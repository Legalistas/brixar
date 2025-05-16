'use client'

import { Sale } from '@/store/saleStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/utils/format' // Asumimos que existe esta función
import { UserRound, Home, CalendarCheck, Landmark, Users } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface SaleSummaryProps {
  sale: Sale
}

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

export function SaleSummary({ sale }: SaleSummaryProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No especificada'
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: es })
  }
  
  // Calcular totales
  const legalExpensesTotal = 
    (sale.legalExpenses || 0) + 
    (sale.transferTaxes || 0) + 
    (sale.notaryFees || 0) + 
    (sale.registrationFees || 0)
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Resumen de la Venta</CardTitle>
            <CardDescription>
              ID de venta: {sale.id} • Creada: {formatDate(sale.createdAt)}
            </CardDescription>
          </div>
          <Badge
            variant="secondary"
            className={`${statusColors[sale.status]} text-white`}
          >
            {statusLabels[sale.status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Propiedad y Partes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center">
                <Home className="h-5 w-5 mr-2 text-primary" />
                <h3 className="font-medium">Propiedad</h3>
              </div>
              <div className="pl-7 space-y-1">
                <p className="text-lg font-semibold">{sale.property.title}</p>
                <p className="text-sm text-muted-foreground">ID: {sale.property.id}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" />
                <h3 className="font-medium">Partes</h3>
              </div>
              <div className="pl-7 space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Comprador:</span>
                  <span className="text-sm font-medium">{sale.buyer.name || sale.buyer.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Vendedor:</span>
                  <span className="text-sm font-medium">{sale.seller?.name || 'No asignado'}</span>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Fechas y Detalles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center">
                <CalendarCheck className="h-5 w-5 mr-2 text-primary" />
                <h3 className="font-medium">Detalles Temporales</h3>
              </div>
              <div className="pl-7 space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Fecha de venta:</span>
                  <span className="text-sm font-medium">{formatDate(sale.saleDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Última actualización:</span>
                  <span className="text-sm font-medium">{formatDate(sale.updatedAt)}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <Landmark className="h-5 w-5 mr-2 text-primary" />
                <h3 className="font-medium">Detalles Legales</h3>
              </div>
              <div className="pl-7 space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">N° de contrato:</span>
                  <span className="text-sm font-medium">{sale.contractNumber || 'No especificado'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Lugar de firma:</span>
                  <span className="text-sm font-medium">{sale.signingPlace || 'No especificado'}</span>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Resumen Financiero */}
          <div>
            <h3 className="font-medium mb-3">Resumen Financiero</h3>
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Precio de venta</span>
                  <span className="font-medium">{formatCurrency(sale.price)}</span>
                </div>
                
                {legalExpensesTotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Gastos legales</span>
                    <span>{formatCurrency(legalExpensesTotal)}</span>
                  </div>
                )}
                
                <Separator className="my-2" />
                
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(sale.totalAmount || sale.price)}</span>
                </div>
                
                {(sale.downPayment || 0) > 0 && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span>Pago inicial</span>
                      <span>- {formatCurrency(sale.downPayment || 0)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm mt-2">
                      <span>Monto financiado</span>
                      <span>{formatCurrency(sale.financedAmount || 0)}</span>
                    </div>
                    
                    {(sale.financingTermMonths || 0) > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Plazo de financiamiento</span>
                        <span>{sale.financingTermMonths} meses</span>
                      </div>
                    )}
                    
                    {(sale.interestRate || 0) > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Tasa de interés</span>
                        <span>{sale.interestRate}%</span>
                      </div>
                    )}
                    
                    {(sale.monthlyPayment || 0) > 0 && (
                      <div className="flex justify-between text-sm font-medium">
                        <span>Cuota mensual</span>
                        <span>{formatCurrency(sale.monthlyPayment || 0)}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
