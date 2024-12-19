import { useState } from 'react'

interface SidebarProps {
  onFilterChange: (filters: { price?: number; bedrooms?: number; bathrooms?: number; propertyType?: string }) => void;
}

const Sidebar = ({ onFilterChange }: SidebarProps) => {
  const [price, setPrice] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [bathrooms, setBathrooms] = useState('')
  const [propertyType, setPropertyType] = useState('')

  const handleFilterChange = () => {
    onFilterChange({
      price: price ? Number(price) : undefined,
      bedrooms: bedrooms ? Number(bedrooms) : undefined,
      bathrooms: bathrooms ? Number(bathrooms) : undefined,
      propertyType: propertyType || undefined,
    })
  }

  return (
    <div className="w-64 p-4">
      <h2 className="text-xl font-semibold mb-4">Filtros</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Precio máximo</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          onBlur={handleFilterChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Mínimo de dormitorios</label>
        <input
          type="number"
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
          onBlur={handleFilterChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Mínimo de baños</label>
        <input
          type="number"
          value={bathrooms}
          onChange={(e) => setBathrooms(e.target.value)}
          onBlur={handleFilterChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Tipo de propiedad</label>
        <select
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          onBlur={handleFilterChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Todos</option>
          <option value="HOUSE">Casa</option>
          <option value="APARTMENT">Departamento</option>
        </select>
      </div>
    </div>
  )
}

export default Sidebar