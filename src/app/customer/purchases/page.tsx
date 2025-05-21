'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { useSaleStore, Sale } from '@/store/saleStore'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ExternalLink,
  Loader2,
  Search,
  DollarSign,
  Filter,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const statusColors = {
  PENDING: 'bg-yellow-500 hover:bg-yellow-600',
  PROCESSING: 'bg-blue-500 hover:bg-blue-600',
  COMPLETED: 'bg-green-500 hover:bg-green-600',
  CANCELLED: 'bg-gray-500 hover:bg-gray-600',
}

const statusLabels = {
  PENDING: 'Pendiente',
  PROCESSING: 'En proceso',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
}

export default function CustomerPurchasesPage() {
  const { sales, isLoading, error, fetchUserSales } = useSaleStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  useEffect(() => {
    fetchUserSales()
  }, [fetchUserSales])

  // Filtrar las compras según los criterios de búsqueda y filtro
  const filteredSales = sales.filter((sale) => {
    const matchesSearch =
      searchTerm === '' ||
      sale.property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${sale.id}`.includes(searchTerm)

    const matchesStatus = statusFilter === 'ALL' || sale.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Mis Compras</h1>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar por título o ID..."
              className="pl-8 w-full md:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                <SelectItem value="PENDING">Pendiente</SelectItem>
                <SelectItem value="PROCESSING">En proceso</SelectItem>
                <SelectItem value="COMPLETED">Completada</SelectItem>
                <SelectItem value="CANCELLED">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-10 border rounded-lg bg-red-50">
          <DollarSign className="h-12 w-12 mx-auto text-red-400" />
          <h3 className="mt-4 text-lg font-medium">
            Error al cargar las compras
          </h3>
          <p className="text-red-500 mt-2">
            {error}. Por favor, intenta de nuevo.
          </p>
          <Button 
            onClick={() => fetchUserSales()} 
            className="mt-4"
            variant="outline"
          >
            Reintentar
          </Button>
        </div>
      ) : (
        <>
          {filteredSales.length === 0 ? (
            <div className="text-center py-10 border rounded-lg bg-gray-50">
              <DollarSign className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">
                No se encontraron compras
              </h3>
              <p className="text-gray-500 mt-2">
                No se encontraron compras que coincidan con los criterios de
                búsqueda.
              </p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Propiedad</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium">{sale.id}</TableCell>
                      <TableCell>{sale.property.title}</TableCell>
                      <TableCell>
                        ${sale.price.toLocaleString('es-ES')}
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
                        {format(new Date(sale.createdAt), 'dd/MM/yyyy HH:mm')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center space-x-2">
                          <Link href={`/customer/purchases/${sale.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 gap-1"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              Ver
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}
    </div>
  )
}
