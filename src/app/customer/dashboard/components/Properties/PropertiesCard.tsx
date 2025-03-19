import Image from 'next/image'
import { Bath, BedDouble, Home, Maximize, Building, TypeIcon as type, LucideIcon, HelpCircle } from 'lucide-react'
import { Property, PropertyType, ListingType } from '@/types/property'
import React from 'react'
import { formatCurrency } from '@/utils/formatUtils'
import Link from 'next/link'
import { useCurrency } from '@/context/CurrencyContext'

const propertyTypeIcons: { [key in PropertyType]: LucideIcon } = {
    [PropertyType.HOUSE]: Home,
    [PropertyType.APARTMENT]: Building,
    [PropertyType.LAND]: Maximize,
    [PropertyType.OFFICE]: Building,
    [PropertyType.COMMERCIAL]: Building,
    [PropertyType.WAREHOUSE]: Building,
    [PropertyType.FARM]: Home,
    [PropertyType.CHALET]: Home,
}

const formatPropertyType = (propertyType: PropertyType): string => {
    return PropertyType[propertyType as unknown as keyof typeof PropertyType] || 'Propiedad'
}

const formatListingType = (listingType: ListingType): string => {
    return ListingType[listingType as unknown as keyof typeof ListingType] || 'Listado'
}


export default function PropertyCard({ property, visitDate }: { property: Property, visitDate: Date }) {
    const mainAddress = property.address[0] // Assuming the first address is the main one
    const { convertPrice, currentCurrency } = useCurrency();
    return (
        <div className="max-w-sm bg-white rounded-lg overflow-hidden shadow border-1 border-gray-400">
            {/* Image Container */}
            <div className="relative h-48 w-full">
                <Image
                    src={property.images[0]?.url || "/placeholder.svg"}
                    alt={`Imagen de ${property.title}`}
                    fill
                    className="object-cover"
                />
                {/* Price Tag */}
                <div className="absolute bottom-4 right-4 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {formatCurrency(convertPrice(Number(property.price)))}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {property.title}
                </h3>

                {/* Property Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Area */}
                    <div className="flex items-center gap-2 text-gray-600">
                        <Maximize className="h-4 w-4" />
                        <span className="text-sm">{property.squareMeters} m²</span>
                    </div>

                    {/* Property Type */}
                    <div className="flex items-center gap-2 text-gray-600">
                        {React.createElement(propertyTypeIcons[property.propertyType] || Home, { className: "h-4 w-4" })}
                        <span className="text-sm">{formatPropertyType(property.propertyType)}</span>
                    </div>

                    {/* Bathrooms */}
                    <div className="flex items-center gap-2 text-gray-600">
                        <Bath className="h-4 w-4" />
                        <span className="text-sm">{property.bathrooms} Baño{property.bathrooms > 1 ? 's' : ''}</span>
                    </div>

                    {/* Bedrooms */}
                    <div className="flex items-center gap-2 text-gray-600">
                        <BedDouble className="h-4 w-4" />
                        <span className="text-sm">{property.bedrooms} Dormitorio{property.bedrooms > 1 ? 's' : ''}</span>
                    </div>
                </div>

                {/* Address */}
                <div className="mt-4 text-sm text-gray-600">
                    <p>{mainAddress.streetName}, {mainAddress.city}</p>
                    <p>{mainAddress.state.name}, {mainAddress.country.name}</p>
                </div>

                {/* Listing Type */}
                <div className="mt-2 inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    {formatListingType(property.listingType)}
                </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-between items-center">
                {/* <Link href={`/customer/properties/${property.slug}`} className="p-2.5 text-xs font-medium block text-center rounded-md bg-slate-500 hover:bg-slate-700 text-white">Ver detalles</Link> */}
                <div className="text-sm"> Visita programada: {new Date(visitDate).toLocaleString()}</div>
                <Link href={`/customer/properties/${property.slug}`} className="p-2.5 text-xs font-medium block text-center rounded-md bg-[#FB6107] hover:bg-[#FB6107]/90 text-white">
                    <HelpCircle className="h-4 w-4" />
                </Link>
            </div>
        </div>
    )
}

