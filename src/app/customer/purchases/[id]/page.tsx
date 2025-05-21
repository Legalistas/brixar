'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSaleStore } from '@/store/saleStore'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

// Componente para mostrar el resumen de la compra
function PurchaseSummary({ sale }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Información de la Propiedad</CardTitle>
                    <CardDescription>Detalles de la propiedad adquirida</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Propiedad:</span>
                            <span>{sale.property.title}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Precio:</span>
                            <span>${sale.price.toLocaleString('es-ES')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Estado:</span>
                            <span className="px-2 py-1 text-xs rounded-full bg-gray-100">{sale.status}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Detalles de la Compra</CardTitle>
                    <CardDescription>Información sobre la transacción</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-600">ID de Compra:</span>
                            <span>{sale.id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Fecha:</span>
                            <span>{format(new Date(sale.createdAt), 'dd/MM/yyyy HH:mm')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Método de Pago:</span>
                            <span>{sale.paymentMethod || 'No especificado'}</span>
                        </div>
                        {sale.paymentReference && (
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600">Referencia de Pago:</span>
                                <span>{sale.paymentReference}</span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

// Componente para la página completa
export default function PurchaseDetailPage() {
    const params = useParams()
    const router = useRouter()
    const saleId = Number(params.id)

    const { currentSale, isLoading, error, fetchSaleById, resetState } = useSaleStore()
    const [activeTab, setActiveTab] = useState('summary')

    useEffect(() => {
        fetchSaleById(saleId)

        // Cleanup al desmontar el componente
        return () => {
            resetState()
        }
    }, [saleId, fetchSaleById, resetState])

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
                    <Link href="/customer/purchases">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver a mis compras
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
                    <AlertTitle>Compra no encontrada</AlertTitle>
                    <AlertDescription>No se pudo encontrar la información de esta compra</AlertDescription>
                </Alert>
                <Button asChild>
                    <Link href="/customer/purchases">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver a mis compras
                    </Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <Link
                        href="/customer/purchases"
                        className="text-gray-600 hover:text-gray-900 flex items-center mb-2"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver a mis compras
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Detalles de la Compra #{currentSale.id}
                    </h1>
                    <p className="text-gray-600">
                        {currentSale.property.title} • {format(new Date(currentSale.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: es })}
                    </p>
                </div>
            </div>

            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
            >
                <TabsList className="grid grid-cols-1 mb-8">
                    <TabsTrigger value="summary">Resumen</TabsTrigger>
                </TabsList>

                <TabsContent value="summary" className="space-y-6">
                    <PurchaseSummary sale={currentSale} />

                    {currentSale.transactions && currentSale.transactions.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Historial de Pagos</CardTitle>
                                <CardDescription>
                                    Registro de transacciones relacionadas con esta compra
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {currentSale.transactions.map((transaction) => (
                                        <div key={transaction.id} className="flex justify-between items-center p-3 border rounded-lg">
                                            <div>
                                                <p className="font-medium">{transaction.type}</p>
                                                <p className="text-sm text-gray-500">
                                                    {format(new Date(transaction.createdAt), "dd/MM/yyyy HH:mm")}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold">${transaction.amount.toLocaleString('es-ES')}</p>
                                                <p className="text-xs text-gray-500">{transaction.status}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {currentSale.documents && Object.keys(currentSale.documents).length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Documentos</CardTitle>
                                <CardDescription>
                                    Documentos relacionados con su compra
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(currentSale.documents).map(([key, value]) => (
                                        <div key={key} className="p-3 border rounded-lg">
                                            <p className="font-medium capitalize">{key.replace(/_/g, ' ')}</p>
                                            <a
                                                href={value as string}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 hover:underline text-sm flex items-center mt-1"
                                            >
                                                Ver documento
                                                <ExternalLink className="ml-1 h-3 w-3" />
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}
