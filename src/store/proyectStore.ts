import { create } from 'zustand'
import { API_ENDPOINTS } from '@/constants/api-endpoint'

// Interfaces para las entidades relacionadas
interface ProyectMedia {
  id: number
  proyectId: number
  link: string
  type: string
  title: string
  description?: string
}

interface Address {
  id: number
  proyectId?: number
  propertyId?: number
  countryId?: number
  stateId?: number
  city?: string
  postalCode?: string
  streetName?: string
  description?: string
  positions?: Position[]
  country?: { id: number; name: string }
  state?: { id: number; name: string }
}

interface Position {
  id: number
  addressId: number
  longitude?: string
  latitude?: string
}

interface ProyectDetails {
  id: number
  proyectId: number
  type?: string
  investmentPeriod?: number
  surface?: number
  rooms?: number
  floors?: number
  features?: any
  buildingYear?: number
  riskScore?: number
  profitabilityScore?: number
}

interface ProyectFound {
  id: number
  proyectId: number
  startInvestDate?: string
  endInvestDate?: string
  companyCapital: number
  quantityFunded: number
  quantityToFund: number
  maxOverfunding: number
  rentProfitability: number
  totalNetProfitability: number
  totalNetProfitabilityToShow: number
  apreciationProfitability: number
  fields?: any
}

// Interfaz principal para Proyect
export interface Proyect {
  id: number
  slug: string
  title: string
  openingLine?: string
  description?: string
  promotorId?: number
  openingPhase?: number
  phase: 'IN_STUDY' | 'FUNDING' | 'CONSTRUCTION' | 'COMPLETED'
  businessModel: 'SOLD' | 'RENT' | 'LEADING'
  fundedDate?: string
  details?: any
  timeline?: any
  daysToEnd?: number
  priority?: number
  daysToStart?: number
  createdAt: string
  updatedAt: string
  address?: Address[]
  projectMedia?: ProyectMedia[]
  proyectDetails?: ProyectDetails
  proyectFound?: ProyectFound
  // Podemos añadir más relaciones si es necesario
  promotor?: {
    id: number
    name: string
    email: string
  }
}

// Interfaz para crear un nuevo proyecto
export interface CreateProyectInput {
  title: string
  slug: string
  openingLine?: string
  description?: string
  phase: 'IN_STUDY' | 'FUNDING' | 'CONSTRUCTION' | 'COMPLETED'
  businessModel: 'SOLD' | 'RENT' | 'LEADING'
  openingPhase?: number
  priority?: number
  daysToEnd?: number
  daysToStart?: number
  details?: any
  timeline?: any
  address?: {
    id?: number
    city?: string
    postalCode?: string
    streetName?: string
    description?: string
    countryId?: number | null
    stateId?: number | null
    positions?: {
      id?: number
      latitude?: string
      longitude?: string
    }[]
  }
  projectMedia?: {
    id?: number
    link: string
    type: string
    title: string
    description?: string
  }[]
  proyectDetails?: {
    id?: number
    type?: string
    investmentPeriod?: number
    surface?: number
    rooms?: number
    floors?: number
    features?: any
    buildingYear?: number | null
    riskScore?: number
    profitabilityScore?: number
  }
  proyectFound?: {
    id?: number
    startInvestDate?: string
    endInvestDate?: string
    companyCapital?: number
    quantityFunded?: number
    quantityToFund?: number
    maxOverfunding?: number
    rentProfitability?: number
    totalNetProfitability?: number
    totalNetProfitabilityToShow?: number
    apreciationProfitability?: number
    fields?: any
  }
}

// Interfaz para la store
interface ProyectStore {
  proyects: Proyect[]
  currentProyect: Proyect | null
  isLoading: boolean
  error: string | null
  
  // Métodos para gestionar proyectos
  fetchProyects: () => Promise<void>
  fetchProyectBySlug: (slug: string) => Promise<void>
  createProyect: (proyectData: CreateProyectInput) => Promise<boolean>
  updateProyect: (slug: string, proyectData: Partial<CreateProyectInput>) => Promise<boolean>
  deleteProyect: (slug: string) => Promise<boolean>
  resetState: () => void
}

export const useProyectStore = create<ProyectStore>((set, get) => ({
  proyects: [],
  currentProyect: null,
  isLoading: false,
  error: null,

  fetchProyects: async () => {
    try {
      set({ isLoading: true, error: null })
      const response = await fetch(API_ENDPOINTS.PROYECTS_INDEX)
      
      if (!response.ok) {
        throw new Error('Error al cargar los proyectos')
      }
      
      const data = await response.json()
      set({ proyects: data, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido', 
        isLoading: false 
      })
    }
  },

  fetchProyectBySlug: async (slug: string) => {
    try {
      set({ isLoading: true, error: null })
      const response = await fetch(API_ENDPOINTS.PROYECT_SHOW(slug))
      
      if (!response.ok) {
        throw new Error('Error al cargar el proyecto')
      }
      
      const data = await response.json()
      set({ currentProyect: data, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido', 
        isLoading: false 
      })
    }
  },

  createProyect: async (proyectData: CreateProyectInput) => {
    try {
      set({ isLoading: true, error: null })
      const response = await fetch(API_ENDPOINTS.PROYECTS_CREATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(proyectData),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear el proyecto')
      }
      
      const newProyect = await response.json()
      
      set((state) => ({
        proyects: [...state.proyects, newProyect],
        isLoading: false
      }))
      
      return true
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido', 
        isLoading: false 
      })
      return false
    }
  },

  updateProyect: async (slug: string, proyectData: Partial<CreateProyectInput>) => {
    try {
      set({ isLoading: true, error: null })
      const response = await fetch(API_ENDPOINTS.PROYECT_UPDATE(slug), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(proyectData),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al actualizar el proyecto')
      }
      
      const updatedProyect = await response.json()
      
      set((state) => ({
        proyects: state.proyects.map(proyect => 
          proyect.slug === slug ? updatedProyect : proyect
        ),
        currentProyect: updatedProyect,
        isLoading: false
      }))
      
      return true
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido', 
        isLoading: false 
      })
      return false
    }
  },

  deleteProyect: async (slug: string) => {
    try {
      set({ isLoading: true, error: null })
      const response = await fetch(API_ENDPOINTS.PROYECT_DELETE(slug), {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al eliminar el proyecto')
      }
      
      set((state) => ({
        proyects: state.proyects.filter(proyect => proyect.slug !== slug),
        isLoading: false
      }))
      
      return true
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido', 
        isLoading: false 
      })
      return false
    }
  },

  resetState: () => {
    set({
      currentProyect: null,
      error: null
    })
  }
}))