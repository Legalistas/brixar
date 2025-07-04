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
  FileText,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { CreateProyectInput, Proyect } from '@/store/proyectStore'
import { toast } from '@/hooks/useToast'
import ProjectForm from './ProjectForm'
import ProjectViewForm from './ProjectViewForm'
import { useRouter } from 'next/navigation'
import { createProyect, getAllProyects, updateProyect } from '@/services/proyects-service'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { ProjectPhase } from '@/types/proyect'
import { ProyectPhase } from '@prisma/client'

const ProjectManagement: React.FC = () => {
  const router = useRouter()

  const [currentView, setCurrentView] = useState<
    'list' | 'create' | 'edit' | 'view'
  >('list')
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showPhaseModal, setShowPhaseModal] = useState<string | null>(null)
  const [selectedPhase, setSelectedPhase] = useState<ProyectPhase>("IN_STUDY")
  const [phaseUpdating, setPhaseUpdating] = useState(false)

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
    onError: () => {
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
    onError: () => {
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

  const handleOpenPhaseModal = (project: any) => {
    setShowPhaseModal(project.slug)
    setSelectedPhase(project.phase)
  }

  const handleClosePhaseModal = () => {
    setShowPhaseModal(null)
    setSelectedPhase("IN_STUDY")
  }

  const handlePhaseChange = async () => {
    if (!showPhaseModal || !selectedPhase) return
    setPhaseUpdating(true)
    try {
      const project = projects.find((p: any) => p.slug === showPhaseModal)
      if (!project) return
      await updateProyect(showPhaseModal, {
        ...project,
        phase: selectedPhase,
        title: project.title ?? "",
        description: project.description ?? "",
      })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      handleClosePhaseModal()
      toast({
        title: 'Fase actualizada',
        description: 'La fase del proyecto se ha actualizado.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la fase.',
        variant: 'destructive',
      })
    } finally {
      setPhaseUpdating(false)
    }
  }

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
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedProject(project)
                                router.push(
                                  `/admin/dashboard/proyectos/costos?slug=${project.slug}`
                                )
                              }}
                            >
                              <BadgeDollarSign className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Gestionar costos</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
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
                          </TooltipTrigger>
                          <TooltipContent>Editar</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
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
                          </TooltipTrigger>
                          <TooltipContent>Eliminar</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={async (e) => {
                                e.stopPropagation();
                                await handleToggleVisible(project);
                              }}
                            >
                              {project.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Visibilidad</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleOpenPhaseModal(project)
                              }}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Cambiar fase</TooltipContent>
                        </Tooltip>
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
      {/* Phase Change Modal */}
      <Dialog open={!!showPhaseModal} onOpenChange={open => { if (!open) handleClosePhaseModal() }}>
        <DialogContent>
          {showPhaseModal && (() => {
            const project = projects.find((p: any) => p.slug === showPhaseModal)
            if (!project) return null
            return (
              <>
                <DialogHeader>
                  <DialogTitle>Cambiar fase del proyecto</DialogTitle>
                </DialogHeader>
                <div className="mb-4">
                  <p className="mb-2 text-gray-700">Proyecto: <span className="font-medium text-gray-900">{project.title}</span></p>
                  <p className="mb-4 text-gray-700">Fase actual: <span className="ml-2 inline-block rounded-md px-2 py-1 text-xs font-medium bg-gray-100">{getPhaseLabel(project.phase)}</span></p>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Seleccionar nueva fase:</label>
                  <div className="space-y-2">
                    <div>
                      <input type="radio" id="instudy" name="phase" value="IN_STUDY" checked={selectedPhase === 'IN_STUDY'} onChange={() => setSelectedPhase('IN_STUDY')} className="mr-2" />
                      <label htmlFor="instudy" className="text-sm text-gray-600">En planeación</label>
                    </div>
                    <div>
                      <input type="radio" id="construction" name="phase" value="CONSTRUCTION" checked={selectedPhase === 'CONSTRUCTION'} onChange={() => setSelectedPhase('CONSTRUCTION')} className="mr-2" />
                      <label htmlFor="construction" className="text-sm text-gray-600">Construcción</label>
                    </div>
                    <div>
                      <input type="radio" id="completed" name="phase" value="COMPLETED" checked={selectedPhase === 'COMPLETED'} onChange={() => setSelectedPhase('COMPLETED')} className="mr-2" />
                      <label htmlFor="completed" className="text-sm text-gray-600">Completado</label>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={handleClosePhaseModal} disabled={phaseUpdating}>Cancelar</Button>
                  <Button onClick={handlePhaseChange} disabled={!selectedPhase || phaseUpdating} className="bg-blue-600 hover:bg-blue-700 text-white">
                    {phaseUpdating ? 'Actualizando...' : 'Guardar'}
                  </Button>
                </DialogFooter>
              </>
            )
          })()}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProjectManagement
