import { MetricsData, FormattingFunctions } from './types';
import { ProyectCompensation } from '@/store/compensationStore';
import { useState } from 'react';

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

  // Estado para manejar porcentajes personalizados
  const [usarPorcentajesPersonalizados, setUsarPorcentajesPersonalizados] = useState(false);
  const [porcentajesObjetivo, setPorcentajesObjetivo] = useState<Record<string, number>>({});
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);

  // Inicializar porcentajes equitativos cuando se activa la opción personalizada
  const inicializarPorcentajes = () => {
    const inversores = Object.keys(gastosPorInversor);
    if (inversores.length === 0) return;
    
    const porcentajeEquitativo = 100 / inversores.length;
    const porcentajesIniciales = inversores.reduce((acc, inversor) => {
      acc[inversor] = Math.round(porcentajeEquitativo * 100) / 100;
      return acc;
    }, {} as Record<string, number>);
    
    setPorcentajesObjetivo(porcentajesIniciales);
  };

  // Validar que los porcentajes sumen 100%
  const validarPorcentajes = () => {
    const total = Object.values(porcentajesObjetivo).reduce((sum, p) => sum + p, 0);
    return Math.abs(total - 100) < 0.01; // Tolerancia para decimales
  };

  // Actualizar un porcentaje específico
  const actualizarPorcentaje = (inversor: string, porcentaje: number) => {
    setPorcentajesObjetivo(prev => ({
      ...prev,
      [inversor]: porcentaje
    }));
  };

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
  }, {} as Record<string, number>);  // Calcular compensaciones necesarias para igualar costos
  const calcularCompensacionesParaIgualar = () => {
    const inversores = Object.keys(totalCombinadoPorInversor);
    if (inversores.length < 2) return [];

    const totalGastos = Object.values(totalCombinadoPorInversor).reduce((sum, gasto) => sum + gasto, 0);
    
    const compensacionesNecesarias: { origen: string; destino: string; monto: number }[] = [];
    const inversoresPagadores: { inversor: string; monto: number }[] = [];
    const inversoresReceptores: { inversor: string; monto: number }[] = [];

    // Determinar objetivos según configuración
    let objetivosPorInversor: Record<string, number>;
    
    if (usarPorcentajesPersonalizados && validarPorcentajes()) {
      // Usar porcentajes personalizados
      objetivosPorInversor = inversores.reduce((acc, inversor) => {
        const porcentaje = porcentajesObjetivo[inversor] || 0;
        acc[inversor] = (totalGastos * porcentaje) / 100;
        return acc;
      }, {} as Record<string, number>);
    } else {
      // Usar distribución equitativa (comportamiento original)
      const gastoPromedio = totalGastos / inversores.length;
      objetivosPorInversor = inversores.reduce((acc, inversor) => {
        acc[inversor] = gastoPromedio;
        return acc;
      }, {} as Record<string, number>);
    }

    // Separar inversores que deben pagar y recibir según objetivos
    inversores.forEach(inversor => {
      const gastoActual = totalCombinadoPorInversor[inversor];
      const gastoObjetivo = objetivosPorInversor[inversor];
      const diferencia = gastoActual - gastoObjetivo;
      
      if (diferencia > 0) {
        // Este inversor gastó más de su objetivo, debe recibir compensación
        inversoresReceptores.push({ inversor, monto: diferencia });
      } else if (diferencia < 0) {
        // Este inversor gastó menos de su objetivo, debe pagar compensación
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
    </h2>      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <h3 className="text-base font-bold text-slate-700 mb-1 text-center">
            Total en ARS
          </h3>
          <p className="text-2xl font-bold text-slate-800">
            {formatCurrency(metrics.totalPesos)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <h3 className="text-base font-bold text-slate-700 mb-1 text-center">
            Total en USD
          </h3>
          <p className="text-2xl font-bold text-slate-800">
            {formatCurrencyUSD(metrics.totalDolares)}
          </p>
        </div>

        {/* Card de Costo por m² */}
        {metrosConstruidos && metrosConstruidos > 0 ? (
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <h3 className="text-base font-bold text-slate-700 mb-1 text-center">
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
            <h3 className="text-base font-bold text-slate-700 mb-1 text-center">
              Costo por m²
            </h3>
            <p className="text-lg font-medium text-slate-800">
              No disponible
            </p>
          </div>
        )}
      </div>{/* Segunda fila de cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">        {/* Card de Gastos por Inversor */}
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <h3 className="text-base font-bold text-slate-700 mb-2 text-center">
            Gastos por inversor
          </h3>
          {Object.keys(gastosPorInversor).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(gastosPorInversor).map(([inversor, gasto]) => {
                const totalGastos = Object.values(gastosPorInversor).reduce((sum, g) => sum + Number(g), 0);
                const porcentaje = totalGastos > 0 ? (Number(gasto) / totalGastos) * 100 : 0;
                
                return (
                  <div key={inversor} className="border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                    <div className="text-sm font-medium text-slate-700">{inversor}</div>
                    <div className="font-semibold text-lg text-slate-800">
                      ${(Number(gasto)).toLocaleString('es-AR')}
                    </div>
                    <div className="text-xs text-slate-500 flex justify-between">
                      <span>Gastos totales</span>
                      <span className="font-medium text-slate-600">{porcentaje.toFixed(1)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-lg font-medium text-slate-800">
              No hay datos de inversores
            </p>
          )}
        </div>        {/* Card de Compensaciones por Inversor */}
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <h3 className="text-base font-bold text-slate-700 mb-2 text-center">
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
        </div>        {/* Card de Total por Inversor (Costos + Compensaciones) */}
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <h3 className="text-base font-bold text-slate-700 mb-2 text-center">
            Total por inversor
          </h3>
          {Object.keys(totalCombinadoPorInversor).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(totalCombinadoPorInversor).map(([inversor, total]) => {
                const totalCombinado = Object.values(totalCombinadoPorInversor).reduce((sum, t) => sum + Math.abs(Number(t)), 0);
                const porcentaje = totalCombinado > 0 ? (Math.abs(Number(total)) / totalCombinado) * 100 : 0;
                
                return (
                  <div key={inversor} className="border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                    <div className="text-sm font-medium text-slate-700">{inversor}</div>
                    <div className={`font-semibold text-lg ${total >= 0 ? 'text-slate-800' : 'text-green-600'
                      }`}>
                      ${Math.abs(Number(total)).toLocaleString('es-AR')}
                    </div>
                    <div className="text-xs text-slate-500 flex justify-between">
                      <span>{total >= 0 ? 'Total gastado' : 'Total ahorrado'}</span>
                      <span className="font-medium text-slate-600">{porcentaje.toFixed(1)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-lg font-medium text-slate-800">
              No hay datos
            </p>
          )}
        </div>
      </div>      {/* Sección de compensaciones para igualar costos */}
      {Object.keys(totalCombinadoPorInversor).length > 1 && (
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-amber-800 flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {usarPorcentajesPersonalizados ? 'Compensaciones con porcentajes personalizados' : 'Compensaciones recomendadas para igualar costos'}
            </h3>
            <button
              onClick={() => setMostrarConfiguracion(!mostrarConfiguracion)}
              className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors flex items-center"
            >
              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Configurar
            </button>
          </div>

          {/* Panel de configuración */}
          {mostrarConfiguracion && (
            <div className="mb-4 bg-white border border-amber-300 rounded-md p-4">
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={usarPorcentajesPersonalizados}
                    onChange={(e) => {
                      setUsarPorcentajesPersonalizados(e.target.checked);
                      if (e.target.checked) {
                        inicializarPorcentajes();
                      }
                    }}
                    className="mr-2 h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-amber-800">
                    Usar porcentajes personalizados
                  </span>
                </label>
                {usarPorcentajesPersonalizados && !validarPorcentajes() && (
                  <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                    Los porcentajes deben sumar 100%
                  </span>
                )}
              </div>

              {usarPorcentajesPersonalizados && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.keys(gastosPorInversor).map((inversor) => (
                    <div key={inversor} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                      <span className="text-sm font-medium text-gray-700">{inversor}</span>
                      <div className="flex items-center">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={porcentajesObjetivo[inversor] || 0}
                          onChange={(e) => actualizarPorcentaje(inversor, parseFloat(e.target.value) || 0)}
                          className="w-16 text-sm border border-gray-300 rounded px-2 py-1 text-center"
                        />
                        <span className="ml-1 text-sm text-gray-500">%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-3 text-xs text-amber-700">
                {usarPorcentajesPersonalizados ? (
                  <>
                    📊 <strong>Porcentajes personalizados:</strong> Define qué porcentaje del total debe asumir cada inversor.
                  </>
                ) : (
                  <>
                    ⚖️ <strong>Distribución equitativa:</strong> Todos los inversores asumirán el mismo porcentaje de gastos.
                  </>
                )}
              </div>
            </div>
          )}

          {/* Lista de compensaciones */}
          {compensacionesNecesarias.length > 0 ? (
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
                    {usarPorcentajesPersonalizados ? 'Según porcentajes' : 'Para igualar gastos'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-md p-4 border border-amber-300 text-center">
              <svg className="h-8 w-8 text-green-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-amber-800 font-medium">
                {usarPorcentajesPersonalizados ? 'Los gastos ya están balanceados según los porcentajes definidos' : 'Los gastos ya están balanceados equitativamente'}
              </p>
            </div>
          )}

          <div className="mt-3 text-sm text-amber-700">
            💡 <strong>Sugerencia:</strong> Después de registrar estas compensaciones, los gastos estarán distribuidos según {usarPorcentajesPersonalizados ? 'los porcentajes configurados' : 'partes iguales'}.
          </div>
        </div>
      )}
    </div>
  );
};

export default CostosMetrics;
