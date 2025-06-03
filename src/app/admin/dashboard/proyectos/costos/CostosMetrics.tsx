import { MetricsData, FormattingFunctions } from './types';
import { ProyectCompensation } from '@/store/compensationStore';

interface CostosMetricsProps {
  metrics: MetricsData;
  formatting: FormattingFunctions;
  isFiltered?: boolean;
  totalCount: number;
  metrosConstruidos?: number;
  gastosPorInversor?: Record<string, number>;
  compensations?: ProyectCompensation[];
  compensationMetrics?: {
    totalPesos: number;
    totalDolares: number;
  };
}

const CostosMetrics = ({
  metrics,
  formatting,
  isFiltered = false,
  totalCount,
  metrosConstruidos,
  gastosPorInversor = {},
  compensations = [],
  compensationMetrics
}: CostosMetricsProps) => {
  const { formatCurrency, formatCurrencyUSD } = formatting;

  // Calcular totales de compensaciones por inversor
  const compensacionesPorInversor = compensations.reduce((acc, comp) => {
    // Inversor origen (quien paga) - en rojo/negativo
    if (comp.inversorOrigen) {
      acc[comp.inversorOrigen] = (acc[comp.inversorOrigen] || 0) - Number(comp.importePesos);
    }
    // Inversor destino (quien recibe) - en verde/positivo
    if (comp.inversorDestino) {
      acc[comp.inversorDestino] = (acc[comp.inversorDestino] || 0) + Number(comp.importePesos);
    }
    return acc;
  }, {} as Record<string, number>);
  // Calcular total combinado (gastos + compensaciones netas)
  const totalCombinado = {
    totalPesos: metrics.totalPesos + (compensationMetrics?.totalPesos || 0),
    totalDolares: metrics.totalDolares + (compensationMetrics?.totalDolares || 0)
  };
  // Calcular total combinado por inversor (gastos + compensaciones)
  const totalCombinadoPorInversor = Object.keys({ ...gastosPorInversor, ...compensacionesPorInversor }).reduce((acc, inversor) => {
    const gastos = gastosPorInversor[inversor] || 0;
    const compensaciones = compensacionesPorInversor[inversor] || 0;
    acc[inversor] = gastos - compensaciones;
    return acc;
  }, {} as Record<string, number>);
  // Calcular compensaciones necesarias para igualar costos
  const calcularCompensacionesParaIgualar = () => {
    const inversores = Object.keys(totalCombinadoPorInversor);
    if (inversores.length < 2) return [];

    const totalGastos = Object.values(totalCombinadoPorInversor).reduce((sum, gasto) => sum + gasto, 0);
    const gastoPromedio = totalGastos / inversores.length;

    const compensacionesNecesarias: { origen: string; destino: string; monto: number }[] = [];
    const inversoresPagadores: { inversor: string; monto: number }[] = [];
    const inversoresReceptores: { inversor: string; monto: number }[] = [];

    // Separar inversores que deben pagar y recibir
    inversores.forEach(inversor => {
      const gastoActual = totalCombinadoPorInversor[inversor];
      const diferencia = gastoActual - gastoPromedio;
      
      if (diferencia > 0) {
        // Este inversor gastó más, debe recibir compensación
        inversoresReceptores.push({ inversor, monto: diferencia });
      } else if (diferencia < 0) {
        // Este inversor gastó menos, debe pagar compensación
        inversoresPagadores.push({ inversor, monto: Math.abs(diferencia) });
      }
    });

    // Calcular las compensaciones específicas
    let indicePagador = 0;
    let indiceReceptor = 0;
    let montoPendientePagador = inversoresPagadores[indicePagador]?.monto || 0;
    let montoPendienteReceptor = inversoresReceptores[indiceReceptor]?.monto || 0;

    while (indicePagador < inversoresPagadores.length && indiceReceptor < inversoresReceptores.length) {
      const pagador = inversoresPagadores[indicePagador];
      const receptor = inversoresReceptores[indiceReceptor];

      const montoATransferir = Math.min(montoPendientePagador, montoPendienteReceptor);

      if (montoATransferir > 1) { // Solo mostrar si es mayor a $1 para evitar diferencias mínimas
        compensacionesNecesarias.push({
          origen: pagador.inversor,
          destino: receptor.inversor,
          monto: montoATransferir
        });
      }

      montoPendientePagador -= montoATransferir;
      montoPendienteReceptor -= montoATransferir;

      if (montoPendientePagador <= 1) {
        indicePagador++;
        montoPendientePagador = inversoresPagadores[indicePagador]?.monto || 0;
      }

      if (montoPendienteReceptor <= 1) {
        indiceReceptor++;
        montoPendienteReceptor = inversoresReceptores[indiceReceptor]?.monto || 0;
      }
    }

    return compensacionesNecesarias;
  };

  const compensacionesNecesarias = calcularCompensacionesParaIgualar();

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">      <h2 className="text-lg font-medium text-slate-800 mb-4">
      Resumen de Costos{' '}
      {isFiltered ? '(Filtrados)' : ''}
    </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <h3 className="text-sm font-medium text-slate-500 mb-1">
            Total en ARS
          </h3>
          <p className="text-2xl font-bold text-slate-800">
            {formatCurrency(metrics.totalPesos)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <h3 className="text-sm font-medium text-slate-500 mb-1">
            Total en USD
          </h3>
          <p className="text-2xl font-bold text-slate-800">
            {formatCurrencyUSD(metrics.totalDolares)}
          </p>
        </div>

        {/* Card de Costo por m² */}
        {metrosConstruidos && metrosConstruidos > 0 ? (
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <h3 className="text-sm font-medium text-slate-500 mb-1">
              Costo por m²
            </h3>
            <p className="text-2xl font-bold text-slate-800">
              {formatCurrencyUSD(totalCombinado.totalDolares / metrosConstruidos)}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {metrosConstruidos} m² construidos
            </p>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <h3 className="text-sm font-medium text-slate-500 mb-1">
              Costo por m²
            </h3>
            <p className="text-lg font-medium text-slate-800">
              No disponible
            </p>
          </div>
        )}
      </div>      {/* Segunda fila de cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card de Gastos por Inversor */}
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <h3 className="text-sm font-medium text-slate-500 mb-2">
            Gastos por inversor
          </h3>
          {Object.keys(gastosPorInversor).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(gastosPorInversor).map(([inversor, gasto]) => (
                <div key={inversor} className="border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                  <div className="text-sm font-medium text-slate-700">{inversor}</div>
                  <div className="font-semibold text-lg text-slate-800">
                    ${(Number(gasto)).toLocaleString('es-AR')}
                  </div>
                  <div className="text-xs text-slate-500">
                    Gastos totales
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-lg font-medium text-slate-800">
              No hay datos de inversores
            </p>
          )}
        </div>

        {/* Card de Compensaciones por Inversor */}
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <h3 className="text-sm font-medium text-slate-500 mb-2">
            Compensaciones por inversor
          </h3>
          {Object.keys(compensacionesPorInversor).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(compensacionesPorInversor).map(([inversor, monto]) => (
                <div key={inversor} className="border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                  <div className="text-sm font-medium text-slate-700">{inversor}</div>
                  <div className={`font-semibold text-lg ${monto >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {monto >= 0 ? '+' : ''}${Math.abs(Number(monto)).toLocaleString('es-AR')}
                  </div>
                  <div className="text-xs text-slate-500">
                    {monto >= 0 ? 'Recibió' : 'Pagó'}
                  </div>
                </div>
              ))}
            </div>) : (
            <p className="text-lg font-medium text-slate-800">
              Sin compensaciones
            </p>
          )}
        </div>

        {/* Card de Total por Inversor (Costos + Compensaciones) */}
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <h3 className="text-sm font-medium text-slate-500 mb-2">
            Total por inversor
          </h3>
          {Object.keys(totalCombinadoPorInversor).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(totalCombinadoPorInversor).map(([inversor, total]) => (
                <div key={inversor} className="border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                  <div className="text-sm font-medium text-slate-700">{inversor}</div>
                  <div className={`font-semibold text-lg ${total >= 0 ? 'text-slate-800' : 'text-green-600'
                    }`}>
                    ${Math.abs(Number(total)).toLocaleString('es-AR')}
                  </div>
                  <div className="text-xs text-slate-500">
                    {total >= 0 ? 'Total gastado' : 'Total ahorrado'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-lg font-medium text-slate-800">
              No hay datos
            </p>          )}
        </div>
      </div>

      {/* Sección de compensaciones para igualar costos */}
      {compensacionesNecesarias.length > 0 && (
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-amber-800 mb-3 flex items-center">
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Compensaciones recomendadas para igualar costos
          </h3>
          <div className="space-y-2">
            {compensacionesNecesarias.map((comp, index) => (
              <div key={index} className="flex items-center justify-between bg-white rounded-md p-3 border border-amber-300">
                <div className="flex items-center space-x-3">
                  <div className="bg-amber-100 rounded-full p-2">
                    <svg className="h-4 w-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                  <span className="text-amber-800 font-medium">
                    <span className="font-semibold">{comp.origen}</span> debe pagar{' '}
                    <span className="font-bold text-amber-900">
                      ${comp.monto.toLocaleString('es-AR')}
                    </span>{' '}
                    a <span className="font-semibold">{comp.destino}</span>
                  </span>
                </div>
                <div className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded">
                  Para igualar gastos
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-sm text-amber-700">
            💡 <strong>Sugerencia:</strong> Después de registrar estas compensaciones, todos los inversores tendrán gastos equivalentes en el proyecto.
          </div>
        </div>
      )}
    </div>
  );
};

export default CostosMetrics;
