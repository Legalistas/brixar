import { useCurrency } from '@/context/CurrencyContext'
import { Property, PropertyType, ListingType } from '@/types/property'
import { formatCurrency } from '@/utils/formatUtils'
import { Bath, BedDouble, Home, Maximize } from 'lucide-react'

const formatPropertyType = (propertyType: PropertyType): string => {
    return PropertyType[propertyType as keyof typeof PropertyType] || 'Propiedad'
}

const formatListingType = (listingType: ListingType): string => {
    return ListingType[listingType as unknown as keyof typeof ListingType] || 'Listado'
}

export default function PropertyInfo({ property }: { property: Property }) {
    const mainAddress = property.address[0]
    const { convertPrice, currentCurrency } = useCurrency()


    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Información de la propiedad</h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                    <Maximize className="h-5 w-5 text-gray-500" />
                    <span>{property.squareMeters} m²</span>
                </div>
                <div className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-gray-500" />
                    <span>{formatPropertyType(property.propertyType)}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Bath className="h-5 w-5 text-gray-500" />
                    <span>{property.bathrooms} Baño{property.bathrooms > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-2">
                    <BedDouble className="h-5 w-5 text-gray-500" />
                    <span>{property.bedrooms} Dormitorio{property.bedrooms > 1 ? 's' : ''}</span>
                </div>
            </div>
            <div className="mt-4">
                <p className="font-semibold">Dirección:</p>
                <p>{mainAddress.streetName}, {mainAddress.city}</p>
                <p>{mainAddress.state.name}, {mainAddress.country.name}</p>
            </div>
            <div className="mt-4">
                <p className="font-semibold">Precio:</p>
                <p className="text-2xl text-green-600">
                    {formatCurrency(convertPrice(Number(property.price)))}
                </p>
            </div>
            <div className="mt-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-2.5 py-0.5 rounded">
                    {formatListingType(property.listingType)}
                </span>
            </div>
        </div>
    )
}

