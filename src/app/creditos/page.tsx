'use client'

import { useState } from 'react'
import { Container } from '@/components/Container'
import { Button } from '@/components/Button'
import { PhoneFrame } from '@/components/PhoneFrame'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import {
  MessageCircle,
  Home,
  FileText,
  Key,
  Coins,
  Calendar,
  CheckCircle,
} from 'lucide-react'

function BackgroundIllustration(props: React.HTMLAttributes<HTMLDivElement>) {
  const id = useState(() => Math.random().toString(36).substr(2, 9))[0]

  return (
    <div {...props}>
      <svg
        viewBox="0 0 1026 1026"
        fill="none"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full animate-spin-slow"
      >
        <path
          d="M1025 513c0 282.77-229.23 512-512 512S1 795.77 1 513 230.23 1 513 1s512 229.23 512 512Z"
          stroke="#D4D4D4"
          strokeOpacity="0.7"
        />
        <path
          d="M513 1025C230.23 1025 1 795.77 1 513"
          stroke={`url(#${id}-gradient-1)`}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient
            id={`${id}-gradient-1`}
            x1="1"
            y1="513"
            x2="1"
            y2="1025"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#06b6d4" />
            <stop offset="1" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <svg
        viewBox="0 0 1026 1026"
        fill="none"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full animate-spin-reverse-slower"
      >
        <path
          d="M913 513c0 220.914-179.086 400-400 400S113 733.914 113 513s179.086-400 400-400 400 179.086 400 400Z"
          stroke="#D4D4D4"
          strokeOpacity="0.7"
        />
        <path
          d="M913 513c0 220.914-179.086 400-400 400"
          stroke={`url(#${id}-gradient-2)`}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient
            id={`${id}-gradient-2`}
            x1="913"
            y1="513"
            x2="913"
            y2="913"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#06b6d4" />
            <stop offset="1" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

interface LoanOptionProps {
  title: string
  description: string
  rate: string
}

function LoanOption({ title, description, rate }: LoanOptionProps) {
  return (
    <div className="rounded-2xl border border-gray-200 p-6 dark:border-gray-700 bg-gray-800 transform transition-all duration-300 hover:scale-105 hover:bg-gray-700">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-gray-300">{description}</p>
      <p className="mt-4 text-2xl font-bold text-cyan-400">{rate}</p>
    </div>
  )
}

interface StepProps {
  icon: React.ReactNode
  title: string
  description: string
}

function Step({ icon, title, description }: StepProps) {
  return (
    <div className="flex items-center space-x-4 transform transition-all duration-300 hover:scale-105">
      <div className="flex-shrink-0">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500 text-white transition-colors duration-300 hover:bg-cyan-600">
          {icon}
        </div>
      </div>
      <div>
        <h4 className="text-lg font-semibold text-white">{title}</h4>
        <p className="mt-1 text-sm text-gray-400">{description}</p>
      </div>
    </div>
  )
}

export default function PrestamosHipotecariosPage() {
  return (
    <>
      <Header />
      <main>
        <div className="opacity-0 animate-fade-in">
          <section className="relative overflow-hidden bg-gray-900 py-20 sm:py-28">
            <BackgroundIllustration className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
            <Container className="relative">
              <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-3xl">
                <h1 className="text-4xl font-medium tracking-tight text-white">
                  Préstamos Hipotecarios{' '}
                  <span className="font-bold">Flexibles</span> para tu hogar
                  soñado
                </h1>
                <p className="mt-6 text-lg text-gray-400">
                  En Brixar, ofrecemos préstamos hipotecarios con financiación
                  propia, adaptados a tus necesidades. Elige la opción que mejor
                  se ajuste a tu situación y comienza a construir tu futuro hoy.
                </p>
              </div>
              <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <LoanOption
                  title="Préstamo Inicial"
                  description="Perfecto para primeros compradores. Entrada mínima y cuotas accesibles."
                  rate=""
                />
                <LoanOption
                  title="Préstamo Flexible"
                  description="Ajusta tus pagos según tus posibilidades. Ideal para ingresos variables."
                  rate=""
                />
                <LoanOption
                  title="Préstamo Acelerado"
                  description="Para quienes buscan pagar rápidamente. Mayores pagos iniciales, menor plazo."
                  rate=""
                />
              </div>
              <div className="mt-20">
                <h2 className="text-3xl font-bold text-white mb-8">
                  Proceso de Solicitud
                </h2>
                <div className="grid gap-8 md:grid-cols-2">
                  <Step
                    icon={<Home className="h-6 w-6" />}
                    title="Elige tu Propiedad"
                    description="Selecciona la vivienda que deseas financiar con nuestro préstamo."
                  />
                  <Step
                    icon={<FileText className="h-6 w-6" />}
                    title="Completa la Solicitud"
                    description="Llena nuestro formulario en línea con tus datos personales y financieros."
                  />
                  <Step
                    icon={<Coins className="h-6 w-6" />}
                    title="Evaluación Financiera"
                    description="Nuestro equipo analizará tu solicitud y capacidad de pago."
                  />
                  <Step
                    icon={<CheckCircle className="h-6 w-6" />}
                    title="Aprobación del Préstamo"
                    description="Si todo está en orden, aprobaremos tu préstamo hipotecario."
                  />
                  <Step
                    icon={<Calendar className="h-6 w-6" />}
                    title="Programar Firma"
                    description="Coordinaremos una fecha para la firma de los documentos del préstamo."
                  />
                  <Step
                    icon={<Key className="h-6 w-6" />}
                    title="¡Disfruta tu Nueva Casa!"
                    description="Finaliza el proceso y recibe las llaves de tu nuevo hogar."
                  />
                </div>
              </div>

              <section className="mt-16 flex justify-center">
                <div className="w-full max-w-lg">
                  <div className="flex flex-col items-center p-8 bg-gradient-to-br from-cyan-600 to-cyan-800 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105">
                    <h3 className="text-2xl font-semibold text-white mb-4">
                      ¿Listo para comenzar?
                    </h3>
                    <p className="mt-2 text-center text-sm text-gray-100">
                      Contáctanos ahora y un asesor te ayudará a elegir el mejor
                      plan de préstamo hipotecario para ti.
                    </p>
                    <Link href="/contacto" className="mt-6">
                      <Button className="flex items-center gap-2 bg-white text-cyan-800 hover:bg-cyan-100 transition-colors duration-300">
                        <MessageCircle className="h-5 w-5" />
                        Contáctanos
                      </Button>
                    </Link>
                  </div>
                </div>
              </section>
            </Container>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
