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
  phase: ProjectPhase
  businessModel: string
  fundedDate: string | null
  details: any | null
  timeline: any | null
  daysToEnd: number | null
  priority: number | null
  daysToStart: number | null
  createdAt: string
  updatedAt: string
  address: Array<{
    city: string
    streetName: string
    state: {
      name: string
    }
    country: {
      name: string
    }
    positions: Array<{
      latitude: string
      longitude: string
    }>
  }>
  projectMedia: Array<{
    id: number
    url: string
  }>
  proyectDetails: {
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
  promotor: {
    id: number
    name: string
    email: string
    emailVerified: string
    image: string | null
    role: string
    status: boolean
  }
}
