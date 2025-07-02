'use client'

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Building,
  Plus,
  Edit,
  Eye,
  Trash2,
  Search,
  BadgeDollarSign,
  EyeOff,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { CreateProyectInput, Proyect } from '@/store/proyectStore'
import { toast } from '@/hooks/useToast'
import ProjectForm from './ProjectForm'
import ProjectViewForm from './ProjectViewForm'
import { useRouter } from 'next/navigation'
import { createProyect, getAllProyects, updateProyect } from '@/services/proyects-service'

// Mock service functions with complete data
const mockProjectService = {
  getAllProyects: async () => {
    // Simulate API call with complete mock data
    return [
      {
        id: 1,
        title: 'Torre Residencial Ejemplo',
        slug: 'torre-residencial-ejemplo',
        openingLine: 'Vivir en el corazón de la ciudad',
        description:
          'Un moderno complejo residencial con todas las comodidades que necesitas para vivir cómodamente en el centro de la ciudad. Ubicado estratégicamente cerca de centros comerciales, escuelas y transporte público.',
        phase: 'CONSTRUCTION',
        businessModel: 'SOLD',
        openingPhase: 1,
        priority: 8,
        daysToStart: 30,
        daysToEnd: 365,
        address: {
          id: 1,
          city: 'Buenos Aires',
          postalCode: '1001',
          streetName: 'Av. Corrientes 1234',
          description: 'Ubicado en el centro financiero de la ciudad',
          countryId: 1,
          stateId: 1,
          positions: [
            {
              id: 1,
              latitude: '-34.6037',
              longitude: '-58.3816',
            },
          ],
        },
        projectMedia: [
          {
            id: 1,
            link: 'https://example.com/imagen1.jpg',
            type: 'image',
            title: 'Vista frontal del edificio',
            description: 'Fachada principal del complejo residencial',
          },
          {
            id: 2,
            link: 'https://example.com/video1.mp4',
            type: 'video',
            title: 'Recorrido virtual',
            description: 'Tour virtual por las instalaciones',
          },
        ],
        proyectDetails: {
          id: 1,
          type: 'RESIDENTIAL',
          surface: 2500,
          rooms: 45,
          floors: 15,
          buildingYear: 2024,
          investmentPeriod: 24,
          riskScore: 7,
          profitabilityScore: 8,
          features: {
            gym: true,
            pool: true,
            parking: true,
            security: true,
          },
        },
        proyectFound: {
          id: 1,
          startInvestDate: '2024-01-15',
          endInvestDate: '2025-12-31',
          companyCapital: 500000,
          quantityFunded: 300000,
          quantityToFund: 1200000,
          maxOverfunding: 1500000,
          rentProfitability: 8.5,
          totalNetProfitability: 12.3,
          totalNetProfitabilityToShow: 12.0,
          apreciationProfitability: 15.2,
          fields: {
            minimumInvestment: 10000,
            targetInvestors: 120,
          },
        },
        projectUnits: [
          {
            id: 1,
            projectId: 1,
            sku: 'TR-001',
            surface: 85,
            priceUsd: 120000,
            floor: 5,
            rooms: 2,
            bathrooms: 1,
            parking: true,
            isPublished: true,
            status: 'AVAILABLE',
            type: 'APARTMENT',
            unitNumber: '501',
            description: 'Departamento con vista al río y balcón amplio',
            availabilityDate: '2024-06-01',
            features: {
              balcony: true,
              airConditioning: true,
              builtInClosets: true,
            },
            createdAt: '2024-01-15T10:00:00Z',
          },
          {
            id: 2,
            projectId: 1,
            sku: 'TR-002',
            surface: 65,
            priceUsd: 95000,
            floor: 3,
            rooms: 1,
            bathrooms: 1,
            parking: false,
            isPublished: true,
            status: 'RESERVED',
            type: 'APARTMENT',
            unitNumber: '302',
            description: 'Moderno monoambiente en excelente ubicación',
            availabilityDate: '2024-07-15',
            features: {
              balcony: false,
              airConditioning: true,
              builtInClosets: false,
            },
            createdAt: '2024-01-15T10:30:00Z',
          },
          {
            id: 3,
            projectId: 1,
            sku: 'TR-003',
            surface: 120,
            priceUsd: 180000,
            floor: 8,
            rooms: 3,
            bathrooms: 2,
            parking: true,
            isPublished: false,
            status: 'AVAILABLE',
            type: 'APARTMENT',
            unitNumber: '801',
            description: 'Amplio departamento familiar con vista panorámica',
            availabilityDate: '2024-08-01',
            features: {
              balcony: true,
              airConditioning: true,
              builtInClosets: true,
            },
            createdAt: '2024-01-15T11:00:00Z',
          },
        ],
      },
      {
        id: 2,
        title: 'Complejo de Casas Los Álamos',
        slug: 'complejo-casas-los-alamos',
        openingLine: 'Tu casa soñada te está esperando',
        description:
          'Exclusivo barrio privado con casas de diseño moderno, amplios jardines y todas las comodidades para la familia.',
        phase: 'FUNDING',
        businessModel: 'POZO',
        openingPhase: 2,
        priority: 6,
        daysToStart: 120,
        daysToEnd: 720,
        address: {
          id: 2,
          city: 'Córdoba',
          postalCode: '5000',
          streetName: 'Ruta Provincial 24 Km 8',
          description: 'Barrio privado en las afueras de la ciudad',
          countryId: 1,
          stateId: 2,
          positions: [
            {
              id: 2,
              latitude: '-31.4201',
              longitude: '-64.1888',
            },
          ],
        },
        projectMedia: [
          {
            id: 3,
            link: 'https://example.com/casa1.jpg',
            type: 'image',
            title: 'Casa modelo tipo A',
            description: 'Diseño de casa de 3 dormitorios',
          },
        ],
        proyectDetails: {
          id: 2,
          type: 'RESIDENTIAL',
          surface: 15000,
          rooms: 24,
          floors: 1,
          buildingYear: 2025,
          investmentPeriod: 36,
          riskScore: 5,
          profitabilityScore: 6,
          features: {
            gym: true,
            pool: true,
            parking: true,
            security: true,
            playArea: true,
          },
        },
        proyectFound: {
          id: 2,
          startInvestDate: '2024-03-01',
          endInvestDate: '2026-06-30',
          companyCapital: 800000,
          quantityFunded: 150000,
          quantityToFund: 2000000,
          maxOverfunding: 2500000,
          rentProfitability: 6.8,
          totalNetProfitability: 9.5,
          totalNetProfitabilityToShow: 9.0,
          apreciationProfitability: 12.8,
          fields: {
            minimumInvestment: 15000,
            targetInvestors: 80,
          },
        },
        projectUnits: [
          {
            id: 4,
            projectId: 2,
            sku: 'LA-001',
            surface: 150,
            priceUsd: 220000,
            rooms: 3,
            bathrooms: 2,
            parking: true,
            isPublished: true,
            status: 'AVAILABLE',
            type: 'HOUSE',
            unitNumber: 'Casa 1',
            description: 'Casa de 3 dormitorios con jardín y quincho',
            availabilityDate: '2025-06-01',
            features: {
              garden: true,
              quincho: true,
              garage: true,
            },
            createdAt: '2024-01-20T09:00:00Z',
          },
        ],
      },
    ]
  },
  createProyect: async (data: CreateProyectInput) => {
    console.log('Creating project:', data)
    return { id: Date.now(), ...data }
  },
  updateProyect: async (id: number, data: CreateProyectInput) => {
    console.log('Updating project:', id, data)
    return { id, ...data }
  },
  deleteProyect: async (id: number) => {
    console.log('Deleting project:', id)
    return true
  },
}

const ProjectManagement: React.FC = () => {
  const router = useRouter()

  const [currentView, setCurrentView] = useState<
    'list' | 'create' | 'edit' | 'view'
  >('list')
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const queryClient = useQueryClient()

  // Fetch projects
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getAllProyects,
    // queryFn: mockProjectService.getAllProyects,
  })
  console.log('projects', projects)

  // Luego, agrupa por projectId o slug:
//   const unitsByProject = allUnits.reduce((acc, unit) => {
//     acc[unit.projectId] = acc[unit.projectId] || [];
//     acc[unit.projectId].push(unit);
//     return acc;
//   }, {});

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: createProyect,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setCurrentView('list')
      toast({
        title: '¡Proyecto creado!',
        description: 'El proyecto se ha creado exitosamente.',
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'No se pudo crear el proyecto. Intenta de nuevo.',
        variant: 'destructive',
      })
    },
  })

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: CreateProyectInput }) =>
      updateProyect(slug, data),
    // mockProjectService.updateProyect(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setCurrentView('list')
      setSelectedProject(null)
      toast({
        title: '¡Proyecto actualizado!',
        description: 'Los cambios se han guardado exitosamente.',
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el proyecto. Intenta de nuevo.',
        variant: 'destructive',
      })
    },
  })

  // Delete project mutation
  // const deleteProjectMutation = useMutation({
  //   mutationFn: mockProjectService.deleteProyect,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['projects'] })
  //     toast({
  //       title: 'Proyecto eliminado',
  //       description: 'El proyecto se ha eliminado exitosamente.',
  //     })
  //   },
  // })

  const handleCreateProject = (data: CreateProyectInput) => {
    createProjectMutation.mutate(data)
  }

  const handleUpdateProject = (data: CreateProyectInput) => {
    if (selectedProject) {
      updateProjectMutation.mutate({ slug: selectedProject.slug, data })
    }
  }

  // const handleDeleteProject = (id: number) => {
  //   if (confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
  //     deleteProjectMutation.mutate(id)
  //   }
  // }

  const handleViewProject = (project: any) => {
    setSelectedProject(project)
    setCurrentView('view')
  }

  const handleEditFromView = () => {
    setCurrentView('edit')
  }

  const getPhaseLabel = (phase: string) => {
    const phases = {
      IN_STUDY: 'En Estudio',
      FUNDING: 'Financiación',
      CONSTRUCTION: 'Construcción',
      COMPLETED: 'Completado',
    }
    return phases[phase as keyof typeof phases] || phase
  }

  const getBusinessModelLabel = (model: string) => {
    const models = {
      SOLD: 'Venta',
      RENT: 'Alquiler',
      TRUST: 'Fideicomiso',
      POZO: 'Pozo',
    }
    return models[model as keyof typeof models] || model
  }

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleToggleVisible = async (project: any) => {
    try {
      await updateProyect(project.slug, { ...project, visible: !project.visible });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: 'Visibilidad actualizada',
        description: `El proyecto ahora está ${project.visible ? 'oculto' : 'visible'}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la visibilidad.',
        variant: 'destructive',
      });
    }
  };

  if (currentView === 'create') {
    return (
      <ProjectForm
        onSubmit={handleCreateProject}
        onCancel={() => setCurrentView('list')}
        isLoading={createProjectMutation.isPending}
      />
    )
  }

  if (currentView === 'view' && selectedProject) {
    return (
      <ProjectViewForm
        project={selectedProject}
        onEdit={handleEditFromView}
        onBack={() => {
          setCurrentView('list')
          setSelectedProject(null)
        }}
      />
    )
  }

  if (currentView === 'edit' && selectedProject) {
    return (
      <ProjectForm
        initialData={selectedProject}
        isEditing={true}
        onSubmit={handleUpdateProject}  
        onCancel={() => {
          setCurrentView('list')
          setSelectedProject(null)
        }}
        isLoading={updateProjectMutation.isPending}
      />
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Building className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gestión de Proyectos
            </h1>
            <p className="text-gray-600">
              Administra tus proyectos inmobiliarios y sus unidades
            </p>
          </div>
        </div>
        <Button
          onClick={() => setCurrentView('create')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Proyecto
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar proyectos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <Building className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm
              ? 'No se encontraron proyectos'
              : 'No hay proyectos aún'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm
              ? 'Intenta con otros términos de búsqueda'
              : 'Comienza creando tu primer proyecto inmobiliario'}
          </p>
          {!searchTerm && (
            <Button
              onClick={() => setCurrentView('create')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear Primer Proyecto
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
                return (
                <Card
                    key={project.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleViewProject(project)}
                >
                    <CardHeader>
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                            {project.title}
                        </CardTitle>
                        <p className="text-sm text-gray-500">/{project.slug}</p>
                        </div>
                        <div
                        className="flex space-x-1"
                        onClick={(e) => e.stopPropagation()}
                        >
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                            e.stopPropagation()
                            setSelectedProject(project)
                            router.push(
                                `/admin/dashboard/proyectos/costos?slug=${project.slug}`
                            ) //${project.slug}
                            }}
                        >
                            <BadgeDollarSign className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                            e.stopPropagation()
                            setSelectedProject(project)
                            setCurrentView('edit')
                            }}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                            e.stopPropagation()
                            // handleDeleteProject(project.id)
                            }}
                            className="text-red-600 hover:text-red-800"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={async (e) => {
                            e.stopPropagation();
                            await handleToggleVisible(project);
                            }}
                        >
                            {project.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        </div>
                    </div>
                    </CardHeader>
                    <CardContent>
                    <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">
                            {getPhaseLabel(project.phase)}
                        </Badge>
                        <Badge variant="secondary">
                            {getBusinessModelLabel(project.businessModel)}
                        </Badge>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Unidades:</span>
                        <span className="font-medium">
                            {project.projectUnits.length}
                        </span>
                        </div>

                        {project.projectUnits &&
                        project.projectUnits.length > 0 && (
                            <div className="text-sm text-gray-600">
                            <div className="flex justify-between">
                                <span>Precio desde:</span>
                                <span className="font-medium">
                                $
                                {Math.min(
                                    ...project.projectUnits.map(
                                    (u: any) => u.priceUsd
                                    )
                                ).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Superficie desde:</span>
                                <span className="font-medium">
                                {Math.min(
                                    ...project.projectUnits.map(
                                    (u: any) => u.surface
                                    )
                                )}{' '}
                                m²
                                </span>
                            </div>
                            </div>
                        )}
                    </div>
                    </CardContent>
                </Card>
                )
            })}
        </div>
      )}
    </div>
  )
}

export default ProjectManagement
