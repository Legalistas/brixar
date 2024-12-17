import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getPorpertiesBySlug } from '@/services/properties-service'
import { Property } from '@/types/property'
import ImageCarousel from './components/ImageCarousel'
import PropertyDescription from './components/PropertyDescription'
import PropertyInfo from './components/PropertyInfo'
import PropertyMap from './components/PropertyMap'

async function getProperty(slug: string): Promise<Property> {
    try {
        const property = await getPorpertiesBySlug(slug)
        if (!property) notFound()
        return property
    } catch (error) {
        console.error('Error fetching property:', error)
        notFound()
    }
}

export default async function PropertyView({ params }: { params: { slug: string } }) {
    const property = await getProperty(params.slug)

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">{property.title}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <Suspense fallback={<div>Loading images...</div>}>
                        <ImageCarousel images={property.images} />
                    </Suspense>
                    <Suspense fallback={<div>Loading description...</div>}>
                        <PropertyDescription description={property.description} />
                    </Suspense>
                </div>
                <div>
                    <Suspense fallback={<div>Loading property info...</div>}>
                        <PropertyInfo property={property} />
                    </Suspense>
                    <Suspense fallback={<div>Loading map...</div>}>
                        <PropertyMap
                            latitude={parseFloat(property.address[0].positions[0].latitude)}
                            longitude={parseFloat(property.address[0].positions[0].longitude)}
                        />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}