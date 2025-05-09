import { Calendar, DollarSign, FileText, User, Tag, Edit, Trash2 } from 'lucide-react';
import { ProyectCost } from '@/store/costStore';
import { FormattingFunctions } from './types';

interface CostosTableProps {
  costs: ProyectCost[];
  showDeleteConfirmation: (costId: number) => void;
  formatting: FormattingFunctions;
  isFiltered?: boolean;
}

const CostosTable = ({ 
  costs, 
  showDeleteConfirmation,
  formatting,
  isFiltered = false
}: CostosTableProps) => {
  const { formatDate, formatCurrency, formatCurrencyUSD } = formatting;

  return (
    <div className="overflow-x-auto rounded-md border border-slate-200">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-slate-50 text-slate-600 text-sm">
            <th className="py-3 px-4 border-b border-slate-200 text-left font-medium">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Fecha
              </div>
            </th>
            <th className="py-3 px-4 border-b border-slate-200 text-left font-medium">
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                Rubro / Proveedor
              </div>
            </th>
            <th className="py-3 px-4 border-b border-slate-200 text-left font-medium">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-1" />
                Detalle
              </div>
            </th>
            <th className="py-3 px-4 border-b border-slate-200 text-left font-medium">
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                Importe ARS
              </div>
            </th>
            <th className="py-3 px-4 border-b border-slate-200 text-left font-medium">
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                Cotización USD
              </div>
            </th>
            <th className="py-3 px-4 border-b border-slate-200 text-left font-medium">
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                Importe USD
              </div>
            </th>
            <th className="py-3 px-4 border-b border-slate-200 text-left font-medium">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                Inversor
              </div>
            </th>
            <th className="py-3 px-4 border-b border-slate-200 text-center font-medium">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {costs.length > 0 ? (
            costs.map((cost) => (
              <tr key={cost.id} className="hover:bg-slate-50">
                <td className="py-3 px-4">{formatDate(cost.fecha)}</td>
                <td className="py-3 px-4">
                  <div className="font-medium text-slate-800">{cost.rubro}</div>
                  <div className="text-sm text-slate-500">{cost.proveedor}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="max-w-xs truncate">{cost.detalle || '-'}</div>
                </td>
                <td className="py-3 px-4">{formatCurrency(cost.importePesos)}</td>
                <td className="py-3 px-4">{formatCurrency(cost.precioDolarBlue)}</td>
                <td className="py-3 px-4">{formatCurrencyUSD(cost.importeDolar)}</td>
                <td className="py-3 px-4">{cost.inversor || '-'}</td>
                <td className="py-3 px-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => showDeleteConfirmation(cost.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr className="text-center">
              <td colSpan={8} className="py-8 text-slate-500">
                {isFiltered
                  ? 'No hay registros que coincidan con los filtros aplicados'
                  : 'No hay registros de costos para este proyecto'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CostosTable;
