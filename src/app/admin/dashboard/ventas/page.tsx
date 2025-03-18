'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Plus, Search } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader,
  TableRow 
} from '@/components/ui/table'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { API_ENDPOINTS } from '@/constants/api-endpoint'
import Image from 'next/image'
import { toast } from 'sonner'

interface Sale {
  id: number
  propertyId: number
  buyerId: number
  sellerId: number
  price: number
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED'
  paymentMethod?: string
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
  }
  seller?: {
    id: number
    name: string
    email: string
  }
  inquiry?: {
    id: number
    title: string
  }
}

const statusColors = {
  PENDING: 'bg-yellow-500 hover:bg-yellow-600',
  PROCESSING: 'bg-blue-500 hover:bg-blue-600',
  COMPLETED: 'bg-green-500 hover:bg-green-600',
  CANCELLED: 'bg-gray-500 hover:bg-gray-600'
}

const statusLabels = {
  PENDING: 'Pendiente',
  PROCESSING: 'En proceso',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada'
}

export default function AdminSalesPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [filteredSales, setFilteredSales] = useState<Sale[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  
  useEffect(() => {
    fetchSales()
  }, [])
  
  useEffect(() => {
    if (searchTerm) {
      const results = sales.filter(sale => 
        sale.property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.buyer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sale.seller?.name && sale.seller.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        sale.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.id.toString().includes(searchTerm)
      )
      setFilteredSales(results)
    } else {
      setFilteredSales(sales)
    }
  }, [searchTerm, sales])

  const fetchSales = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(API_ENDPOINTS.SALES_INDEX)
      
      if (!response.ok) {
        throw new Error('Error al cargar las ventas')
      }
      
      const data = await response.json()
      setSales(data)
      setFilteredSales(data)
    } catch (error) {
      console.error('Error fetching sales:', error)
      toast.error('Error al cargar las ventas')
    } finally {
      setIsLoading(false)
    }
  }

  const getPropertyImage = (sale: Sale) => {
    if (sale.property.images && sale.property.images.length > 0) {
      return '/uploads' + sale.property.images[0].url
    }
    return '/placeholder-property.jpg'
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Ventas</h1>
        <Link href="/admin/dashboard/ventas/nueva">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Venta
          </Button>
        </Link>
      </div>
      
      <div className="mb-6 flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar ventas..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex-1 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Propiedad</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Método de Pago</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.length > 0 ? (
                filteredSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>{sale.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded">
                          <Image
                            src={getPropertyImage(sale)}
                            alt={sale.property.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="truncate max-w-[200px]">
                          <Link 
                            href={`/propiedades/${sale.property.slug}`}
                            className="text-blue-600 hover:underline truncate block"
                          >
                            {sale.property.title}
                          </Link>
                          {sale.inquiry && (
                            <span className="text-xs text-gray-500">
                              Consulta #{sale.inquiry.id}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="truncate max-w-[150px]">
                        <span className="font-medium">{sale.buyer.name}</span>
                        <br />
                        <span className="text-xs text-gray-500">{sale.buyer.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">${sale.price.toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary"
                        className={`${statusColors[sale.status]} text-white`}
                      >
                        {statusLabels[sale.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {sale.paymentMethod || '-'}
                    </TableCell>
                    <TableCell>
                      {format(new Date(sale.createdAt), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/dashboard/ventas/${sale.id}`}>
                        <Button size="sm" variant="outline">Ver</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-gray-500">
                    {searchTerm ? 'No se encontraron ventas con esa búsqueda' : 'No hay ventas registradas'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
