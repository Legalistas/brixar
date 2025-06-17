import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { TextField } from '@/components/Fields'
import { Logomark } from '@/components/Logo'
import { NavLinks } from '@/components/NavLinks'
import qrCode from '@/images/qr-code.svg'
import IconBrixarSingle from './IconBrixarSingle'
import LogoBrixar from '@/components/LogoBrixar'
import FacebookIcon from './Icons/FacebookIcon'
import InstagramIcon from './Icons/InstagramIcon'
import LinkedInIcon from './Icons/LinkedInIcon'
import TikTokIcon from './Icons/TikTokIcon'

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
        <div className="flex flex-col items-center justify-between gap-y-12 pb-6 pt-16 lg:py-16">
          <div className="flex flex-col items-center">
            <div className="flex items-center text-gray-900">
              <Image
                src="/images/logos/BRIXAR_png-isologo-07_black.png"
                alt="Logo"
                width={48}
                height={48}
                className="w-12 h-12 flex-none"
              />
              <div className="ml-4">
                <p className="text-base font-semibold">Brixar</p>
                <p className="mt-1 text-sm">El hogar de tus sueños.</p>
              </div>
            </div>
            <nav className="hidden sm:flex mt-11 gap-8">
              <NavLinks />
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <Link href="https://www.facebook.com/profile.php?id=61573096243305" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
              <FacebookIcon className="h-6 w-6" />
            </Link>
            <Link href="https://www.instagram.com/brixar.desarrollos" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
              <InstagramIcon className="h-6 w-6" />
            </Link>
            <Link href="https://www.linkedin.com/company/brixar-desarrollos" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
              <LinkedInIcon className="h-6 w-6" />
            </Link>
            <Link href="https://www.tiktok.com/@brixar.desarrollos" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
              <TikTokIcon className="h-6 w-6" />
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-center border-t border-gray-200 pb-12 pt-8 md:flex-row-reverse md:justify-between md:pt-6">
          <p className="mt-6 text-sm text-gray-500 md:mt-0 text-center">
            &copy; Copyright {new Date().getFullYear()}. Operado por Fixer
            S.A.S. Todos los derechos reservados.
          </p>
        </div>
      </Container>
    </footer>
  )
}
