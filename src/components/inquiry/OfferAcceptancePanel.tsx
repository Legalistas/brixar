'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useInquiryStore } from "@/store/inquiryStore"
import { CheckCircle2, AlertCircle, DollarSign, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface OfferAcceptancePanelProps {
  inquiryId: number
  isAdmin: boolean
}

export function OfferAcceptancePanel({ inquiryId, isAdmin }: OfferAcceptancePanelProps) {
  const router = useRouter()
  const { currentInquiry, fetchInquiryById, acceptOfferAsAdmin, acceptOfferAsClient, completeTransaction, isLoading, error } = useInquiryStore()
  const [localLoading, setLocalLoading] = useState(false)
  
  useEffect(() => {
    // Aseguramos que tengamos la información más actualizada de la consulta
    fetchInquiryById(inquiryId)
  }, [fetchInquiryById, inquiryId])

  useEffect(() => {
    // Mostrar errores si ocurren durante la aceptación de ofertas
    if (error) {
      toast.error(error)
    }
  }, [error])

  // Si no hay consulta o precio negociado, no mostramos el panel
  if (!currentInquiry || !currentInquiry.negotiatedPrice) {
    return null
  }
  
  const handleAccept = async () => {
    setLocalLoading(true)
    try {
      if (isAdmin) {
        await acceptOfferAsAdmin(inquiryId)
      } else {
        await acceptOfferAsClient(inquiryId)
      }
      
      // Refrescar para obtener el estado actualizado
      await fetchInquiryById(inquiryId)
      
      // Verificar si ambas partes han aceptado para completar la transacción
      const updatedInquiry = useInquiryStore.getState().currentInquiry
      
      if (updatedInquiry?.adminAccepted && updatedInquiry?.clientAccepted) {
        toast.loading('Generando venta...')
        const saleId = await completeTransaction(inquiryId)
        
        if (saleId) {
          toast.success('¡Venta generada exitosamente!')
          
          // Redirigir al administrador a la página de la venta
          if (isAdmin) {
            setTimeout(() => {
              router.push(`/admin/dashboard/ventas/${saleId}`)
            }, 1500)
          }
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al procesar la oferta'
      toast.error(message)
    } finally {
      setLocalLoading(false)
    }
  }

  // Si la consulta está cerrada o resuelta, mostramos el panel de transacción completada
  if (currentInquiry.status === 'CLOSED' || currentInquiry.status === 'RESOLVED') {
    return (
      <Card className="bg-gray-50 mb-4 w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <CheckCircle2 className="w-5 h-5 mr-2 text-green-500" />
            Transacción completada
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Esta consulta ha sido {currentInquiry.status === 'RESOLVED' ? 'resuelta' : 'cerrada'}.
            {currentInquiry.status === 'RESOLVED' && ' Se ha registrado la venta correctamente.'}
          </p>
        </CardContent>
      </Card>
    )
  }
  
  // Si el usuario actual ya aceptó
  const userAccepted = isAdmin ? currentInquiry.adminAccepted : currentInquiry.clientAccepted
  // Si la contraparte ya aceptó
  const counterpartAccepted = isAdmin ? currentInquiry.clientAccepted : currentInquiry.adminAccepted
  
  const loading = isLoading || localLoading
  
  return (
    <Card className={`mb-4 w-full ${counterpartAccepted ? 'border-green-500' : ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-green-600" />
          Oferta: ${currentInquiry.negotiatedPrice.toLocaleString()}
        </CardTitle>
        <CardDescription>
          {counterpartAccepted ? (
            <div className="flex items-center text-green-600">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              {isAdmin ? 'El cliente ha aceptado la oferta' : 'El administrador ha aceptado la oferta'}
            </div>
          ) : (
            <div className="flex items-center text-yellow-600">
              <AlertCircle className="w-4 h-4 mr-1" />
              {isAdmin ? 'Esperando confirmación del cliente' : 'Esperando confirmación del administrador'}
            </div>
          )}
        </CardDescription>
      </CardHeader>
      
      <CardFooter>
        {userAccepted ? (
          <Button variant="outline" disabled className="w-full">
            <CheckCircle2 className="w-4 h-4 mr-2" /> Oferta aceptada
          </Button>
        ) : (
          <Button 
            variant={counterpartAccepted ? "default" : "outline"}
            className={`w-full ${counterpartAccepted ? "bg-green-600 hover:bg-green-700" : ""}`}
            disabled={loading}
            onClick={handleAccept}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Procesando...
              </>
            ) : counterpartAccepted ? (
              'Confirmar y completar venta'
            ) : (
              'Aceptar oferta'
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
