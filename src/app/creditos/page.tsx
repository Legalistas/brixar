'use client'

import { useState } from 'react'
import { Container } from '@/components/Container'
import { Button } from '@/components/Button'
import { PhoneFrame } from '@/components/PhoneFrame'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { MessageCircle } from 'lucide-react'

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

interface CreditOptionProps {
  title: string
  description: string
  amount: string
}

function CreditOption({ title, description, amount }: CreditOptionProps) {
  return (
    <div className="rounded-2xl border border-gray-200 p-6 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-gray-300">{description}</p>
      <p className="mt-4 text-2xl font-bold text-white">{amount}</p>
    </div>
  )
}

export default function CreditosPage() {
  return (
    <>
      <Header />
      <main>
        <section className="relative overflow-hidden bg-gray-900 py-20 sm:py-28">
          <BackgroundIllustration className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
          <Container className="relative">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-3xl">
              <h1 className="text-4xl font-medium tracking-tight text-white">
                Opciones de <span className="font-bold">crédito flexibles</span>{' '}
                para tu hogar soñado
              </h1>
              <p className="mt-6 text-lg text-gray-400">
                En Sembrar, ofrecemos planes de financiación adaptados a tus
                necesidades. Elige la opción que mejor se ajuste a tu situación
                y comienza a construir tu futuro hoy.
              </p>
            </div>
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <CreditOption
                title="Plan Inicial"
                description="Perfecto para quienes están comenzando. Entrada mínima y cuotas accesibles."
                amount="Desde $10,000"
              />
              <CreditOption
                title="Plan Flexible"
                description="Ajusta tus pagos según tus posibilidades. Ideal para ingresos variables."
                amount="Personalizado"
              />
              <CreditOption
                title="Plan Acelerado"
                description="Para quienes buscan mudarse lo antes posible. Mayores pagos iniciales, menor plazo."
                amount="Hasta 50% de descuento"
              />
            </div>
            <div className="mt-16 flex justify-center">
              <PhoneFrame className="max-w-[366px]">
                <div className="flex flex-col items-center p-8">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    ¿Listo para comenzar?
                  </h3>
                  <p className="mt-2 text-center text-sm text-gray-700 dark:text-gray-300">
                    Contáctanos ahora y un asesor te ayudará a elegir el mejor
                    plan para ti.
                  </p>
                  <Link href="https://wa.me/5493492282324" className="mt-6">
                    <Button className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      Contactar por WhatsApp
                    </Button>
                  </Link>
                </div>
              </PhoneFrame>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
