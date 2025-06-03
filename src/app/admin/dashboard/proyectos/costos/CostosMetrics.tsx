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
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CostosMetrics;
