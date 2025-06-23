'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Building2, TrendingUp, Users, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Proyect } from '@/types/proyect'
import { getAllProyects } from '@/services/proyects-service'
import { ProjectFilters } from './components/ProjectFilters'
import { ProjectCard } from './components/ProjectCard'

export default function Projects() {
  const [selectedPhase, setSelectedPhase] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  const {
    data: projects,
    isLoading,
    error,
  } = useQuery<Proyect[]>({
    queryKey: ['proyects'],
    queryFn: getAllProyects,
  })

  const handleViewDetails = (slug: string) => {
    router.push(`/proyectos/${slug}`)
  }

  const handleClearFilters = () => {
    setSelectedPhase('all')
    setSelectedType('all')
    setSearchTerm('')
  }

  const hasActiveFilters =
    selectedPhase !== 'all' || selectedType !== 'all' || searchTerm !== ''

  const filteredProjects =
    projects?.filter((project: Proyect) => {
      const matchesPhase =
        selectedPhase === 'all' || project.phase === selectedPhase
      const matchesType =
        selectedType === 'all' || project.proyectDetails?.type === selectedType
      const matchesSearch =
        searchTerm === '' ||
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.address[0]?.city
          .toLowerCase()
          .includes(searchTerm.toLowerCase())

      return matchesPhase && matchesType && matchesSearch
    }) || []

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Error al cargar proyectos
          </h1>
          <p className="text-gray-600">
            Por favor, intenta nuevamente más tarde.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Proyectos Inmobiliarios
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-orange-100">
              Descubre oportunidades de inversión únicas en desarrollos de alta
              calidad
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                  <Building2 className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-3xl font-bold">
                    {projects?.length || 0}
                  </div>
                  <div className="text-orange-100">Proyectos Activos</div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-3xl font-bold">95%</div>
                  <div className="text-orange-100">Tasa de Éxito</div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                  <Users className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-3xl font-bold">500+</div>
                  <div className="text-orange-100">Inversores Satisfechos</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Buscar por nombre o ciudad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border-gray-300 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Filters */}
        <ProjectFilters
          selectedPhase={selectedPhase}
          selectedType={selectedType}
          onPhaseChange={setSelectedPhase}
          onTypeChange={setSelectedType}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {isLoading
              ? 'Cargando...'
              : `${filteredProjects.length} proyecto${
                  filteredProjects.length !== 1 ? 's' : ''
                } encontrado${filteredProjects.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm border border-gray-200 animate-pulse"
              >
                <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-8 bg-gray-200 rounded w-full mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project: Proyect) => (
              <ProjectCard
                key={project.id}
                project={project}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No se encontraron proyectos
              </h3>
              <p className="text-gray-600 mb-6">
                Intenta ajustar tus filtros o búsqueda para encontrar proyectos
                disponibles.
              </p>
              {hasActiveFilters && (
                <Button onClick={handleClearFilters} variant="outline">
                  Limpiar filtros
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ¿No encontraste lo que buscabas?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Nuestros asesores especializados pueden ayudarte a encontrar la
            oportunidad de inversión perfecta para tu perfil. Recibe
            notificaciones de nuevos proyectos que coincidan con tus intereses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="flex justify-center">
              <a
                href="https://wa.me/5493492282324"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-5 py-3 text-base font-medium text-black hover:bg-gray-50 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="#25D366"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
                Contactar a un asesor
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 'use client'

// import { getAllProyects } from '@/services/proyects-service'
// import { useEffect, useState } from 'react'
// import { Proyect } from '@/types/proyect'
// import Loading from '@/components/ui/Loading'
// import { SecondaryFeatures } from '@/components/SecondaryFeatures'
// import { CallToAction } from '@/components/CallToAction'
// import { PrimaryFeatures } from '@/components/PrimaryFeatures'
// import { useQuery } from '@tanstack/react-query'
// import { ProjectCard } from './components/ProjectCard'

// export default function Projects() {
//   const { data: projects, isLoading, isError, error } = useQuery<Proyect[]>({
//     queryKey: ['proyects'],
//     queryFn: getAllProyects,
//   });
//   console.log('Projects component rendered', projects)

//   if (isLoading)
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <Loading />
//       </div>
//     )

//   if (isError)
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="text-red-500 text-center">{error.message}</div>
//       </div>
//     )

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-[1280px]">
//       <h1 className="text-3xl font-bold mb-6 text-center">
//         Proyectos abiertos
//       </h1>
//       {projects?.length === 0 ? (
//         <div className="text-center text-gray-500 py-8">
//           <p className="text-lg font-medium">No hay proyectos disponibles</p>
//           <p className="text-sm text-gray-400 mt-2">
//             Vuelve más tarde para ver nuevos proyectos
//           </p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {projects?.map((project) => (
//             <ProjectCard key={project.id} project={project} />
//           ))}
//         </div>
//       )}
//       <SecondaryFeatures />
//       <div className="flex flex-col items-center justify-center w-full" style={{
//         minWidth: '-webkit-fill-available',
//       }}>
//         <CallToAction />
//         <PrimaryFeatures />
//       </div>
//     </div>
//   )
// }
