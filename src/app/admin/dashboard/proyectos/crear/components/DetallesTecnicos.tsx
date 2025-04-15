'use client'

interface DetallesTecnicosProps {
  proyectType: string
  setProyectType: (value: string) => void
  investmentPeriod: number
  setInvestmentPeriod: (value: number) => void
  surface: number
  setSurface: (value: number) => void
  rooms: number
  setRooms: (value: number) => void
  floors: number
  setFloors: (value: number) => void
  features: {[key: string]: any}
  setFeatures: (value: {[key: string]: any}) => void
  buildingYear: number | null
  setBuildingYear: (value: number | null) => void
  riskScore: number
  setRiskScore: (value: number) => void
  profitabilityScore: number
  setProfitabilityScore: (value: number) => void
}

export default function DetallesTecnicos({
  proyectType,
  setProyectType,
  investmentPeriod,
  setInvestmentPeriod,
  surface,
  setSurface,
  rooms,
  setRooms,
  floors,
  setFloors,
  features,
  setFeatures,
  buildingYear,
  setBuildingYear,
  riskScore,
  setRiskScore,
  profitabilityScore,
  setProfitabilityScore
}: DetallesTecnicosProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
        <h2 className="text-lg font-medium text-slate-800">Detalles Técnicos</h2>
        <p className="text-sm text-slate-500">Características técnicas del proyecto</p>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="proyectType" className="block text-sm font-medium text-slate-700 mb-1">
            Tipo de Proyecto
          </label>
          <input
            id="proyectType"
            type="text"
            value={proyectType}
            onChange={(e) => setProyectType(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
          />
          <p className="mt-1 text-xs text-slate-500">
            Ej: Residencial, Comercial, Industrial, etc.
          </p>
        </div>
        
        <div>
          <label htmlFor="investmentPeriod" className="block text-sm font-medium text-slate-700 mb-1">
            Período de Inversión (meses)
          </label>
          <input
            id="investmentPeriod"
            type="number"
            value={investmentPeriod}
            onChange={(e) => setInvestmentPeriod(parseInt(e.target.value) || 0)}
            className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
          />
        </div>
        
        <div>
          <label htmlFor="surface" className="block text-sm font-medium text-slate-700 mb-1">
            Superficie (m²)
          </label>
          <input
            id="surface"
            type="number"
            value={surface}
            onChange={(e) => setSurface(parseInt(e.target.value) || 0)}
            className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
          />
        </div>
        
        <div>
          <label htmlFor="buildingYear" className="block text-sm font-medium text-slate-700 mb-1">
            Año de Construcción
          </label>
          <input
            id="buildingYear"
            type="number"
            value={buildingYear || ''}
            onChange={(e) => setBuildingYear(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
          />
        </div>
        
        <div>
          <label htmlFor="rooms" className="block text-sm font-medium text-slate-700 mb-1">
            Número de Habitaciones
          </label>
          <input
            id="rooms"
            type="number"
            value={rooms}
            onChange={(e) => setRooms(parseInt(e.target.value) || 0)}
            className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
          />
        </div>
        
        <div>
          <label htmlFor="floors" className="block text-sm font-medium text-slate-700 mb-1">
            Número de Plantas
          </label>
          <input
            id="floors"
            type="number"
            value={floors}
            onChange={(e) => setFloors(parseInt(e.target.value) || 0)}
            className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
          />
        </div>
        
        <div>
          <label htmlFor="riskScore" className="block text-sm font-medium text-slate-700 mb-1">
            Puntuación de Riesgo (1-10)
          </label>
          <input
            id="riskScore"
            type="number"
            min="1"
            max="10"
            value={riskScore}
            onChange={(e) => setRiskScore(parseInt(e.target.value) || 0)}
            className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
          />
        </div>
        
        <div>
          <label htmlFor="profitabilityScore" className="block text-sm font-medium text-slate-700 mb-1">
            Puntuación de Rentabilidad (1-10)
          </label>
          <input
            id="profitabilityScore"
            type="number"
            min="1"
            max="10"
            value={profitabilityScore}
            onChange={(e) => setProfitabilityScore(parseInt(e.target.value) || 0)}
            className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
          />
        </div>
      </div>
    </div>
  )
}