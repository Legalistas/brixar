import { Loader2 } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  costId: number | null;
  onDelete: (costId: number) => Promise<void>;
  onCancel: () => void;
  isDeleting: boolean;
}

const DeleteConfirmationModal = ({ 
  isOpen, 
  costId, 
  onDelete, 
  onCancel,
  isDeleting
}: DeleteConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-medium text-slate-800 mb-4">
          Confirmar eliminación
        </h2>
        <p className="text-slate-600 mb-6">
          ¿Está seguro de que desea eliminar este costo? Esta acción no se
          puede deshacer.
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium py-2 px-4 rounded-md transition-colors"
            disabled={isDeleting}
          >
            Cancelar
          </button>
          <button
            onClick={() => costId !== null && onDelete(costId)}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center"
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
