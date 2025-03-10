import { create } from 'zustand'
import { API_ENDPOINTS } from '@/constants/api-endpoint'

interface InquiryMessage {
  id: number
  message: string
  isAdmin: boolean
  createdAt: string
  user: {
    id: number
    name: string
    email: string
    image: string | null
  }
}

interface Inquiry {
  id: number
  title: string
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED' | 'RESOLVED'
  offeredPrice: number | null
  negotiatedPrice: number | null
  createdAt: string
  updatedAt: string
  property: {
    id: number
    slug: string
    title: string
    images?: { url: string }[]
  }
  user?: {
    id: number
    name: string
    email: string
  }
  messages?: InquiryMessage[]
}

interface InquiryStore {
  inquiries: Inquiry[]
  isLoading: boolean
  error: string | null
  currentInquiry: Inquiry | null
  messages: InquiryMessage[]
  
  // Métodos para gestionar consultas
  fetchUserInquiries: () => Promise<void>
  fetchInquiryById: (inquiryId: number) => Promise<void>
  createInquiry: (data: {
    propertyId: number
    title: string
    message?: string
    offeredPrice?: number
  }) => Promise<Inquiry | null>
  updateInquiry: (inquiryId: number, data: {
    status?: 'OPEN' | 'IN_PROGRESS' | 'CLOSED' | 'RESOLVED'
    offeredPrice?: number
    negotiatedPrice?: number
  }) => Promise<void>
  
  // Métodos para mensajes
  fetchInquiryMessages: (inquiryId: number) => Promise<void>
  sendMessage: (inquiryId: number, message: string) => Promise<InquiryMessage | null>
  resetState: () => void
}

export const useInquiryStore = create<InquiryStore>((set, get) => ({
  inquiries: [],
  isLoading: false,
  error: null,
  currentInquiry: null,
  messages: [],
  
  // Obtener todas las consultas del usuario
  fetchUserInquiries: async () => {
    try {
      set({ isLoading: true, error: null })
      const response = await fetch(API_ENDPOINTS.USER_INQUIRIES)
      
      if (!response.ok) {
        throw new Error('Error al cargar las consultas')
      }
      
      const data = await response.json()
      set({ inquiries: data, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido', 
        isLoading: false 
      })
    }
  },
  
  // Obtener una consulta por ID
  fetchInquiryById: async (inquiryId: number) => {
    try {
      set({ isLoading: true, error: null })
      const response = await fetch(API_ENDPOINTS.INQUIRY_BY_ID(inquiryId))
      
      if (!response.ok) {
        throw new Error('Error al cargar la consulta')
      }
      
      const data = await response.json()
      set({ 
        currentInquiry: data,
        messages: data.messages || [],
        isLoading: false 
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido', 
        isLoading: false 
      })
    }
  },
  
  // Crear una nueva consulta
  createInquiry: async (data) => {
    try {
      set({ isLoading: true, error: null })
      const response = await fetch(API_ENDPOINTS.INQUIRY_CREATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Error al crear la consulta')
      }
      
      const newInquiry = await response.json()
      set((state) => ({ 
        inquiries: [newInquiry, ...state.inquiries],
        isLoading: false 
      }))
      
      return newInquiry
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido', 
        isLoading: false 
      })
      return null
    }
  },
  
  // Actualizar una consulta
  updateInquiry: async (inquiryId, data) => {
    try {
      set({ isLoading: true, error: null })
      const response = await fetch(API_ENDPOINTS.INQUIRY_UPDATE(inquiryId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Error al actualizar la consulta')
      }
      
      const updatedInquiry = await response.json()
      
      set((state) => ({
        inquiries: state.inquiries.map(inquiry => 
          inquiry.id === inquiryId ? updatedInquiry : inquiry
        ),
        currentInquiry: updatedInquiry,
        isLoading: false
      }))
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido', 
        isLoading: false 
      })
    }
  },
  
  // Obtener mensajes de una consulta
  fetchInquiryMessages: async (inquiryId: number) => {
    try {
      set({ isLoading: true, error: null })
      const response = await fetch(API_ENDPOINTS.INQUIRY_MESSAGES(inquiryId))
      
      if (!response.ok) {
        throw new Error('Error al cargar los mensajes')
      }
      
      const data = await response.json()
      set({ messages: data, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido', 
        isLoading: false 
      })
    }
  },
  
  // Enviar un nuevo mensaje
  sendMessage: async (inquiryId: number, message: string) => {
    try {
      set({ isLoading: true, error: null })
      const response = await fetch(API_ENDPOINTS.INQUIRY_MESSAGE_CREATE(inquiryId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      })
      
      if (!response.ok) {
        throw new Error('Error al enviar el mensaje')
      }
      
      const newMessage = await response.json()
      
      set((state) => ({
        messages: [...state.messages, newMessage],
        isLoading: false
      }))
      
      return newMessage
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido', 
        isLoading: false 
      })
      return null
    }
  },
  
  // Resetear el estado
  resetState: () => {
    set({
      currentInquiry: null,
      messages: [],
      error: null
    })
  }
}))
