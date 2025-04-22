'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  Loader2, 
  Calendar,
  DollarSign,
  FileText,
  User,
  Tag,
  Plus,
  AlertCircle,
  ArrowLeft
} from 'lucide-react'
import { useProyectStore } from '@/store/proyectStore'

export default function CostosProyectoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const slug = searchParams?.get('slug')
  
  const { currentProyect, isLoading, error: storeError, fetchProyectBySlug } = useProyectStore()
  const [error, setError] = useState('')
  const [showAddCostPopup, setShowAddCostPopup] = useState(false)

  // Cargar el proyecto si se proporciona un slug
  useEffect(() => {
    if (slug) {
      fetchProyectBySlug(slug)
    }
  }, [slug, fetchProyectBySlug])

  // Actualizar el error local si hay error en el store
  useEffect(() => {
    if (storeError) {
      setError(storeError)
    }
  }, [storeError])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const formatCurrencyUSD = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }
  
  // Popup para agregar un nuevo costo
  const AddCostPopup = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full">
          <h3 className="text-xl font-medium mb-4 text-slate-800">
            Añadir nuevo costo al proyecto
          </h3>
          
          {currentProyect && (
            <p className="mb-4 text-slate-600">
              Proyecto: <span className="font-medium text-slate-800">{currentProyect.title}</span>
            </p>
          )}

          <form className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Fecha
                  </label>
                  <input 
                    type="date" 
                    className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Rubro
                </label>
                <input 
                  type="text" 
                  placeholder="ej: Construcción, Materiales, Servicios..." 
                  className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Proveedor
                </label>
                <input 
                  type="text" 
                  placeholder="Nombre del proveedor" 
                  className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Detalle
                </label>
                <textarea 
                  placeholder="Descripción detallada del costo" 
                  className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Importe en pesos (ARS)
                  </label>
                  <input 
                    type="number"
                    step="0.01" 
                    placeholder="0.00" 
                    className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Cotización dólar blue
                  </label>
                  <input 
                    type="number"
                    step="0.01" 
                    placeholder="0.00" 
                    className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Importe en dólares (USD)
                </label>
                <input 
                  type="number"
                  step="0.01" 
                  placeholder="0.00" 
                  disabled
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
                <p className="text-xs text-slate-500 mt-1">Este valor se calculará automáticamente</p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                onClick={() => setShowAddCostPopup(false)}
                className="border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium py-2 px-4 rounded-md transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                className="bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-slate-400 animate-spin" />
          <p className="mt-2 text-slate-500">Cargando información del proyecto...</p>
        </div>
      </div>
    )
  }

  // Si no hay un slug o proyecto seleccionado, mostrar lista de proyectos
  if (!slug || !currentProyect) {
    return (
      <div className="container mx-auto py-8 px-4 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medium text-slate-800">
            Costos de Proyectos
          </h1>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-md mb-4">
          Por favor, seleccione un proyecto para gestionar sus costos desde la página de proyectos.
        </div>
        
        <Link
          href="/admin/dashboard/proyectos"
          className="inline-flex items-center text-slate-700 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Volver a la lista de proyectos
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 bg-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link
            href="/admin/dashboard/proyectos"
            className="inline-flex items-center text-slate-700 hover:text-slate-900 mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver a proyectos
          </Link>
          <h1 className="text-2xl font-medium text-slate-800">
            Costos del Proyecto: {currentProyect.title}
          </h1>
        </div>
        <button
          onClick={() => setShowAddCostPopup(true)}
          className="bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Añadir Costo
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Sección de resumen de costos */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-medium text-slate-800 mb-4">Resumen de Costos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <h3 className="text-sm font-medium text-slate-500 mb-1">Total en ARS</h3>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(0)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <h3 className="text-sm font-medium text-slate-500 mb-1">Total en USD</h3>
            <p className="text-2xl font-bold text-slate-800">{formatCurrencyUSD(0)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <h3 className="text-sm font-medium text-slate-500 mb-1">Cantidad de registros</h3>
            <p className="text-2xl font-bold text-slate-800">0</p>
          </div>
        </div>
      </div>

      {/* Lista de costos */}
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
                  Usuario
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            <tr className="text-center">
              <td colSpan={7} className="py-8 text-slate-500">
                No hay registros de costos para este proyecto
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {showAddCostPopup && <AddCostPopup />}
    </div>
  )
}