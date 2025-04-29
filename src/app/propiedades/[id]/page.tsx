'use client'

import { useParams } from 'next/navigation'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { useEffect, useState } from 'react'
import { getAllProperties } from '@/services/properties-service'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'react-toastify'
import {
  Loader2,
  Bed,
  Bath,
  SquareCode,
  Home,
  Tag,
  Calendar,
  Car,
  MapPin,
  DollarSign,
  Send,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { generatePropertySku } from '@/lib/utils'
import { CallToAction } from '@/components/CallToAction'
import { TikTok } from '@/components/TikTok/TikTok'

type Property = {
  id: number
  slug: string
  title: string
  description: string
  price: string
  bedrooms: number
  bathrooms: number
  squareMeters: number
  propertyType: string
  listingType: string
  isAvailable: boolean
  yearBuilt: number
  parkingSpaces: number
  images: { id: number; url: string }[]
  videos: { id: number; url: string; title?: string; description?: string; thumbnail?: string }[]
  address: {
    city: string
    postalCode: string
    streetName: string
    state: { name: string }
    country: { name: string }
    positions: { longitude: string; latitude: string }[]
  }[]
}

const propertyTypeLabels = {
  HOUSE: 'Casa',
  APARTMENT: 'Departamento',
  LAND: 'Terreno',
  OFFICE: 'Oficina',
  COMMERCIAL: 'Local Comercial',
  WAREHOUSE: 'Bodega',
  FARM: 'Finca',
  CHALET: 'Chalet',
}

const listingTypeLabels = {
  SALE: 'Venta',
  RENT: 'Alquiler',
  TEMPORARY_RENT: 'Alquiler Temporal',
  EXCHANGE: 'Permuta',
}

export default function PropertyPage() {
  const params = useParams()
  const slug = params.id as string
  const { data: session } = useSession()

  const [property, setProperty] = useState<Property | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [offeredPrice, setOfferedPrice] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingProperty, setLoadingProperty] = useState(true)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => {
    const fetchProperties = async () => {
      setLoadingProperty(true)
      try {
        const response = await getAllProperties()
        const filteredProperty: Property | undefined = response.find(
          (p: Property) => p.slug === slug
        )
        setProperty(filteredProperty || null)
      } catch (error) {
        console.error('Error al cargar la propiedad:', error)
        toast.error('Error al cargar los detalles de la propiedad')
      } finally {
        setLoadingProperty(false)
      }
    }

    fetchProperties()
  }, [slug])

  const handleSubmitInquiry = async () => {
    if (!title || !message) {
      toast.error('Por favor complete todos los campos obligatorios')
      return
    }

    try {
      setIsSubmitting(true)

      if (property) {
        console.log('Enviando consulta para propiedad:', property.id)
        console.log('Datos de sesión:', session)

        const response = await fetch('/api/inquiries', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            propertyId: property.id,
            title,
            message,
            offeredPrice: offeredPrice
              ? Number.parseFloat(offeredPrice)
              : undefined,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.error('Error response:', errorData)
          throw new Error(errorData.error || 'Error al crear la consulta')
        }

        const inquiry = await response.json()
        console.log('Consulta creada:', inquiry)

        toast.success('Tu consulta ha sido enviada correctamente')
        setIsOpen(false)
        setTitle('')
        setMessage('')
        setOfferedPrice('')
      }
    } catch (error: any) {
      console.error('Error al enviar consulta:', error)
      toast.error(
        error.message ||
          'Error al enviar tu consulta. Inténtalo de nuevo más tarde.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loadingProperty) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-16 min-h-[70vh] flex justify-center items-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <span className="text-xl font-medium text-gray-700">
              Cargando propiedad...
            </span>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!property) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-16 min-h-[70vh] flex flex-col justify-center items-center">
          <div className="text-center max-w-md">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">
              Propiedad no encontrada
            </h1>
            <p className="text-gray-600 mb-8">
              La propiedad que buscas no existe o ha sido eliminada.
            </p>
            <Link href="/propiedades">
              <Button size="lg" className="font-medium">
                Ver todas las propiedades
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const formattedPrice = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(property.price))

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8 lg:py-12">
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant="outline" className="font-medium">
              {
                listingTypeLabels[
                  property.listingType as keyof typeof listingTypeLabels
                ]
              }
            </Badge>
            <Badge variant="outline" className="font-medium">
              {
                propertyTypeLabels[
                  property.propertyType as keyof typeof propertyTypeLabels
                ]
              }
            </Badge>
            {property.isAvailable ? (
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                Disponible
              </Badge>
            ) : (
              <Badge variant="secondary">No disponible</Badge>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {property.title}
          </h1>
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin className="h-4 w-4 mr-1" />
            <span>
              {property.address[0].streetName}, {property.address[0].city},{' '}
              {property?.address[0]?.state?.name}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-3xl font-bold text-primary">
              {formattedPrice}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <section className="mt-0">
              <div className="rounded-xl overflow-hidden bg-gray-100 mb-4">
                <Carousel className="w-full">
                  <CarouselContent>
                    {property.images.map((image, index) => (
                      <CarouselItem key={image.id}>
                        <div className="relative aspect-video w-full overflow-hidden rounded-md">
                          <Image
                            src={image.url || '/placeholder.svg'}
                            alt={`Imagen de la propiedad ${index + 1}`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                            className="object-cover"
                            priority={index === 0}
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </Carousel>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {property.images.slice(0, 5).map((image, index) => (
                  <div
                    key={image.id}
                    className={`relative aspect-square rounded-md overflow-hidden cursor-pointer border-2 ${
                      activeImageIndex === index
                        ? 'border-primary'
                        : 'border-transparent'
                    }`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <Image
                      src={image.url || '/placeholder.svg'}
                      alt={`Miniatura ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 20vw, 10vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Sección de videos */}
            {property.videos && property.videos.length > 0 && (
              <section className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Videos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.videos.map((video) => (
                    <div key={video.id} className="bg-gray-100 rounded-xl overflow-hidden">
                      <div className="aspect-video">
                        <video
                          src={video.url}
                          controls
                          className="w-full h-full object-cover"
                          poster={video.thumbnail || undefined}
                        >
                          Tu navegador no soporta la reproducción de videos.
                        </video>
                      </div>
                      {(video.title || video.description) && (
                        <div className="p-3 bg-white">
                          {video.title && <h4 className="font-medium">{video.title}</h4>}
                          {video.description && <p className="text-sm text-gray-600 mt-1">{video.description}</p>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="mt-12">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 mb-8">
                    <div className="flex items-center gap-2">
                      <Bed className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-gray-500">Dormitorios</p>
                        <p className="font-medium">{property.bedrooms}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-gray-500">Baños</p>
                        <p className="font-medium">{property.bathrooms}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <SquareCode className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-gray-500">Superficie</p>
                        <p className="font-medium">
                          {property.squareMeters} m²
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Home className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-gray-500">Tipo</p>
                        <p className="font-medium">
                          {
                            propertyTypeLabels[
                              property.propertyType as keyof typeof propertyTypeLabels
                            ]
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-gray-500">Operación</p>
                        <p className="font-medium">
                          {
                            listingTypeLabels[
                              property.listingType as keyof typeof listingTypeLabels
                            ]
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-gray-500">Año</p>
                        <p className="font-medium">{property.yearBuilt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Car className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-gray-500">Cocheras</p>
                        <p className="font-medium">{property.parkingSpaces}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3">Descripción</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {property.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="mt-12">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Dirección</h3>
                    <div className="space-y-1 text-gray-700">
                      <p>{property.address[0].streetName}</p>
                      <p>
                        {property.address[0].city},{' '}
                        {property?.address[0]?.state?.name}{' '}
                        {property.address[0].postalCode}
                      </p>
                      <p>{property?.address[0]?.country?.name}</p>
                    </div>
                  </div>

                  {property.address[0].positions.length > 0 && (
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">
                        Mapa no disponible en esta vista
                      </p>
                      {/* Aquí se podría integrar un mapa real usando las coordenadas */}
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          </div>

          <div>
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">
                    ¿Interesado en esta propiedad?
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">
                    Completa el formulario y nos pondremos en contacto contigo a
                    la brevedad.
                  </p>

                  <p className="text-gray-600 text-sm mb-4">
                    SKU:{' '}
                    <strong>
                      {generatePropertySku(property?.id, property?.title)}
                    </strong>
                  </p>

                  {session ? (
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full" size="lg">
                          <Send className="h-4 w-4 mr-2" />
                          Realizar consulta
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>
                            Consulta sobre esta propiedad
                          </DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="title">
                              Asunto <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="title"
                              placeholder="Asunto de tu consulta"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              required
                              disabled={isSubmitting}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="message">
                              Mensaje <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                              id="message"
                              placeholder="Describe tu consulta aquí"
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              required
                              disabled={isSubmitting}
                              className="min-h-[120px]"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label
                              htmlFor="price"
                              className="flex items-center gap-1"
                            >
                              <DollarSign className="h-4 w-4" />
                              Oferta (USD)
                              <span className="text-gray-500 text-xs font-normal">
                                (opcional)
                              </span>
                            </Label>
                            <Input
                              id="price"
                              type="number"
                              placeholder="Precio ofrecido"
                              value={offeredPrice}
                              onChange={(e) => setOfferedPrice(e.target.value)}
                              disabled={isSubmitting}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline" disabled={isSubmitting}>
                              Cancelar
                            </Button>
                          </DialogClose>
                          <Button
                            onClick={handleSubmitInquiry}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Enviando...
                              </>
                            ) : (
                              'Enviar consulta'
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">
                        Inicia sesión para consultar sobre esta propiedad
                      </p>
                      <Link href="/login">
                        <Button className="w-full" size="lg">
                          Iniciar sesión
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Compartir propiedad</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                      </svg>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                      </svg>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                      </svg>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <section className="py-8">
        <CallToAction />
        <TikTok />
      </section>
      <Footer />
    </>
  )
}
