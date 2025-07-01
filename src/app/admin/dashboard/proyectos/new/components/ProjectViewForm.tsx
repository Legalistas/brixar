import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Building, Edit, ArrowLeft, MapPin } from 'lucide-react'
import { CreateProyectInput } from '@/store/proyectStore'
import ProjectUnitsList from './ProjectUnitsList'

interface ProjectViewFormProps {
  project: CreateProyectInput & { id: number }
  onEdit: () => void
  onBack: () => void
}

const ProjectViewForm: React.FC<ProjectViewFormProps> = ({
  project,
  onEdit,
  onBack,
}) => {
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

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-2">
            <Building className="h-6 w-6 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {project.title}
              </h1>
              <p className="text-gray-500">/{project.slug}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline">{getPhaseLabel(project.phase)}</Badge>
          <Badge variant="secondary">
            {getBusinessModelLabel(project.businessModel)}
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            {project.projectUnits?.length || 0} unidades
          </Badge>
          <Button onClick={onEdit} className="bg-blue-600 hover:bg-blue-700">
            <Edit className="h-4 w-4 mr-2" />
            Editar Proyecto
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="diagram">Diagrama</TabsTrigger>
          <TabsTrigger value="basic">Información</TabsTrigger>
          <TabsTrigger value="funding">Financiación</TabsTrigger>
          <TabsTrigger value="units">Unidades</TabsTrigger>
        </TabsList>

        <TabsContent value="diagram" className="space-y-6">

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
                  <Label htmlFor="title">Título del Proyecto</Label>
                  <Input
                    id="title"
                    value={project.title}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={project.slug}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="openingLine">Línea de Apertura</Label>
                <Input
                  id="openingLine"
                  value={project.openingLine || ''}
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={project.description || ''}
                  readOnly
                  className="bg-gray-50"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phase">Fase del Proyecto</Label>
                  <Input
                    id="phase"
                    value={getPhaseLabel(project.phase)}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessModel">Modelo de Negocio</Label>
                  <Input
                    id="businessModel"
                    value={getBusinessModelLabel(project.businessModel)}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="openingPhase">Fase de Apertura</Label>
                  <Input
                    id="openingPhase"
                    value={project.openingPhase || ''}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Prioridad</Label>
                  <Input
                    id="priority"
                    value={project.priority || ''}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="daysToStart">Días para Inicio</Label>
                  <Input
                    id="daysToStart"
                    value={project.daysToStart || ''}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="daysToEnd">Días para Finalizar</Label>
                  <Input
                    id="daysToEnd"
                    value={project.daysToEnd || ''}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Dirección
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad</Label>
                  <Input
                    id="city"
                    value={project.address?.[0]?.city || ''}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Código Postal</Label>
                  <Input
                    id="postalCode"
                    value={project.address?.[0]?.postalCode || ''}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="streetName">Dirección</Label>
                <Input
                  id="streetName"
                  value={project.address?.[0]?.streetName || ''}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addressDescription">
                  Descripción de la Dirección
                </Label>
                <Input
                  id="addressDescription"
                  value={project.address?.[0]?.description || ''}
                  readOnly
                  className="bg-gray-50"
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
                    value={project.proyectDetails?.type || ''}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="surface">Superficie (m²)</Label>
                  <Input
                    id="surface"
                    value={project.proyectDetails?.surface || ''}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rooms">Habitaciones Totales</Label>
                  <Input
                    id="rooms"
                    value={project.proyectDetails?.rooms || ''}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="floors">Pisos</Label>
                  <Input
                    id="floors"
                    value={project.proyectDetails?.floors || ''}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="buildingYear">Año de Construcción</Label>
                  <Input
                    id="buildingYear"
                    value={project.proyectDetails?.buildingYear || ''}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="investmentPeriod">
                    Período de Inversión (meses)
                  </Label>
                  <Input
                    id="investmentPeriod"
                    value={project.proyectDetails?.investmentPeriod || ''}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="riskScore">Puntuación de Riesgo</Label>
                  <Input
                    id="riskScore"
                    value={project.proyectDetails?.riskScore || ''}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="profitabilityScore">
                  Puntuación de Rentabilidad
                </Label>
                <Input
                  id="profitabilityScore"
                  value={project.proyectDetails?.profitabilityScore || ''}
                  readOnly
                  className="bg-gray-50"
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
                    value={project.proyectFound?.startInvestDate || ''}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endInvestDate">
                    Fecha de Fin de Inversión
                  </Label>
                  <Input
                    id="endInvestDate"
                    value={project.proyectFound?.endInvestDate || ''}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyCapital">Capital de la Empresa</Label>
                  <Input
                    id="companyCapital"
                    value={project.proyectFound?.companyCapital || ''}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantityFunded">Cantidad Financiada</Label>
                  <Input
                    id="quantityFunded"
                    value={project.proyectFound?.quantityFunded || ''}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantityToFund">Cantidad a Financiar</Label>
                  <Input
                    id="quantityToFund"
                    value={project.proyectFound?.quantityToFund || ''}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxOverfunding">
                    Máximo Sobrefinanciamiento
                  </Label>
                  <Input
                    id="maxOverfunding"
                    value={project.proyectFound?.maxOverfunding || ''}
                    readOnly
                    className="bg-gray-50"
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
                    value={project.proyectFound?.rentProfitability || ''}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalNetProfitability">
                    Rentabilidad Neta Total (%)
                  </Label>
                  <Input
                    id="totalNetProfitability"
                    value={project.proyectFound?.totalNetProfitability || ''}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apreciationProfitability">
                    Rentabilidad por Apreciación (%)
                  </Label>
                  <Input
                    id="apreciationProfitability"
                    value={project.proyectFound?.apreciationProfitability || ''}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Units Tab */}
        <TabsContent value="units" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Unidades del Proyecto</CardTitle>
            </CardHeader>
            <CardContent>
              {project.projectUnits && project.projectUnits.length > 0 ? (
                <ProjectUnitsList
                  units={project.projectUnits}
                  onEdit={() => {}} // Disabled in view mode
                  onDelete={() => {}} // Disabled in view mode
                  readOnly={true}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay unidades registradas</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ProjectViewForm
