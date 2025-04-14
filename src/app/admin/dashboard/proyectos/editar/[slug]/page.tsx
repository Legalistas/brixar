'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useProyectStore } from '@/store/proyectStore'
import { ProyectPhase, BusinessModel } from '@prisma/client'
import { AlertCircle, Loader2, ArrowLeft, Upload, Plus, Trash2, FileText } from 'lucide-react'
import { slugify } from '@/utils/slugify'

export default function EditarProyectoPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const { 
    currentProyect, 
    isLoading: isStoreLoading, 
    error: storeError, 
    fetchProyectBySlug, 
    updateProyect 
  } = useProyectStore()
  
  // Estados para los campos del formulario
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [openingLine, setOpeningLine] = useState('')
  const [description, setDescription] = useState('')
  const [phase, setPhase] = useState<ProyectPhase>('FUNDING')
  const [businessModel, setBusinessModel] = useState<BusinessModel>('SOLD')
  const [openingPhase, setOpeningPhase] = useState<number>(0)
  const [priority, setPriority] = useState<number>(0)
  const [daysToEnd, setDaysToEnd] = useState<number>(0)
  const [daysToStart, setDaysToStart] = useState<number>(0)
  
  // Estados para dirección
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [streetName, setStreetName] = useState('')
  const [countryId, setCountryId] = useState<number | null>(null)
  const [stateId, setStateId] = useState<number | null>(null)
  const [addressDescription, setAddressDescription] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [addressId, setAddressId] = useState<number | null>(null)
  
  // Estados para medios del proyecto
  const [mediaItems, setMediaItems] = useState<{
    id?: number;
    link: string;
    type: string;
    title: string;
    description: string;
  }[]>([])
  
  // Estados para detalles del proyecto
  const [details, setDetails] = useState<{[key: string]: any}>({})
  const [timeline, setTimeline] = useState<{[key: string]: any}>({})
  const [proyectType, setProyectType] = useState('')
  const [investmentPeriod, setInvestmentPeriod] = useState<number>(12)
  const [surface, setSurface] = useState<number>(0)
  const [rooms, setRooms] = useState<number>(0)
  const [floors, setFloors] = useState<number>(0)
  const [features, setFeatures] = useState<{[key: string]: any}>({})
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
  const [isLoading, setIsLoading] = useState(false)
  const [countries, setCountries] = useState<{id: number, name: string}[]>([])
  const [states, setStates] = useState<{id: number, name: string}[]>([])
  const [showMediaForm, setShowMediaForm] = useState(false)
  const [tempMedia, setTempMedia] = useState({
    link: '',
    type: 'image',
    title: '',
    description: ''
  })
  
  // Cargar el proyecto al montar el componente
  useEffect(() => {
    const loadProyect = async () => {
      await fetchProyectBySlug(params.slug)
    }
    
    loadProyect()
  }, [params.slug, fetchProyectBySlug])
  
  // Cargar países al montar el componente
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
  
  // Cuando el proyecto se carga, llenar los campos del formulario
  useEffect(() => {
    if (currentProyect) {
      setTitle(currentProyect.title || '')
      setSlug(currentProyect.slug || '')
      setOpeningLine(currentProyect.openingLine || '')
      setDescription(currentProyect.description || '')
      setPhase(currentProyect.phase)
      setBusinessModel(currentProyect.businessModel)
      setOpeningPhase(currentProyect.openingPhase || 0)
      setPriority(currentProyect.priority || 0)
      setDaysToEnd(currentProyect.daysToEnd || 0)
      setDaysToStart(currentProyect.daysToStart || 0)
      setDetails(currentProyect.details || {})
      setTimeline(currentProyect.timeline || {})
      
      // Cargar datos de dirección si existen
      if (currentProyect.address && currentProyect.address.length > 0) {
        const address = currentProyect.address[0]
        setAddressId(address.id)
        setCity(address.city || '')
        setPostalCode(address.postalCode || '')
        setStreetName(address.streetName || '')
        setCountryId(address.countryId || null)
        setStateId(address.stateId || null)
        setAddressDescription(address.description || '')
        
        // Cargar coordenadas si existen
        if (address.positions && address.positions.length > 0) {
          setLatitude(address.positions[0].latitude || '')
          setLongitude(address.positions[0].longitude || '')
        }
      }
      
      // Cargar medios del proyecto
      if (currentProyect.projectMedia && currentProyect.projectMedia.length > 0) {
        setMediaItems(currentProyect.projectMedia.map(media => ({
          id: media.id,
          link: media.link,
          type: media.type,
          title: media.title,
          description: media.description || ''
        })))
      }
      
      // Cargar detalles del proyecto si existen
      if (currentProyect.proyectDetails) {
        const details = currentProyect.proyectDetails
        setProyectType(details.type || '')
        setInvestmentPeriod(details.investmentPeriod || 12)
        setSurface(details.surface || 0)
        setRooms(details.rooms || 0)
        setFloors(details.floors || 0)
        setFeatures(details.features || {})
        setBuildingYear(details.buildingYear || null)
        setRiskScore(details.riskScore || 0)
        setProfitabilityScore(details.profitabilityScore || 0)
      }
      
      // Cargar datos de financiación si existen
      if (currentProyect.proyectFound) {
        const found = currentProyect.proyectFound
        
        // Formatear fechas para el input de tipo date
        if (found.startInvestDate) {
          const date = new Date(found.startInvestDate)
          setStartInvestDate(date.toISOString().split('T')[0])
        }
        
        if (found.endInvestDate) {
          const date = new Date(found.endInvestDate)
          setEndInvestDate(date.toISOString().split('T')[0])
        }
        
        setCompanyCapital(Number(found.companyCapital) || 0)
        setQuantityFunded(Number(found.quantityFunded) || 0)
        setQuantityToFund(Number(found.quantityToFund) || 0)
        setMaxOverfunding(Number(found.maxOverfunding) || 0)
        setRentProfitability(Number(found.rentProfitability) || 0)
        setTotalNetProfitability(Number(found.totalNetProfitability) || 0)
        setTotalNetProfitabilityToShow(Number(found.totalNetProfitabilityToShow) || 0)
        setApreciationProfitability(Number(found.apreciationProfitability) || 0)
      }
    }
  }, [currentProyect])
  
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
  
  // Actualizar el error local si hay error en el store
  useEffect(() => {
    if (storeError) {
      setError(storeError)
    }
  }, [storeError])
  
  // Añadir medio al proyecto
  const handleAddMedia = () => {
    if (tempMedia.link && tempMedia.title) {
      setMediaItems([...mediaItems, { ...tempMedia }])
      setTempMedia({
        link: '',
        type: 'image',
        title: '',
        description: ''
      })
      setShowMediaForm(false)
    }
  }
  
  // Eliminar medio del proyecto
  const handleRemoveMedia = (index: number) => {
    const updatedMedia = [...mediaItems]
    updatedMedia.splice(index, 1)
    setMediaItems(updatedMedia)
  }
  
  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Validar campos obligatorios
      if (!title || !slug || !phase || !businessModel) {
        setError('Por favor, complete los campos obligatorios: título, fase y modelo de negocio.')
        setIsLoading(false)
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
        
        // Incluir dirección si hay datos de dirección
        address: city || postalCode || streetName || countryId || stateId ? {
          id: addressId, // Incluir el ID si estamos actualizando una dirección existente
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
      
      const result = await updateProyect(params.slug, proyectData)
      
      if (result) {
        router.push('/admin/dashboard/proyectos')
      } else {
        setError('Ocurrió un error al actualizar el proyecto. Por favor, intente de nuevo.')
      }
    } catch (err) {
      setError('Error al procesar el formulario. Por favor, revise los datos e intente de nuevo.')
      console.error('Error al actualizar proyecto:', err)
    } finally {
      setIsLoading(false)
    }
  }
  
  if (isStoreLoading && !currentProyect) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-slate-400 animate-spin" />
          <p className="mt-2 text-slate-500">Cargando proyecto...</p>
        </div>
      </div>
    )
  }
  
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
          Editar Proyecto: {title}
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
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <h2 className="text-lg font-medium text-slate-800">Información del Proyecto</h2>
            <p className="text-sm text-slate-500">Datos básicos del proyecto</p>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-slate-700 mb-1">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                id="slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
                required
              />
              <p className="mt-1 text-xs text-slate-500">
                URL amigable para el proyecto (sin espacios ni caracteres especiales)
              </p>
            </div>
            
            <div>
              <label htmlFor="businessModel" className="block text-sm font-medium text-slate-700 mb-1">
                Modelo de Negocio <span className="text-red-500">*</span>
              </label>
              <select
                id="businessModel"
                value={businessModel}
                onChange={(e) => setBusinessModel(e.target.value as BusinessModel)}
                className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
                required
              >
                <option value="SOLD">Venta</option>
                <option value="RENT">Alquiler</option>
                <option value="LEADING">Leasing</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="phase" className="block text-sm font-medium text-slate-700 mb-1">
                Fase del Proyecto <span className="text-red-500">*</span>
              </label>
              <select
                id="phase"
                value={phase}
                onChange={(e) => setPhase(e.target.value as ProyectPhase)}
                className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
                required
              >
                <option value="IN_STUDY">En Estudio</option>
                <option value="FUNDING">Financiación</option>
                <option value="CONSTRUCTION">Construcción</option>
                <option value="COMPLETED">Completado</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="openingPhase" className="block text-sm font-medium text-slate-700 mb-1">
                Fase de Apertura
              </label>
              <input
                id="openingPhase"
                type="number"
                value={openingPhase}
                onChange={(e) => setOpeningPhase(parseInt(e.target.value) || 0)}
                className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
              />
            </div>
            
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-slate-700 mb-1">
                Prioridad
              </label>
              <input
                id="priority"
                type="number"
                value={priority}
                onChange={(e) => setPriority(parseInt(e.target.value) || 0)}
                className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
              />
              <p className="mt-1 text-xs text-slate-500">
                Valor numérico que determina la prioridad de visualización (mayor número = mayor prioridad)
              </p>
            </div>
            
            <div>
              <label htmlFor="daysToEnd" className="block text-sm font-medium text-slate-700 mb-1">
                Días para finalizar
              </label>
              <input
                id="daysToEnd"
                type="number"
                value={daysToEnd}
                onChange={(e) => setDaysToEnd(parseInt(e.target.value) || 0)}
                className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
              />
            </div>
            
            <div>
              <label htmlFor="daysToStart" className="block text-sm font-medium text-slate-700 mb-1">
                Días para comenzar
              </label>
              <input
                id="daysToStart"
                type="number"
                value={daysToStart}
                onChange={(e) => setDaysToStart(parseInt(e.target.value) || 0)}
                className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
              />
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="openingLine" className="block text-sm font-medium text-slate-700 mb-1">
                Línea de Apertura
              </label>
              <input
                id="openingLine"
                type="text"
                value={openingLine}
                onChange={(e) => setOpeningLine(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
              />
              <p className="mt-1 text-xs text-slate-500">
                Una breve introducción o eslogan para el proyecto
              </p>
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
                Descripción
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
              />
            </div>
          </div>
        </div>
        
        {/* Ubicación del proyecto */}
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
        
        {/* Medios del proyecto */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <h2 className="text-lg font-medium text-slate-800">Medios</h2>
            <p className="text-sm text-slate-500">Imágenes, vídeos y otros medios del proyecto</p>
          </div>
          
          <div className="p-6">
            {/* Lista de medios añadidos */}
            {mediaItems.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-700 mb-3">Medios añadidos</h3>
                <ul className="space-y-3">
                  {mediaItems.map((media, index) => (
                    <li key={index} className="flex items-center justify-between bg-slate-50 p-3 rounded-md border border-slate-200">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-slate-200 rounded-md overflow-hidden mr-3 flex-shrink-0">
                          {media.type === 'image' && media.link && (
                            <img src={media.link} alt={media.title} className="w-full h-full object-cover" />
                          )}
                          {media.type !== 'image' && (
                            <div className="w-full h-full flex items-center justify-center bg-slate-300">
                              <FileText className="h-6 w-6 text-slate-600" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-700">{media.title}</div>
                          <div className="text-xs text-slate-500">
                            {media.type} · {media.description ? `${media.description.substring(0, 30)}...` : 'Sin descripción'}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMedia(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Formulario para añadir medio */}
            {showMediaForm ? (
              <div className="bg-slate-50 p-4 rounded-md border border-slate-200 mb-4">
                <h3 className="text-sm font-medium text-slate-700 mb-3">Añadir nuevo medio</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="mediaLink" className="block text-xs font-medium text-slate-700 mb-1">
                      URL del medio <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="mediaLink"
                      type="text"
                      value={tempMedia.link}
                      onChange={(e) => setTempMedia({...tempMedia, link: e.target.value})}
                      className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-slate-500 focus:ring-slate-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="mediaType" className="block text-xs font-medium text-slate-700 mb-1">
                      Tipo de medio
                    </label>
                    <select
                      id="mediaType"
                      value={tempMedia.type}
                      onChange={(e) => setTempMedia({...tempMedia, type: e.target.value})}
                      className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-slate-500 focus:ring-slate-500"
                    >
                      <option value="image">Imagen</option>
                      <option value="video">Vídeo</option>
                      <option value="document">Documento</option>
                      <option value="3d">Modelo 3D</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="mediaTitle" className="block text-xs font-medium text-slate-700 mb-1">
                      Título <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="mediaTitle"
                      type="text"
                      value={tempMedia.title}
                      onChange={(e) => setTempMedia({...tempMedia, title: e.target.value})}
                      className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-slate-500 focus:ring-slate-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="mediaDescription" className="block text-xs font-medium text-slate-700 mb-1">
                      Descripción
                    </label>
                    <input
                      id="mediaDescription"
                      type="text"
                      value={tempMedia.description}
                      onChange={(e) => setTempMedia({...tempMedia, description: e.target.value})}
                      className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-slate-500 focus:ring-slate-500"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end mt-3 space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowMediaForm(false)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleAddMedia}
                    disabled={!tempMedia.link || !tempMedia.title}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-slate-700 rounded-md hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Añadir
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowMediaForm(true)}
                className="w-full border-2 border-dashed border-slate-300 rounded-md p-6 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:border-slate-400 transition-colors"
              >
                <div className="flex flex-col items-center">
                  <Upload className="h-8 w-8 mb-2" />
                  <span className="text-sm font-medium">Añadir medio al proyecto</span>
                  <span className="text-xs mt-1">Imágenes, vídeos, documentos, etc.</span>
                </div>
              </button>
            )}
          </div>
        </div>
        
        {/* Detalles del proyecto */}
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
        
        {/* Información de financiación */}
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
              <label htmlFor="companyCapital" className="block text-sm font-medium text-slate-700 mb-1">
                Capital de la Empresa
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-500">€</span>
                </div>
                <input
                  id="companyCapital"
                  type="number"
                  value={companyCapital}
                  onChange={(e) => setCompanyCapital(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-md border border-slate-300 pl-8 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="quantityFunded" className="block text-sm font-medium text-slate-700 mb-1">
                Cantidad Financiada
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-500">€</span>
                </div>
                <input
                  id="quantityFunded"
                  type="number"
                  value={quantityFunded}
                  onChange={(e) => setQuantityFunded(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-md border border-slate-300 pl-8 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
                />
              </div>
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
              <label htmlFor="maxOverfunding" className="block text-sm font-medium text-slate-700 mb-1">
                Sobrefinanciación Máxima
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-500">€</span>
                </div>
                <input
                  id="maxOverfunding"
                  type="number"
                  value={maxOverfunding}
                  onChange={(e) => setMaxOverfunding(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-md border border-slate-300 pl-8 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="rentProfitability" className="block text-sm font-medium text-slate-700 mb-1">
                Rentabilidad por Alquiler (%)
              </label>
              <div className="relative">
                <input
                  id="rentProfitability"
                  type="number"
                  step="0.01"
                  value={rentProfitability}
                  onChange={(e) => setRentProfitability(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-slate-500">%</span>
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="totalNetProfitability" className="block text-sm font-medium text-slate-700 mb-1">
                Rentabilidad Neta Total (%)
              </label>
              <div className="relative">
                <input
                  id="totalNetProfitability"
                  type="number"
                  step="0.01"
                  value={totalNetProfitability}
                  onChange={(e) => setTotalNetProfitability(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-slate-500">%</span>
                </div>
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
            
            <div>
              <label htmlFor="apreciationProfitability" className="block text-sm font-medium text-slate-700 mb-1">
                Rentabilidad por Apreciación (%)
              </label>
              <div className="relative">
                <input
                  id="apreciationProfitability"
                  type="number"
                  step="0.01"
                  value={apreciationProfitability}
                  onChange={(e) => setApreciationProfitability(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-slate-500">%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Botones de acción */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-slate-300 rounded-md text-slate-700 bg-white hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-900 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center">
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Guardando...
              </span>
            ) : (
              'Actualizar Proyecto'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}