import { useState, useEffect } from 'react'
import type { CreateProyectCostInput } from '@/store/costStore'
import { Proyect } from '@/store/proyectStore'
import { useCompensationStore, type CreateProyectCompensationInput } from '@/store/compensationStore'

interface AddCostPopupProps {
  currentProyect: Proyect
  formData: {
    fecha: string
    tipo: string
    rubro: string
    rubroPersonalizado: string
    proveedor: string
    detalle: string
    importePesos: string
    precioDolarBlue: string
    importeDolar: string
    inversor: string
    inversorPersonalizado: string
    inversorDestino: string
    inversorDestinoPersonalizado: string
  }
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  setShowAddCostPopup: (show: boolean) => void
  rubros: string[]
  inversores: string[]
}

export const AddCostPopup: React.FC<AddCostPopupProps> = ({
  currentProyect,
  formData,
  handleChange,
  handleSubmit,
  setShowAddCostPopup,
  rubros,
  inversores,
}) => {
  // Usamos el store de compensaciones
  const createCompensation = useCompensationStore(state => state.createCompensation)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Esta función manejará el envío de compensaciones utilizando compensationStore
  const handleCompensationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.tipo === 'compensacion') {
      try {
        setLoading(true)
        setError(null)
        
        // Extraer el mes de la fecha (formato: YYYY-MM-DD)
        const date = new Date(formData.fecha)
        const mes = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
        
        // Preparar los datos para la compensación
        const compensationData: CreateProyectCompensationInput = {
          proyectId: currentProyect.id,
          fecha: formData.fecha,
          mes: mes,
          detalle: formData.detalle || undefined,
          importePesos: parseFloat(formData.importePesos),
          precioDolarBlue: parseFloat(formData.precioDolarBlue),
          importeDolar: parseFloat(formData.importeDolar),
          inversorOrigen: formData.inversor === 'Otro' ? formData.inversorPersonalizado : formData.inversor,
          inversorDestino: formData.inversorDestino === 'Otro' ? formData.inversorDestinoPersonalizado : formData.inversorDestino
        }
        
        // Enviar la compensación utilizando el store de compensaciones
        const success = await createCompensation(compensationData)
        
        if (success) {
          // Cerrar el popup si la operación fue exitosa
          setShowAddCostPopup(false)
        } else {
          setError('No se pudo registrar la compensación. Inténtelo nuevamente.')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido al guardar la compensación')
      } finally {
        setLoading(false)
      }
    } else {
      // Si no es una compensación, usar el manejador de envío original para costos
      await handleSubmit(e)
    }
  }

  return (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg sm:text-xl font-medium mb-2 sm:mb-4 text-slate-800">
          {formData.tipo === "compensacion" ? "Añadir compensación entre inversores" : "Añadir nuevo costo al proyecto"}
        </h3>

        <p className="mb-3 sm:mb-4 text-sm sm:text-base text-slate-600">
          Proyecto: <span className="font-medium text-slate-800">{currentProyect.title}</span>
        </p>

        <form className="space-y-3 sm:space-y-4" onSubmit={handleCompensationSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tipo de operación
              </label>
              <div className="flex space-x-4 mt-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="tipoCosto"
                    name="tipo"
                    value="costo"
                    checked={formData.tipo === 'costo'}
                    onChange={handleChange}
                    className="mr-1 accent-slate-700"
                    required
                  />
                  <label htmlFor="tipoCosto" className="text-sm text-slate-700">
                    Agregar costo
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="tipoCompensacion"
                    name="tipo"
                    value="compensacion"
                    checked={formData.tipo === 'compensacion'}
                    onChange={handleChange}
                    className="mr-1 accent-slate-700"
                  />
                  <label
                    htmlFor="tipoCompensacion"
                    className="text-sm text-slate-700"
                  >
                    Compensación
                  </label>
                </div>
              </div>
            </div>

            {formData.tipo !== 'compensacion' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Rubro
                  </label>
                  <select
                    name="rubro"
                    value={formData.rubro}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
                    required={formData.tipo !== 'compensacion'}
                  >
                    <option value="">Seleccione un rubro</option>
                    {rubros.map((rubro) => (
                      <option key={rubro} value={rubro}>
                        {rubro}
                      </option>
                    ))}
                  </select>
                  {formData.rubro === 'Otros' && (
                    <input
                      type="text"
                      name="rubroPersonalizado"
                      value={formData.rubroPersonalizado}
                      onChange={handleChange}
                      placeholder="Especifique el rubro"
                      className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400 mt-2"
                      required={
                        formData.rubro === 'Otros' &&
                        formData.tipo !== 'compensacion'
                      }
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Proveedor
                  </label>
                  <input
                    type="text"
                    name="proveedor"
                    value={formData.proveedor}
                    onChange={handleChange}
                    placeholder="Nombre del proveedor"
                    className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
                    required={formData.tipo !== 'compensacion'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Detalle
                  </label>
                  <textarea
                    name="detalle"
                    value={formData.detalle}
                    onChange={handleChange}
                    placeholder="Descripción detallada del costo"
                    className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
                    rows={3}
                  />
                </div>
              </>
            )}

            {formData.tipo === 'compensacion' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Descripción
                </label>
                <textarea
                  name="detalle"
                  value={formData.detalle}
                  onChange={handleChange}
                  placeholder="Descripción de la compensación entre inversores"
                  className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  rows={3}
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Importe en pesos (ARS)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="importePesos"
                  value={formData.importePesos}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Cotización dólar blue
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="precioDolarBlue"
                  value={formData.precioDolarBlue}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Importe en dólares (USD)
              </label>
              <input
                type="number"
                step="0.01"
                name="importeDolar"
                value={formData.importeDolar}
                placeholder="0.00"
                readOnly
                className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
              <p className="text-xs text-slate-500 mt-1">
                Este valor se calcula automáticamente
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Inversor {formData.tipo === 'compensacion' ? 'origen' : ''}
                  </label>
                  <select
                    name="inversor"
                    value={formData.inversor}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
                    required
                  >
                    <option value="">Seleccione un inversor</option>
                    {inversores.map((inversor) => (
                      <option key={inversor} value={inversor}>
                        {inversor}
                      </option>
                    ))}
                  </select>
                  {formData.inversor === 'Otro' && (
                    <input
                      type="text"
                      name="inversorPersonalizado"
                      value={formData.inversorPersonalizado}
                      onChange={handleChange}
                      placeholder="Especifique el inversor"
                      className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400 mt-2"
                      required={formData.inversor === 'Otro'}
                    />
                  )}
                </div>

                {formData.tipo === 'compensacion' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Inversor destino
                    </label>
                    <select
                      name="inversorDestino"
                      value={formData.inversorDestino}
                      onChange={handleChange}
                      className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
                      required={formData.tipo === 'compensacion'}
                    >
                      <option value="">Seleccione un inversor destino</option>
                      {inversores.map((inversor) => (
                        <option key={inversor} value={inversor}>
                          {inversor}
                        </option>
                      ))}
                    </select>
                    {formData.inversorDestino === 'Otro' && (
                      <input
                        type="text"
                        name="inversorDestinoPersonalizado"
                        value={formData.inversorDestinoPersonalizado}
                        onChange={handleChange}
                        placeholder="Especifique el inversor destino"
                        className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400 mt-2"
                        required={formData.inversorDestino === 'Otro'}
                      />
                    )}
                  </div>
                )}
              </div>
              {formData.tipo === 'compensacion' && (
                <p className="text-xs text-amber-600 mt-4 font-medium">
                  Esta operación registrará un movimiento de fondos desde &quot;
                  {formData.inversor === 'Otro'
                    ? formData.inversorPersonalizado
                    : formData.inversor}
                  &quot; hacia &quot;
                  {formData.inversorDestino === 'Otro'
                    ? formData.inversorDestinoPersonalizado
                    : formData.inversorDestino}
                  &quot;
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 mt-4 border-t border-slate-200">
            {error && (
              <div className="flex-1 text-red-600 text-sm self-center">
                {error}
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowAddCostPopup(false)}
              className="border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium py-2 px-4 rounded-md transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center"
              disabled={loading}
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {formData.tipo === 'compensacion'
                ? 'Registrar Compensación'
                : 'Guardar Costo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
