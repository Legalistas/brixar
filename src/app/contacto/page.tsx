'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Phone, MapPin } from 'lucide-react'
import Image from 'next/image'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import PropertyMap from './map'

export default function ContactoPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Contáctanos
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <ContactForm />
            </div>
            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <ContactInfo />
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <Map />
              </div>
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
        Envíanos un mensaje
      </h2>
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
          className="w-full min-h-[120px]"
        />
      </div>
      <div>
        <Button type="submit" className="w-full">
          Enviar mensaje
        </Button>
      </div>
    </form>
  )
}

function ContactInfo() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
        Información de contacto
      </h2>
      <div className="space-y-4">
        <p className="flex items-center text-gray-600 dark:text-gray-300">
          <Mail className="mr-3 text-cyan-600 dark:text-cyan-400" size={20} />
          contacto@brixar.ar
        </p>
        <p className="flex items-center text-gray-600 dark:text-gray-300">
          <Phone className="mr-3 text-cyan-600 dark:text-cyan-400" size={20} />
          3492 282324
        </p>
        <p className="flex items-center text-gray-600 dark:text-gray-300">
          <MapPin className="mr-3 text-cyan-600 dark:text-cyan-400" size={20} />
          Aconcagua 697, Rafaela, Santa Fe
        </p>
      </div>
    </div>
  )
}

function Map() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
        Nuestra ubicación
      </h2>
      <div className="relative w-full h-96 rounded-lg overflow-hidden">
        {/*<Image
          src="/placeholder.svg?height=320&width=480"
          alt="Mapa de ubicación"
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />*/}
        <PropertyMap latitude={-31.2545} longitude={-61.4867} />
      </div>
    </div>
  )
}
