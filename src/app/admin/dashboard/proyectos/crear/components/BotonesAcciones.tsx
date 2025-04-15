'use client'

import { Loader2 } from 'lucide-react'

interface BotonesAccionesProps {
  isLoading: boolean
  onCancel: () => void
}

export default function BotonesAcciones({ isLoading, onCancel }: BotonesAccionesProps) {
  return (
    <div className="flex justify-end space-x-4">
      <button
        type="button"
        onClick={onCancel}
        className="px-6 py-2 border border-slate-300 rounded-md text-slate-700 bg-white hover:bg-slate-50 transition-colors"
      >
        Cancelar
      </button>
      <button
        type="submit"
        disabled={isLoading}
        className="px-6 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-900 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center">
            <Loader2 className="animate-spin h-4 w-4 mr-2" />
            Guardando...
          </span>
        ) : (
          'Crear Proyecto'
        )}
      </button>
    </div>
  )
}