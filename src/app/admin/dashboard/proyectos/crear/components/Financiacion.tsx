'use client'

interface FinanciacionProps {
  startInvestDate: string
  setStartInvestDate: (value: string) => void
  endInvestDate: string
  setEndInvestDate: (value: string) => void
  companyCapital: number
  setCompanyCapital: (value: number) => void
  quantityFunded: number
  setQuantityFunded: (value: number) => void
  quantityToFund: number
  setQuantityToFund: (value: number) => void
  maxOverfunding: number
  setMaxOverfunding: (value: number) => void
  rentProfitability: number
  setRentProfitability: (value: number) => void
  totalNetProfitability: number
  setTotalNetProfitability: (value: number) => void
  totalNetProfitabilityToShow: number
  setTotalNetProfitabilityToShow: (value: number) => void
  apreciationProfitability: number
  setApreciationProfitability: (value: number) => void
}

export default function Financiacion({
  startInvestDate,
  setStartInvestDate,
  endInvestDate,
  setEndInvestDate,
  companyCapital,
  setCompanyCapital,
  quantityFunded,
  setQuantityFunded,
  quantityToFund,
  setQuantityToFund,
  maxOverfunding,
  setMaxOverfunding,
  rentProfitability,
  setRentProfitability,
  totalNetProfitability,
  setTotalNetProfitability,
  totalNetProfitabilityToShow,
  setTotalNetProfitabilityToShow,
  apreciationProfitability,
  setApreciationProfitability
}: FinanciacionProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
        <h2 className="text-lg font-medium text-slate-800">Financiación</h2>
        <p className="text-sm text-slate-500">Datos financieros y de inversión</p>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="startInvestDate" className="block text-sm font-medium text-slate-700 mb-1">
            Fecha de Inicio de Inversión
          </label>
          <input
            id="startInvestDate"
            type="date"
            value={startInvestDate}
            onChange={(e) => setStartInvestDate(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
          />
        </div>
        
        <div>
          <label htmlFor="endInvestDate" className="block text-sm font-medium text-slate-700 mb-1">
            Fecha Fin de Inversión
          </label>
          <input
            id="endInvestDate"
            type="date"
            value={endInvestDate}
            onChange={(e) => setEndInvestDate(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
          />
        </div>
        
        <div>
          <label htmlFor="quantityToFund" className="block text-sm font-medium text-slate-700 mb-1">
            Cantidad a Financiar
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-slate-500">€</span>
            </div>
            <input
              id="quantityToFund"
              type="number"
              value={quantityToFund}
              onChange={(e) => setQuantityToFund(parseFloat(e.target.value) || 0)}
              className="w-full rounded-md border border-slate-300 pl-8 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="totalNetProfitabilityToShow" className="block text-sm font-medium text-slate-700 mb-1">
            Rentabilidad Neta Total a Mostrar (%)
          </label>
          <div className="relative">
            <input
              id="totalNetProfitabilityToShow"
              type="number"
              step="0.01"
              value={totalNetProfitabilityToShow}
              onChange={(e) => setTotalNetProfitabilityToShow(parseFloat(e.target.value) || 0)}
              className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-slate-500">%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}