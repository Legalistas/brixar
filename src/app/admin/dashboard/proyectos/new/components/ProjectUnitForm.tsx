import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { Save, X } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { ProjectUnit } from '@/store/proyectStore'

interface ProjectUnitFormProps {
  unit?: ProjectUnit | null
  onSave: (unit: ProjectUnit) => void
  onCancel: () => void
  projectId?: number
}

const ProjectUnitForm: React.FC<ProjectUnitFormProps> = ({
  unit,
  onSave,
  onCancel,
  projectId
}) => {
    console.log('UNIT ', unit)
  const [formData, setFormData] = useState<ProjectUnit>({
    // id: 0,
    projectId: projectId ?? 0,
    sku: '',
    surface: 0,
    priceUsd: 0,
    parking: false,
    isPublished: false,
    createdAt: new Date().toISOString(),
    availabilityDate: '',
  })

  useEffect(() => {
    if (unit) {
      setFormData(unit)
    }
  }, [unit])

  const handleInputChange = (field: keyof ProjectUnit, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.sku || !formData.surface || !formData.priceUsd) {
      return
    }
    console.log('form data pre save', formData)
    onSave(formData)
  }

  const statusOptions = [
    { value: 'AVAILABLE', label: 'Disponible' },
    { value: 'RESERVED', label: 'Reservada' },
    { value: 'SOLD', label: 'Vendida' },
    { value: 'RENTED', label: 'Alquilada' },
  ]

  const typeOptions = [
    { value: 'APARTMENT', label: 'Departamento' },
    { value: 'HOUSE', label: 'Casa' },
    { value: 'LOT', label: 'Lote' },
    { value: 'OFFICE', label: 'Oficina' },
    { value: 'COMMERCIAL', label: 'Local Comercial' },
  ]

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{unit ? 'Editar Unidad' : 'Nueva Unidad'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => handleInputChange('sku', e.target.value)}
                placeholder="Código único de la unidad"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unitNumber">Número de Unidad</Label>
              <Input
                id="unitNumber"
                value={formData.unitNumber || ''}
                onChange={(e) =>
                  handleInputChange('unitNumber', e.target.value)
                }
                placeholder="101, A-1, etc."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Unidad</Label>
              <Select
                value={formData.type || ''}
                onValueChange={(value) => handleInputChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={formData.status || ''}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Measurements and Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="surface">Superficie (m²) *</Label>
              <Input
                id="surface"
                type="number"
                value={formData.surface}
                onChange={(e) =>
                  handleInputChange('surface', parseFloat(e.target.value) || 0)
                }
                placeholder="Superficie en metros cuadrados"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priceUsd">Precio (USD) *</Label>
              <Input
                id="priceUsd"
                type="number"
                value={formData.priceUsd}
                onChange={(e) =>
                  handleInputChange('priceUsd', parseFloat(e.target.value) || 0)
                }
                placeholder="Precio en dólares"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Room Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rooms">Habitaciones</Label>
              <Input
                id="rooms"
                type="number"
                value={formData.rooms || ''}
                onChange={(e) =>
                  handleInputChange(
                    'rooms',
                    parseInt(e.target.value) || undefined
                  )
                }
                placeholder="Cantidad"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bathrooms">Baños</Label>
              <Input
                id="bathrooms"
                type="number"
                value={formData.bathrooms || ''}
                onChange={(e) =>
                  handleInputChange(
                    'bathrooms',
                    parseInt(e.target.value) || undefined
                  )
                }
                placeholder="Cantidad"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="floor">Piso</Label>
              <Input
                id="floor"
                type="number"
                value={formData.floor || ''}
                onChange={(e) =>
                  handleInputChange(
                    'floor',
                    parseInt(e.target.value) || undefined
                  )
                }
                placeholder="Número de piso"
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descripción adicional de la unidad"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="availabilityDate">Fecha de Disponibilidad</Label>
            <Input
              id="availabilityDate"
              type="date"
              value={formData.availabilityDate || ''}
              onChange={(e) =>
                handleInputChange('availabilityDate', e.target.value)
              }
            />
          </div>

          {/* Switches */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="parking">Estacionamiento</Label>
              <p className="text-sm text-gray-500">
                ¿La unidad incluye estacionamiento?
              </p>
            </div>
            <Switch
              id="parking"
              checked={formData.parking}
              onCheckedChange={(value) => handleInputChange('parking', value)}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="isPublished">Publicar</Label>
              <p className="text-sm text-gray-500">
                ¿La unidad está disponible para mostrar?
              </p>
            </div>
            <Switch
              id="isPublished"
              checked={formData.isPublished}
              onCheckedChange={(value) =>
                handleInputChange('isPublished', value)
              }
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4 mr-2" />
              {unit ? 'Guardar Cambios' : 'Agregar Unidad'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ProjectUnitForm
