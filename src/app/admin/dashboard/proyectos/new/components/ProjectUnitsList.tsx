
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Home, DollarSign, Maximize, Car, CheckCircle, XCircle } from 'lucide-react';
import { ProjectUnit } from '@/store/proyectStore';

interface ProjectUnitsListProps {
  units: ProjectUnit[];
  onEdit: (unit: ProjectUnit) => void;
  onDelete: (unitId: number) => void;
  readOnly?: boolean;
}

const ProjectUnitsList: React.FC<ProjectUnitsListProps> = ({
  units,
  onEdit,
  onDelete,
  readOnly = false
}) => {
  const getStatusBadge = (status?: string) => {
    const statusConfig = {
      'AVAILABLE': { label: 'Disponible', variant: 'default' as const, color: 'bg-green-100 text-green-800' },
      'RESERVED': { label: 'Reservada', variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800' },
      'SOLD': { label: 'Vendida', variant: 'destructive' as const, color: 'bg-red-100 text-red-800' },
      'RENTED': { label: 'Alquilada', variant: 'outline' as const, color: 'bg-blue-100 text-blue-800' }
    };

    if (!status || !statusConfig[status as keyof typeof statusConfig]) {
      return <Badge variant="outline" className="bg-gray-100 text-gray-800">Sin estado</Badge>;
    }

    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getTypeBadge = (type?: string) => {
    const typeConfig = {
      'APARTMENT': 'Depto',
      'HOUSE': 'Casa',
      'LOT': 'Lote',
      'OFFICE': 'Oficina',
      'COMMERCIAL': 'Local'
    };

    return type && typeConfig[type as keyof typeof typeConfig] 
      ? typeConfig[type as keyof typeof typeConfig] 
      : 'Unidad';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="space-y-4">
      {units.map((unit) => (
        <Card key={unit.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                {/* SKU and Unit Number */}
                <div className="space-y-1">
                  <div className="font-semibold text-gray-900">{unit.sku}</div>
                  {unit.unitNumber && (
                    <div className="text-sm text-gray-500">#{unit.unitNumber}</div>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {getTypeBadge(unit.type)}
                  </Badge>
                </div>

                {/* Surface and Rooms */}
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-gray-600">
                    <Maximize className="h-4 w-4 mr-1" />
                    {unit.surface} m²
                  </div>
                  {unit.rooms && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Home className="h-4 w-4 mr-1" />
                      {unit.rooms} hab{unit.bathrooms ? `, ${unit.bathrooms} baños` : ''}
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <div className="flex items-center font-semibold text-lg text-gray-900">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {formatPrice(unit.priceUsd)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatPrice(unit.priceUsd / unit.surface)}/m²
                  </div>
                </div>

                {/* Floor and Parking */}
                <div className="space-y-1">
                  {unit.floor && (
                    <div className="text-sm text-gray-600">Piso {unit.floor}</div>
                  )}
                  <div className="flex items-center text-sm">
                    <Car className="h-4 w-4 mr-1" />
                    {unit.parking ? (
                      <span className="text-green-600">Con estacionamiento</span>
                    ) : (
                      <span className="text-gray-500">Sin estacionamiento</span>
                    )}
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-1">
                  {getStatusBadge(unit.status)}
                  <div className="flex items-center text-sm">
                    {unit.isPublished ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                        <span className="text-green-600">Publicada</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 mr-1 text-gray-400" />
                        <span className="text-gray-500">No publicada</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {!readOnly && (
                  <div className="flex space-x-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(unit)}
                      className="hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => unit.id && onDelete(unit.id)}
                      className="hover:bg-red-50 text-red-600 border-red-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {unit.description && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-600">{unit.description}</p>
              </div>
            )}

            {/* Availability Date */}
            {unit.availabilityDate && (
              <div className="mt-2">
                <div className="text-xs text-gray-500">
                  Disponible desde: {new Date(unit.availabilityDate).toLocaleDateString('es-ES')}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProjectUnitsList;
