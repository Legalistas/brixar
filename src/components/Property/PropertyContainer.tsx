'use client'

import { useEffect, useState } from 'react'
import { getAllProperties } from '@/services/properties-service'
import PropertyCard from './PropertyCard'
import PropertySkeleton from './PropertySkeleton'
import { Property } from '@prisma/client'
import Link from 'next/link'

interface Filters {
  price?: number
  bedrooms?: number
  bathrooms?: number
  propertyType?: string
}

interface PropertyContainerProps {
  filters?: Filters
  separateByStatus?: boolean
}

const PropertyContainer = ({ filters = {} as Filters, separateByStatus = false }: PropertyContainerProps) => {  
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [enVentaProperties, setEnVentaProperties] = useState<Property[]>([])
  const [reservadasProperties, setReservadasProperties] = useState<Property[]>([])
  const [vendidasProperties, setVendidasProperties] = useState<Property[]>([])
  const [enVentaLimited, setEnVentaLimited] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true)
      try {
        const response = await getAllProperties()
        setProperties(response)
        setFilteredProperties(response)
      } catch (error) {
        console.error('Error fetching properties:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProperties()
  }, [])

  useEffect(() => {
    let filtered = properties

    if (filters.price !== undefined) {
      filtered = filtered.filter(
        (property) =>
          // @ts-expect-error ignore
          filters.price !== undefined && property.price <= filters.price
      )
    }

    if (filters.bedrooms) {
      filtered = filtered.filter(
        (property) =>
          filters.bedrooms !== undefined &&
          property.bedrooms >= filters.bedrooms
      )
    }

    if (filters.bathrooms !== undefined) {
      filtered = filtered.filter(
        (property) =>
          filters.bathrooms !== undefined &&
          property.bathrooms >= filters.bathrooms
      )
    }

    if (filters.propertyType) {
      filtered = filtered.filter(
        (property) => property.propertyType === filters.propertyType
      )
    }

    // Si no estamos separando por estado, filtramos solo las propiedades en venta
    if (!separateByStatus) {
      const enVenta = filtered.filter(property => property.status === 'EN_VENTA')
      // Ordenamos por ID en orden descendente para obtener las más recientes primero (asumiendo que el ID aumenta con cada nueva propiedad)
      const sortedProperties = [...enVenta].sort((a, b) => b.id - a.id)
      setFilteredProperties(sortedProperties)
      // Limitamos a solo 8 propiedades para la visualización inicial
      setEnVentaLimited(sortedProperties.slice(0, 8))
    } else {
      setFilteredProperties(filtered)
    }

    // Si separateByStatus está activado, separamos las propiedades por estado
    if (separateByStatus) {
      setEnVentaProperties(filtered.filter(property => property.status === 'EN_VENTA'))
      setReservadasProperties(filtered.filter(property => property.status === 'RESERVADA'))
      setVendidasProperties(filtered.filter(property => property.status === 'VENDIDA'))
    }
  }, [filters, properties, separateByStatus])

  // Crear array de esqueletos
  const skeletonArray = Array(8).fill(0)

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pb-32 pt-20">
      {separateByStatus ? (
        <>
          {/* Propiedades en venta */}
          <h2 className="text-2xl font-bold mb-6">Propiedades en venta</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
            {isLoading ? (
              <>
                {skeletonArray.map((_, index) => (
                  <PropertySkeleton key={index} />
                ))}
              </>
            ) : (
              <>
                {enVentaProperties.length > 0 ? (
                  enVentaProperties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      // @ts-expect-error ignore
                      property={property}
                    />
                  ))
                ) : (
                  <div className="col-span-4 py-8 text-center text-gray-500">
                    No hay propiedades en venta disponibles.
                  </div>
                )}
              </>
            )}
          </div>

          {/* Propiedades reservadas */}
          {!isLoading && reservadasProperties.length > 0 && (
            <>
              <h2 className="text-2xl font-bold mb-6 mt-8">Propiedades reservadas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
                {reservadasProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    // @ts-expect-error ignore
                    property={property}
                  />
                ))}
              </div>
            </>
          )}

          {/* Propiedades vendidas */}
          {!isLoading && vendidasProperties.length > 0 && (
            <>
              <h2 className="text-2xl font-bold mb-6 mt-8">Propiedades vendidas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {vendidasProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    // @ts-expect-error ignore
                    property={property}
                  />
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-6">Propiedades destacadas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {isLoading ? (
              <>
                {skeletonArray.map((_, index) => (
                  <PropertySkeleton key={index} />
                ))}
              </>
            ) : (
              <>
                {enVentaLimited.length > 0 ? (
                  enVentaLimited.map((property) => (
                    <PropertyCard
                      key={property.id}
                      // @ts-expect-error ignore
                      property={property}
                    />
                  ))
                ) : (
                  <div className="col-span-4 py-8 text-center text-gray-500">
                    No hay propiedades destacadas disponibles.
                  </div>
                )}
              </>
            )}
          </div>
          
          {!isLoading && filteredProperties.length > 8 && (
            <div className="flex justify-center mt-10">
              <Link 
                href="/propiedades"
                className="px-6 py-3 bg-[#FB6107] hover:bg-[#FB6107]/90 text-white font-medium rounded-md transition-colors"
              >
                Ver más propiedades
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default PropertyContainer
