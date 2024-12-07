"use client"

import React from 'react'
import { CircleBackground } from '@/components/CircleBackground'
import { Container } from '@/components/Container'
import Link from 'next/link'
import WhatsappIcon from './Icons/WhatsappIcon'

export function CallToAction(): JSX.Element {
    return (
        <section
            id="get-free-shares-today"
            className="relative overflow-hidden bg-gray-900 py-20 sm:py-28"
        >
            <div className="absolute left-20 top-1/2 -translate-y-1/2 sm:left-1/2 sm:-translate-x-1/2">
                <CircleBackground color="#fff" className="animate-spin-slower" />
            </div>
            <Container className="relative">
                <div className="mx-auto max-w-md sm:text-center">
                    <h2 className="text-3xl font-medium tracking-tight text-white sm:text-4xl">
                        Te ayudamos a cumplir tu sueño
                    </h2>
                    <p className="mt-4 text-lg text-gray-300">
                        Invertir en una propiedad es una decisión importante. Con nuestros inmuebles, te aseguramos una elección acertada y opciones de financiación.
                    </p>
                    <div className="mt-8 flex justify-center">
                        <Link href="https://wa.me/5493492282324">
                            <button className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-indigo-700 hover:bg-gray-50 sm:px-8">
                                <WhatsappIcon className='w-6 h-6 mr-1' /> Contactanos
                            </button>
                        </Link>
                    </div>
                </div>
            </Container>
        </section>
    )
}