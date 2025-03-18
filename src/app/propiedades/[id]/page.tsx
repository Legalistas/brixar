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
import { useInquiryStore } from '@/store/inquiryStore'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

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
  APARTMENT: 'Departamento'
}

const listingTypeLabels = {
  SALE: 'Venta',
  RENT: 'Alquiler'
}

export default function PropertyPage() {
  const params = useParams()
  const slug = params.id as string
  const { data: session } = useSession()
  const { createInquiry, isLoading } = useInquiryStore()

  const [property, setProperty] = useState<Property | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [offeredPrice, setOfferedPrice] = useState('')

  console.log('prop:', property)

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await getAllProperties()
        const filteredProperty: Property | undefined = response.find((p: Property) => p.slug === slug)
        setProperty(filteredProperty || null)
      } catch (error) {
        console.error('Error al cargar la propiedad:', error)
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
      if (property) {
        // Usar el API_ENDPOINTS.INQUIRY_CREATE directamente
        const response = await fetch('/api/inquiries', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            propertyId: property.id,
            title,
            message,
            offeredPrice: offeredPrice ? parseFloat(offeredPrice) : undefined
          }),
        });

        if (!response.ok) {
          throw new Error('Error al crear la consulta');
        }

        const inquiry = await response.json();
        
        if (inquiry) {
          toast.success('Tu consulta ha sido enviada correctamente')
          setIsOpen(false)
          setTitle('')
          setMessage('')
          setOfferedPrice('')
        }
      }
    } catch (error) {
      console.error('Error al enviar consulta:', error);
      toast.error('Error al enviar tu consulta. Inténtalo de nuevo más tarde.')
    }
  }

  if (!property) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">Propiedad no encontrada</h1>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{property.title}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Detalles</h2>
              <p className="text-gray-600 mb-2">{property.description}</p>
              <p className="text-xl font-bold text-green-600">Precio: USD ${property.price}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p><strong>Dormitorios:</strong> {property.bedrooms}</p>
                <p><strong>Baños:</strong> {property.bathrooms}</p>
                <p><strong>Metros cuadrados:</strong> {property.squareMeters}</p>
              </div>
              <div>
                <p><strong>Tipo de propiedad:</strong> {propertyTypeLabels[property.propertyType as keyof typeof propertyTypeLabels]}</p>
                <p><strong>Tipo de operación:</strong> {listingTypeLabels[property.listingType as keyof typeof listingTypeLabels]}</p>
                <p><strong>Año de construcción:</strong> {property.yearBuilt}</p>
                <p><strong>Cocheras:</strong> {property.parkingSpaces}</p>
              </div>
            </div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Ubicación</h2>
              <p>{property.address[0].streetName}</p>
              <p>{property.address[0].city}, {property.address[0].state.name} {property.address[0].postalCode}</p>
              <p>{property.address[0].country.name}</p>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Imágenes</h2>
            <div className="grid grid-cols-2 gap-4">
              {property.images.map((image) => (
                <div key={image.id} className="relative h-48">
                  <Image
                    src={"/uploads" + image.url}
                    alt={`Imagen de la propiedad ${image.id}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="rounded-lg object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 bg-gray-100 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">¿Estás interesado en esta propiedad?</h2>
          
          {session ? (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Realizar consulta
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Consulta sobre esta propiedad</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Asunto
                    </Label>
                    <Input
                      id="title"
                      className="col-span-3"
                      placeholder="Asunto de tu consulta"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="message" className="text-right">
                      Mensaje
                    </Label>
                    <Textarea
                      id="message"
                      className="col-span-3"
                      placeholder="Describe tu consulta aquí"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">
                      Oferta (USD)
                    </Label>
                    <Input
                      id="price"
                      className="col-span-3"
                      type="number"
                      placeholder="Precio ofrecido (opcional)"
                      value={offeredPrice}
                      onChange={(e) => setOfferedPrice(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancelar</Button>
                  </DialogClose>
                  <Button 
                    onClick={handleSubmitInquiry} 
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? 'Enviando...' : 'Enviar consulta'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : (
            <>
              <p className="mb-4">Entra en tu cuenta para consultar sobre esta propiedad</p>
              <Link href="/login">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Iniciar sesión
                </Button>
              </Link>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}