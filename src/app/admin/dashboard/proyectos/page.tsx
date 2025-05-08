'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { API_ENDPOINTS } from '@/constants/api-endpoint'
import { ProyectPhase, BusinessModel } from '@prisma/client'
import {
  Eye,
  Edit,
  Trash2,
  FileText,
  AlertCircle,
  Plus,
  Loader2,
  Receipt,
} from 'lucide-react'
import { useProyectStore } from '@/store/proyectStore'

export default function ProyectosPage() {
  const router = useRouter()
  const {
    proyects,
    isLoading,
    error: storeError,
    fetchProyects,
    deleteProyect,
  } = useProyectStore()
  const [error, setError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [showEditPopup, setShowEditPopup] = useState<string | null>(null)
  const [showPhasePopup, setShowPhasePopup] = useState<string | null>(null)
  const [selectedPhase, setSelectedPhase] = useState<ProyectPhase | null>(null)
  const [phaseUpdating, setPhaseUpdating] = useState(false)

  // Cargar proyectos al montar el componente
  useEffect(() => {
    fetchProyects()
  }, [fetchProyects])

  // Actualizar el error local si hay error en el store
  useEffect(() => {
    if (storeError) {
      setError(storeError)
    }
  }, [storeError])

  const handleDelete = async (slug: string) => {
    setDeleting(true)
    try {
      const success = await deleteProyect(slug)
      if (!success) {
        throw new Error('Error al eliminar el proyecto')
      }
      setDeleteConfirm(null)
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al eliminar el proyecto')
    } finally {
      setDeleting(false)
    }
  }

  const handlePhaseChange = async (slug: string) => {
    if (!selectedPhase) return

    setPhaseUpdating(true)
    try {
      const response = await fetch(API_ENDPOINTS.PROYECT_EDIT(slug), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phase: selectedPhase }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.error || 'Error al actualizar la fase del proyecto'
        )
      }

      // Recargar los proyectos para actualizar la lista
      await fetchProyects()
      setShowPhasePopup(null)
      setSelectedPhase(null)
    } catch (err: any) {
      setError(
        err.message || 'Ocurrió un error al actualizar la fase del proyecto'
      )
    } finally {
      setPhaseUpdating(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getBusinessModelLabel = (model: BusinessModel) => {
    switch (model) {
      case 'SOLD':
        return 'Venta'
      case 'RENT':
        return 'Alquiler'
      case 'LEADING':
        return 'Leasing'
      default:
        return model
    }
  }

  const getPhaseLabel = (phase: ProyectPhase) => {
    switch (phase) {
      case 'IN_STUDY':
        return 'En Estudio'
      case 'FUNDING':
        return 'Financiación'
      case 'CONSTRUCTION':
        return 'Construcción'
      case 'COMPLETED':
        return 'Completado'
      default:
        return phase
    }
  }

  const getPhaseClasses = (phase: ProyectPhase) => {
    switch (phase) {
      case 'IN_STUDY':
        return 'bg-blue-50 text-blue-700 border border-blue-100'
      case 'FUNDING':
        return 'bg-amber-50 text-amber-700 border border-amber-100'
      case 'CONSTRUCTION':
        return 'bg-orange-50 text-orange-700 border border-orange-100'
      case 'COMPLETED':
        return 'bg-green-50 text-green-700 border border-green-100'
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200'
    }
  }

  // Popup de cambio de fase
  const PhasePopup = ({ slug }: { slug: string }) => {
    const project = proyects.find((p) => p.slug === slug)
    if (!project) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h3 className="text-xl font-medium mb-4 text-slate-800">
            Cambiar fase del proyecto
          </h3>
          <p className="mb-4 text-slate-600">
            Proyecto:{' '}
            <span className="font-medium text-slate-800">{project.title}</span>
          </p>
          <p className="mb-4 text-slate-600">
            Fase actual:
            <span
              className={`ml-2 inline-block rounded-md px-2 py-1 text-xs font-medium ${getPhaseClasses(
                project.phase
              )}`}
            >
              {getPhaseLabel(project.phase)}
            </span>
          </p>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Seleccionar nueva fase:
            </label>
            <div className="space-y-2">
              <div>
                <input
                  type="radio"
                  id="in_study"
                  name="phase"
                  value="IN_STUDY"
                  checked={selectedPhase === 'IN_STUDY'}
                  onChange={() => setSelectedPhase('IN_STUDY')}
                  className="mr-2"
                />
                <label htmlFor="in_study" className="text-sm text-slate-600">
                  En Estudio
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="funding"
                  name="phase"
                  value="FUNDING"
                  checked={selectedPhase === 'FUNDING'}
                  onChange={() => setSelectedPhase('FUNDING')}
                  className="mr-2"
                />
                <label htmlFor="funding" className="text-sm text-slate-600">
                  Financiación
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="construction"
                  name="phase"
                  value="CONSTRUCTION"
                  checked={selectedPhase === 'CONSTRUCTION'}
                  onChange={() => setSelectedPhase('CONSTRUCTION')}
                  className="mr-2"
                />
                <label
                  htmlFor="construction"
                  className="text-sm text-slate-600"
                >
                  Construcción
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="completed"
                  name="phase"
                  value="COMPLETED"
                  checked={selectedPhase === 'COMPLETED'}
                  onChange={() => setSelectedPhase('COMPLETED')}
                  className="mr-2"
                />
                <label htmlFor="completed" className="text-sm text-slate-600">
                  Completado
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                setShowPhasePopup(null)
                setSelectedPhase(null)
              }}
              className="border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium py-2 px-4 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => handlePhaseChange(slug)}
              disabled={!selectedPhase || phaseUpdating}
              className={`bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 px-4 rounded-md transition-colors ${
                !selectedPhase || phaseUpdating
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            >
              {phaseUpdating ? (
                <span className="flex items-center">
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Actualizando...
                </span>
              ) : (
                'Guardar'
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Popup de edición rápida
  const EditPopup = ({ slug }: { slug: string }) => {
    const project = proyects.find((p) => p.slug === slug)
    if (!project) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full">
          <h3 className="text-xl font-medium mb-4 text-slate-800">
            Opciones de edición
          </h3>
          <p className="mb-4 text-slate-600">
            Proyecto:{' '}
            <span className="font-medium text-slate-800">{project.title}</span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => {
                setShowEditPopup(null)
                router.push(`/admin/dashboard/proyectos/editar/${slug}`)
              }}
              className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar detalles
            </button>

            <button
              onClick={() => {
                setShowEditPopup(null)
                setShowPhasePopup(slug)
                setSelectedPhase(project.phase)
              }}
              className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center"
            >
              <FileText className="h-4 w-4 mr-2" />
              Cambiar fase
            </button>

            <button
              onClick={() => {
                window.open(`/proyectos/${slug}`, '_blank')
                setShowEditPopup(null)
              }}
              className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center"
            >
              <Eye className="h-4 w-4 mr-2" />
              Ver en sitio
            </button>

            <button
              onClick={() => {
                setShowEditPopup(null)
                router.push(`/admin/dashboard/proyectos/costos?slug=${slug}`)
              }}
              className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center"
            >
              <Receipt className="h-4 w-4 mr-2" />
              Gestionar costos
            </button>

            <button
              onClick={() => {
                setShowEditPopup(null)
                setDeleteConfirm(slug)
              }}
              className="border border-red-200 bg-white hover:bg-red-50 text-red-600 font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </button>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={() => setShowEditPopup(null)}
              className="border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium py-2 px-4 rounded-md transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    )
  }

  console.log('Proyectos:', proyects)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-slate-400 animate-spin" />
          <p className="mt-2 text-slate-500">Cargando proyectos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium text-slate-800">Proyectos</h1>
        <Link
          href="/admin/dashboard/proyectos/crear"
          className="bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Crear Nuevo Proyecto
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {proyects.length === 0 ? (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-md mb-4">
          No hay proyectos creados. Puedes crear un nuevo proyecto usando el
          botón &quot;Crear Nuevo Proyecto&quot;.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border border-slate-200">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-sm">
                <th className="py-3 px-4 border-b border-slate-200 text-left font-medium">
                  Imagen
                </th>
                <th className="py-3 px-4 border-b border-slate-200 text-left font-medium">
                  Título
                </th>
                <th className="py-3 px-4 border-b border-slate-200 text-left font-medium">
                  Modelo Negocio
                </th>
                <th className="py-3 px-4 border-b border-slate-200 text-left font-medium">
                  Fase
                </th>
                <th className="py-3 px-4 border-b border-slate-200 text-left font-medium">
                  Inicio
                </th>
                <th className="py-3 px-4 border-b border-slate-200 text-left font-medium">
                  M2
                </th>
                <th className="py-3 px-4 border-b border-slate-200 text-left font-medium">
                  Acciones
                </th>
                <th className="py-3 px-4 border-b border-slate-200 text-left font-medium">
                  Costos
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {proyects.map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="w-16 h-16 relative">
                      <img
                        src={
                          project.projectMedia &&
                          project.projectMedia.length > 0
                            ? project.projectMedia[0].link
                            : '/images/placeholder.svg'
                        }
                        alt={project.title}
                        className="w-full h-full object-cover rounded-md border border-slate-200"
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-800 font-medium">
                    {project.title}
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {getBusinessModelLabel(project.businessModel)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block rounded-md px-2 py-1 text-xs font-medium ${getPhaseClasses(
                        project.phase
                      )}`}
                    >
                      {getPhaseLabel(project.phase)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {formatDate(project.createdAt)}
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {project?.proyectDetails?.surface ? `${project?.proyectDetails?.surface} m²` : 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    {deleteConfirm === project.slug ? (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleDelete(project.slug)}
                          disabled={deleting}
                          className={`bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs py-1 px-2 rounded-md transition-colors ${
                            deleting ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {deleting ? (
                            <span className="flex items-center">
                              <Loader2 className="animate-spin h-3 w-3 mr-1" />
                              Eliminando...
                            </span>
                          ) : (
                            'Confirmar'
                          )}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs py-1 px-2 rounded-md transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setShowEditPopup(project.slug)}
                          className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs py-1 px-2 rounded-md transition-colors"
                        >
                          Opciones
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      href={`/admin/dashboard/proyectos/costos?slug=${project.slug}`}
                      className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs py-1 px-2 rounded-md transition-colors"
                    >
                      Agregar Costos
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Popups */}
      {showPhasePopup && <PhasePopup slug={showPhasePopup} />}
      {showEditPopup && <EditPopup slug={showEditPopup} />}
    </div>
  )
}
