export interface Sale {
  receipts: string
  date: string
  total: string
  customer: {
    name: string
    email: string
    phone?: string
    profiles: Array<{
      address?: string
      country?: { name: string }
      state?: { name: string }
      city?: { name: string }
      document: string | null
      documentNumber?: string
    }>
  }
  saleDetail: Array<{
    product?: {
      sku?: string
      name?: string
    }
    qty?: number
    price: number
    total: number
  }>
}

export interface PDFData {
  sales: Sale[]
  x: number
  y: number
  w: number
  h: number
  r: number
}
