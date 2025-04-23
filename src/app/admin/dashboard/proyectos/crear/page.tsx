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

export default function CrearProyectoPage() {
  const router = useRouter()
  const { createProyect, isLoading, error: storeError } = useProyectStore()
  
  // Valores predeterminados para Argentina y Santa Fe
  const defaultCountryId = 1 // Argentina
  const defaultStateId = 21 // Santa Fe
  const defaultCity = 'Rafaela'
  
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
  const [city, setCity] = useState(defaultCity)
  const [postalCode, setPostalCode] = useState('')
  const [streetName, setStreetName] = useState('')
  const [countryId, setCountryId] = useState<number | null>(defaultCountryId)
  const [stateId, setStateId] = useState<number | null>(defaultStateId)
  const [addressDescription, setAddressDescription] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  
  // Estados para medios del proyecto
  const [mediaItems, setMediaItems] = useState<{link: string, type: string, title: string, description: string}[]>([])
  
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
  const [countries, setCountries] = useState<{id: number, name: string}[]>([])
  const [states, setStates] = useState<{id: number, name: string}[]>([])
  const [showMediaForm, setShowMediaForm] = useState(false)
  const [tempMedia, setTempMedia] = useState({
    link: '',
    type: 'image',
    title: '',
    description: ''
  })
  
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
      
      const result = await createProyect(proyectData)
      
      if (result) {
        router.push('/admin/dashboard/proyectos')
      } else {
        setError('Ocurrió un error al crear el proyecto. Por favor, intente de nuevo.')
      }
    } catch (err) {
      setError('Error al procesar el formulario. Por favor, revise los datos e intente de nuevo.')
      console.error('Error al crear proyecto:', err)
    }
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
        
        {/* Botones de acción */}
        <BotonesAcciones 
          isLoading={isLoading}
          onCancel={() => router.back()}
        />
      </form>
    </div>
  )
}