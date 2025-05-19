'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { API_ENDPOINTS } from '@/constants/api-endpoint'
import { PropertyState, ListingType } from '@prisma/client'
import {
  Eye,
  Edit,
  Trash2,
  FileText,
  AlertCircle,
  Plus,
  Loader2,
} from 'lucide-react'

// Tipo para las propiedades
interface Property {
  id: number
  slug: string
  title: string
  price: number
  bedrooms: number
  bathrooms: number
  propertyType: PropertyState
  listingType: ListingType
  isAvailable: boolean
  status: any
  images: { url: string }[]
  createdAt: string
  updatedAt: string
}

export default function PublicacionesPage() {
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [showStatusPopup, setShowStatusPopup] = useState<string | null>(null)
  const [showEditPopup, setShowEditPopup] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<any | null>(null)
  const [statusUpdating, setStatusUpdating] = useState(false)
  const [redirectToSale, setRedirectToSale] = useState<number | null>(null)

  // Cargar propiedades al montar el componente
  useEffect(() => {
    fetchProperties()
  }, [])

  // Efecto para redirigir a la página de venta cuando es necesario
  useEffect(() => {
    if (redirectToSale) {
      router.push(`/admin/dashboard/ventas/${redirectToSale}`)
    }
  }, [redirectToSale, router])

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const response = await fetch(API_ENDPOINTS.PROPERTIES_INDEX)
      if (!response.ok) {
        throw new Error('No se pudieron cargar las propiedades')
      }
      const data = await response.json()
      setProperties(data)
    } catch (error) {
      console.error('Error fetching properties:', error)
      setError('Error al cargar las propiedades. Por favor, intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (slug: string) => {
    setDeleting(true)
    try {
      const response = await fetch(API_ENDPOINTS.PROPERTY_DELETE(slug), {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al eliminar la propiedad')
      }

      // Actualizar la lista después de eliminar
      setProperties(properties.filter((property) => property.slug !== slug))
      setDeleteConfirm(null)
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al eliminar la propiedad')
    } finally {
      setDeleting(false)
    }
  }
  const handleStatusChange = async (slug: string) => {
    if (!selectedStatus) return

    setStatusUpdating(true)
    try {
      const response = await fetch(API_ENDPOINTS.PROPERTY_UPDATE(slug), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: selectedStatus }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.error || 'Error al actualizar el estado de la propiedad'
        )
      }

      // Actualizar el estado en la lista local
      setProperties(
        properties.map((property) =>
          property.slug === slug
            ? { ...property, status: selectedStatus }
            : property
        )
      )      // Si la propiedad fue marcada como vendida, redirigir al formulario de nueva venta
      if (selectedStatus === 'VENDIDA') {
        const property = properties.find(p => p.slug === slug)
        if (property) {
          // Redirigir al usuario a la página de creación de venta con la propertyId como parámetro
          router.push(`/admin/dashboard/newSale?propertyId=${property.id}`)
        }
      }

      setShowStatusPopup(null)
      setSelectedStatus(null)
    } catch (err: any) {
      setError(
        err.message ||
        'Ocurrió un error al actualizar el estado de la propiedad'
      )
    } finally {
      setStatusUpdating(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getPropertyTypeLabel = (type: PropertyState) => {
    return type === PropertyState.APARTMENT ? 'Apartamento' : 'Casa'
  }

  const getListingTypeLabel = (type: ListingType) => {
    return type === ListingType.SALE ? 'Venta' : 'Alquiler'
  }

  const getStatusLabel = (status: any) => {
    switch (status) {
      case 'EN_VENTA':
        return 'En Venta'
      case 'RESERVADA':
        return 'Reservada'
      case 'VENDIDA':
        return 'Vendida'
      default:
        return status
    }
  }

  const getStatusClasses = (status: any) => {
    switch (status) {
      case 'EN_VENTA':
        return 'bg-slate-100 text-slate-700 border border-slate-200'
      case 'RESERVADA':
        return 'bg-amber-50 text-amber-700 border border-amber-100'
      case 'VENDIDA':
        return 'bg-slate-100 text-slate-500 border border-slate-200'
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200'
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

  // Popup de cambio de estado
  const StatusPopup = ({ slug }: { slug: string }) => {
    const property = properties.find((p) => p.slug === slug)
    if (!property) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">          <h3 className="text-xl font-medium mb-4 text-slate-800">
          Cambiar estado de propiedad
        </h3>
          <p className="mb-4 text-slate-600">
            Propiedad:{' '}
            <span className="font-medium text-slate-800">{property.title}</span>
          </p>
          <p className="mb-4 text-slate-600">
            Estado actual:
            <span
              className={`ml-2 inline-block rounded-md px-2 py-1 text-xs font-medium ${getStatusClasses(
                property.status
              )}`}
            >
              {getStatusLabel(property.status)}
            </span>
          </p>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Seleccionar nuevo estado:
            </label>
            <div className="space-y-2">
              <div>
                <input
                  type="radio"
                  id="en_venta"
                  name="status"
                  value="EN_VENTA"
                  checked={selectedStatus === 'EN_VENTA'}
                  onChange={() => setSelectedStatus('EN_VENTA')}
                  className="mr-2"
                />
                <label htmlFor="en_venta" className="text-sm text-slate-600">
                  En Venta
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="reservada"
                  name="status"
                  value="RESERVADA"
                  checked={selectedStatus === 'RESERVADA'}
                  onChange={() => setSelectedStatus('RESERVADA')}
                  className="mr-2"
                />
                <label htmlFor="reservada" className="text-sm text-slate-600">
                  Reservada
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="vendida"
                  name="status"
                  value="VENDIDA"
                  checked={selectedStatus === 'VENDIDA'}
                  onChange={() => setSelectedStatus('VENDIDA')}
                  className="mr-2"
                />
                <label htmlFor="vendida" className="text-sm text-slate-600">
                  Vendida
                </label>
              </div>
            </div>
          </div>

          {selectedStatus === 'VENDIDA' && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-amber-700 text-sm mb-2">
                Al marcar esta propiedad como vendida, deberá registrar los detalles de la venta.
              </p>
              <p className="text-amber-800 text-sm">
                Después de guardar, será redirigido al formulario para completar la información de la venta.
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                setShowStatusPopup(null)
                setSelectedStatus(null)
              }}
              className="border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium py-2 px-4 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => handleStatusChange(slug)}
              disabled={!selectedStatus || statusUpdating}
              className={`bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 px-4 rounded-md transition-colors ${!selectedStatus || statusUpdating
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
                }`}
            >
              {statusUpdating ? (
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
    const property = properties.find((p) => p.slug === slug)
    if (!property) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full">
          <h3 className="text-xl font-medium mb-4 text-slate-800">
            Opciones de edición
          </h3>
          <p className="mb-4 text-slate-600">
            Propiedad:{' '}
            <span className="font-medium text-slate-800">{property.title}</span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => {
                setShowEditPopup(null)
                router.push(`/admin/dashboard/propiedad/editar/${slug}`)
              }}
              className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar detalles
            </button>

            <button
              onClick={() => {
                setShowEditPopup(null)
                setShowStatusPopup(slug)
                setSelectedStatus(property.status)
              }}
              className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center"
            >
              <FileText className="h-4 w-4 mr-2" />
              Cambiar estado
            </button>

            <button
              onClick={() => {
                window.open(`/propiedades/${slug}`, '_blank')
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-slate-400 animate-spin" />
          <p className="mt-2 text-slate-500">Cargando propiedades...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium text-slate-800">
          Propiedades Publicadas
        </h1>
        <Link
          href="/admin/dashboard/publicar"
          className="bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Publicar Nueva Propiedad
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {properties.length === 0 ? (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-md mb-4">
          No hay propiedades publicadas. Puedes crear una nueva propiedad usando
          el botón &quot;Publicar Nueva Propiedad&quot;.
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
                  Precio
                </th>
                <th className="py-3 px-4 border-b border-slate-200 text-left font-medium">
                  Tipo
                </th>
                <th className="py-3 px-4 border-b border-slate-200 text-left font-medium">
                  Modalidad
                </th>
                <th className="py-3 px-4 border-b border-slate-200 text-left font-medium">
                  Hab.
                </th>
                <th className="py-3 px-4 border-b border-slate-200 text-left font-medium">
                  Baños
                </th>
                <th className="py-3 px-4 border-b border-slate-200 text-left font-medium">
                  Disponible
                </th>
                <th className="py-3 px-4 border-b border-slate-200 text-left font-medium">
                  Estado
                </th>
                <th className="py-3 px-4 border-b border-slate-200 text-left font-medium">
                  Fecha
                </th>
                <th className="py-3 px-4 border-b border-slate-200 text-left font-medium">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {properties.map((property) => (
                <tr
                  key={property.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="w-16 h-16 relative">
                      <img
                        src={
                          property.images[0]?.url || '/placeholder-property.jpg'
                        }
                        alt={property.title}
                        className="w-full h-full object-cover rounded-md border border-slate-200"
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-800 font-medium">
                    {property.title}
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {formatPrice(Number(property.price))}
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {getPropertyTypeLabel(property.propertyType)}
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {getListingTypeLabel(property.listingType)}
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {property.bedrooms}
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {property.bathrooms}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block rounded-md px-2 py-1 text-xs font-medium ${property.isAvailable
                          ? 'bg-slate-100 text-slate-700 border border-slate-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                    >
                      {property.isAvailable ? 'Disponible' : 'No disponible'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block rounded-md px-2 py-1 text-xs font-medium ${getStatusClasses(
                        property.status
                      )}`}
                    >
                      {getStatusLabel(property.status)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {formatDate(property.createdAt)}
                  </td>
                  <td className="py-3 px-4">
                    {deleteConfirm === property.slug ? (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleDelete(property.slug)}
                          disabled={deleting}
                          className={`bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs py-1 px-2 rounded-md transition-colors ${deleting ? 'opacity-50 cursor-not-allowed' : ''
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
                          onClick={() => setShowEditPopup(property.slug)}
                          className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs py-1 px-2 rounded-md transition-colors"
                        >
                          Opciones
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Popups */}
      {showStatusPopup && <StatusPopup slug={showStatusPopup} />}
      {showEditPopup && <EditPopup slug={showEditPopup} />}
    </div>
  )
}
