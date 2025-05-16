'use client'

import { useState } from 'react'
import { Sale } from '@/store/saleStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon, Save } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast'

interface SaleDetailFormProps {
  sale: Sale
  onSave: (data: Partial<Sale>) => Promise<void>
  isLoading?: boolean
}

export function SaleDetailForm({ sale, onSave, isLoading = false }: SaleDetailFormProps) {
  const [formData, setFormData] = useState<Partial<Sale>>({
    // Datos del comprador
    buyerDocumentType: sale.buyerDocumentType || '',
    buyerDocumentNumber: sale.buyerDocumentNumber || '',
    buyerAddress: sale.buyerAddress || '',
    buyerPhone: sale.buyerPhone || '',
    
    // Datos de la venta
    saleDate: sale.saleDate || undefined,
    contractNumber: sale.contractNumber || '',
    signingPlace: sale.signingPlace || '',
    
    // Datos de pago
    price: sale.price,
    totalAmount: sale.totalAmount || sale.price,
    downPayment: sale.downPayment || 0,
    financedAmount: sale.financedAmount || 0,
    financingTermMonths: sale.financingTermMonths || 0,
    interestRate: sale.interestRate || 0,
    monthlyPayment: sale.monthlyPayment || 0,
    paymentMethod: sale.paymentMethod || '',
    paymentReference: sale.paymentReference || '',
    
    // Gastos legales
    legalExpenses: sale.legalExpenses || 0,
    transferTaxes: sale.transferTaxes || 0,
    notaryFees: sale.notaryFees || 0,
    registrationFees: sale.registrationFees || 0,
    
    notes: sale.notes || '',
  })

  const [date, setDate] = useState<Date | undefined>(
    sale.saleDate ? new Date(sale.saleDate) : undefined
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    
    // Convertir valores numéricos
    if (type === 'number') {
      setFormData((prev) => ({
        ...prev,
        [name]: value === '' ? '' : Number(value),
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleDateChange = (date: Date | undefined) => {
    setDate(date)
    if (date) {
      setFormData((prev) => ({
        ...prev,
        saleDate: date.toISOString(),
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await onSave(formData)
      toast({
        title: 'Datos guardados',
        description: 'Los detalles de la venta se han actualizado correctamente.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron guardar los cambios. Intente nuevamente.',
        variant: 'destructive',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="buyer" className="w-full">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="buyer">Datos del Comprador</TabsTrigger>
          <TabsTrigger value="sale">Datos de la Venta</TabsTrigger>
          <TabsTrigger value="payment">Datos de Pago</TabsTrigger>
          <TabsTrigger value="legal">Gastos Legales</TabsTrigger>
        </TabsList>
        
        {/* Tab: Datos del Comprador */}
        <TabsContent value="buyer">
          <Card>
            <CardHeader>
              <CardTitle>Información del Comprador</CardTitle>
              <CardDescription>
                Detalles adicionales del comprador para la documentación legal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="buyerDocumentType">Tipo de documento</Label>
                  <Input
                    id="buyerDocumentType"
                    name="buyerDocumentType"
                    value={formData.buyerDocumentType}
                    onChange={handleChange}
                    placeholder="DNI, Pasaporte, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buyerDocumentNumber">Número de documento</Label>
                  <Input
                    id="buyerDocumentNumber"
                    name="buyerDocumentNumber"
                    value={formData.buyerDocumentNumber}
                    onChange={handleChange}
                    placeholder="Número de documento"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="buyerAddress">Dirección</Label>
                <Input
                  id="buyerAddress"
                  name="buyerAddress"
                  value={formData.buyerAddress}
                  onChange={handleChange}
                  placeholder="Dirección completa"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buyerPhone">Teléfono</Label>
                <Input
                  id="buyerPhone"
                  name="buyerPhone"
                  value={formData.buyerPhone}
                  onChange={handleChange}
                  placeholder="Número de teléfono"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tab: Datos de la Venta */}
        <TabsContent value="sale">
          <Card>
            <CardHeader>
              <CardTitle>Detalles de la Venta</CardTitle>
              <CardDescription>
                Información relacionada con el contrato y la formalización de la venta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fecha de Venta</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contractNumber">Número de Contrato</Label>
                  <Input
                    id="contractNumber"
                    name="contractNumber"
                    value={formData.contractNumber}
                    onChange={handleChange}
                    placeholder="Número de contrato o escritura"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signingPlace">Lugar de Firma</Label>
                <Input
                  id="signingPlace"
                  name="signingPlace"
                  value={formData.signingPlace}
                  onChange={handleChange}
                  placeholder="Ciudad/localidad donde se firma el contrato"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notas Adicionales</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Observaciones o detalles adicionales"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tab: Datos de Pago */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Información de Pago</CardTitle>
              <CardDescription>
                Detalles financieros de la transacción
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Precio de Venta</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    min={0}
                    step={0.01}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalAmount">Importe Total (incl. gastos)</Label>
                  <Input
                    id="totalAmount"
                    name="totalAmount"
                    type="number"
                    value={formData.totalAmount}
                    onChange={handleChange}
                    min={0}
                    step={0.01}
                  />
                </div>
              </div>

              <Separator className="my-4" />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="downPayment">Pago Inicial</Label>
                  <Input
                    id="downPayment"
                    name="downPayment"
                    type="number"
                    value={formData.downPayment}
                    onChange={handleChange}
                    min={0}
                    step={0.01}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="financedAmount">Monto Financiado</Label>
                  <Input
                    id="financedAmount"
                    name="financedAmount"
                    type="number"
                    value={formData.financedAmount}
                    onChange={handleChange}
                    min={0}
                    step={0.01}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="financingTermMonths">Plazo (meses)</Label>
                  <Input
                    id="financingTermMonths"
                    name="financingTermMonths"
                    type="number"
                    value={formData.financingTermMonths}
                    onChange={handleChange}
                    min={0}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interestRate">Tasa de Interés (%)</Label>
                  <Input
                    id="interestRate"
                    name="interestRate"
                    type="number"
                    value={formData.interestRate}
                    onChange={handleChange}
                    min={0}
                    step={0.01}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyPayment">Cuota Mensual</Label>
                  <Input
                    id="monthlyPayment"
                    name="monthlyPayment"
                    type="number"
                    value={formData.monthlyPayment}
                    onChange={handleChange}
                    min={0}
                    step={0.01}
                  />
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Método de Pago</Label>
                  <Input
                    id="paymentMethod"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    placeholder="Efectivo, Transferencia, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentReference">Referencia de Pago</Label>
                  <Input
                    id="paymentReference"
                    name="paymentReference"
                    value={formData.paymentReference}
                    onChange={handleChange}
                    placeholder="Número de transacción, etc."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tab: Gastos Legales */}
        <TabsContent value="legal">
          <Card>
            <CardHeader>
              <CardTitle>Gastos Legales</CardTitle>
              <CardDescription>
                Detalle de los gastos legales asociados a la transacción
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="legalExpenses">Gastos Legales Generales</Label>
                  <Input
                    id="legalExpenses"
                    name="legalExpenses"
                    type="number"
                    value={formData.legalExpenses}
                    onChange={handleChange}
                    min={0}
                    step={0.01}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transferTaxes">Impuestos de Transferencia</Label>
                  <Input
                    id="transferTaxes"
                    name="transferTaxes"
                    type="number"
                    value={formData.transferTaxes}
                    onChange={handleChange}
                    min={0}
                    step={0.01}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="notaryFees">Honorarios Notariales</Label>
                  <Input
                    id="notaryFees"
                    name="notaryFees"
                    type="number"
                    value={formData.notaryFees}
                    onChange={handleChange}
                    min={0}
                    step={0.01}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registrationFees">Gastos de Inscripción</Label>
                  <Input
                    id="registrationFees"
                    name="registrationFees"
                    type="number"
                    value={formData.registrationFees}
                    onChange={handleChange}
                    min={0}
                    step={0.01}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="mr-2">Guardando...</span>
              <span className="animate-spin">⊚</span>
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Guardar Cambios
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
