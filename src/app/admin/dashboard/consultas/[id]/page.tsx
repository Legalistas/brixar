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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useInquiryStore } from '@/store/inquiryStore'

const statusColors = {
  OPEN: 'bg-blue-500 hover:bg-blue-600',
  IN_PROGRESS: 'bg-yellow-500 hover:bg-yellow-600',
  CLOSED: 'bg-gray-500 hover:bg-gray-600',
  RESOLVED: 'bg-green-500 hover:bg-green-600',
}

const statusLabels = {
  OPEN: 'Abierta',
  IN_PROGRESS: 'En progreso',
  CLOSED: 'Cerrada',
  RESOLVED: 'Resuelta',
}

export default function AdminInquiryDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const inquiryId = parseInt(params.id)
  const { data: session } = useSession()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [offerAmount, setOfferAmount] = useState('')
  const [isOpenOfferDialog, setIsOpenOfferDialog] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  const {
    currentInquiry,
    messages,
    isLoading,
    fetchInquiryById,
    fetchInquiryMessages,
    sendMessage,
    updateInquiry,
    acceptOfferAsAdmin,
  } = useInquiryStore()

  useEffect(() => {
    fetchInquiryById(inquiryId)
    fetchInquiryMessages(inquiryId)

    return () => {
      useInquiryStore.getState().resetState()
    }
  }, [inquiryId, fetchInquiryById, fetchInquiryMessages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    setIsSending(true)
    try {
      await sendMessage(inquiryId, newMessage.trim())
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
      await updateInquiry(inquiryId, {
        negotiatedPrice: parseFloat(offerAmount),
        status: 'IN_PROGRESS',
      })

      await sendMessage(inquiryId, `Se ha realizado una oferta por $${offerAmount}`)

      setOfferAmount('')
      setIsOpenOfferDialog(false)

      toast.success('Oferta enviada correctamente')

      await fetchInquiryById(inquiryId)
    } catch (error) {
      toast.error('Error al enviar la oferta')
    } finally {
      setIsSending(false)
    }
  }

  const handleAcceptOffer = async () => {
    try {
      await acceptOfferAsAdmin(inquiryId)

      await fetchInquiryById(inquiryId)
      toast.success('Oferta aceptada correctamente')
    } catch (error) {
      toast.error('Error al aceptar la oferta')
    }
  }

  const updateInquiryStatus = async (newStatus: string) => {
    try {
      await updateInquiry(inquiryId, {
        status: newStatus as 'OPEN' | 'IN_PROGRESS' | 'CLOSED' | 'RESOLVED',
      })
      toast.success('Estado actualizado correctamente')
    } catch (error) {
      toast.error('Error al actualizar el estado')
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      <div className="flex flex-col pb-4 border-b">
        <div className="flex items-center justify-between mb-4">
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
                  Propiedad: {currentInquiry?.property?.title} | Cliente:{' '}
                  {currentInquiry.user?.name} ({currentInquiry.user?.email})
                </p>
              )}
            </div>
          </div>

          {currentInquiry && (
            <div className="flex items-center gap-4">
              <Badge
                variant="secondary"
                className={statusColors[currentInquiry.status] + ' text-white'}
              >
                {statusLabels[currentInquiry.status]}
              </Badge>

              <div className="w-44">
                <Select
                  value={currentInquiry.status}
                  onValueChange={updateInquiryStatus}
                  disabled={isLoading}
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
            </div>
          )}
        </div>

        {currentInquiry?.negotiatedPrice && (
          <div className="mb-2 w-full">
            <div className="bg-green-50 border border-green-200 rounded-md p-4 flex flex-col md:flex-row items-center justify-between">
              <div>
                <h3 className="font-semibold text-green-800">
                  Oferta pendiente de aceptación
                </h3>
                <p className="text-green-700">
                  Precio negociado: ${currentInquiry.negotiatedPrice}
                </p>
                <p className="text-sm text-green-600">
                  {currentInquiry.adminAccepted
                    ? 'Has aceptado esta oferta.'
                    : 'Aún no has aceptado esta oferta.'}
                </p>
              </div>

              {!currentInquiry.adminAccepted && (
                <Button
                  onClick={handleAcceptOffer}
                  className="bg-green-600 hover:bg-green-700 mt-2 md:mt-0"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="mr-2 h-4 w-4" />
                  )}
                  Aceptar oferta
                </Button>
              )}
            </div>
          </div>
        )}

        {currentInquiry &&
          currentInquiry.status !== 'CLOSED' &&
          currentInquiry.status !== 'RESOLVED' && (
            <div className="flex justify-end mt-2">
              <Dialog
                open={isOpenOfferDialog}
                onOpenChange={setIsOpenOfferDialog}
              >
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
                      Ingresa el monto de la oferta que quieres enviar al
                      cliente.
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
          <div className="flex-1 overflow-y-auto py-4 px-1">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No hay mensajes en esta consulta.
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => {
                  const isCurrentUser = String(message.user.id) === session?.user.id
                  return (
                    <div
                      key={message.id}
                      className={`flex ${
                        isCurrentUser ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`flex gap-2 max-w-[80%] ${
                          isCurrentUser ? 'flex-row-reverse' : ''
                        }`}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={message.user.image || ''} />
                          <AvatarFallback>
                            {getInitials(message.user.name)}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <div
                            className={`
                              px-4 py-3 rounded-lg 
                              ${
                                isCurrentUser || message.isAdmin
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-100 text-gray-800'
                              }
                            `}
                          >
                            <p>{message.message}</p>
                          </div>
                          <div
                            className={`text-xs text-gray-500 mt-1 ${
                              isCurrentUser ? 'text-right' : ''
                            }`}
                          >
                            {message.isAdmin && (
                              <span className="font-semibold mr-1">Admin</span>
                            )}
                            <span>
                              {message.user.name} -{' '}
                              {format(
                                new Date(message.createdAt),
                                'dd/MM/yyyy HH:mm'
                              )}
                            </span>
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

          {currentInquiry?.status !== 'CLOSED' &&
            currentInquiry?.status !== 'RESOLVED' && (
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

          {(currentInquiry?.status === 'CLOSED' ||
            currentInquiry?.status === 'RESOLVED') && (
            <div className="bg-gray-100 rounded-md p-4 mt-4 text-center text-gray-600">
              Esta consulta está{' '}
              {currentInquiry?.status === 'CLOSED' ? 'cerrada' : 'resuelta'} y
              no puede recibir más mensajes.
            </div>
          )}
        </>
      )}
    </div>
  )
}
