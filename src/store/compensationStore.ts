import { create } from 'zustand'
import { API_ENDPOINTS } from '@/constants/api-endpoint'

// Interfaz para el usuario
interface Usuario {
  id: number
  name: string | null
  email: string
}

// Interfaz para el proyecto asociado a la compensación
interface ProyectoCompensacion {
  id: number
  title: string
  slug: string
}

// Interfaz para una compensación entre inversores
export interface ProyectCompensation {
  id: number
  proyectId: number
  fecha: string
  mes: string
  detalle?: string | null
  importePesos: number
  precioDolarBlue: number
  importeDolar: number
  inversorOrigen: string
  inversorDestino: string
  usuarioId: number
  createdAt: string
  updatedAt: string
  proyect?: ProyectoCompensacion
  usuario?: Usuario
}

// Interfaz para la respuesta de compensaciones por proyecto
interface CompensationsByProyectResponse {
  compensations: ProyectCompensation[]
  proyecto: {
    id: number
    title: string
    slug: string
  }
  metrics: {
    totalPesos: number
    totalDolares: number
    compensacionesPorMes: Record<string, number>
  }
}

// Interfaz para crear una nueva compensación
export interface CreateProyectCompensationInput {
  proyectId: number
  fecha: string
  mes: string
  detalle?: string
  importePesos: number
  precioDolarBlue: number
  importeDolar: number
  inversorOrigen: string
  inversorDestino: string
}

// Interfaz para la tienda de compensaciones
interface CompensationStore {
  compensations: ProyectCompensation[]
  currentCompensation: ProyectCompensation | null
  projectCompensations: ProyectCompensation[] // Compensaciones específicas de un proyecto
  metrics: {
    totalPesos: number
    totalDolares: number
    compensacionesPorMes: Record<string, number>
  } | null
  isLoading: boolean
  error: string | null
  
  // Métodos para gestionar compensaciones
  fetchCompensations: () => Promise<void>
  fetchCompensationById: (id: number) => Promise<void>
  fetchCompensationsByProyectId: (proyectId: number) => Promise<void>
  fetchCompensationsByProyectSlug: (slug: string) => Promise<void>
  createCompensation: (compensationData: CreateProyectCompensationInput) => Promise<boolean>
  updateCompensation: (id: number, compensationData: Partial<CreateProyectCompensationInput>) => Promise<boolean>
  deleteCompensation: (id: number) => Promise<boolean>
  resetState: () => void
}

export const useCompensationStore = create<CompensationStore>((set, get) => ({
  compensations: [],
  currentCompensation: null,
  projectCompensations: [],
  metrics: null,
  isLoading: false,
  error: null,

  fetchCompensations: async () => {
    try {
      set({ isLoading: true, error: null })
      const response = await fetch(API_ENDPOINTS.COMPENSATIONS_INDEX)
      
      if (!response.ok) {
        throw new Error('Error al cargar las compensaciones')
      }
      
      const data = await response.json()
      set({ compensations: data, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido', 
        isLoading: false 
      })
    }
  },

  fetchCompensationById: async (id: number) => {
    try {
      set({ isLoading: true, error: null })
      const response = await fetch(API_ENDPOINTS.COMPENSATION_BY_ID(id))
      
      if (!response.ok) {
        throw new Error('Error al cargar la compensación')
      }
      
      const data = await response.json()
      set({ currentCompensation: data, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido', 
        isLoading: false 
      })
    }
  },

  fetchCompensationsByProyectId: async (proyectId: number) => {
    try {
      set({ isLoading: true, error: null })
      const response = await fetch(API_ENDPOINTS.COMPENSATIONS_BY_PROJECT_ID(proyectId))
      
      if (!response.ok) {
        throw new Error('Error al cargar las compensaciones del proyecto')
      }
      
      const data = await response.json()
      set({ projectCompensations: data, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido', 
        isLoading: false 
      })
    }
  },

  fetchCompensationsByProyectSlug: async (slug: string) => {
    try {
      set({ isLoading: true, error: null })
      const response = await fetch(API_ENDPOINTS.COMPENSATIONS_BY_PROJECT_SLUG(slug))
      
      if (!response.ok) {
        throw new Error('Error al cargar las compensaciones del proyecto')
      }
      
      const data: CompensationsByProyectResponse = await response.json()
      set({ 
        projectCompensations: data.compensations, 
        metrics: data.metrics,
        isLoading: false 
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido', 
        isLoading: false 
      })
    }
  },

  createCompensation: async (compensationData: CreateProyectCompensationInput) => {
    try {
      set({ isLoading: true, error: null })
      const response = await fetch(API_ENDPOINTS.COMPENSATIONS_CREATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(compensationData),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear la compensación')
      }
      
      const newCompensation = await response.json()
      
      set((state) => ({
        compensations: [...state.compensations, newCompensation],
        projectCompensations: state.projectCompensations.length > 0 && newCompensation.proyectId === state.projectCompensations[0]?.proyectId
          ? [...state.projectCompensations, newCompensation]
          : state.projectCompensations,
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

  updateCompensation: async (id: number, compensationData: Partial<CreateProyectCompensationInput>) => {
    try {
      set({ isLoading: true, error: null })
      const response = await fetch(API_ENDPOINTS.COMPENSATION_UPDATE(id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(compensationData),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al actualizar la compensación')
      }
      
      const updatedCompensation = await response.json()
      
      set((state) => ({
        compensations: state.compensations.map(compensation => 
          compensation.id === id ? updatedCompensation : compensation
        ),
        projectCompensations: state.projectCompensations.map(compensation => 
          compensation.id === id ? updatedCompensation : compensation
        ),
        currentCompensation: state.currentCompensation?.id === id ? updatedCompensation : state.currentCompensation,
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

  deleteCompensation: async (id: number) => {
    try {
      set({ isLoading: true, error: null })
      const response = await fetch(API_ENDPOINTS.COMPENSATION_DELETE(id), {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al eliminar la compensación')
      }
      
      set((state) => ({
        compensations: state.compensations.filter(compensation => compensation.id !== id),
        projectCompensations: state.projectCompensations.filter(compensation => compensation.id !== id),
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
      currentCompensation: null,
      projectCompensations: [],
      metrics: null,
      error: null
    })
  }
}))
