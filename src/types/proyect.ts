import { ProyectPhase } from "@prisma/client"

export type ProjectPhase = 'CONSTRUCTION' | 'COMPLETED' | 'PLANNING'
export type ProjectType = 'APARTMENT' | 'HOUSE'

export interface Proyect {
  id: number
  slug: string
  title: string
  openingLine: string | null
  description: string
  promotorId: number
  openingPhase: string | null
  phase: ProyectPhase
  businessModel: string
  fundedDate: string | null
  details: any | null
  timeline: any | null
  daysToEnd: number | null
  priority: number | null
  daysToStart: number | null
  createdAt: string
  updatedAt: string
  address: Address[]
  projectMedia: ProjectMedia[]
  proyectDetails: ProyectDetails
  promotor: Promotor
}

export interface Promotor {
  id: number
  name: string
  email: string
  emailVerified: string
  image: string | null
  role: string
  status: boolean
}

interface ProyectDetails {
  id: number
  proyectId: number
  type: ProjectType
  investmentPeriod: number
  surface: number | null
  rooms: number | null
  floors: number | null
  features: any | null
  buildingYear: number
  riskScore: number | null
  profitabilityScore: number | null
}

export interface ProjectMedia {
  id: number
  url: string
}

interface Address {
  city: string
  streetName: string
  state: {
    name: string
  }
  country: {
    name: string
  }
  positions: Position[]
}

interface Position {
  latitude: string
  longitude: string
}