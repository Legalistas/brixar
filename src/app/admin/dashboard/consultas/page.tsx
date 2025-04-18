'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Loader2 } from 'lucide-react'
import { API_ENDPOINTS } from '@/constants/api-endpoint'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const statusColors = {
  OPEN: 'bg-blue-500 hover:bg-blue-600',
  IN_PROGRESS: 'bg-yellow-500 hover:bg-yellow-600',
  CLOSED: 'bg-gray-500 hover:bg-gray-600',
  RESOLVED: 'bg-green-500 hover:bg-green-600'
}

const statusLabels = {
  OPEN: 'Abierta',
  IN_PROGRESS: 'En progreso',
  CLOSED: 'Cerrada',
  RESOLVED: 'Resuelta'
}

interface Inquiry {
  id: number
  title: string
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED' | 'RESOLVED'
  createdAt: string
  updatedAt: string
  property: {
    id: number
    title: string
    images: { url: string }[]
  }
  user: {
    id: string
    name: string
    email: string
  }
}

export default function AdminConsultasPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  
  useEffect(() => {
    fetchAllInquiries()
  }, [])
  
  const fetchAllInquiries = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(API_ENDPOINTS.INQUIRIES_INDEX)
      if (!response.ok) throw new Error('Error al cargar las consultas')
      const data = await response.json()
      setInquiries(data)
    } catch (error) {
      console.error('Error fetching inquiries:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredInquiries = inquiries.filter(inquiry => {
    // Filter by search term
    const matchesSearch = 
      inquiry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Filter by status
    const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Gestión de Consultas</h2>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar por título, propiedad o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-40">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="OPEN">Abierta</SelectItem>
              <SelectItem value="IN_PROGRESS">En progreso</SelectItem>
              <SelectItem value="RESOLVED">Resuelta</SelectItem>
              <SelectItem value="CLOSED">Cerrada</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={fetchAllInquiries}>
          Actualizar
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className="text-center p-6 bg-gray-50 rounded-md">
          <h3 className="text-lg font-medium">No se encontraron consultas</h3>
          <p className="text-gray-600 mt-1">
            {searchTerm || statusFilter !== 'all' 
              ? 'Prueba con otros filtros de búsqueda.' 
              : 'No hay consultas registradas en el sistema.'}
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Propiedad</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Última actualización</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInquiries.map((inquiry) => (
                <TableRow 
                  key={inquiry.id} 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => window.location.href = `/admin/dashboard/consultas/${inquiry.id}`}
                >
                  <TableCell className="font-medium">{inquiry.title}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary"
                      className={statusColors[inquiry.status] + " text-white"}
                    >
                      {statusLabels[inquiry.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>{inquiry.property.title}</TableCell>
                  <TableCell>{inquiry.user.name}</TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(inquiry.updatedAt), { locale: es, addSuffix: true })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
