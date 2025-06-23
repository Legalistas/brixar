'use client'

import { useEffect, useState } from 'react'
import { getProyectBySlug } from '@/services/proyects-service'
import { Proyect } from '@/types/proyect'
import { notFound, useRouter } from 'next/navigation'
import Loading from '@/components/ui/Loading'
import Image from 'next/image'
import { Building2, Calendar, Home, MapPin, Maximize } from 'lucide-react'
import Link from 'next/link'
import { generatePropertySku } from '@/lib/utils'

export default function ProjectDetail({
  params,
}: {
  params: { slug: string }
}) {
  const [project, setProject] = useState<Proyect | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleRedirect = () => {
    router.push('/register')
  }

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true)
        const response = await getProyectBySlug(params.slug)
        setProject(response)
      } catch (error) {
        console.error('Error fetching project:', error)
        setError('Error al cargar el proyecto')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProject()
  }, [params.slug])

  if (isLoading)
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading />
      </div>
    )

  if (error || !project) return notFound()

  const mainAddress = project.address[0]
  const ProjectTypeIcon =
    project.proyectDetails.type === 'APARTMENT' ? Building2 : Home

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1280px]">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
        <div className="flex items-center text-gray-600 gap-2">
          <MapPin className="h-4 w-4" />
          <p className="text-sm">
            {mainAddress?.streetName}, {mainAddress?.city},{' '}
            {mainAddress?.state?.name}
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Images and Description */}
        <div className="space-y-6">
          {/* Main Image */}
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <Image
              src={project.projectMedia?.[0]?.url || '/images/placeholder.svg'}
              alt={project.title}
              fill
              className="object-cover"
            />
            <div
              className={`absolute top-4 left-4 px-4 py-2 text-sm font-semibold text-white rounded-lg 
                            ${
                              project.phase === 'CONSTRUCTION'
                                ? 'bg-yellow-500'
                                : project.phase === 'COMPLETED'
                                ? 'bg-green-500'
                                : 'bg-blue-500'
                            }`}
            >
              {project.phase}
            </div>
          </div>

          {/* Image Gallery */}
          {project.projectMedia && project.projectMedia.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {project.projectMedia.slice(1, 5).map((media, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden"
                >
                  <Image
                    src={media.url || '/placeholder.svg?height=200&width=200'}
                    alt={`${project.title} - ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold mb-4">Descripción</h2>
            <p className="text-gray-600 whitespace-pre-line">
              {project.description}
            </p>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          {/* Project Details Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">
              Detalles del Proyecto
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <ProjectTypeIcon className="h-5 w-5 text-gray-600" />
                <span className="text-sm">
                  {project.proyectDetails.type === 'APARTMENT'
                    ? 'Departamento'
                    : 'Casa'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-600" />
                <span className="text-sm">
                  Año {project.proyectDetails.buildingYear}
                </span>
              </div>

              {project.proyectDetails.surface && (
                <div className="flex items-center gap-2">
                  <Maximize className="h-5 w-5 text-gray-600" />
                  <span className="text-sm">
                    {project.proyectDetails.surface} m²
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Location Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Ubicación</h2>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">{mainAddress.streetName}</p>
              <p className="text-sm text-gray-600">
                {mainAddress.city}, {mainAddress?.state?.name}
              </p>
              <p className="text-sm text-gray-600">
                {mainAddress.country?.name}
              </p>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-4">
            SKU:{' '}
            <strong>
              {generatePropertySku(project?.id, project?.title)}
            </strong>
          </p>

          {/* Contact Button */}
          <button
            onClick={handleRedirect}
            className="w-full bg-[#FB6107] hover:bg-[#FB6107]/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Registrate para invertir
          </button>
        </div>
      </div>
    </div>
  )
}
