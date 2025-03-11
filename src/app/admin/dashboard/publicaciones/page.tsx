"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_ENDPOINTS } from "@/constants/api-endpoint";
import { PropertyState, ListingType } from "@prisma/client";

// Tipo para las propiedades
interface Property {
  id: number;
  slug: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  propertyType: PropertyState;
  listingType: ListingType;
  isAvailable: boolean;
  status: any;
  images: { url: string }[];
  createdAt: string;
  updatedAt: string;
}

export default function PublicacionesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showStatusPopup, setShowStatusPopup] = useState<string | null>(null);
  const [showEditPopup, setShowEditPopup] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<any | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Cargar propiedades al montar el componente
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.PROPERTIES_INDEX);
      if (!response.ok) {
        throw new Error("No se pudieron cargar las propiedades");
      }
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error("Error fetching properties:", error);
      setError("Error al cargar las propiedades. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    setDeleting(true);
    try {
      const response = await fetch(API_ENDPOINTS.PROPERTY_DELETE(slug), {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar la propiedad");
      }

      // Actualizar la lista después de eliminar
      setProperties(properties.filter((property) => property.slug !== slug));
      setDeleteConfirm(null);
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al eliminar la propiedad");
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusChange = async (slug: string) => {
    if (!selectedStatus) return;
    
    setStatusUpdating(true);
    try {
      const response = await fetch(API_ENDPOINTS.PROPERTY_UPDATE(slug), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: selectedStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar el estado de la propiedad");
      }

      // Actualizar el estado en la lista local
      setProperties(
        properties.map((property) =>
          property.slug === slug
            ? { ...property, status: selectedStatus }
            : property
        )
      );
      
      setShowStatusPopup(null);
      setSelectedStatus(null);
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al actualizar el estado de la propiedad");
    } finally {
      setStatusUpdating(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getPropertyTypeLabel = (type: PropertyState) => {
    return type === PropertyState.APARTMENT ? "Apartamento" : "Casa";
  };

  const getListingTypeLabel = (type: ListingType) => {
    return type === ListingType.SALE ? "Venta" : "Alquiler";
  };

  const getStatusLabel = (status: any) => {
    switch (status) {
      case 'EN_VENTA':
        return "En Venta";
      case 'RESERVADA':
        return "Reservada";
      case 'VENDIDA':
        return "Vendida";
      default:
        return status;
    }
  };

  const getStatusClasses = (status: any) => {
    switch (status) {
      case 'EN_VENTA':
        return "bg-green-100 text-green-800";
      case 'RESERVADA':
        return "bg-yellow-100 text-yellow-800";
      case 'VENDIDA':
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  // Popup de cambio de estado
  const StatusPopup = ({ slug }: { slug: string }) => {
    const property = properties.find(p => p.slug === slug);
    if (!property) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h3 className="text-xl font-bold mb-4">Cambiar estado de propiedad</h3>
          <p className="mb-4">Propiedad: <span className="font-semibold">{property.title}</span></p>
          <p className="mb-4">Estado actual: 
            <span className={`ml-2 inline-block rounded-full px-2 py-1 text-xs font-bold ${getStatusClasses(property.status)}`}>
              {getStatusLabel(property.status)}
            </span>
          </p>
          
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Seleccionar nuevo estado:</label>
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
                <label htmlFor="en_venta" className="text-sm">En Venta</label>
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
                <label htmlFor="reservada" className="text-sm">Reservada</label>
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
                <label htmlFor="vendida" className="text-sm">Vendida</label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                setShowStatusPopup(null);
                setSelectedStatus(null);
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Cancelar
            </button>
            <button
              onClick={() => handleStatusChange(slug)}
              disabled={!selectedStatus || statusUpdating}
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                !selectedStatus || statusUpdating ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {statusUpdating ? "Actualizando..." : "Guardar"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Popup de edición rápida
  const EditPopup = ({ slug }: { slug: string }) => {
    const property = properties.find(p => p.slug === slug);
    if (!property) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full">
          <h3 className="text-xl font-bold mb-4">Opciones de edición</h3>
          <p className="mb-4">Propiedad: <span className="font-semibold">{property.title}</span></p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => {
                setShowEditPopup(null);
                router.push(`/admin/editar/${slug}`);
              }}
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar detalles
            </button>
            
            <button
              onClick={() => {
                setShowEditPopup(null);
                setShowStatusPopup(slug);
                setSelectedStatus(property.status);
              }}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Cambiar estado
            </button>
            
            <button
              onClick={() => {
                window.open(`/propiedades/${slug}`, '_blank');
                setShowEditPopup(null);
              }}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Ver en sitio
            </button>
            
            <button
              onClick={() => {
                setShowEditPopup(null);
                setDeleteConfirm(slug);
              }}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-4 rounded flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Eliminar
            </button>
          </div>
          
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setShowEditPopup(null)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Propiedades Publicadas</h1>
        <Link 
          href="/admin/publicar"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Publicar Nueva Propiedad
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {properties.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          No hay propiedades publicadas. Puedes crear una nueva propiedad usando el botón &quot;Publicar Nueva Propiedad&quot;.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">Imagen</th>
                <th className="py-2 px-4 border-b text-left">Título</th>
                <th className="py-2 px-4 border-b text-left">Precio</th>
                <th className="py-2 px-4 border-b text-left">Tipo</th>
                <th className="py-2 px-4 border-b text-left">Modalidad</th>
                <th className="py-2 px-4 border-b text-left">Hab.</th>
                <th className="py-2 px-4 border-b text-left">Baños</th>
                <th className="py-2 px-4 border-b text-left">Disponible</th>
                <th className="py-2 px-4 border-b text-left">Estado</th>
                <th className="py-2 px-4 border-b text-left">Fecha</th>
                <th className="py-2 px-4 border-b text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">
                    <div className="w-16 h-16 relative">
                      <img
                        src={property.images[0]?.url || "/placeholder-property.jpg"}
                        alt={property.title}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b">{property.title}</td>
                  <td className="py-2 px-4 border-b">{formatPrice(Number(property.price))}</td>
                  <td className="py-2 px-4 border-b">{getPropertyTypeLabel(property.propertyType)}</td>
                  <td className="py-2 px-4 border-b">{getListingTypeLabel(property.listingType)}</td>
                  <td className="py-2 px-4 border-b">{property.bedrooms}</td>
                  <td className="py-2 px-4 border-b">{property.bathrooms}</td>
                  <td className="py-2 px-4 border-b">
                    <span
                      className={`inline-block rounded-full px-2 py-1 text-xs font-bold ${
                        property.isAvailable
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {property.isAvailable ? "Disponible" : "No disponible"}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <span
                      className={`inline-block rounded-full px-2 py-1 text-xs font-bold ${
                        getStatusClasses(property.status)
                      }`}
                    >
                      {getStatusLabel(property.status)}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">{formatDate(property.createdAt)}</td>
                  <td className="py-2 px-4 border-b">
                    {deleteConfirm === property.slug ? (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleDelete(property.slug)}
                          disabled={deleting}
                          className={`bg-red-500 hover:bg-red-700 text-white text-xs py-1 px-2 rounded ${
                            deleting ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          {deleting ? "Eliminando..." : "Confirmar"}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="bg-gray-500 hover:bg-gray-700 text-white text-xs py-1 px-2 rounded"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setShowEditPopup(property.slug)}
                          className="bg-blue-500 hover:bg-blue-700 text-white text-xs py-1 px-2 rounded"
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
  );
}
