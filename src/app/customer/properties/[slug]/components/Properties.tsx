import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PropertyCard from './PropertyCard';
import { useQuery } from '@tanstack/react-query';
import { Property } from '@/types/property';
import { getAllProperties } from '@/services/properties-service';

const Properties = () => {
  const [filter, setFilter] = useState<'todas' | 'EN_VENTA' | 'VENDIDA'>('todas');

  const { data: propiedades } = useQuery<Property[]>({
    queryKey: ['propiedades'],
    queryFn: () => getAllProperties(),
  })

  const availableProperties = propiedades?.filter(p => p.status === 'EN_VENTA');
  const soldProperties = propiedades?.filter(p => p.status === 'VENDIDA');
  
  const getFilteredProperties = () => {
    switch (filter) {
      case 'EN_VENTA':
        return availableProperties;
      case 'VENDIDA':
        return soldProperties;
      default:
        return propiedades;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Propiedades <span className="text-orange-500">en venta</span>
        </h1>
        <p className="text-gray-600">Encuentra tu hogar ideal</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Ver:</span>
          <Button
            variant={filter === 'todas' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('todas')}
            className={filter === 'todas' ? 'bg-orange-500 hover:bg-orange-600' : ''}
          >
            Todas
          </Button>
          <Button
            variant={filter === 'EN_VENTA' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('EN_VENTA')}
            className={filter === 'EN_VENTA' ? 'bg-orange-500 hover:bg-orange-600' : ''}
          >
            En Venta
          </Button>
          <Button
            variant={filter === 'VENDIDA' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('VENDIDA')}
            className={filter === 'VENDIDA' ? 'bg-gray-500 hover:bg-gray-600' : ''}
          >
            Vendidas
          </Button>
        </div>
      </div>

      {/* Available Properties */}
      {(filter === 'todas' || filter === 'EN_VENTA') && (availableProperties && availableProperties.length > 0) && (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Propiedades Disponibles</h2>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {availableProperties.length} disponibles
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      )}

      {/* Sold Properties */}
      {(filter === 'todas' || filter === 'VENDIDA') && (soldProperties && soldProperties.length > 0) && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Propiedades Vendidas</h2>
            <Badge variant="secondary" className="bg-gray-100 text-gray-600">
              {soldProperties.length} vendidas
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {soldProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      )}

      {getFilteredProperties() && getFilteredProperties()?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No se encontraron propiedades</p>
        </div>
      )}
    </div>
  );
};

export default Properties;
