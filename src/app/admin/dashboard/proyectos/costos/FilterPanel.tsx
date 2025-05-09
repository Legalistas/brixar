import { User, Filter, X } from 'lucide-react';
import { FilterOptions, FilterValues, FormattingFunctions } from './types';

interface FilterPanelProps {
  filters: FilterValues;
  handleFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  clearFilters: () => void;
  options: FilterOptions;
  formatting: FormattingFunctions;
  filteredCount: number;
  totalCount: number;
}

const FilterPanel = ({
  filters,
  handleFilterChange,
  clearFilters,
  options,
  formatting,
  filteredCount,
  totalCount
}: FilterPanelProps) => {
  const { uniqueYears, uniqueMonths, uniqueRubros, uniqueInversores } = options;
  const { getMonthName } = formatting;

  return (
    <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-slate-800">Filtros</h2>
        <button
          onClick={clearFilters}
          className="text-sm text-slate-600 hover:text-slate-800 flex items-center"
        >
          <X className="w-4 h-4 mr-1" />
          Limpiar filtros
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Filtro por rubro */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Rubro
          </label>
          <select
            name="rubro"
            value={filters.rubro}
            onChange={handleFilterChange}
            className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <option value="">Todos los rubros</option>
            {uniqueRubros.map((rubro) => (
              <option key={rubro} value={rubro}>
                {rubro}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por inversor */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Inversor
          </label>
          <select
            name="inversor"
            value={filters.inversor}
            onChange={handleFilterChange}
            className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <option value="">Todos los inversores</option>
            {uniqueInversores.map((inversor) => (
              <option key={inversor} value={inversor}>
                {inversor}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por mes */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Mes
          </label>
          <select
            name="mes"
            value={filters.mes}
            onChange={handleFilterChange}
            className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <option value="">Todos los meses</option>
            {uniqueMonths.map((month) => (
              <option key={month} value={month}>
                {getMonthName(month)}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por año */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Año
          </label>
          <select
            name="año"
            value={filters.año}
            onChange={handleFilterChange}
            className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <option value="">Todos los años</option>
            {uniqueYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 text-sm text-slate-600">
        Mostrando {filteredCount} de {totalCount} registros
      </div>
    </div>
  );
};

export default FilterPanel;
