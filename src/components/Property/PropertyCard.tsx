import React from 'react'
import { useCurrency } from '@/context/CurrencyContext'
import { formatCurrency } from '@/utils/formatUtils'
import { Bath, BedDouble, Building2, Home, Maximize } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface PropertyImage {
  id: number
  url: string
  propertyId: number
}

interface PropertyAddress {
  city: string
  streetName: string
  state: {
    name: string
  }
  country: {
    name: string
  }
}

interface PropertyProps {
  property: {
    id: number
    slug: string
    title: string
    price: string
    bedrooms: number
    bathrooms: number
    squareMeters: number
    propertyType: 'HOUSE' | 'APARTMENT'
    listingType: 'SALE' | 'RENT'
    status: 'EN_VENTA' | 'RESERVADA' | 'VENDIDA'
    images: PropertyImage[]
    address: PropertyAddress[]
  }
}

const propertyTypeIcons = {
  HOUSE: Home,
  APARTMENT: Building2,
}

const PropertyCard = ({ property }: PropertyProps) => {
  const { convertPrice } = useCurrency()
  const mainAddress = property.address[0]
  const formatPropertyType = (type: string) => {
    return type === 'HOUSE' ? 'Casa' : 'Departamento'
  }

  const formatListingType = (type: string) => {
    return type === 'SALE' ? 'Venta' : 'Alquiler'
  }

  const listingTypeColors = {
    SALE: 'from-red-500 to-yellow-500',
    RENT: 'from-blue-500 to-green-500',
  }

  const isUnavailable =
    property.status === 'RESERVADA' || property.status === 'VENDIDA'

  const statusLabels = {
    EN_VENTA: 'En Venta',
    RESERVADA: 'Reservada',
    VENDIDA: 'Vendida',
  }

  return (
    <div
      key={property.id}
      className="bg-white rounded-lg overflow-hidden shadow border border-gray-200 transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg flex flex-col h-full"
    >
      {/* Image Container with Rainbow Badge */}
      <div className="relative h-48 w-full flex-shrink-0">
        <div
          className={`absolute top-0 left-0 z-10 px-3 py-1 text-xs font-semibold text-white rounded-br-lg bg-gradient-to-r ${
            listingTypeColors[property.listingType]
          }`}
        >
          {formatListingType(property.listingType)}
        </div>

        {/* Property Image */}
        <div className="relative h-full w-full">
          <Image
            src={property.images[0]?.url || '/placeholder.svg'}
            alt={`Imagen de ${property.title}`}
            fill
            className={`object-cover transition-transform duration-300 ease-in-out hover:scale-110 ${
              isUnavailable ? 'grayscale' : ''
            }`}
          />

          {/* Status Overlay for RESERVADA or VENDIDA */}
          {isUnavailable && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-black/80 text-white px-6 py-3 rounded-md text-lg font-bold transform -rotate-12">
                {statusLabels[property.status]}
              </div>
            </div>
          )}

          {/* Price Tag */}
          <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded-full text-xs font-semibold">
            {formatCurrency(convertPrice(Number(property.price)))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
          {property.title}
        </h3>

        {/* Property Details Grid */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="flex items-center gap-1 text-gray-600">
            <Maximize className="h-4 w-4" />
            <span className="text-xs">{property.squareMeters} m²</span>
          </div>

          <div className="flex items-center gap-1 text-gray-600">
            {React.createElement(
              propertyTypeIcons[property.propertyType] || Home,
              { className: 'h-4 w-4' }
            )}
            <span className="text-xs">
              {formatPropertyType(property.propertyType)}
            </span>
          </div>

          <div className="flex items-center gap-1 text-gray-600">
            <Bath className="h-4 w-4" />
            <span className="text-xs">
              {property.bathrooms} Baño{property.bathrooms > 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex items-center gap-1 text-gray-600">
            <BedDouble className="h-4 w-4" />
            <span className="text-xs">
              {property.bedrooms} Dormitorio{property.bedrooms > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Address */}
        <div className="text-xs text-gray-600 mb-2 flex-grow">
          <p>
            {mainAddress.streetName}, {mainAddress.city}
          </p>
          <p>
            {mainAddress?.state?.name}, {mainAddress?.country?.name}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 mt-auto">
        <Link
          href={`/propiedades/${property.slug}`}
          className="p-2 text-xs font-medium block text-center rounded-md bg-[#FB6107] hover:bg-[#FB6107]/90 text-white transition-colors"
        >
          Ver detalles
        </Link>
      </div>
    </div>
  )
}

export default PropertyCard
