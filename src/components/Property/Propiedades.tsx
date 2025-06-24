'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { getAllProperties } from '@/services/properties-service'
import {
  Bath,
  Bed,
  Home,
  MapPin,
  Maximize,
  Search,
  Grid3X3,
  List,
  Building2,
} from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Property } from '@prisma/client'
import { PropertyProps } from './PropertyCard'
import { useCurrency } from '@/context/CurrencyContext'
import { useRouter } from 'next/navigation'
import PropertySkeleton, { PropertyListItemSkeleton } from './PropertySkeleton'

function formatPrice(price: number | string) {
  const numPrice = typeof price === 'string' ? Number.parseInt(price) : price
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice)
}

const propertyTypeIcons = {
  HOUSE: Home,
  APARTMENT: Building2,
}

const statusLabels = {
  EN_VENTA: 'En Venta',
  RESERVADA: 'Reservada',
  VENDIDA: 'Vendida',
}

export const PropertyCard = ({ property }: PropertyProps) => {
  const { convertPrice } = useCurrency()
  const router = useRouter()
  const mainAddress = property.address[0]
  const formatPropertyType = (type: string) => {
    return type === 'HOUSE' ? 'Casa' : 'Departamento'
  }

  const formatListingType = (type: string) => {
    return type === 'SALE' ? 'Venta' : 'Alquiler'
  }

  const PropertyTypeIcon = propertyTypeIcons[property.propertyType]

  const listingTypeColors = {
    SALE: 'from-red-500 to-yellow-500',
    RENT: 'from-blue-500 to-green-500',
  }

  const isUnavailable =
    property.status === 'RESERVADA' || property.status === 'VENDIDA'

  const handleViewDetails = () => {
    router.push(`/propiedades/${property.slug}`)
  }

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0 relative">
        <div className="relative overflow-hidden">
          <Image
            src={property.images?.[0]?.url || '/placeholder.svg'}
            alt={property.title}
            width={400}
            height={300}
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Badge de estado */}
          <Badge
            className={`absolute top-3 left-3 ${
              property.status === 'VENDIDA'
                ? 'bg-gray-800 hover:bg-gray-700'
                : property.status === 'RESERVADA'
                ? 'bg-yellow-600 hover:bg-yellow-700'
                : 'bg-orange-500 hover:bg-orange-600'
            } text-white font-medium`}
          >
            {statusLabels[property.status]}
          </Badge>

          {/* Precio */}
          <div className="absolute bottom-3 left-3">
            <span className="bg-black/80 text-white px-3 py-1 rounded-full text-lg font-bold">
              {formatPrice(property.price)}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {property.title}
          </h3>
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">
              {mainAddress?.streetName}, {mainAddress?.city}
            </span>
          </div>
        </div>

        <Separator />

        {/* Características en grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center">
              <Maximize className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Superficie</p>
              <p className="font-semibold text-gray-900">
                {property.squareMeters} m²
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center">
              <PropertyTypeIcon className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Tipo</p>
              <p className="font-semibold text-gray-900">
                {formatPropertyType(property.propertyType)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center">
              <Bath className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Baños</p>
              <p className="font-semibold text-gray-900">
                {property.bathrooms}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center">
              <Bed className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Dormitorios</p>
              <p className="font-semibold text-gray-900">{property.bedrooms}</p>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <p className="text-xs text-gray-500">
            <span className="font-medium">SKU:</span> {property.slug}
          </p>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className={`w-full ${
            isUnavailable
              ? 'bg-gray-600 hover:bg-gray-700'
              : 'bg-orange-500 hover:bg-orange-600'
          } text-white font-medium`}
          disabled={isUnavailable}
          onClick={handleViewDetails}
        >
          {isUnavailable ? statusLabels[property.status] : 'Ver detalles'}
        </Button>
      </CardFooter>
    </Card>
  )
}

export const PropertyListItem = ({ property }: PropertyProps) => {
  const router = useRouter()
  const mainAddress = property.address[0]

  const formatPropertyType = (type: string) => {
    return type === 'HOUSE' ? 'Casa' : 'Departamento'
  }

  const isUnavailable =
    property.status === 'RESERVADA' || property.status === 'VENDIDA'
  const PropertyTypeIcon = propertyTypeIcons[property.propertyType]

  const handleViewDetails = () => {
    router.push(`/propiedades/${property.slug}`)
  }

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Imagen */}
          <div className="relative md:w-80 h-48 md:h-auto flex-shrink-0">
            <Image
              src={property.images?.[0]?.url || '/placeholder.svg'}
              alt={property.title}
              width={400}
              height={300}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent md:bg-gradient-to-t md:from-black/60 md:via-transparent md:to-transparent" />

            {/* Badge de estado */}
            <Badge
              className={`absolute top-3 left-3 ${
                property.status === 'VENDIDA'
                  ? 'bg-gray-800 hover:bg-gray-700'
                  : property.status === 'RESERVADA'
                  ? 'bg-yellow-600 hover:bg-yellow-700'
                  : 'bg-orange-500 hover:bg-orange-600'
              } text-white font-medium`}
            >
              {statusLabels[property.status]}
            </Badge>

            {/* Precio */}
            <div className="absolute bottom-3 left-3">
              <span className="bg-black/80 text-white px-3 py-1 rounded-full text-lg font-bold">
                {formatPrice(property.price)}
              </span>
            </div>
          </div>

          {/* Contenido */}
          <div className="flex-1 p-6">
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {property.title}
                  </h3>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>
                      {mainAddress?.streetName}, {mainAddress?.city}
                    </span>
                  </div>
                </div>

                <Separator className="mb-4" />

                {/* Características en línea horizontal */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
                      <Maximize className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Superficie</p>
                      <p className="font-semibold text-gray-900">
                        {property.squareMeters} m²
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
                      <PropertyTypeIcon className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tipo</p>
                      <p className="font-semibold text-gray-900">
                        {formatPropertyType(property.propertyType)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
                      <Bath className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Baños</p>
                      <p className="font-semibold text-gray-900">
                        {property.bathrooms}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
                      <Bed className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Dormitorios</p>
                      <p className="font-semibold text-gray-900">
                        {property.bedrooms}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">SKU:</span> {property.slug}
                  </p>
                </div>
              </div>

              {/* Botón */}
              <div className="flex justify-end">
                <Button
                  className={`${
                    isUnavailable
                      ? 'bg-gray-600 hover:bg-gray-700'
                      : 'bg-orange-500 hover:bg-orange-600'
                  } text-white font-medium px-8`}
                  disabled={isUnavailable}
                  onClick={handleViewDetails}
                >
                  {isUnavailable
                    ? statusLabels[property.status]
                    : 'Ver detalles'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export const Propiedades = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const { data: propiedades } = useQuery<Property[]>({
    queryKey: ['propiedades'],
    queryFn: () => getAllProperties(),
  })
  const isLoading = !propiedades

  const propiedadesEnVenta = propiedades?.filter(
    (propiedad) => propiedad.status === 'EN_VENTA'
  )
  const propiedadesVendidas = propiedades?.filter(
    (propiedad) => propiedad.status === 'VENDIDA'
  )

  return (
    <div
      className="min-h-screen bg-gray-50 overflow-x-hidden"
      style={{
        minWidth: '-webkit-fill-available',
      }}
    >
      <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8"> */}

        {/* Filtros y búsqueda */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar por ubicación, SKU o nombre..."
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Select>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Tipo de propiedad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casa">Casa</SelectItem>
                    <SelectItem value="departamento">Departamento</SelectItem>
                    <SelectItem value="terreno">Terreno</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Rango de precio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-50000">$0 - $50,000</SelectItem>
                    <SelectItem value="50000-100000">
                      $50,000 - $100,000
                    </SelectItem>
                    <SelectItem value="100000+">$100,000+</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setViewMode(viewMode === 'grid' ? 'list' : 'grid')
                  }
                  title={
                    viewMode === 'grid' ? 'Vista de lista' : 'Vista de tarjetas'
                  }
                >
                  {viewMode === 'grid' ? (
                    <List className="w-4 h-4" />
                  ) : (
                    <Grid3X3 className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Propiedades en venta */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <h2 className="text-3xl font-bold text-gray-900">
              Propiedades en venta
            </h2>
            <Badge variant="secondary" className="text-sm">
              {propiedadesEnVenta?.length} propiedades
            </Badge>
          </div>

          {isLoading ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <PropertySkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <PropertyListItemSkeleton key={i} />
                ))}
              </div>
            )
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {propiedadesEnVenta?.map((propiedad) => (
                // @ts-expect-error ignore
                <PropertyCard key={propiedad.id} property={propiedad} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {propiedadesEnVenta?.map((propiedad) => (
                // @ts-expect-error ignore
                <PropertyListItem key={propiedad.id} property={propiedad} />
              ))}
            </div>
          )}
        </section>

        {/* Propiedades vendidas */}
        <section>
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <h2 className="text-3xl font-bold text-gray-900">
              Propiedades vendidas
            </h2>
            <Badge variant="secondary" className="text-sm">
              {propiedadesVendidas?.length} propiedad
            </Badge>
          </div>

          {isLoading ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <PropertySkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <PropertyListItemSkeleton key={i} />
                ))}
              </div>
            )
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {propiedadesVendidas?.map((propiedad) => (
                // @ts-expect-error ignore
                <PropertyCard key={propiedad.id} property={propiedad} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {propiedadesVendidas?.map((propiedad) => (
                // @ts-expect-error ignore
                <PropertyListItem key={propiedad.id} property={propiedad} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
