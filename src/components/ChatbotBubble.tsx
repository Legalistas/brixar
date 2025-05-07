'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { v4 as uuidv4 } from 'uuid'
import { MessageCircle, Send, X, Loader2, ChevronDown } from 'lucide-react'

type Message = {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

export const ChatbotBubble = () => {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Generar o recuperar un sessionId cuando el componente se monta
  useEffect(() => {
    // Si el usuario está autenticado, usar su ID
    if (session?.user?.email) {
      setSessionId(session.user.email)
    } else {
      // Si no está autenticado, generar un ID aleatorio o recuperar uno guardado
      const savedSessionId = localStorage.getItem('chatbot_session_id')
      if (savedSessionId) {
        setSessionId(savedSessionId)
      } else {
        const newSessionId = uuidv4()
        localStorage.setItem('chatbot_session_id', newSessionId)
        setSessionId(newSessionId)
      }
    }
  }, [session])

  // Añadir mensaje de bienvenida al abrir el chat por primera vez
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: uuidv4(),
          text: "¡Hola! Soy el asistente virtual de Brixar. ¿En qué puedo ayudarte? Puedes preguntarme sobre propiedades disponibles, opciones de financiamiento o cualquier otra consulta inmobiliaria.",
          isUser: false,
          timestamp: new Date()
        }
      ])
    }
  }, [isOpen, messages.length])

  // Desplazamiento automático al último mensaje
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
    
    // Enfocar el input cuando se abre el chat
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [messages, isOpen])

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault()
    
    if (!message.trim()) return
    
    const userMessage = {
      id: uuidv4(),
      text: message,
      isUser: true,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setMessage('')
    setIsLoading(true)
    
    try {
      const response = await fetch('https://n8n-leg.onrender.com/webhook/10d61391-c302-474c-9f03-e049bab33e38/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId,
          action: 'sendMessage',
          chatInput: message
        })
      })
      
      const data = await response.json()
      
      console.log('Respuesta del servidor:', data.output)

      if (data) {
        setMessages(prev => [...prev, {
          id: uuidv4(),
          text: data.output || data.response,
          isUser: false,
          timestamp: new Date()
        }])
      } else {
        throw new Error('Formato de respuesta inesperado')
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error)
      setMessages(prev => [...prev, {
        id: uuidv4(),
        text: "Lo siento, ha ocurrido un error al procesar tu mensaje. Por favor, intenta nuevamente más tarde.",
        isUser: false,
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const toggleChat = () => {
    setIsOpen(prev => !prev)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      {isOpen ? (
        <div className="bg-white rounded-xl shadow-2xl flex flex-col w-80 sm:w-96 h-[500px] max-h-[80vh] border border-gray-200 transition-all duration-300 ease-in-out">
          {/* Cabecera del chat */}
          <div className="bg-slate-800 text-white p-4 rounded-t-xl flex justify-between items-center">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-6 w-6" />
              <h3 className="font-semibold">Asistente Brixar</h3>
            </div>
            <button onClick={toggleChat} aria-label="Cerrar chat">
              <X className="h-5 w-5 hover:text-gray-300 transition-colors" />
            </button>
          </div>
          
          {/* Contenedor de mensajes */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            <div className="space-y-4">
              {messages.map(msg => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      msg.isUser 
                        ? 'bg-slate-800 text-white rounded-tr-none' 
                        : 'bg-gray-200 text-gray-800 rounded-tl-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.isUser ? 'text-gray-300' : 'text-gray-500'}`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-800 rounded-2xl rounded-tl-none px-4 py-3">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Formulario de entrada */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 bg-white rounded-b-xl">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !message.trim()}
                className={`rounded-full p-2 ${
                  !message.trim() || isLoading 
                    ? 'bg-gray-300 text-gray-500' 
                    : 'bg-slate-800 text-white hover:bg-slate-700'
                }`}
                aria-label="Enviar mensaje"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className="bg-slate-800 hover:bg-slate-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center transition-transform hover:scale-110"
          aria-label="Abrir chat"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}
    </div>
  )
}