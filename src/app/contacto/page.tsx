'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin } from 'lucide-react'
import Image from 'next/image'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function Contactopage() { 
    return (<>
        <Header/>
        <div className="min-h-screen bg-background">
            <h1 className="text-3xl md:text-4xl font-bold text-center py-6 md:py-8">Contáctanos</h1>
            <main className="container mx-auto px-4 md:px-6 lg:px-8 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    <div>
                        <ContactForm />
                    </div>
                    <div>
                        <ContactInfo />
                        <Map />
                    </div>
                </div>
            </main>
        </div>
        <Footer />
        </>
    )
}

function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para enviar el formulario
    console.log('Formulario enviado:', { name, email, whatsapp, message })
    // Resetear el formulario
    setName('')
    setEmail('')
    setWhatsapp('')
    setMessage('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl md:text-2xl font-semibold mb-4">Envíanos un mensaje</h2>
      <div>
        <Input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full"
        />
      </div>
      <div>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full"
        />
      </div>
      <div>
        <Input
          type="tel"
          placeholder="WhatsApp"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          className="w-full"
        />
      </div>
      <div>
        <Textarea
          placeholder="Mensaje"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          className="w-full min-h-[100px]"
        />
      </div>
      <div className="flex justify-center">
        <Button type="submit" className="w-full md:w-auto">Enviar mensaje</Button>
      </div>
    </form>
  )
}

function ContactInfo() {
  return (
    <div className="mb-8 md:mb-12">
      <h2 className="text-xl md:text-2xl font-semibold mb-4">Información de contacto</h2>
      <div className="space-y-2">
        <p className="flex items-center text-sm md:text-base">
          <Mail className="mr-2 flex-shrink-0" size={18} />
          info@tuempresa.com
        </p>
        <p className="flex items-center text-sm md:text-base">
          <Phone className="mr-2 flex-shrink-0" size={18} />
          +1 234 567 890
        </p>
        <p className="flex items-center text-sm md:text-base">
          <MapPin className="mr-2 flex-shrink-0" size={18} />
          123 Calle Principal, Ciudad, País
        </p>
      </div>
    </div>
  )
}

function Map() {
  return (
    <div className="mt-8">
      <h2 className="text-xl md:text-2xl font-semibold mb-4">Nuestra ubicación</h2>
      <div className="relative w-full h-48 md:h-64 lg:h-80">
        <Image
          src="/placeholder.svg?height=256&width=512"
          alt="Mapa de ubicación"
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
      </div>
    </div>
  )
}

