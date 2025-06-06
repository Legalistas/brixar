import { Calendar, DollarSign, FileText, User, Tag, Edit, Trash2 } from 'lucide-react';
import { ProyectCompensation } from '@/store/compensationStore';
import { FormattingFunctions } from './types';

interface CompensacionesTableProps {
  compensations: ProyectCompensation[];
  showDeleteConfirmation: (compensationId: number, type: 'compensacion') => void;
  showEditCompensation: (compensation: ProyectCompensation) => void;
  formatting: FormattingFunctions;
  isFiltered?: boolean;
}

const CompensacionesTable = ({ 
  compensations, 
  showDeleteConfirmation,
  showEditCompensation,
  formatting,
  isFiltered = false
}: CompensacionesTableProps) => {
  const { formatDate, formatCurrency, formatCurrencyUSD } = formatting;

  if (compensations.length === 0) {
    return (
      <div className="bg-white p-6 rounded-md border border-slate-200 text-center my-6">
        <p className="text-slate-500">
          {isFiltered
            ? 'No hay compensaciones que coincidan con los filtros aplicados'
            : 'No hay registros de compensaciones entre inversores para este proyecto'}
        </p>
      </div>
    );
  }

  return (
    <div className="my-6">
      <h2 className="text-xl font-medium text-slate-800 mb-4">
        Compensaciones entre inversores
      </h2>
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
                  <User className="h-4 w-4 mr-1" />
                  Origen → Destino
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
              <th className="py-3 px-4 border-b border-slate-200 text-center font-medium">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {compensations.map((compensation) => (
              <tr key={compensation.id} className="hover:bg-slate-50">
                <td className="py-3 px-4">{formatDate(compensation.fecha)}</td>
                <td className="py-3 px-4">
                  <div className="font-medium text-slate-800">{compensation.inversorOrigen}</div>
                  <div className="text-sm text-slate-500">→ {compensation.inversorDestino}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="max-w-xs truncate">{compensation.detalle || '-'}</div>
                </td>
                <td className="py-3 px-4">{formatCurrency(compensation.importePesos)}</td>
                <td className="py-3 px-4">{formatCurrency(compensation.precioDolarBlue)}</td>
                <td className="py-3 px-4">{formatCurrencyUSD(compensation.importeDolar)}</td>                <td className="py-3 px-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button 
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => showEditCompensation(compensation)}
                      title="Editar compensación"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => showDeleteConfirmation(compensation.id, 'compensacion')}
                      title="Eliminar compensación"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompensacionesTable;
