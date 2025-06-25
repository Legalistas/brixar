import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, MapPin, ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react'
import { GoogleMap } from '@/components/GoogleMap'
import VisitScheduler from './VisitScheduler'
import { useQuery } from '@tanstack/react-query'
import { Property } from '@/types/property'
import { getPorpertiesBySlug } from '@/services/properties-service'
import { useState } from 'react'
import PropertyDetailSkeleton from '@/components/Property/PropertyDetailSkeleton'
import Image from 'next/image'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface PropertyDetailProps {
  slug: string
}

const PropertyDetail = ({ slug }: PropertyDetailProps) => {
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

  if (isLoading) {
    return <PropertyDetailSkeleton />
  }

  if (!propiedad) {
    return <div>Propiedad no encontrada</div>
  }

  // Carrusel de imágenes
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a propiedades
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
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

            {/* Modal de imagen ampliada */}
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

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Descripción</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {propiedad.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Características</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Cochera abierta</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Cocina equipada</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Baño moderno</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Patio grande</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Aberturas premium</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Cerámicas de calidad</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map Section */}
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Property Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">
                  {propiedad.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{propiedad.address[0].streetName}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {propiedad.address[0].city}, {propiedad.address[0].state?.name ? propiedad.address[0].state.name : ''} {propiedad.address[0].postalCode}
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Superficie</span>
                    <span className="font-semibold">{propiedad.squareMeters} m²</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Baños</span>
                    <span className="font-semibold">{propiedad.bathrooms}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Dormitorios</span>
                    <span className="font-semibold">{propiedad.bedrooms}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tipo</span>
                    <Badge variant="outline">{propiedad.propertyType}</Badge>
                  </div>
                </div>

                <Separator />

                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    ${propiedad.price.toLocaleString()}
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                    {propiedad.status}
                  </Badge>
                </div>

                <VisitScheduler slug={propiedad.slug} propertyId={propiedad.id} />

                <Button variant="outline" className="w-full">
                  Contactar vendedor
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetail
