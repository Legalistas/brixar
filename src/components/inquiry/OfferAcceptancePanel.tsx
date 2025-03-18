'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useInquiryStore } from "@/store/inquiryStore"
import { CheckCircle2, AlertCircle, DollarSign } from "lucide-react"
import { useEffect } from "react"
import { toast } from "sonner"

interface OfferAcceptancePanelProps {
  inquiryId: number
  isAdmin: boolean
}

export function OfferAcceptancePanel({ inquiryId, isAdmin }: OfferAcceptancePanelProps) {
  const { currentInquiry, fetchInquiryById, acceptOfferAsAdmin, acceptOfferAsClient, isLoading, error } = useInquiryStore()
  
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
  
  const handleAccept = () => {
    if (isAdmin) {
      acceptOfferAsAdmin(inquiryId)
    } else {
      acceptOfferAsClient(inquiryId)
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
            disabled={isLoading}
            onClick={handleAccept}
          >
            {isLoading ? 'Procesando...' : counterpartAccepted ? 'Confirmar y completar venta' : 'Aceptar oferta'}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
