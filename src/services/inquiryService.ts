import { API_ENDPOINTS } from '@/constants/api-endpoint'

// Servicio para gestionar consultas e inquiries
export const inquiryService = {
  // Aceptar la oferta como cliente
  acceptOfferAsClient: async (inquiryId: number) => {
    const response = await fetch(API_ENDPOINTS.INQUIRY_CLIENT_ACCEPT(inquiryId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.message || 'Error al aceptar la oferta como cliente')
    }
    
    return response.json()
  },
  
  // Aceptar la oferta como administrador
  acceptOfferAsAdmin: async (inquiryId: number) => {
    const response = await fetch(API_ENDPOINTS.INQUIRY_ADMIN_ACCEPT(inquiryId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.message || 'Error al aceptar la oferta como administrador')
    }
    
    return response.json()
  },
  
  // Completar la transacción
  completeTransaction: async (inquiryId: number) => {
    const response = await fetch(API_ENDPOINTS.INQUIRY_COMPLETE_TRANSACTION(inquiryId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.message || 'Error al completar la transacción')
    }
    
    return response.json()
  }
}
