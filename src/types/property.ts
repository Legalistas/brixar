interface PropertyImage {
  id: number
  url: string
  propertyId: number
}

export interface Property {
  id: number
  slug: string
  title: string
  description: string
  price: string
  bedrooms: number
  bathrooms: number
  squareMeters: number
  propertyType: string
  listingType: string
  isAvailable: boolean
  yearBuilt: number
  parkingSpaces: number
  amenities: {
    [key: string]: boolean
  }
  status: string
  images: PropertyImage[]
  address: Address[]
}

export interface Address {
  id: number
  propertyId: number
  proyectId: null | number
  countryId: number
  stateId: number
  city: string
  postalCode: string
  streetName: string
  description: null | string
  createdAt: string
  updatedAt: string
  state: State
  country: Country
  positions: Position[]
}

export interface State {
  id: number
  countryId: number
  name: string
  status: boolean
  createdAt: string
  updatedAt: string
}

export interface Country {
  id: number
  name: string
  prefix: string
  code: string
  status: boolean
  createdAt: string
  updatedAt: string
}

export interface Position {
  id: number
  addressId: number
  longitude: string
  latitude: string
}

export enum PropertyType {
  HOUSE = 'CASA',
  APARTMENT = 'APARTAMENTO',
  LAND = 'TERRENO',
  OFFICE = 'OFICINA',
  COMMERCIAL = 'LOCAL_COMERCIAL',
  WAREHOUSE = 'BODEGA',
  FARM = 'FINCA',
  CHALET = 'CHALET',
}

export enum ListingType {
  SALE = 'VENTA',
  RENT = 'ALQUILER',
  TEMPORARY_RENT = 'ALQUILER_TEMPORAL',
  EXCHANGE = 'PERMUTA',
  // Otros tipos de anuncios pueden ser añadidos aquí
}
