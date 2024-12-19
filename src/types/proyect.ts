export interface Proyect {
  id: number
  slug: string
  title: string
  openingLine: string | null
  description: string
  promotorId: number
  openingPhase: string | null
  phase: string
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
  projectMedia: any[]
  proyectDetails: ProyectDetails
  proyectFound: ProyectFound
  promotor: Promotor
}

interface Address {
  id: number
  propertyId: number | null
  proyectId: number
  countryId: number
  stateId: number
  city: string
  postalCode: string
  streetName: string
  description: string | null
  createdAt: string
  updatedAt: string
  state: State
  country: Country
  positions: Position[]
}

interface State {
  id: number
  countryId: number
  name: string
  status: boolean
  createdAt: string
  updatedAt: string
}

interface Country {
  id: number
  name: string
  prefix: string
  code: string
  status: boolean
  createdAt: string
  updatedAt: string
}

interface Position {
  id: number
  addressId: number
  longitude: string
  latitude: string
}

interface ProyectDetails {
  id: number
  proyectId: number
  type: string
  investmentPeriod: number
  surface: number | null
  rooms: number | null
  floors: number | null
  features: any | null
  buildingYear: number
  riskScore: number | null
  profitabilityScore: number | null
}

interface ProyectFound {
  id: number
  proyectId: number
  startInvestDate: string
  endInvestDate: string
  startPreFundingDate: string | null
  endPreFundingDate: string | null
  companyCapital: string
  quantityFunded: string
  quantityToFund: string
  maxOverfunding: string
  investors: any | null
  fields: any | null
  rentProfitability: string
  totalNetProfitability: string
  totalNetProfitabilityToShow: string
  apreciationProfitability: string
}

interface Promotor {
  id: number
  name: string
  email: string
  emailVerified: string
  password: string | null
  image: string | null
  role: string
  status: boolean
  created_at: string
  updated_at: string
}
