'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSaleStore } from '@/store/saleStore'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { SaleDetailForm } from '@/components/sales/SaleDetailForm'
import { SaleDocuments } from '@/components/sales/SaleDocuments'
import { SaleSummary } from '@/components/sales/SaleSummary'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function SaleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const saleId = Number(params.id)
  
  const { currentSale, isLoading, error, fetchSaleById, updateSaleDetails, resetState } = useSaleStore()
  const [activeTab, setActiveTab] = useState('summary')
  
  useEffect(() => {
    fetchSaleById(saleId)
    
    // Cleanup al desmontar el componente
    return () => {
      resetState()
    }
  }, [saleId, fetchSaleById, resetState])
  
  const handleSaveDetails = async (data: any) => {
    await updateSaleDetails(saleId, data)
    fetchSaleById(saleId) // Recargar los datos
  }
  
  const handleUpdateDocuments = async (documents: any) => {
    await updateSaleDetails(saleId, { documents })
    fetchSaleById(saleId) // Recargar los datos
  }
  
  if (isLoading && !currentSale) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button asChild>
          <Link href="/admin/dashboard/ventas">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a ventas
          </Link>
        </Button>
      </div>
    )
  }
  
  if (!currentSale) {
    return (
      <div className="container mx-auto p-6">
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Venta no encontrada</AlertTitle>
          <AlertDescription>La venta solicitada no existe o no tienes permisos para verla.</AlertDescription>
        </Alert>
        <Button asChild>
          <Link href="/admin/dashboard/ventas">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a ventas
          </Link>
        </Button>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/dashboard/ventas">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Detalle de Venta #{currentSale.id}</h1>
            <p className="text-muted-foreground">
              {currentSale.property.title} • {format(new Date(currentSale.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: es })}
            </p>
          </div>
        </div>
      </div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="summary">Resumen</TabsTrigger>
          <TabsTrigger value="details">Detalles</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-6">
          <SaleSummary sale={currentSale} />
          
          {currentSale.transactions && currentSale.transactions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Historial de Pagos</CardTitle>
                <CardDescription>
                  Registro de transacciones relacionadas con esta venta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentSale.transactions.map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{transaction.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(transaction.createdAt), "dd/MM/yyyy HH:mm")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${transaction.amount.toLocaleString('es-ES')}</p>
                        <p className="text-xs text-muted-foreground">{transaction.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="details">
          <SaleDetailForm 
            sale={currentSale} 
            onSave={handleSaveDetails}
            isLoading={isLoading}
          />
        </TabsContent>
        
        <TabsContent value="documents">
          <SaleDocuments 
            sale={currentSale} 
            onUpdate={handleUpdateDocuments}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
