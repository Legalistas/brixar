import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Property } from '@/types/property'

interface PropertyCardProps {
  property: Property
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const isAvailable = property.status === 'venta'

  const getStausProperty = (propertyType: string) => {
    switch (propertyType) {
      case 'HOUSE':
        return <div>Casa</div>
      case 'APARTMENT':
        return <div>Departamento</div>
      default:
        return <div>{propertyType}</div>
    }
  }

  return (
    <Card
      className={`group overflow-hidden hover:shadow-lg transition-all duration-300 ${
        !isAvailable ? 'opacity-75' : ''
      }`}
    >
      <div className="relative">
        <img
          src={property.images[0].url}
          alt={property.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Badge
          className={`absolute top-3 left-3 ${
            isAvailable
              ? 'bg-orange-500 hover:bg-orange-600 text-white'
              : 'bg-gray-500 hover:bg-gray-600 text-white'
          }`}
        >
          {isAvailable ? 'Venta' : 'Vendida'}
        </Badge>
        <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm font-semibold">
          ${property.price.toLocaleString()}
        </div>
      </div>

      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="font-semibold text-lg text-gray-900 mb-1">
            {property.title}
          </h3>
          <p className="text-gray-600 text-sm">
            {property.address[0].streetName}
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <span className="font-medium">{property.squareMeters}</span>
            <span>m²</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">{property.bathrooms}</span>
            <span>Baño{property.bathrooms > 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">{property.bedrooms}</span>
            <span>Dorm.</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-sm">
            {getStausProperty(property.propertyType)}
          </Badge>
          <Link href={`/customer/properties/${property.slug}`}>
            <Button
              size="sm"
              className={
                !isAvailable
                  ? 'bg-orange-500 hover:bg-orange-600'
                  : 'bg-gray-400 hover:bg-gray-500'
              }
            >
              Ver detalles
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default PropertyCard
