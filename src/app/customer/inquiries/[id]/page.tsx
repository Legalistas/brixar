'use client'

import { useInquiryStore } from '@/store/inquiryStore'
import { useEffect, useState, useRef } from 'react'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, ArrowLeft, Send } from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'

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

export default function InquiryDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const inquiryId = parseInt(params.id)
  const { data: session } = useSession()
  const { currentInquiry, messages, isLoading, fetchInquiryById, sendMessage } =
    useInquiryStore()

  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchInquiryById(inquiryId)
  }, [fetchInquiryById, inquiryId])

  useEffect(() => {
    // Scroll to bottom when messages change
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
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="flex items-center gap-3">
          <Link href="/customer/inquiries">
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
                Propiedad: {currentInquiry.property.title}
              </p>
            )}
          </div>
        </div>

        {currentInquiry && (
          <Badge
            variant="secondary"
            className={statusColors[currentInquiry.status] + ' text-white'}
          >
            {statusLabels[currentInquiry.status]}
          </Badge>
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
                  const isCurrentUser =
                    message.user.id.toString() === session?.user.id
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
                                  isCurrentUser
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

          {/* Message Input */}
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
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isSending}
                    className="h-auto"
                  >
                    {isSending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
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
