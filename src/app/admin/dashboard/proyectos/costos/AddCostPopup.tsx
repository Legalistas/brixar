import { useState, useEffect } from 'react'
import type { CreateProyectCostInput } from '@/store/costStore'
import { Proyect } from '@/store/proyectStore'

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
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full">
        <h3 className="text-xl font-medium mb-4 text-slate-800">
          {formData.tipo === 'compensacion'
            ? 'Añadir compensación entre inversores'
            : 'Añadir nuevo costo al proyecto'}
        </h3>

        <p className="mb-4 text-slate-600">
          Proyecto:{' '}
          <span className="font-medium text-slate-800">
            {currentProyect.title}
          </span>
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
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
                    <label
                      htmlFor="tipoCosto"
                      className="text-sm text-slate-700"
                    >
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
            <button
              type="button"
              onClick={() => setShowAddCostPopup(false)}
              className="border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium py-2 px-4 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
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
