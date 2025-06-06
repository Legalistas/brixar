import { useState, useEffect } from 'react'
import { Proyect } from '@/store/proyectStore'
import { ProyectCompensation, useCompensationStore, type CreateProyectCompensationInput } from '@/store/compensationStore'

interface EditCompensationPopupProps {
  currentProyect: Proyect
  compensation: ProyectCompensation
  setShowEditCompensationPopup: (show: boolean) => void
  inversores: string[]
  onUpdate: () => void
}

export const EditCompensationPopup: React.FC<EditCompensationPopupProps> = ({
  currentProyect,
  compensation,
  setShowEditCompensationPopup,
  inversores,
  onUpdate
}) => {
  const { updateCompensation } = useCompensationStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Formulario para editar compensación
  const [formData, setFormData] = useState({
    fecha: new Date(compensation.fecha).toISOString().split('T')[0],
    detalle: compensation.detalle || '',
    importePesos: compensation.importePesos.toString() || '',
    precioDolarBlue: compensation.precioDolarBlue.toString() || '',
    importeDolar: compensation.importeDolar.toString() || '',
    inversorOrigen: compensation.inversorOrigen || '',
    inversorDestino: compensation.inversorDestino || '',
    inversorOrigenPersonalizado: '',
    inversorDestinoPersonalizado: '',
  })

  useEffect(() => {
    // Si el inversor origen no está en la lista de inversores predefinidos, es personalizado
    if (!inversores.includes(compensation.inversorOrigen || '') && compensation.inversorOrigen) {
      setFormData(prev => ({ 
        ...prev, 
        inversorOrigen: 'Otro', 
        inversorOrigenPersonalizado: compensation.inversorOrigen || '' 
      }))
    }

    // Si el inversor destino no está en la lista de inversores predefinidos, es personalizado
    if (!inversores.includes(compensation.inversorDestino || '') && compensation.inversorDestino) {
      setFormData(prev => ({ 
        ...prev, 
        inversorDestino: 'Otro', 
        inversorDestinoPersonalizado: compensation.inversorDestino || '' 
      }))
    }
  }, [compensation, inversores])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target

    // Actualizar el estado en una sola operación para evitar múltiples renderizados
    setFormData((prev) => {
      const newData = { ...prev, [name]: value }

      // Calcular automáticamente el importe en dólares cuando cambian los valores
      if (name === 'importePesos' || name === 'precioDolarBlue') {
        const pesos =
          parseFloat(name === 'importePesos' ? value : newData.importePesos) ||
          0
        const cotizacion =
          parseFloat(
            name === 'precioDolarBlue' ? value : newData.precioDolarBlue
          ) || 0

        if (pesos > 0 && cotizacion > 0) {
          newData.importeDolar = (pesos / cotizacion).toFixed(2)
        }
      }

      return newData
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError(null)
      
      const fechaObj = new Date(formData.fecha)
      const mes = `${fechaObj.getFullYear()}-${String(
        fechaObj.getMonth() + 1
      ).padStart(2, '0')}`
      
      // Preparar los datos para actualizar
      const updateData: Partial<CreateProyectCompensationInput> = {
        fecha: formData.fecha,
        mes: mes,
        detalle: formData.detalle,
        importePesos: parseFloat(formData.importePesos),
        precioDolarBlue: parseFloat(formData.precioDolarBlue),
        importeDolar: parseFloat(formData.importeDolar),
        inversorOrigen: formData.inversorOrigen === 'Otro' ? formData.inversorOrigenPersonalizado : formData.inversorOrigen,
        inversorDestino: formData.inversorDestino === 'Otro' ? formData.inversorDestinoPersonalizado : formData.inversorDestino,
      }
      
      // Enviar la actualización utilizando el store
      const success = await updateCompensation(compensation.id, updateData)
      
      if (success) {
        // Cerrar el popup si la operación fue exitosa
        setShowEditCompensationPopup(false)
        // Ejecutar callback para refrescar la lista de compensaciones
        onUpdate()
      } else {
        setError('No se pudo actualizar la compensación. Inténtelo nuevamente.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido al actualizar la compensación')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg sm:text-xl font-medium text-slate-800">
            Editar compensación
          </h3>
          <button
            type="button"
            onClick={() => setShowEditCompensationPopup(false)}
            className="text-slate-400 hover:text-slate-500"
          >
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <p className="mb-3 sm:mb-4 text-sm sm:text-base text-slate-600">
          Proyecto: <span className="font-medium text-slate-800">{currentProyect.title}</span>
        </p>

        <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
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
                  Cotización dólar
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
                    Inversor origen
                  </label>
                  <select
                    name="inversorOrigen"
                    value={formData.inversorOrigen}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
                    required
                  >
                    <option value="">Seleccione un inversor origen</option>
                    {inversores.map((inversor) => (
                      <option key={inversor} value={inversor}>
                        {inversor}
                      </option>
                    ))}
                  </select>
                  {formData.inversorOrigen === 'Otro' && (
                    <input
                      type="text"
                      name="inversorOrigenPersonalizado"
                      value={formData.inversorOrigenPersonalizado}
                      onChange={handleChange}
                      placeholder="Especifique el inversor origen"
                      className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400 mt-2"
                      required={formData.inversorOrigen === 'Otro'}
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Inversor destino
                  </label>
                  <select
                    name="inversorDestino"
                    value={formData.inversorDestino}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
                    required
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
              </div>
              
              <p className="text-xs text-amber-600 mt-4 font-medium">
                Esta operación registrará un movimiento de fondos desde &quot;{
                  formData.inversorOrigen === 'Otro'
                    ? formData.inversorOrigenPersonalizado
                    : formData.inversorOrigen
                }&quot; hacia &quot;{
                  formData.inversorDestino === 'Otro'
                    ? formData.inversorDestinoPersonalizado
                    : formData.inversorDestino
                }&quot;
              </p>
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
              onClick={() => setShowEditCompensationPopup(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 flex items-center disabled:opacity-70"
              disabled={loading}
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
