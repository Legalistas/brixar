'use client'

import { useParams } from 'next/navigation'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { useEffect, useState } from 'react'
import { getAllProperties } from '@/services/properties-service'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

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

  const [property, setProperty] = useState<Property | null>(null)

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
          <p className="mb-4">Entra en tu cuenta para comprar</p>
          <Link href="/login">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Iniciar sesión
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}