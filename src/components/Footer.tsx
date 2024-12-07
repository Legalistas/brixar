import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { TextField } from '@/components/Fields'
import { Logomark } from '@/components/Logo'
import { NavLinks } from '@/components/NavLinks'
import qrCode from '@/images/qr-code.svg'

interface QrCodeBorderProps extends React.SVGProps<SVGSVGElement> { }

function QrCodeBorder(props: QrCodeBorderProps) {
    return (
        <svg viewBox="0 0 96 96" fill="none" aria-hidden="true" {...props}>
            <path
                d="M1 17V9a8 8 0 0 1 8-8h8M95 17V9a8 8 0 0 0-8-8h-8M1 79v8a8 8 0 0 0 8 8h8M95 79v8a8 8 0 0 1-8 8h-8"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    )
}

export function Footer(): JSX.Element {
    return (
        <footer className="border-t border-gray-200">
            <Container>
                <div className="flex flex-col items-start justify-between gap-y-12 pb-6 pt-16 lg:flex-row lg:items-center lg:py-16">
                    <div>
                        <div className="flex items-center text-gray-900">
                            <Image
                                src="/images/logos/isonaranja.png"
                                alt="logo"
                                width={48}
                                height={48}
                                className="h-12 w-auto"
                                priority
                            />
                            <div className="ml-4">
                                <p className="text-base font-semibold">Sembrar</p>
                                <p className="mt-1 text-sm">El inmueble de tus sueños a tu alcance.</p>
                            </div>
                        </div>
                        <nav className="mt-11 flex gap-8">
                            <NavLinks />
                        </nav>
                    </div>
                    <div className="group relative -mx-4 flex items-center self-stretch p-4 transition-colors hover:bg-gray-100 sm:self-auto sm:rounded-2xl lg:mx-0 lg:self-auto lg:p-6">
                        <div className="relative h-24 w-24 flex-none">
                            <Image
                                src="/images/qr-code.svg"
                                alt="QR Code"
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                style={{
                                    opacity: 0.5,
                                    transition: 'opacity 0.3s ease',
                                    zIndex: 10,
                                }}
                                className="hover:opacity-90"
                            />
                        </div>
                        <div className="ml-8 lg:w-64">
                            <p className="text-base font-semibold text-gray-900">
                                <Link href="#">
                                    <span className="absolute inset-0 sm:rounded-2xl" />
                                    Consulta por tu obra
                                </Link>
                            </p>
                            <p className="mt-1 text-sm text-gray-700">
                                Escanea el código QR y conversa al instante con un asesor sobre el avance de tu vivienda.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center border-t border-gray-200 pb-12 pt-8 md:flex-row-reverse md:justify-between md:pt-6">
                    <form className="flex w-full justify-center md:w-auto">
                        <TextField
                            type="email"
                            aria-label="Email address"
                            placeholder="Email"
                            autoComplete="email"
                            required
                            className="w-60 min-w-0 shrink"
                        />
                        <Button type="submit" className="ml-4 flex-none bg-[#fb6107]">
                            <span className="hidden lg:inline">Recibí nuestras ofertas</span>
                            <span className="lg:hidden">Join newsletter</span>
                        </Button>
                    </form>
                    <p className="mt-6 text-sm text-gray-500 md:mt-0">
                        &copy; Copyright {new Date().getFullYear()}. Operado por Fixer S.A.S. Todos los derechos reservados.
                    </p>
                </div>
            </Container>
        </footer>
    )
}

