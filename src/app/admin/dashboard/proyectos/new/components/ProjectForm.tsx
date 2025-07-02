import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Building, Plus, Save, ArrowLeft } from 'lucide-react'
import { CreateProyectInput, ProjectUnit, Proyect } from '@/store/proyectStore'
import ProjectUnitsList from './ProjectUnitsList'
import ProjectUnitForm from './ProjectUnitForm'
import {
  getProjectUnits,
  createProjectUnit,
  updateProjectUnit,
} from '@/services/proyects-service'
import { useQuery } from '@tanstack/react-query'
import RoadmapTab from './RoadmapTab'

interface ProjectFormProps {
  initialData?: Proyect
  isEditing?: boolean
  onSubmit: (data: CreateProyectInput) => void
  onCancel: () => void
  isLoading?: boolean
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  initialData,
  isEditing = false,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Proyect>(initialData!)
  const [showUnitForm, setShowUnitForm] = useState(false)
  const [editingUnit, setEditingUnit] = useState<ProjectUnit | null>(null)

  const handleInputChange = (field: keyof CreateProyectInput, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const { data: units = [], refetch: refetchUnits } = useQuery({
    queryKey: ['project-units', initialData?.slug],
    queryFn: () => getProjectUnits(initialData?.slug!),
  })

  const handleNestedInputChange = (
    parentField: keyof CreateProyectInput,
    field: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [field]: value,
      },
    }))
  }

  const handleAddUnit = (unit: ProjectUnit) => {
    const newUnit = {
      ...unit,
      createdAt: new Date().toISOString(),
    }

    setFormData((prev) => ({
      ...prev,
      projectUnits: [...(prev.projectUnits || []), newUnit],
    }))

    setShowUnitForm(false)
  }

  const handleEditUnit = (unit: ProjectUnit) => {
    setFormData((prev) => ({
      ...prev,
      projectUnits:
        prev.projectUnits?.map((u) => (u.id === unit.id ? unit : u)) || [],
    }))

    setEditingUnit(null)
    setShowUnitForm(false)
  }

  const handleDeleteUnit = (unitId: number) => {
    setFormData((prev) => ({
      ...prev,
      projectUnits: prev.projectUnits?.filter((u) => u.id !== unitId) || [],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const {
      title,
      slug,
      openingLine,
      description,
      phase,
      businessModel,
      openingPhase,
      priority,
      daysToEnd,
      daysToStart,
      details,
      timeline,
      address,
      projectMedia,
      proyectDetails,
      proyectFound,
      projectUnits,
    } = formData

    // Ensure phase and businessModel are valid for CreateProyectInput
    const projectData: CreateProyectInput = {
      title,
      slug,
      openingLine,
      description,
      phase: (['IN_STUDY', 'FUNDING', 'CONSTRUCTION', 'COMPLETED'].includes(
        phase
      )
        ? phase
        : 'IN_STUDY') as CreateProyectInput['phase'],
      businessModel: (['SOLD', 'RENT', 'TRUST', 'POZO'].includes(businessModel)
        ? businessModel
        : 'SOLD') as CreateProyectInput['businessModel'],
      openingPhase,
      priority,
      daysToEnd,
      daysToStart,
      details,
      timeline,
      address,
      projectMedia,
      proyectDetails,
      proyectFound,
      projectUnits,
    }
    await onSubmit(projectData)

    for (const unit of projectUnits) {
      console.log('UNIT PRE PUT', unit)
      if (unit.id) {
        await updateProjectUnit(formData.slug, unit.id, unit)
      } else {
        await createProjectUnit(formData.slug, unit)
      }
    }
    refetchUnits()
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()
  }

  const phaseOptions = [
    { value: 'IN_STUDY', label: 'En Estudio' },
    { value: 'FUNDING', label: 'Financiación' },
    { value: 'CONSTRUCTION', label: 'Construcción' },
    { value: 'COMPLETED', label: 'Completado' },
  ]

  const businessModelOptions = [
    { value: 'SOLD', label: 'Venta' },
    { value: 'RENT', label: 'Alquiler' },
    { value: 'TRUST', label: 'Fideicomiso' },
    { value: 'POZO', label: 'Pozo' },
  ]

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" onClick={onCancel} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-2">
            <Building className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Editar Proyecto' : 'Nuevo Proyecto'}
            </h1>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="px-3 py-1">
            {formData.projectUnits?.length || 0} unidades
          </Badge>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading
              ? 'Guardando...'
              : isEditing
              ? 'Guardar Cambios'
              : 'Crear Proyecto'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="diagram" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="diagram">Diagrama</TabsTrigger>
            <TabsTrigger value="basic">Información</TabsTrigger>
            <TabsTrigger value="funding">Financiación</TabsTrigger>
            <TabsTrigger value="units">Unidades</TabsTrigger>
          </TabsList>

          <TabsContent value="diagram" className="space-y-6">
            <RoadmapTab initialData={formData} />
          </TabsContent>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información General</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título del Proyecto *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => {
                        handleInputChange('title', e.target.value)
                        if (!isEditing) {
                          handleInputChange(
                            'slug',
                            generateSlug(e.target.value)
                          )
                        }
                      }}
                      placeholder="Nombre del proyecto inmobiliario"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) =>
                        handleInputChange('slug', e.target.value)
                      }
                      placeholder="url-amigable-del-proyecto"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="openingLine">Línea de Apertura</Label>
                  <Input
                    id="openingLine"
                    value={formData.openingLine || ''}
                    onChange={(e) =>
                      handleInputChange('openingLine', e.target.value)
                    }
                    placeholder="Frase destacada del proyecto"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) =>
                      handleInputChange('description', e.target.value)
                    }
                    placeholder="Descripción detallada del proyecto"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phase">Fase del Proyecto *</Label>
                    <Select
                      value={formData.phase}
                      onValueChange={(value) =>
                        handleInputChange('phase', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar fase" />
                      </SelectTrigger>
                      <SelectContent>
                        {phaseOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessModel">Modelo de Negocio *</Label>
                    <Select
                      value={formData.businessModel}
                      onValueChange={(value) =>
                        handleInputChange('businessModel', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar modelo" />
                      </SelectTrigger>
                      <SelectContent>
                        {businessModelOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="openingPhase">Fase de Apertura</Label>
                    <Input
                      id="openingPhase"
                      type="number"
                      value={formData.openingPhase || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'openingPhase',
                          parseInt(e.target.value) || undefined
                        )
                      }
                      placeholder="Fase"
                      min="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Prioridad</Label>
                    <Input
                      id="priority"
                      type="number"
                      value={formData.priority || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'priority',
                          parseInt(e.target.value) || undefined
                        )
                      }
                      placeholder="1-10"
                      min="1"
                      max="10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="daysToStart">Días para Inicio</Label>
                    <Input
                      id="daysToStart"
                      type="number"
                      value={formData.daysToStart || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'daysToStart',
                          parseInt(e.target.value) || undefined
                        )
                      }
                      placeholder="Días"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="daysToEnd">Días para Finalizar</Label>
                    <Input
                      id="daysToEnd"
                      type="number"
                      value={formData.daysToEnd || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'daysToEnd',
                          parseInt(e.target.value) || undefined
                        )
                      }
                      placeholder="Días"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Section */}
            <Card>
              <CardHeader>
                <CardTitle>Dirección</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Ciudad</Label>
                    <Input
                      id="city"
                      value={formData.address?.[0]?.city || ''}
                      onChange={(e) =>
                        handleNestedInputChange(
                          'address',
                          'city',
                          e.target.value
                        )
                      }
                      placeholder="Ciudad"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Código Postal</Label>
                    <Input
                      id="postalCode"
                      value={formData.address?.[0]?.postalCode || ''}
                      onChange={(e) =>
                        handleNestedInputChange(
                          'address',
                          'postalCode',
                          e.target.value
                        )
                      }
                      placeholder="Código postal"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="streetName">Dirección</Label>
                  <Input
                    id="streetName"
                    value={formData.address?.[0]?.streetName || ''}
                    onChange={(e) =>
                      handleNestedInputChange(
                        'address',
                        'streetName',
                        e.target.value
                      )
                    }
                    placeholder="Calle y número"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addressDescription">
                    Descripción de la Dirección
                  </Label>
                  <Input
                    id="addressDescription"
                    value={formData.address?.[0]?.description || ''}
                    onChange={(e) =>
                      handleNestedInputChange(
                        'address',
                        'description',
                        e.target.value
                      )
                    }
                    placeholder="Descripción adicional de la ubicación"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Details Section */}
            <Card>
              <CardHeader>
                <CardTitle>Detalles del Proyecto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Input
                      id="type"
                      value={formData.proyectDetails?.type || ''}
                      onChange={(e) =>
                        handleNestedInputChange(
                          'proyectDetails',
                          'type',
                          e.target.value
                        )
                      }
                      placeholder="RESIDENTIAL, COMMERCIAL, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="surface">Superficie (m²)</Label>
                    <Input
                      id="surface"
                      type="number"
                      value={formData.proyectDetails?.surface || ''}
                      onChange={(e) =>
                        handleNestedInputChange(
                          'proyectDetails',
                          'surface',
                          parseInt(e.target.value) || undefined
                        )
                      }
                      placeholder="Superficie total"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rooms">Habitaciones Totales</Label>
                    <Input
                      id="rooms"
                      type="number"
                      value={formData.proyectDetails?.rooms || ''}
                      onChange={(e) =>
                        handleNestedInputChange(
                          'proyectDetails',
                          'rooms',
                          parseInt(e.target.value) || undefined
                        )
                      }
                      placeholder="Total de habitaciones"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="floors">Pisos</Label>
                    <Input
                      id="floors"
                      type="number"
                      value={formData.proyectDetails?.floors || ''}
                      onChange={(e) =>
                        handleNestedInputChange(
                          'proyectDetails',
                          'floors',
                          parseInt(e.target.value) || undefined
                        )
                      }
                      placeholder="Cantidad de pisos"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="buildingYear">Año de Construcción</Label>
                    <Input
                      id="buildingYear"
                      type="number"
                      value={formData.proyectDetails?.buildingYear || ''}
                      onChange={(e) =>
                        handleNestedInputChange(
                          'proyectDetails',
                          'buildingYear',
                          parseInt(e.target.value) || undefined
                        )
                      }
                      placeholder="Año"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="investmentPeriod">
                      Período de Inversión (meses)
                    </Label>
                    <Input
                      id="investmentPeriod"
                      type="number"
                      value={formData.proyectDetails?.investmentPeriod || ''}
                      onChange={(e) =>
                        handleNestedInputChange(
                          'proyectDetails',
                          'investmentPeriod',
                          parseInt(e.target.value) || undefined
                        )
                      }
                      placeholder="Meses"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="riskScore">Puntuación de Riesgo</Label>
                    <Input
                      id="riskScore"
                      type="number"
                      value={formData.proyectDetails?.riskScore || ''}
                      onChange={(e) =>
                        handleNestedInputChange(
                          'proyectDetails',
                          'riskScore',
                          parseInt(e.target.value) || undefined
                        )
                      }
                      placeholder="1-10"
                      min="1"
                      max="10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profitabilityScore">
                    Puntuación de Rentabilidad
                  </Label>
                  <Input
                    id="profitabilityScore"
                    type="number"
                    value={formData.proyectDetails?.profitabilityScore || ''}
                    onChange={(e) =>
                      handleNestedInputChange(
                        'proyectDetails',
                        'profitabilityScore',
                        parseInt(e.target.value) || undefined
                      )
                    }
                    placeholder="1-10"
                    min="1"
                    max="10"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Funding Tab */}
          <TabsContent value="funding" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información Financiera</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startInvestDate">
                      Fecha de Inicio de Inversión
                    </Label>
                    <Input
                      id="startInvestDate"
                      type="date"
                      value={formData.proyectFound?.startInvestDate || ''}
                      onChange={(e) =>
                        handleNestedInputChange(
                          'proyectFound',
                          'startInvestDate',
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endInvestDate">
                      Fecha de Fin de Inversión
                    </Label>
                    <Input
                      id="endInvestDate"
                      type="date"
                      value={formData.proyectFound?.endInvestDate || ''}
                      onChange={(e) =>
                        handleNestedInputChange(
                          'proyectFound',
                          'endInvestDate',
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyCapital">
                      Capital de la Empresa
                    </Label>
                    <Input
                      id="companyCapital"
                      type="number"
                      value={formData.proyectFound?.companyCapital || ''}
                      onChange={(e) =>
                        handleNestedInputChange(
                          'proyectFound',
                          'companyCapital',
                          parseFloat(e.target.value) || undefined
                        )
                      }
                      placeholder="USD"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantityFunded">Cantidad Financiada</Label>
                    <Input
                      id="quantityFunded"
                      type="number"
                      value={formData.proyectFound?.quantityFunded || ''}
                      onChange={(e) =>
                        handleNestedInputChange(
                          'proyectFound',
                          'quantityFunded',
                          parseFloat(e.target.value) || undefined
                        )
                      }
                      placeholder="USD"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantityToFund">Cantidad a Financiar</Label>
                    <Input
                      id="quantityToFund"
                      type="number"
                      value={formData.proyectFound?.quantityToFund || ''}
                      onChange={(e) =>
                        handleNestedInputChange(
                          'proyectFound',
                          'quantityToFund',
                          parseFloat(e.target.value) || undefined
                        )
                      }
                      placeholder="USD"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxOverfunding">
                      Máximo Sobrefinanciamiento
                    </Label>
                    <Input
                      id="maxOverfunding"
                      type="number"
                      value={formData.proyectFound?.maxOverfunding || ''}
                      onChange={(e) =>
                        handleNestedInputChange(
                          'proyectFound',
                          'maxOverfunding',
                          parseFloat(e.target.value) || undefined
                        )
                      }
                      placeholder="USD"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rentProfitability">
                      Rentabilidad por Alquiler (%)
                    </Label>
                    <Input
                      id="rentProfitability"
                      type="number"
                      value={formData.proyectFound?.rentProfitability || ''}
                      onChange={(e) =>
                        handleNestedInputChange(
                          'proyectFound',
                          'rentProfitability',
                          parseFloat(e.target.value) || undefined
                        )
                      }
                      placeholder="%"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalNetProfitability">
                      Rentabilidad Neta Total (%)
                    </Label>
                    <Input
                      id="totalNetProfitability"
                      type="number"
                      value={formData.proyectFound?.totalNetProfitability || ''}
                      onChange={(e) =>
                        handleNestedInputChange(
                          'proyectFound',
                          'totalNetProfitability',
                          parseFloat(e.target.value) || undefined
                        )
                      }
                      placeholder="%"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apreciationProfitability">
                      Rentabilidad por Apreciación (%)
                    </Label>
                    <Input
                      id="apreciationProfitability"
                      type="number"
                      value={
                        formData.proyectFound?.apreciationProfitability || ''
                      }
                      onChange={(e) =>
                        handleNestedInputChange(
                          'proyectFound',
                          'apreciationProfitability',
                          parseFloat(e.target.value) || undefined
                        )
                      }
                      placeholder="%"
                      step="0.01"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalNetProfitabilityToShow">
                    Rentabilidad Neta a Mostrar (%)
                  </Label>
                  <Input
                    id="totalNetProfitabilityToShow"
                    type="number"
                    value={
                      formData.proyectFound?.totalNetProfitabilityToShow || ''
                    }
                    onChange={(e) =>
                      handleNestedInputChange(
                        'proyectFound',
                        'totalNetProfitabilityToShow',
                        parseFloat(e.target.value) || undefined
                      )
                    }
                    placeholder="%"
                    step="0.01"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Units Tab */}
          <TabsContent value="units" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Unidades del Proyecto</CardTitle>
                <Button
                  type="button"
                  onClick={() => {
                    setEditingUnit(null)
                    setShowUnitForm(true)
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Unidad
                </Button>
              </CardHeader>
              <CardContent>
                {formData.projectUnits && formData.projectUnits.length > 0 ? (
                  <ProjectUnitsList
                    units={formData.projectUnits}
                    onEdit={(unit) => {
                      setEditingUnit(unit)
                      setShowUnitForm(true)
                    }}
                    onDelete={handleDeleteUnit}
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay unidades agregadas aún</p>
                    <p className="text-sm">
                      Comienza agregando la primera unidad del proyecto
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>

      {/* Unit Form Modal */}
      {showUnitForm && (
        <ProjectUnitForm
          unit={editingUnit}
          projectId={initialData?.id}
          onSave={editingUnit ? handleEditUnit : handleAddUnit}
          onCancel={() => {
            setShowUnitForm(false)
            setEditingUnit(null)
          }}
        />
      )}
    </div>
  )
}

export default ProjectForm
