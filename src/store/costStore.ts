import { create } from 'zustand'
import { API_ENDPOINTS } from '@/constants/api-endpoint'

// Interfaz para el usuario
interface Usuario {
  id: number
  name: string | null
  email: string
}

// Interfaz para el proyecto asociado al costo
interface ProyectoCosto {
  id: number
  title: string
  slug: string
}

// Interfaz para un costo de proyecto
export interface ProyectCost {
  id: number
  proyectId: number
  fecha: string
  mes: string
  rubro: string
  proveedor: string
  detalle?: string | null
  importePesos: number
  precioDolarBlue: number
  importeDolar: number
  usuarioId: number
  createdAt: string
  updatedAt: string
  proyect?: ProyectoCosto
  usuario?: Usuario
}

// Interfaz para la respuesta de costos por proyecto
interface CostsByProyectResponse {
  costs: ProyectCost[]
  proyecto: {
    id: number
    title: string
    slug: string
  }
  metrics: {
    totalPesos: number
    totalDolares: number
    costosPorRubro: Record<string, number>
    costosPorMes: Record<string, number>
  }
}

// Interfaz para crear un nuevo costo
export interface CreateProyectCostInput {
  proyectId: number
  fecha: string
  mes: string
  rubro: string
  proveedor: string
  detalle?: string
  importePesos: number
  precioDolarBlue: number
  importeDolar: number
}

// Interfaz para la tienda de costos
interface CostStore {
  costs: ProyectCost[]
  currentCost: ProyectCost | null
  projectCosts: ProyectCost[] // Costos específicos de un proyecto
  metrics: {
    totalPesos: number
    totalDolares: number
    costosPorRubro: Record<string, number>
    costosPorMes: Record<string, number>
  } | null
  isLoading: boolean
  error: string | null
  
  // Métodos para gestionar costos
  fetchCosts: () => Promise<void>
  fetchCostById: (id: number) => Promise<void>
  fetchCostsByProyectId: (proyectId: number) => Promise<void>
  fetchCostsByProyectSlug: (slug: string) => Promise<void>
  createCost: (costData: CreateProyectCostInput) => Promise<boolean>
  updateCost: (id: number, costData: Partial<CreateProyectCostInput>) => Promise<boolean>
  deleteCost: (id: number) => Promise<boolean>
  resetState: () => void
}

export const useCostStore = create<CostStore>((set, get) => ({
  costs: [],
  currentCost: null,
  projectCosts: [],
  metrics: null,
  isLoading: false,
  error: null,

  fetchCosts: async () => {
    try {
      set({ isLoading: true, error: null })
      const response = await fetch(API_ENDPOINTS.COSTS_INDEX)
      
      if (!response.ok) {
        throw new Error('Error al cargar los costos')
      }
      
      const data = await response.json()
      set({ costs: data, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido', 
        isLoading: false 
      })
    }
  },

  fetchCostById: async (id: number) => {
    try {
      set({ isLoading: true, error: null })
      const response = await fetch(API_ENDPOINTS.COST_BY_ID(id))
      
      if (!response.ok) {
        throw new Error('Error al cargar el costo')
      }
      
      const data = await response.json()
      set({ currentCost: data, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido', 
        isLoading: false 
      })
    }
  },

  fetchCostsByProyectId: async (proyectId: number) => {
    try {
      set({ isLoading: true, error: null })
      const response = await fetch(API_ENDPOINTS.COSTS_BY_PROJECT_ID(proyectId))
      
      if (!response.ok) {
        throw new Error('Error al cargar los costos del proyecto')
      }
      
      const data = await response.json()
      set({ projectCosts: data, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido', 
        isLoading: false 
      })
    }
  },

  fetchCostsByProyectSlug: async (slug: string) => {
    try {
      set({ isLoading: true, error: null })
      const response = await fetch(API_ENDPOINTS.COSTS_BY_PROJECT_SLUG(slug))
      
      if (!response.ok) {
        throw new Error('Error al cargar los costos del proyecto')
      }
      
      const data: CostsByProyectResponse = await response.json()
      set({ 
        projectCosts: data.costs, 
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

  createCost: async (costData: CreateProyectCostInput) => {
    try {
      set({ isLoading: true, error: null })
      const response = await fetch(API_ENDPOINTS.COSTS_CREATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(costData),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear el costo')
      }
      
      const newCost = await response.json()
      
      set((state) => ({
        costs: [...state.costs, newCost],
        projectCosts: state.projectCosts.length > 0 && newCost.proyectId === state.projectCosts[0]?.proyectId
          ? [...state.projectCosts, newCost]
          : state.projectCosts,
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

  updateCost: async (id: number, costData: Partial<CreateProyectCostInput>) => {
    try {
      set({ isLoading: true, error: null })
      const response = await fetch(API_ENDPOINTS.COST_UPDATE(id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(costData),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al actualizar el costo')
      }
      
      const updatedCost = await response.json()
      
      set((state) => ({
        costs: state.costs.map(cost => 
          cost.id === id ? updatedCost : cost
        ),
        projectCosts: state.projectCosts.map(cost => 
          cost.id === id ? updatedCost : cost
        ),
        currentCost: state.currentCost?.id === id ? updatedCost : state.currentCost,
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

  deleteCost: async (id: number) => {
    try {
      set({ isLoading: true, error: null })
      const response = await fetch(API_ENDPOINTS.COST_DELETE(id), {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al eliminar el costo')
      }
      
      set((state) => ({
        costs: state.costs.filter(cost => cost.id !== id),
        projectCosts: state.projectCosts.filter(cost => cost.id !== id),
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
      currentCost: null,
      projectCosts: [],
      metrics: null,
      error: null
    })
  }
}))