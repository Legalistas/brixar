'use client'

import { useState, useEffect, useRef } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, ArrowLeft, Send, Check, DollarSign } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { API_ENDPOINTS } from '@/constants/api-endpoint'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'

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

interface Message {
  id: number
  message: string
  createdAt: string
  isAdmin: boolean
  user: {
    id: string
    name: string
    image?: string
  }
  isOffer?: boolean
  offerAmount?: number
  offerStatus?: 'PENDING' | 'ACCEPTED' | 'REJECTED'
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
  }
  user: {
    id: string
    name: string
    email: string
  }
}

export default function AdminInquiryDetailPage({ params }: { params: { id: string } }) {
  const inquiryId = parseInt(params.id)
  const { data: session } = useSession()
  const [currentInquiry, setCurrentInquiry] = useState<Inquiry | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [offerAmount, setOfferAmount] = useState('')
  const [isOpenOfferDialog, setIsOpenOfferDialog] = useState(false)

  useEffect(() => {
    fetchInquiryData()
  }, [inquiryId])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchInquiryData = async () => {
    setIsLoading(true)
    try {
      // Fetch inquiry details
      const inquiryResponse = await fetch(API_ENDPOINTS.INQUIRY_BY_ID(inquiryId))
      if (!inquiryResponse.ok) throw new Error('Error al cargar la consulta')
      const inquiryData = await inquiryResponse.json()
      setCurrentInquiry(inquiryData)
      
      // Fetch inquiry messages
      const messagesResponse = await fetch(API_ENDPOINTS.INQUIRY_MESSAGES(inquiryId))
      if (!messagesResponse.ok) throw new Error('Error al cargar los mensajes')
      const messagesData = await messagesResponse.json()
      setMessages(messagesData)
    } catch (error) {
      console.error('Error fetching inquiry data:', error)
      toast.error('Error al cargar la información de la consulta')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return
    
    setIsSending(true)
    try {
      const response = await fetch(API_ENDPOINTS.INQUIRY_MESSAGE_CREATE(inquiryId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: newMessage.trim(),
          isAdmin: true
        }),
      })
      
      if (!response.ok) throw new Error('Error al enviar el mensaje')
      
      // Refresh messages
      const messagesResponse = await fetch(API_ENDPOINTS.INQUIRY_MESSAGES(inquiryId))
      const messagesData = await messagesResponse.json()
      setMessages(messagesData)
      setNewMessage('')
      
    } catch (error) {
      toast.error('Error al enviar el mensaje')
    } finally {
      setIsSending(false)
    }
  }

  const handleSendOffer = async () => {
    if (!offerAmount.trim()) return
    
    setIsSending(true)
    try {
      // Primero actualizamos el inquiry con el precio ofertado
      const updateInquiryResponse = await fetch(API_ENDPOINTS.INQUIRY_UPDATE(inquiryId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          offeredPrice: parseFloat(offerAmount)
        }),
      });
      
      if (!updateInquiryResponse.ok) throw new Error('Error al actualizar la oferta')
      
      // Luego enviamos el mensaje con la oferta
      const response = await fetch(API_ENDPOINTS.INQUIRY_MESSAGE_CREATE(inquiryId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Oferta por $${offerAmount}`,
          isAdmin: true,
          isOffer: true,
          offerAmount: parseFloat(offerAmount),
          offerStatus: 'PENDING'
        }),
      })
      
      if (!response.ok) throw new Error('Error al enviar la oferta')
      
      // Refrescamos inquiry para obtener el precio actualizado
      const inquiryResponse = await fetch(API_ENDPOINTS.INQUIRY_BY_ID(inquiryId))
      if (inquiryResponse.ok) {
        const inquiryData = await inquiryResponse.json()
        setCurrentInquiry(inquiryData)
      }
      
      // Refrescamos los mensajes
      const messagesResponse = await fetch(API_ENDPOINTS.INQUIRY_MESSAGES(inquiryId))
      const messagesData = await messagesResponse.json()
      setMessages(messagesData)
      setOfferAmount('')
      setIsOpenOfferDialog(false)
      
      toast.success('Oferta enviada correctamente')
    } catch (error) {
      toast.error('Error al enviar la oferta')
    } finally {
      setIsSending(false)
    }
  }

  const handleAcceptOffer = async (offerId: number) => {
    const offerMessage = messages.find(msg => msg.id === offerId && msg.isOffer);
    if (!offerMessage || !offerMessage.offerAmount) {
      toast.error('No se encontró la información de la oferta');
      return;
    }
    
    try {
      // Actualizamos el inquiry con el precio negociado
      const updateInquiryResponse = await fetch(API_ENDPOINTS.INQUIRY_UPDATE(inquiryId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          negotiatedPrice: offerMessage.offerAmount,
          status: 'IN_PROGRESS' // Opcionalmente cambiamos el estado a en progreso
        }),
      });
      
      if (!updateInquiryResponse.ok) throw new Error('Error al aceptar la oferta');
      
      // Actualizamos el mensaje de oferta (esto dependerá de tu API)
      // Por ahora actualizamos el estado local
      const updatedMessages = messages.map(msg => {
        if (msg.id === offerId && msg.isOffer) {
          return { ...msg, offerStatus: 'ACCEPTED' };
        }
        return msg;
      });
      setMessages(updatedMessages);
      
      // Refrescamos el inquiry para obtener datos actualizados
      const inquiryResponse = await fetch(API_ENDPOINTS.INQUIRY_BY_ID(inquiryId));
      if (inquiryResponse.ok) {
        const inquiryData = await inquiryResponse.json();
        setCurrentInquiry(inquiryData);
      }
      
      toast.success('Oferta aceptada correctamente');
    } catch (error) {
      console.error('Error al aceptar la oferta:', error);
      toast.error('Error al aceptar la oferta');
    }
  }

  const updateInquiryStatus = async (newStatus: string) => {
    setIsUpdatingStatus(true)
    try {
      const response = await fetch(API_ENDPOINTS.INQUIRY_UPDATE(inquiryId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus
        }),
      })
      
      if (!response.ok) throw new Error('Error al actualizar el estado')
      
      // Update local state
      if (currentInquiry) {
        setCurrentInquiry({
          ...currentInquiry,
          status: newStatus as 'OPEN' | 'IN_PROGRESS' | 'CLOSED' | 'RESOLVED'
        })
      }
      
      toast.success('Estado actualizado correctamente')
    } catch (error) {
      toast.error('Error al actualizar el estado')
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard/consultas">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              {isLoading ? 'Cargando...' : currentInquiry?.title}
            </h2>
            {currentInquiry && (
              <p className="text-sm text-gray-600 mt-1">
                Propiedad: {currentInquiry.property.title} | 
                Cliente: {currentInquiry.user.name} ({currentInquiry.user.email})
              </p>
            )}
          </div>
        </div>
        
        {currentInquiry && (
          <div className="flex items-center gap-4">
            <Badge 
              variant="secondary"
              className={statusColors[currentInquiry.status] + " text-white"}
            >
              {statusLabels[currentInquiry.status]}
            </Badge>
            
            <div className="w-44">
              <Select 
                value={currentInquiry.status} 
                onValueChange={updateInquiryStatus}
                disabled={isUpdatingStatus}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Cambiar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPEN">Abierta</SelectItem>
                  <SelectItem value="IN_PROGRESS">En progreso</SelectItem>
                  <SelectItem value="RESOLVED">Resuelta</SelectItem>
                  <SelectItem value="CLOSED">Cerrada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Dialog open={isOpenOfferDialog} onOpenChange={setIsOpenOfferDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <DollarSign className="h-4 w-4" />
                  Enviar Oferta
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Enviar nueva oferta</DialogTitle>
                  <DialogDescription>
                    Ingresa el monto de la oferta que quieres enviar al cliente.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">$</span>
                    <Input
                      type="number"
                      placeholder="Monto de la oferta"
                      value={offerAmount}
                      onChange={(e) => setOfferAmount(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleSendOffer} 
                    className="w-full"
                    disabled={!offerAmount.trim() || isSending}
                  >
                    {isSending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <DollarSign className="h-4 w-4 mr-2" />
                    )}
                    Enviar Oferta
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex-1 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto py-4 px-1">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No hay mensajes en esta consulta.
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => {
                  const isCurrentUser = message.user.id === session?.user.id
                  return (
                    <div 
                      key={message.id}
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-2 max-w-[80%] ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={message.user.image || ''} />
                          <AvatarFallback>{getInitials(message.user.name)}</AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <div 
                            className={`
                              px-4 py-3 rounded-lg 
                              ${message.isOffer 
                                ? 'bg-green-100 border border-green-300 text-green-800' 
                                : isCurrentUser || message.isAdmin
                                  ? 'bg-blue-500 text-white' 
                                  : 'bg-gray-100 text-gray-800'
                              }
                            `}
                          >
                            <p>{message.message}</p>
                            
                            {message.isOffer && (
                              <div className="mt-2 pt-2 border-t border-green-300">
                                <div className="flex justify-between items-center">
                                  <Badge variant="outline" className="bg-white">
                                    Oferta: ${message.offerAmount}
                                  </Badge>
                                  
                                  {/* Si es oferta del cliente y está pendiente, mostrar botón para aceptar */}
                                  {!message.isAdmin && message.offerStatus === 'PENDING' && (
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="bg-green-500 text-white hover:bg-green-600"
                                      onClick={() => handleAcceptOffer(message.id)}
                                    >
                                      <Check className="h-4 w-4 mr-1" /> Aceptar
                                    </Button>
                                  )}
                                  
                                  {message.offerStatus === 'ACCEPTED' && (
                                    <Badge className="bg-green-500">Aceptada</Badge>
                                  )}
                                  
                                  {message.offerStatus === 'REJECTED' && (
                                    <Badge variant="destructive">Rechazada</Badge>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className={`text-xs text-gray-500 mt-1 ${isCurrentUser ? 'text-right' : ''}`}>
                            {message.isAdmin && <span className="font-semibold mr-1">Admin</span>}
                            <span>{message.user.name} - {format(new Date(message.createdAt), 'dd/MM/yyyy HH:mm')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Message Input */}
          {currentInquiry?.status !== 'CLOSED' && currentInquiry?.status !== 'RESOLVED' && (
            <div className="pt-4 border-t">
              <div className="flex gap-2">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  rows={2}
                  className="min-h-[80px]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  disabled={isSending}
                />
                <div className="flex flex-col gap-2">
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isSending}
                    className="h-1/2"
                  >
                    {isSending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                  <Button 
                    onClick={() => setIsOpenOfferDialog(true)}
                    variant="outline"
                    className="h-1/2"
                  >
                    <DollarSign className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {(currentInquiry?.status === 'CLOSED' || currentInquiry?.status === 'RESOLVED') && (
            <div className="bg-gray-100 rounded-md p-4 mt-4 text-center text-gray-600">
              Esta consulta está {currentInquiry?.status === 'CLOSED' ? 'cerrada' : 'resuelta'} y no puede recibir más mensajes.
            </div>
          )}
        </>
      )}
    </div>
  )
}
