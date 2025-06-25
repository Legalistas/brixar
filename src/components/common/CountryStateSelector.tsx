'use client'

import { useState, useEffect } from 'react'

// Definir interfaces para la tipificación
interface Country {
  id: number
  name: string
  code: string
}

interface State {
  id: number
  countryId: number
  name: string
}

interface CountryStateSelectorProps {
  selectedCountryId: number
  selectedStateId: number
  onCountryChange: (countryId: number) => void
  onStateChange: (stateId: number) => void
  defaultCity?: string
  onCityChange?: (city: string) => void
}

const countries: Country[] = [
  { id: 1, name: 'Argentina', code: 'AR' },
  { id: 2, name: 'España', code: 'ES' },
  { id: 3, name: 'México', code: 'MX' },
  { id: 4, name: 'Colombia', code: 'CO' },
  { id: 5, name: 'Chile', code: 'CL' },
  { id: 6, name: 'Uruguay', code: 'UY' },
  { id: 7, name: 'Perú', code: 'PE' },
  { id: 8, name: 'Brasil', code: 'BR' },
  { id: 9, name: 'Estados Unidos', code: 'US' },
  { id: 10, name: 'Canadá', code: 'CA' },
]

const states: State[] = [
  // Argentina - todas las provincias
  { id: 1, countryId: 1, name: 'Buenos Aires' },
  { id: 2, countryId: 1, name: 'Ciudad Autónoma de Buenos Aires' },
  { id: 3, countryId: 1, name: 'Catamarca' },
  { id: 4, countryId: 1, name: 'Chaco' },
  { id: 5, countryId: 1, name: 'Chubut' },
  { id: 6, countryId: 1, name: 'Córdoba' },
  { id: 7, countryId: 1, name: 'Corrientes' },
  { id: 8, countryId: 1, name: 'Entre Ríos' },
  { id: 9, countryId: 1, name: 'Formosa' },
  { id: 10, countryId: 1, name: 'Jujuy' },
  { id: 11, countryId: 1, name: 'La Pampa' },
  { id: 12, countryId: 1, name: 'La Rioja' },
  { id: 13, countryId: 1, name: 'Mendoza' },
  { id: 14, countryId: 1, name: 'Misiones' },
  { id: 15, countryId: 1, name: 'Neuquén' },
  { id: 16, countryId: 1, name: 'Río Negro' },
  { id: 17, countryId: 1, name: 'Salta' },
  { id: 18, countryId: 1, name: 'San Juan' },
  { id: 19, countryId: 1, name: 'San Luis' },
  { id: 20, countryId: 1, name: 'Santa Cruz' },
  { id: 21, countryId: 1, name: 'Santa Fe' },
  { id: 22, countryId: 1, name: 'Santiago del Estero' },
  { id: 23, countryId: 1, name: 'Tierra del Fuego' },
  { id: 24, countryId: 1, name: 'Tucumán' },

  // España - comunidades autónomas principales
  { id: 25, countryId: 2, name: 'Madrid' },
  { id: 26, countryId: 2, name: 'Cataluña' },
  { id: 27, countryId: 2, name: 'Andalucía' },
  { id: 28, countryId: 2, name: 'Valencia' },
  { id: 29, countryId: 2, name: 'Galicia' },
  { id: 30, countryId: 2, name: 'País Vasco' },

  // México - estados principales
  { id: 31, countryId: 3, name: 'Ciudad de México' },
  { id: 32, countryId: 3, name: 'Jalisco' },
  { id: 33, countryId: 3, name: 'Nuevo León' },
  { id: 34, countryId: 3, name: 'Puebla' },
  { id: 35, countryId: 3, name: 'Querétaro' },

  // Colombia - departamentos principales
  { id: 36, countryId: 4, name: 'Bogotá' },
  { id: 37, countryId: 4, name: 'Antioquia' },
  { id: 38, countryId: 4, name: 'Valle del Cauca' },

  // Chile - regiones principales
  { id: 39, countryId: 5, name: 'Región Metropolitana' },
  { id: 40, countryId: 5, name: 'Valparaíso' },
  { id: 41, countryId: 5, name: 'Biobío' },

  // Uruguay - departamentos principales
  { id: 42, countryId: 6, name: 'Montevideo' },
  { id: 43, countryId: 6, name: 'Canelones' },
  { id: 44, countryId: 6, name: 'Maldonado' },

  // Perú - departamentos principales
  { id: 45, countryId: 7, name: 'Lima' },
  { id: 46, countryId: 7, name: 'Arequipa' },
  { id: 47, countryId: 7, name: 'Cusco' },

  // Brasil - estados principales
  { id: 48, countryId: 8, name: 'São Paulo' },
  { id: 49, countryId: 8, name: 'Rio de Janeiro' },
  { id: 50, countryId: 8, name: 'Minas Gerais' },

  // Estados Unidos - estados principales
  { id: 51, countryId: 9, name: 'California' },
  { id: 52, countryId: 9, name: 'New York' },
  { id: 53, countryId: 9, name: 'Texas' },
  { id: 54, countryId: 9, name: 'Florida' },

  // Canadá - provincias principales
  { id: 55, countryId: 10, name: 'Ontario' },
  { id: 56, countryId: 10, name: 'Quebec' },
  { id: 57, countryId: 10, name: 'British Columbia' },
]

export default function CountryStateSelector({
  selectedCountryId,
  selectedStateId,
  onCountryChange,
  onStateChange,
  defaultCity,
  onCityChange,
}: CountryStateSelectorProps) {
  const [availableStates, setAvailableStates] = useState<State[]>([])
  const [city, setCity] = useState(defaultCity || '')

  // Actualizar estados disponibles cuando cambia el país seleccionado
  useEffect(() => {
    if (selectedCountryId) {
      const filteredStates = states.filter(
        (state) => state.countryId === selectedCountryId
      )
      setAvailableStates(filteredStates)

      // Si no hay un estado seleccionado o el estado seleccionado no pertenece al país actual,
      // seleccionamos el primer estado disponible o 0 si no hay estados
      if (
        filteredStates.length > 0 &&
        (!selectedStateId ||
          !filteredStates.some((state) => state.id === selectedStateId))
      ) {
        onStateChange(filteredStates[0].id)
      } else if (filteredStates.length === 0 && selectedStateId) {
        onStateChange(0)
      }
    } else {
      setAvailableStates([])
      if (selectedStateId) {
        onStateChange(0)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountryId])

  // Manejar cambios en el campo de ciudad
  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCity = e.target.value
    setCity(newCity)
    if (onCityChange) {
      onCityChange(newCity)
    }
  }

  // Usar el defaultCity cuando se monta el componente
  useEffect(() => {
    if (defaultCity && onCityChange) {
      setCity(defaultCity)
      onCityChange(defaultCity)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultCity])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="country"
        >
          País
        </label>
        <select
          id="country"
          name="country"
          value={selectedCountryId || 0}
          onChange={(e) => onCountryChange(Number(e.target.value))}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value={0}>Seleccione un país</option>
          {countries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="state"
        >
          Estado/Provincia
        </label>
        <select
          id="state"
          name="state"
          value={selectedStateId || 0}
          onChange={(e) => onStateChange(Number(e.target.value))}
          disabled={!selectedCountryId || availableStates.length === 0}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value={0}>Seleccione un estado/provincia</option>
          {availableStates.map((state) => (
            <option key={state.id} value={state.id}>
              {state.name}
            </option>
          ))}
        </select>
      </div>

      {/* Campo para la ciudad */}
      <div className="mb-4 md:col-span-2">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="city"
        >
          Ciudad
        </label>
        <input
          id="city"
          name="city"
          type="text"
          value={city}
          onChange={handleCityChange}
          placeholder="Ingrese la ciudad"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
    </div>
  )
}
