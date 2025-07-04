'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useProyectStore } from '@/store/proyectStore'
import { ProyectPhase, BusinessModel } from '@prisma/client'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import { slugify } from '@/utils/slugify'

// Importar componentes del formulario
import InformacionBasica from './components/InformacionBasica'
import Ubicacion from './components/Ubicacion'
import MediaItems from './components/MediaItems'
import BotonesAcciones from './components/BotonesAcciones'
import { ProjectUnit } from '@/types/projectUnit'
import { ProjectPhase } from '@/types/proyect'

export default function CrearProyectoPage() {
  const router = useRouter()
  const { createProyect, isLoading, error: storeError } = useProyectStore()

  // Valores predeterminados para Argentina y Santa Fe
  const defaultCountryId = 1 // Argentina
  const defaultStateId = 21 // Santa Fe
  const defaultCity = 'Rafaela'

  // Estados para los inversores
  const [selectedInvestors, setSelectedInvestors] = useState<string[]>([])

  // Estados para los campos del formulario
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [openingLine, setOpeningLine] = useState('')
  const [description, setDescription] = useState('')
  const [phase, setPhase] = useState<ProyectPhase>('IN_STUDY')
  const [businessModel, setBusinessModel] = useState<BusinessModel>('SOLD')
  const [openingPhase, setOpeningPhase] = useState<number>(0)
  const [priority, setPriority] = useState<number>(0)
  const [daysToEnd, setDaysToEnd] = useState<number>(0)
  const [daysToStart, setDaysToStart] = useState<number>(0)
  const [openingDate, setOpeningDate] = useState<Date | null>(null)

  // Estados para dirección
  const [city, setCity] = useState(defaultCity)
  const [postalCode, setPostalCode] = useState('')
  const [streetName, setStreetName] = useState('')
  const [countryId, setCountryId] = useState<number | null>(defaultCountryId)
  const [stateId, setStateId] = useState<number | null>(defaultStateId)
  const [addressDescription, setAddressDescription] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')

  // Estados para medios del proyecto
  const [mediaItems, setMediaItems] = useState<{ link: string, type: string, title: string, description: string }[]>([])

  // Estados para detalles del proyecto
  const [details, setDetails] = useState<{ [key: string]: any }>({})
  const [timeline, setTimeline] = useState<{ [key: string]: any }>({})
  const [proyectType, setProyectType] = useState('')
  const [investmentPeriod, setInvestmentPeriod] = useState<number>(12)
  const [surface, setSurface] = useState<number>(0)
  const [rooms, setRooms] = useState<number>(0)
  const [floors, setFloors] = useState<number>(0)
  const [features, setFeatures] = useState<{ [key: string]: any }>({})
  const [buildingYear, setBuildingYear] = useState<number | null>(null)
  const [riskScore, setRiskScore] = useState<number>(0)
  const [profitabilityScore, setProfitabilityScore] = useState<number>(0)

  // Estados para financiación
  const [startInvestDate, setStartInvestDate] = useState('')
  const [endInvestDate, setEndInvestDate] = useState('')
  const [companyCapital, setCompanyCapital] = useState<number>(0)
  const [quantityFunded, setQuantityFunded] = useState<number>(0)
  const [quantityToFund, setQuantityToFund] = useState<number>(0)
  const [maxOverfunding, setMaxOverfunding] = useState<number>(0)
  const [rentProfitability, setRentProfitability] = useState<number>(0)
  const [totalNetProfitability, setTotalNetProfitability] = useState<number>(0)
  const [totalNetProfitabilityToShow, setTotalNetProfitabilityToShow] = useState<number>(0)
  const [apreciationProfitability, setApreciationProfitability] = useState<number>(0)

  // Estados para la UI
  const [error, setError] = useState('')
  const [countries, setCountries] = useState<{ id: number, name: string }[]>([])
  const [states, setStates] = useState<{ id: number, name: string }[]>([])
  const [showMediaForm, setShowMediaForm] = useState(false)
  const [tempMedia, setTempMedia] = useState({
    link: '',
    type: 'image',
    title: '',
    description: ''
  })

  const defaultUnitForm: Partial<ProjectUnit> = {
    sku: '',
    surface: 0,
    priceUsd: 0,
    floor: 0,
    rooms: 0,
    bathrooms: 0,
    parking: false,
    status: '',
    type: '',
    description: '',
    features: {},
    unitNumber: '',
    availabilityDate: '',
    isPublished: true,
  }

  // Estados para unidades
  const [projectUnits, setProjectUnits] = useState<Partial<ProjectUnit>[]>([])
  const [showUnitForm, setShowUnitForm] = useState(false)
  const [editingUnitIndex, setEditingUnitIndex] = useState<number | null>(null)
  const [unitForm, setUnitForm] = useState<Partial<ProjectUnit>>(defaultUnitForm)

  // Cargar países y estados al montar el componente
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('/api/countries')
        if (response.ok) {
          const data = await response.json()
          setCountries(data)
        }
      } catch (error) {
        console.error('Error al cargar países:', error)
      }
    }

    fetchCountries()
  }, [])

  // Cargar estados cuando se selecciona un país
  useEffect(() => {
    if (countryId) {
      const fetchStates = async () => {
        try {
          const response = await fetch(`/api/states/${countryId}`)
          if (response.ok) {
            const data = await response.json()
            setStates(data)
          }
        } catch (error) {
          console.error('Error al cargar estados/provincias:', error)
        }
      }

      fetchStates()
    } else {
      setStates([])
    }
  }, [countryId])

  // Actualizar el slug cuando cambia el título
  useEffect(() => {
    setSlug(slugify(title))
  }, [title])

  // Actualizar el error local si hay error en el store
  useEffect(() => {
    if (storeError) {
      setError(storeError)
    }
  }, [storeError])

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Validar campos obligatorios
      if (!title || !slug || !phase || !businessModel) {
        setError('Por favor, complete los campos obligatorios: título, fase y modelo de negocio.')
        return
      }

      // Preparar datos del proyecto
      const proyectData = {
        title,
        slug,
        openingLine,
        description,
        phase,
        businessModel,
        openingPhase,
        priority,
        daysToEnd,
        daysToStart,
        details,
        timeline,
        projectUnits: projectUnits.length > 0 ? projectUnits : undefined,

        // Incluir dirección si hay datos de dirección
        address: city || postalCode || streetName || countryId || stateId ? {
          city,
          postalCode,
          streetName,
          description: addressDescription,
          countryId,
          stateId,
          positions: latitude && longitude ? [
            {
              latitude,
              longitude
            }
          ] : undefined
        } : undefined,

        // Incluir medios si existen
        projectMedia: mediaItems.length > 0 ? mediaItems : undefined,

        // Incluir detalles del proyecto si hay datos relevantes
        proyectDetails: proyectType || investmentPeriod || surface || rooms || floors ? {
          type: proyectType,
          investmentPeriod,
          surface,
          rooms,
          floors,
          features,
          buildingYear,
          riskScore,
          profitabilityScore
        } : undefined,

        // Incluir datos de financiación si hay datos relevantes
        proyectFound: quantityToFund > 0 ? {
          startInvestDate: startInvestDate ? new Date(startInvestDate).toISOString() : undefined,
          endInvestDate: endInvestDate ? new Date(endInvestDate).toISOString() : undefined,
          companyCapital,
          quantityFunded,
          quantityToFund,
          maxOverfunding,
          rentProfitability,
          totalNetProfitability,
          totalNetProfitabilityToShow,
          apreciationProfitability
        } : undefined
      }

      // const result = await createProyect(proyectData)

      // if (result) {
      if (true) {
        router.push('/admin/dashboard/proyectos')
      } else {
        setError('Ocurrió un error al crear el proyecto. Por favor, intente de nuevo.')
      }
    } catch (err) {
      setError('Error al procesar el formulario. Por favor, revise los datos e intente de nuevo.')
      console.error('Error al crear proyecto:', err)
    }
  }

  const handleSaveUnit = () => {
    if (!unitForm.sku || !unitForm.surface || !unitForm.priceUsd) {
      setError('Completa los campos obligatorios de la unidad: SKU, superficie y precio.');
      return;
    }
    if (editingUnitIndex !== null) {
      // Editar unidad existente
      setProjectUnits(units =>
        units.map((u, idx) => (idx === editingUnitIndex ? unitForm : u))
      );
    } else {
      // Agregar nueva unidad
      setProjectUnits(units => [...units, unitForm]);
    }
    setUnitForm(defaultUnitForm);
    setShowUnitForm(false);
    setEditingUnitIndex(null);
  };

  const handleEditUnit = (idx: number) => {
    setUnitForm(projectUnits[idx]);
    setShowUnitForm(true);
    setEditingUnitIndex(idx);
  };

  const handleDeleteUnit = (idx: number) => {
    setProjectUnits(units => units.filter((_, i) => i !== idx));
  };

  return (
    <div className="container mx-auto py-8 px-4 bg-white">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="mr-4 text-slate-600 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-medium text-slate-800">
          Crear Nuevo Proyecto
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Información básica del proyecto */}
        <InformacionBasica
          title={title}
          setTitle={setTitle}
          slug={slug}
          setSlug={setSlug}
          openingLine={openingLine}
          setOpeningLine={setOpeningLine}
          description={description}
          setDescription={setDescription}
          phase={phase}
          setPhase={setPhase}
          businessModel={businessModel}
          setBusinessModel={setBusinessModel}
          openingPhase={openingPhase}
          setOpeningPhase={setOpeningPhase}
          priority={priority}
          setPriority={setPriority}
          daysToEnd={daysToEnd}
          setDaysToEnd={setDaysToEnd}
          daysToStart={daysToStart}
          setDaysToStart={setDaysToStart}
          surface={surface}
          setSurface={setSurface}
          openingDate={openingDate || new Date()}
          setOpeningDate={setOpeningDate}
        />

        {/* Ubicación del proyecto */}
        <Ubicacion
          city={city}
          setCity={setCity}
          postalCode={postalCode}
          setPostalCode={setPostalCode}
          streetName={streetName}
          setStreetName={setStreetName}
          countryId={countryId}
          setCountryId={setCountryId}
          stateId={stateId}
          setStateId={setStateId}
          addressDescription={addressDescription}
          setAddressDescription={setAddressDescription}
          latitude={latitude}
          setLatitude={setLatitude}
          longitude={longitude}
          setLongitude={setLongitude}
          countries={countries}
          states={states}
        />

        {/* Medios del proyecto */}
        <MediaItems
          mediaItems={mediaItems}
          setMediaItems={setMediaItems}
          showMediaForm={showMediaForm}
          setShowMediaForm={setShowMediaForm}
          tempMedia={tempMedia}
          setTempMedia={setTempMedia}
        />

        {/* Asignar inversores del proyecto */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <h2 className="text-lg font-medium text-slate-800">Inversores del Proyecto</h2>
            <p className="text-sm text-slate-500">
              Asigna inversores a este proyecto. Puedes seleccionar uno o más inversores de la lista.
            </p>
          </div>

          <div className="px-6 py-4">
            <label htmlFor="investors" className="block text-sm font-medium text-slate-700">
              Selecciona Inversores
            </label>
            <select
              id="investors"
              name="investors"
              className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
              multiple
              value={selectedInvestors}
              onChange={(e) => { setSelectedInvestors(Array.from(e.target.selectedOptions, option => option.value)) }}
            >
              <option value="1">Agustín Andereggen</option>
              <option value="2">Oscar Andereggen</option>
            </select>
          </div>
        </div>

        {showUnitForm && (
          <div className="border p-4 rounded mb-4 bg-slate-50">
            <h3 className="font-semibold mb-2">{editingUnitIndex !== null ? 'Editar Unidad' : 'Agregar Unidad'}</h3>
            <div className="grid grid-cols-2 gap-2">
              <input type="text" placeholder="SKU" value={unitForm.sku} onChange={e => setUnitForm({ ...unitForm, sku: e.target.value })} />
              <input type="number" placeholder="Superficie" value={unitForm.surface} onChange={e => setUnitForm({ ...unitForm, surface: Number(e.target.value) })} />
              <input type="number" placeholder="Precio USD" value={unitForm.priceUsd} onChange={e => setUnitForm({ ...unitForm, priceUsd: Number(e.target.value) })} />
              <input type="number" placeholder="Piso" value={unitForm.floor} onChange={e => setUnitForm({ ...unitForm, floor: Number(e.target.value) })} />
              <input type="number" placeholder="Ambientes" value={unitForm.rooms} onChange={e => setUnitForm({ ...unitForm, rooms: Number(e.target.value) })} />
              <input type="number" placeholder="Baños" value={unitForm.bathrooms} onChange={e => setUnitForm({ ...unitForm, bathrooms: Number(e.target.value) })} />
              <label>
                <input type="checkbox" checked={unitForm.parking} onChange={e => setUnitForm({ ...unitForm, parking: e.target.checked })} />
                Cochera
              </label>
              <input type="text" placeholder="Estado" value={unitForm.status} onChange={e => setUnitForm({ ...unitForm, status: e.target.value })} />
              <input type="text" placeholder="Tipo" value={unitForm.type} onChange={e => setUnitForm({ ...unitForm, type: e.target.value })} />
              <input type="text" placeholder="Descripción" value={unitForm.description} onChange={e => setUnitForm({ ...unitForm, description: e.target.value })} />
              <input type="text" placeholder="Número de unidad" value={unitForm.unitNumber} onChange={e => setUnitForm({ ...unitForm, unitNumber: e.target.value })} />
              <input type="date" placeholder="Fecha de disponibilidad" value={unitForm.availabilityDate} onChange={e => setUnitForm({ ...unitForm, availabilityDate: e.target.value })} />
              <label>
                <input type="checkbox" checked={unitForm.isPublished} onChange={e => setUnitForm({ ...unitForm, isPublished: e.target.checked })} />
                Publicado
              </label>
            </div>
            <div className="mt-2 flex gap-2">
              <button type="button" onClick={handleSaveUnit} className="btn btn-primary">Guardar</button>
              <button type="button" onClick={() => { setShowUnitForm(false); setEditingUnitIndex(null); }} className="btn btn-secondary">Cancelar</button>
            </div>
          </div>
        )}

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Unidades del Proyecto</h3>
          <p className="text-sm text-slate-500 mb-2">
            Un proyecto puede tener varias unidades (casas, departamentos, etc). Agrega cada unidad individualmente.
          </p>
          <button
            type="button"
            onClick={() => {
              setShowUnitForm(true);
              setUnitForm(defaultUnitForm);
              setEditingUnitIndex(null);
            }}
            className="btn btn-success mb-2"
          >
            Agregar Unidad
          </button>
          {projectUnits.length === 0 && <p className="text-slate-400">No hay unidades agregadas.</p>}
          <ul>
            {projectUnits.map((unit, idx) => (
              <li key={idx} className="border p-2 rounded mb-2 flex justify-between items-center">
                <span>
                  <b>{unit.sku}</b> - {unit.type} - {unit.surface} m² - USD {unit.priceUsd}
                </span>
                <div>
                  <button type="button" onClick={() => handleEditUnit(idx)} className="btn btn-xs btn-warning mr-2">Editar</button>
                  <button type="button" onClick={() => handleDeleteUnit(idx)} className="btn btn-xs btn-danger">Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Botones de acción */}
        <BotonesAcciones
          isLoading={isLoading}
          onCancel={() => router.back()}
        />
      </form>
    </div>
  )
}