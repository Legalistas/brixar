export interface ProjectUnit {
  id: number
  projectId: number
  sku: string
  surface: number
  priceUsd: number
  floor?: number
  rooms?: number
  bathrooms?: number
  parking: boolean
  status?: string
  type?: string
  description?: string
  features?: any
  unitNumber?: string
  availabilityDate?: string
  isPublished: boolean
  createdAt: string
}
