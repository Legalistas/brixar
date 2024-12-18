'use client'

import React, { useEffect, useState } from 'react'
import { notFound, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { getPorpertiesBySlug } from '@/services/properties-service'
import { checkExistingVisit } from '@/services/visit-service'
import { Property } from '@/types/property'
import ImageCarousel from './components/ImageCarousel'
import PropertyDescription from './components/PropertyDescription'
import PropertyInfo from './components/PropertyInfo'
import PropertyMap from './components/PropertyMap'
import Loading from '@/components/ui/Loading'

interface VisitData {
    hasExistingVisit: boolean;
    visitDate: string | null;
}

export default function PropertyView({ params }: { params: { slug: string } }) {
    const [property, setProperty] = useState<Property | null>(null)
    const [existingVisit, setExistingVisit] = useState<VisitData | null>(null);
    const [isLoading, setIsLoading] = useState(true)
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        const fetchPropertyAndCheckVisit = async () => {
            try {
                const fetchedProperty = await getPorpertiesBySlug(params.slug)
                if (!fetchedProperty) notFound()
                setProperty(fetchedProperty)

                if (session?.user?.id) {
                    const existingVisitData = await checkExistingVisit(fetchedProperty.id, session.user.id);
                    console.log('Existing visit data:', existingVisitData);
                    if (typeof existingVisitData === 'object' && existingVisitData !== null) {
                        setExistingVisit(existingVisitData);
                    } else if (typeof existingVisitData === 'boolean') {
                        setExistingVisit({ hasExistingVisit: existingVisitData, visitDate: null });
                    }
                }
            } catch (error) {
                console.error('Error fetching property or checking visit:', error)
                notFound()
            } finally {
                setIsLoading(false)
            }
        }

        fetchPropertyAndCheckVisit()
    }, [params.slug, session])

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Fecha y hora no disponibles';
        try {
            // Create a date object in UTC
            const date = new Date(dateString);
            // Adjust to local timezone
            const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
            return localDate.toLocaleString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'America/Argentina/Buenos_Aires',
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Fecha y hora inválidas';
        }
    }

    console.log('Current existingVisit state:', existingVisit);

    if (isLoading) {
        return <Loading />
    }

    if (!property) {
        return null
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {existingVisit && existingVisit.hasExistingVisit && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
                    <p className="font-bold">Visita Programada</p>
                    <p>
                        Ya tienes una visita coordinada para este inmueble el día: {formatDate(existingVisit.visitDate)}
                    </p>
                </div>
            )}

            <h1 className="text-3xl font-bold mb-6">{property.title}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <ImageCarousel images={property.images} />
                    <PropertyDescription description={property.description} />
                </div>
                <div>
                    <PropertyInfo property={property} />
                    <PropertyMap
                        latitude={parseFloat(property.address[0].positions[0].latitude)}
                        longitude={parseFloat(property.address[0].positions[0].longitude)}
                    />
                    <div className="mt-6">
                        {status === "authenticated" ? (
                            <button
                                className={`w-full font-bold py-2 px-4 rounded ${existingVisit?.hasExistingVisit
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                                    }`}
                                onClick={() => existingVisit?.hasExistingVisit ? null : router.push(`/customer/properties/${property.slug}/schedule-visit`)}
                                disabled={existingVisit?.hasExistingVisit}
                            >
                                {existingVisit?.hasExistingVisit ? 'Visita ya coordinada' : 'Coordinar visita'}
                            </button>
                        ) : (
                            <Link href="/api/auth/signin">
                                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                                    Iniciar sesión para coordinar visita
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

