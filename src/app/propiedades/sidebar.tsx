import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface SidebarProps {
  onFilterChange: (filters: { price?: number; bedrooms?: number; bathrooms?: number; propertyType?: string }) => void;
}

const Sidebar = ({ onFilterChange }: SidebarProps) => {
  const [price, setPrice] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [bathrooms, setBathrooms] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [isOpen, setIsOpen] = useState(true)

  const handleFilterChange = () => {
    onFilterChange({
      price: price ? Number(price) : undefined,
      bedrooms: bedrooms ? Number(bedrooms) : undefined,
      bathrooms: bathrooms ? Number(bathrooms) : undefined,
      propertyType: propertyType || undefined,
    })
  }

  const handleClearFilters = () => {
    setPrice('')
    setBedrooms('')
    setBathrooms('')
    setPropertyType('')
    onFilterChange({})
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <div className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Filtros</h2>
          <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700">
            {isOpen ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Precio máximo</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              onBlur={handleFilterChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mínimo de dormitorios</label>
            <input
              type="number"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              onBlur={handleFilterChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mínimo de baños</label>
            <input
              type="number"
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              onBlur={handleFilterChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
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
          <button
            onClick={handleClearFilters}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Eliminar filtros
          </button>
        </div>
      </div>
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-1/2 left-0 transform -translate-y-1/2 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 p-2 rounded-r-md shadow-lg"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </>
  )
}

export default Sidebar