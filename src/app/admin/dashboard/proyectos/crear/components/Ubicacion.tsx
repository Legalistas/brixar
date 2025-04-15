'use client'

interface UbicacionProps {
  city: string
  setCity: (value: string) => void
  postalCode: string
  setPostalCode: (value: string) => void
  streetName: string
  setStreetName: (value: string) => void
  countryId: number | null
  setCountryId: (value: number | null) => void
  stateId: number | null
  setStateId: (value: number | null) => void
  addressDescription: string
  setAddressDescription: (value: string) => void
  latitude: string
  setLatitude: (value: string) => void
  longitude: string
  setLongitude: (value: string) => void
  countries: { id: number, name: string }[]
  states: { id: number, name: string }[]
}

export default function Ubicacion({
  city,
  setCity,
  postalCode,
  setPostalCode,
  streetName,
  setStreetName,
  countryId,
  setCountryId,
  stateId,
  setStateId,
  addressDescription,
  setAddressDescription,
  latitude,
  setLatitude,
  longitude,
  setLongitude,
  countries,
  states
}: UbicacionProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
        <h2 className="text-lg font-medium text-slate-800">Ubicación</h2>
        <p className="text-sm text-slate-500">Dirección y ubicación geográfica del proyecto</p>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-slate-700 mb-1">
            País
          </label>
          <select
            id="country"
            value={countryId || ''}
            onChange={(e) => setCountryId(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
          >
            <option value="">Seleccionar país</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-slate-700 mb-1">
            Provincia/Estado
          </label>
          <select
            id="state"
            value={stateId || ''}
            onChange={(e) => setStateId(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
            disabled={!countryId || states.length === 0}
          >
            <option value="">Seleccionar provincia/estado</option>
            {states.map((state) => (
              <option key={state.id} value={state.id}>
                {state.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-slate-700 mb-1">
            Ciudad
          </label>
          <input
            id="city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
          />
        </div>
        
        <div>
          <label htmlFor="postalCode" className="block text-sm font-medium text-slate-700 mb-1">
            Código Postal
          </label>
          <input
            id="postalCode"
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
          />
        </div>
        
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="streetName" className="block text-sm font-medium text-slate-700 mb-1">
            Dirección
          </label>
          <input
            id="streetName"
            type="text"
            value={streetName}
            onChange={(e) => setStreetName(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
          />
        </div>
        
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="addressDescription" className="block text-sm font-medium text-slate-700 mb-1">
            Descripción de la ubicación
          </label>
          <textarea
            id="addressDescription"
            value={addressDescription}
            onChange={(e) => setAddressDescription(e.target.value)}
            rows={2}
            className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
          />
          <p className="mt-1 text-xs text-slate-500">
            Información adicional sobre la ubicación (puntos de referencia, etc.)
          </p>
        </div>
        
        <div>
          <label htmlFor="latitude" className="block text-sm font-medium text-slate-700 mb-1">
            Latitud
          </label>
          <input
            id="latitude"
            type="text"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
          />
        </div>
        
        <div>
          <label htmlFor="longitude" className="block text-sm font-medium text-slate-700 mb-1">
            Longitud
          </label>
          <input
            id="longitude"
            type="text"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
          />
        </div>
      </div>
    </div>
  )
}