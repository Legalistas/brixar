import { MetricsData, FormattingFunctions } from './types';

interface CostosMetricsProps {
  metrics: MetricsData;
  formatting: FormattingFunctions;
  isFiltered?: boolean;
  totalCount: number;
  metrosConstruidos?: number;
  gastosPorInversor?: Record<string, number>;
}

const CostosMetrics = ({
  metrics,
  formatting,
  isFiltered = false,
  totalCount,
  metrosConstruidos,
  gastosPorInversor = {}
}: CostosMetricsProps) => {
  const { formatCurrency, formatCurrencyUSD } = formatting;

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
      <h2 className="text-lg font-medium text-slate-800 mb-4">
        Resumen de Costos{' '}
        {isFiltered ? '(Filtrados)' : ''}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
        </div>        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <h3 className="text-sm font-medium text-slate-500 mb-2">
            Gastos por inversor
          </h3>
          {Object.keys(gastosPorInversor).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(gastosPorInversor).map(([inversor, gasto]) => (<div key={inversor} className="border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                <div className="text-sm font-medium text-slate-700">{inversor}</div>
                <div className="font-semibold text-lg text-slate-800">
                  ${(Number(gasto)).toLocaleString('es-AR')}
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
        {metrosConstruidos && metrosConstruidos > 0 ? (
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <h3 className="text-sm font-medium text-slate-500 mb-1">
              Costo por m²
            </h3>
            <p className="text-2xl font-bold text-slate-800">
              {formatCurrencyUSD(metrics.totalDolares / metrosConstruidos)}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {metrosConstruidos} m² construidos
            </p>
          </div>
        ): (
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <h3 className="text-sm font-medium text-slate-500 mb-1">
              Costo por m²
            </h3>
            <p className="text-lg font-medium text-slate-800">
              No disponible
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CostosMetrics;
