import { create } from 'zustand'
import { API_ENDPOINTS } from '@/constants/api-endpoint'

export interface SaleTransaction {
  id: number
  saleId: number
  amount: number
  type: string
  status: string
  paymentMethod?: string
  reference?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Sale {
  id: number
  propertyId: number
  buyerId: number
  sellerId?: number
  inquiryId?: number  // ID de la consulta que originó esta venta, si existe
  price: number
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED'
  paymentMethod?: string
  paymentReference?: string
  documents?: any
  notes?: string
  createdAt: string
  updatedAt: string
  property: {
    id: number
    slug: string
    title: string
    images?: { url: string }[]
  }
  buyer: {
    id: number
    name: string
    email: string
    image?: string
  }
  seller?: {
    id: number
    name: string
    email: string
    image?: string
  }
  transactions?: SaleTransaction[]
}

interface SaleStore {
  sales: Sale[]
  currentSale: Sale | null
  isLoading: boolean
  error: string | null
  
  // Métodos para gestionar ventas
  fetchUserSales: () => Promise<void>
  fetchAllSales: () => Promise<void>
  fetchSaleById: (saleId: number) => Promise<void>
  updateSaleStatus: (saleId: number, status: string) => Promise<void>
  addSaleTransaction: (saleId: number, transactionData: Partial<SaleTransaction>) => Promise<void>
  updateSaleNotes: (saleId: number, notes: string) => Promise<void>
  resetState: () => void
}

export const useSaleStore = create<SaleStore>((set, get) => ({
  sales: [],
  currentSale: null,
  isLoading: false,
  error: null,

  fetchUserSales: async () => {
    try {
      set({ isLoading: true, error: null })
      const response = await fetch(API_ENDPOINTS.USER_SALES)
      
      if (!response.ok) {
        throw new Error('Error al cargar las ventas del usuario')
      }
      
      const data = await response.json()
      set({ sales: data, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido', 
        isLoading: false 
      })
    }
  },

  fetchAllSales: async () => {
    try {
      set({ isLoading: true, error: null })
      const response = await fetch(API_ENDPOINTS.ADMIN_SALES)
      
      if (!response.ok) {
        throw new Error('Error al cargar todas las ventas')
      }
      
      const data = await response.json()
      set({ sales: data, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido', 
        isLoading: false 
      })
    }
  },

  fetchSaleById: async (saleId: number) => {
    try {
      set({ isLoading: true, error: null })
      const response = await fetch(API_ENDPOINTS.SALE_BY_ID(saleId))
      
      if (!response.ok) {
        throw new Error('Error al cargar la venta')
      }
      
      const data = await response.json()
      set({ currentSale: data, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido', 
        isLoading: false 
      })
    }
  },

  updateSaleStatus: async (saleId: number, status: string) => {
    try {
      set({ isLoading: true, error: null })
      const response = await fetch(API_ENDPOINTS.SALE_UPDATE_STATUS(saleId), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })
      
      if (!response.ok) {
        throw new Error('Error al actualizar el estado de la venta')
      }
      
      const updatedSale = await response.json()
      
      set((state) => ({
        sales: state.sales.map(sale => 
          sale.id === saleId ? updatedSale : sale
        ),
        currentSale: state.currentSale?.id === saleId ? updatedSale : state.currentSale,
        isLoading: false
      }))
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido', 
        isLoading: false 
      })
    }
  },

  addSaleTransaction: async (saleId: number, transactionData: Partial<SaleTransaction>) => {
    try {
      set({ isLoading: true, error: null })
      const response = await fetch(API_ENDPOINTS.SALE_ADD_TRANSACTION(saleId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      })
      
      if (!response.ok) {
        throw new Error('Error al agregar la transacción')
      }
      
      const updatedSale = await response.json()
      
      set((state) => ({
        currentSale: updatedSale,
        isLoading: false
      }))
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido', 
        isLoading: false 
      })
    }
  },

  updateSaleNotes: async (saleId: number, notes: string) => {
    try {
      set({ isLoading: true, error: null })
      const response = await fetch(API_ENDPOINTS.SALE_UPDATE(saleId), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes }),
      })
      
      if (!response.ok) {
        throw new Error('Error al actualizar las notas de la venta')
      }
      
      const updatedSale = await response.json()
      
      set((state) => ({
        sales: state.sales.map(sale => 
          sale.id === saleId ? updatedSale : sale
        ),
        currentSale: updatedSale,
        isLoading: false
      }))
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido', 
        isLoading: false 
      })
    }
  },

  resetState: () => {
    set({
      currentSale: null,
      error: null
    })
  }
}))
