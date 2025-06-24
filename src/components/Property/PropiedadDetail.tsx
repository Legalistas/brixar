'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Home,
  Bath,
  Bed,
  Car,
  Maximize2,
  Calendar,
  Shield,
  Trees,
  X,
  Snowflake,
  Wind,
  Wifi,
  Heart,
  Flame,
  WashingMachine,
  Building,
} from 'lucide-react'
import Image from 'next/image'
import { Property } from '@/types/property'
import { getPorpertiesBySlug } from '@/services/properties-service'
import { useQuery } from '@tanstack/react-query'
import PropertyDetailSkeleton from './PropertyDetailSkeleton'
import { useRouter } from 'next/navigation'
import { GoogleMap } from '../GoogleMap'

const getAmenityConfig = () => {
  return {
    airConditioning: {
      icon: Snowflake,
      label: 'Aire Acondicionado',
    },
    balcony: {
      icon: Wind,
      label: 'Balcón',
    },
    elevator: {
      icon: Building,
      label: 'Ascensor',
    },
    garden: {
      icon: Trees,
      label: 'Jardín',
    },
    heating: {
      icon: Flame,
      label: 'Calefacción',
    },
    laundry: {
      icon: WashingMachine,
      label: 'Lavandería',
    },
    petFriendly: {
      icon: Heart,
      label: 'Pet Friendly',
    },
    security: {
      icon: Shield,
      label: 'Seguridad',
    },
    terrace: {
      icon: Wind,
      label: 'Terraza',
    },
    wifi: {
      icon: Wifi,
      label: 'WiFi',
    },
    parking: {
      icon: Car,
      label: 'Estacionamiento',
    },
  }
}

interface PropertyDetailProps {
  slug: string
}

export default function PropertyDetail({ slug }: PropertyDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [modalImageIndex, setModalImageIndex] = useState(0)
  const router = useRouter()

  const {
    data: propiedad,
    isLoading,
    error,
  } = useQuery<Property>({
    queryKey: ['propiedad', slug],
    queryFn: () => getPorpertiesBySlug(slug),
    enabled: !!slug,
  })

  // Show skeleton while loading
  if (isLoading) {
    return <PropertyDetailSkeleton />
  }

  // Show error state
  if (error || !propiedad) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Error al cargar la propiedad
          </h2>
          <p className="text-gray-600">
            No se pudo cargar la información de la propiedad.
          </p>
        </div>
      </div>
    )
  }

  const nextImage = () => {
    if (currentImageIndex < propiedad.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
    }
  }

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
    }
  }

  const openImageModal = (index: number) => {
    setModalImageIndex(index)
    setIsImageModalOpen(true)
  }

  const nextModalImage = () => {
    if (modalImageIndex < propiedad.images.length - 1) {
      setModalImageIndex(modalImageIndex + 1)
    }
  }

  const prevModalImage = () => {
    if (modalImageIndex > 0) {
      setModalImageIndex(modalImageIndex - 1)
    }
  }

  const formatPrice = (price: string) => {
    return `US$ ${Number.parseInt(price).toLocaleString()}`
  }

  const getPropertyTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      HOUSE: 'Casa',
      APARTMENT: 'Departamento',
      LAND: 'Terreno',
      COMMERCIAL: 'Comercial',
    }
    return types[type] || type
  }

  const getStatusLabel = (status: string) => {
    const statuses: { [key: string]: string } = {
      EN_VENTA: 'En Venta',
      VENDIDO: 'Vendido',
      RESERVADO: 'Reservado',
    }
    return statuses[status] || status
  }

  const address = propiedad.address[0]

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Botón volver */}
      <div className="mb-2">
        <Button
          variant="outline"
          onClick={() => router.push('/propiedades')}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> Volver a propiedades
        </Button>
      </div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {propiedad.title}
          </h1>
          <div className="flex items-center gap-2 text-gray-600 mt-2">
            <MapPin className="w-4 h-4" />
            <span>
              {address.streetName}, {address.city},{' '}
              {address.state?.name ? address.state.name : ''}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1">
            {getStatusLabel(propiedad.status)}
          </Badge>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">
              {formatPrice(propiedad.price)}
            </div>
            <div className="text-sm text-gray-500">SKU: {propiedad.slug}</div>
          </div>
        </div>
      </div>

      {/* Image Carousel */}
      <Card className="overflow-hidden">
        <div className="relative">
          <div className="aspect-video relative">
            <Image
              src={
                propiedad.images[currentImageIndex]?.url ||
                '/placeholder.svg?height=400&width=800'
              }
              alt={`${propiedad.title} - Imagen ${currentImageIndex + 1}`}
              fill
              className="object-cover cursor-pointer"
              onClick={() => openImageModal(currentImageIndex)}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
              onClick={() => openImageModal(currentImageIndex)}
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Navigation buttons */}
          {currentImageIndex > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
              onClick={prevImage}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
          )}

          {currentImageIndex < propiedad.images.length - 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
              onClick={nextImage}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          )}

          {/* Image counter */}
          <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {propiedad.images.length}
          </div>
        </div>

        {/* Thumbnail strip */}
        <div className="p-4">
          <div className="flex gap-2 overflow-x-auto">
            {propiedad.images.map((image, index) => (
              <button
                key={image.id}
                className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                  index === currentImageIndex
                    ? 'border-orange-500'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <Image
                  src={image.url || '/placeholder.svg'}
                  alt={`Thumbnail ${index + 1}`}
                  width={80}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Property Details Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Details */}
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Detalles de la propiedad
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Maximize2 className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Superficie</div>
                  <div className="font-semibold">
                    {propiedad.squareMeters} m²
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Home className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Tipo</div>
                  <div className="font-semibold">
                    {getPropertyTypeLabel(propiedad.propertyType)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Bath className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Baños</div>
                  <div className="font-semibold">{propiedad.bathrooms}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Bed className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Dormitorios</div>
                  <div className="font-semibold">{propiedad.bedrooms}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Car className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Cocheras</div>
                  <div className="font-semibold">{propiedad.parkingSpaces}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Año</div>
                  <div className="font-semibold">{propiedad.yearBuilt}</div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Descripción</h3>
              <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                {propiedad.description}
              </div>
            </div>

            {/* Location */}
            <section className="mt-12">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Dirección</h3>
                    <div className="space-y-1 text-gray-700">
                      <p>{propiedad.address[0].streetName}</p>
                      <p>
                        {propiedad.address[0].city},{' '}
                        {propiedad?.address[0]?.state?.name}{' '}
                        {propiedad.address[0].postalCode}
                      </p>
                      <p>{propiedad?.address[0]?.country?.name}</p>
                    </div>
                  </div>

                  {propiedad.address[0].positions.length > 0 ? (
                    <div className="mt-4">
                      {propiedad.address[0].positions[0].latitude &&
                        propiedad.address[0].positions[0].longitude && (
                          <div className="aspect-video rounded-lg overflow-hidden">
                            <GoogleMap
                              latitude={Number(
                                propiedad.address[0].positions[0].latitude
                              )}
                              longitude={Number(
                                propiedad.address[0].positions[0].longitude
                              )}
                            />
                          </div>
                        )}
                    </div>
                  ) : (
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">
                        Mapa no disponible en esta vista
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Amenities */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Comodidades</h3>
              <div className="space-y-3">
                {Object.entries(propiedad.amenities)
                  .filter(([_, value]) => value === true)
                  .map(([key, _]) => {
                    const amenityConfig = getAmenityConfig()
                    const config =
                      amenityConfig[key as keyof typeof amenityConfig]

                    if (!config) return null

                    const IconComponent = config.icon

                    return (
                      <div key={key} className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{config.label}</span>
                      </div>
                    )
                  })}
                {Object.values(propiedad.amenities).every(
                  (value) => !value
                ) && (
                  <div className="text-sm text-gray-500">
                    No hay comodidades especificadas
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Ubicación</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Dirección:</strong> {address.streetName}
                </div>
                <div>
                  <strong>Ciudad:</strong> {address.city}
                </div>
                <div>
                  <strong>Provincia:</strong>{' '}
                  {address.state?.name ? address.state.name : ''}
                </div>
                <div>
                  <strong>País:</strong>{' '}
                  {address.country?.name ? address.country.name : ''}
                </div>
                <div>
                  <strong>Código Postal:</strong> {address.postalCode}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardContent className="p-6">
              <a
                href="https://wa.me/5493492282324"
                target="_blank"
                rel="noopener noreferrer"
              >
                <h3 className="font-semibold mb-4">
                  ¿Interesado en esta propiedad?
                </h3>
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                  Contactar Agente
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Image Modal */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-4xl w-full p-0">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
              onClick={() => setIsImageModalOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>

            <div className="aspect-video relative">
              <Image
                src={
                  propiedad.images[modalImageIndex]?.url ||
                  '/placeholder.svg?height=600&width=800'
                }
                alt={`${propiedad.title} - Imagen ${modalImageIndex + 1}`}
                fill
                className="object-contain"
              />
            </div>

            {/* Modal Navigation */}
            {modalImageIndex > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                onClick={prevModalImage}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
            )}

            {modalImageIndex < propiedad.images.length - 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                onClick={nextModalImage}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            )}

            {/* Modal Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {modalImageIndex + 1} / {propiedad.images.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
