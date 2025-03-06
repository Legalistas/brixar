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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
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
                          onClick={() => router.push(`/admin/editar/${property.slug}`)}
                          className="bg-yellow-500 hover:bg-yellow-700 text-white text-xs py-1 px-2 rounded"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(property.slug)}
                          className="bg-red-500 hover:bg-red-700 text-white text-xs py-1 px-2 rounded"
                        >
                          Eliminar
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
    </div>
  );
}
