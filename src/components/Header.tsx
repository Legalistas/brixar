'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Popover,
  PopoverButton,
  PopoverBackdrop,
  PopoverPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { NavLinks } from '@/components/NavLinks'
import LogoBrixar from './LogoBrixar'
import { ChevronDown, LogOut, User, DollarSign, RefreshCw } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { useCurrency } from '@/context/CurrencyContext'
import { useDollarRate } from '@/hooks/useDollarRate'

interface IconProps extends React.SVGProps<SVGSVGElement> { }

const MenuIcon: React.FC<IconProps> = (props) => {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M5 6h14M5 18h14M5 12h14"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const ChevronUpIcon: React.FC<IconProps> = (props) => {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M17 14l-5-5-5 5"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

interface MobileNavLinkProps
  extends React.ComponentPropsWithoutRef<typeof Link> { }

const MobileNavLink: React.FC<MobileNavLinkProps> = ({
  href,
  ...props
}: MobileNavLinkProps) => {
  return (
    <PopoverButton
      as={Link as any}
      href={href}
      className="text-base font-medium text-black hover:text-gray-700"
      {...props}
    />
  )
}

const ProfileDropdown: React.FC<{
  user: any
  onClose: () => void
  handleLogout: () => void
}> = ({ user, onClose, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const toggleDropdown = () => setIsOpen(!isOpen)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  const handleProfileClick = () => {
    if (user.role === 'ADMIN') {
      router.push('/admin')
    } else if (user.role === 'CUSTOMER') {
      router.push('/customer')
    }
    setIsOpen(false)
    onClose()
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 sm:px-4 py-2 rounded-md"
        onClick={toggleDropdown}
      >
        <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-sm font-medium text-gray-600">
              {user.name?.charAt(0)}
            </span>
          )}
        </div>
        <span className="hidden sm:inline text-sm text-gray-600">
          {user.name}
        </span>
        <ChevronDown
          className={`hidden sm:block h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
            }`}
        />
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="sm:hidden px-4 py-2 border-b">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <div className="py-1">
            <button
              className="flex w-full items-center px-4 py-2 text-md text-gray-700 hover:bg-gray-100"
              onClick={handleProfileClick}
            >
              <User className="h-6 w-6 mr-2" />
              Panel de Control
            </button>
            <button
              className="flex w-full items-center px-4 py-2 text-md text-gray-700 hover:bg-gray-100"
              onClick={handleLogout}
            >
              <LogOut className="h-6 w-6 mr-2" />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export const Header: React.FC = () => {
  const { data: session, status } = useSession()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [isOpenCurrency, setIsOpenCurrency] = useState(false)
  const { currencies, currentCurrency, setCurrentCurrency } = useCurrency()
  const { dollarRate, isLoading, lastUpdated, updateDollarRate } = useDollarRate()

  const handleLogout = async () => {
    await signOut()
  }
  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <nav>
        <Container className="relative z-50 flex justify-between items-center py-4 lg:py-6">
          <div className="relative z-10 flex items-center gap-8 lg:gap-16">
            <Link href="/" aria-label="Home" className="flex-shrink-0">
              <Image
              src="/images/logos/BRIXAR_png-Logo-02.png"
              alt="Logo Brixar"
              width={1000}
              height={300}
              className="h-8 w-auto lg:h-12 transition-all duration-200 hover:scale-105"
              quality={100}
              priority
              />
            </Link>
            <div className="hidden lg:flex lg:gap-8">
              <NavLinks />
            </div>
          </div><div className="flex items-center gap-3 lg:gap-6">
            <Popover className="lg:hidden">
              {({ open }) => (
                <>
                  <PopoverButton
                    className="relative z-10 -m-2 inline-flex items-center text-black rounded-lg stroke-gray-900 p-2 hover:bg-gray-200/50 hover:stroke-gray-600 active:stroke-gray-900 ui-not-focus-visible:outline-none"
                    aria-label="Toggle site navigation"
                  >
                    {({ open }: { open: boolean }) =>
                      open ? (
                        <ChevronUpIcon className="h-6 w-6" />
                      ) : (
                        <MenuIcon className="h-6 w-6" />
                      )
                    }
                  </PopoverButton>
                  <AnimatePresence initial={false}>
                    {open && (
                      <>
                        <PopoverBackdrop
                          static
                          as={motion.div}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-0 bg-gray-300/60 backdrop-blur"
                        />                        <PopoverPanel
                          static
                          as={motion.div}
                          initial={{ opacity: 0, y: -32 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{
                            opacity: 0,
                            y: -32,
                            transition: { duration: 0.2 },
                          }}
                          className="absolute inset-x-0 top-0 z-0 origin-top bg-white px-0 pb-6 pt-24 shadow-2xl shadow-gray-900/20 border-b border-gray-100"
                        >
                          <div className="flex flex-col divide-y divide-gray-100">                            <MobileNavLink
                              href="/"
                              className="w-full px-6 py-4 text-left bg-white text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-colors font-medium"
                            >
                              Inicio
                            </MobileNavLink>
                            <MobileNavLink
                              href="/propiedades"
                              className="w-full px-6 py-4 text-left bg-white text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-colors font-medium"
                            >
                              Propiedades
                            </MobileNavLink>
                            <MobileNavLink
                              href="/proyectos"
                              className="w-full px-6 py-4 text-left bg-white text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-colors font-medium"
                            >
                              Proyectos
                            </MobileNavLink>
                            <MobileNavLink
                              href="/creditos"
                              className="w-full px-6 py-4 text-left bg-white text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-colors font-medium"
                            >
                              Créditos
                            </MobileNavLink>
                            <MobileNavLink
                              href="/#reviews"
                              className="w-full px-6 py-4 text-left bg-white text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-colors font-medium"
                            >
                              Opiniones
                            </MobileNavLink>
                            <MobileNavLink
                              href="/contacto"
                              className="w-full px-6 py-4 text-left bg-white text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-colors font-medium"
                            >
                              Contacto
                            </MobileNavLink>
                          </div>
                          <div className="mt-6 px-4">
                            {/* Widget del Dólar en móvil */}
                            <div className="flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg px-3 py-3 mb-4 shadow-sm">
                              <DollarSign className="h-4 w-4 text-blue-600 mr-3 flex-shrink-0" />
                              <div className="flex flex-col items-center">
                                <span className="text-xs text-blue-600 font-medium">Dólar Blue</span>
                                {isLoading ? (
                                  <div className="flex items-center gap-2">
                                    <RefreshCw className="h-3 w-3 animate-spin text-blue-600" />
                                    <span className="text-sm text-blue-600">Actualizando...</span>
                                  </div>
                                ) : dollarRate ? (
                                  <span className="text-lg font-bold text-blue-700">
                                    ${dollarRate.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                  </span>
                                ) : (
                                  <span className="text-lg font-bold text-gray-500">N/A</span>
                                )}
                                {lastUpdated && !isLoading && (
                                  <span className="text-xs text-blue-500 mt-1">
                                    Actualizado: {lastUpdated.toLocaleTimeString('es-AR', { 
                                      hour: '2-digit', 
                                      minute: '2-digit' 
                                    })}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 flex flex-col gap-4 p-4">
                            {status === 'authenticated' ? (
                              <ProfileDropdown
                                user={session.user}
                                onClose={() => setDropdownOpen(false)}
                                handleLogout={handleLogout}
                              />                            ) : (
                              <div className="flex flex-col gap-3 w-full">
                                <Button
                                  href="/login"
                                  variant="outline"
                                  className="text-gray-700 border-gray-300 hover:bg-gray-50 justify-center"
                                >
                                  Ingresar
                                </Button>
                                <Button
                                  href="/register"
                                  variant="solid"
                                  className="bg-blue-600 hover:bg-blue-700 text-white justify-center shadow-sm"
                                >
                                  Registrarme
                                </Button>
                              </div>
                            )}
                          </div>
                        </PopoverPanel>
                      </>
                    )}
                  </AnimatePresence>
                </>
              )}
            </Popover>            <div className="hidden lg:flex items-center space-x-4">
              {/* Selector de moneda */}
              <div className="relative">
                <button
                  onClick={() => setIsOpenCurrency(!isOpenCurrency)}
                  className="flex items-center text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100 px-3 py-2 text-sm transition-colors"
                >
                  <span className="mr-2">
                    <span className={`fi fi-${currentCurrency.flagCode}`} />
                  </span>
                  <span className="hidden sm:inline">
                    {currentCurrency.name}
                  </span>
                  <ChevronDown className="h-4 w-4 ml-2" />
                </button>
                {isOpenCurrency && (
                  <div className="absolute top-[calc(100%+0.5rem)] left-0 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black/5 z-50 overflow-hidden">
                    <div className="py-1">
                      {currencies.map((currency, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setCurrentCurrency(currency)
                            setIsOpenCurrency(false)
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                        >
                          <span className="mr-2">
                            <span className={`fi fi-${currency.flagCode}`} />
                          </span>
                          {currency.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Widget del Dólar Blue */}
              <div className="flex items-center bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg px-3 py-2 min-w-[140px] shadow-sm">
                <DollarSign className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs text-blue-600 font-medium">Dólar Blue</span>
                  <div className="flex items-center gap-1">
                    {isLoading ? (
                      <div className="flex items-center gap-1">
                        <RefreshCw className="h-3 w-3 animate-spin text-blue-600" />
                        <span className="text-xs text-blue-600">...</span>
                      </div>
                    ) : dollarRate ? (
                      <span className="text-sm font-bold text-blue-700 truncate">
                        ${dollarRate.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </span>
                    ) : (
                      <span className="text-sm font-bold text-gray-500">N/A</span>
                    )}
                  </div>
                  {lastUpdated && !isLoading && (
                    <span className="text-xs text-blue-500 truncate">
                      {lastUpdated.toLocaleTimeString('es-AR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  )}
                </div>
              </div>

              {/* Separador visual */}
              <div className="h-8 w-px bg-gray-200" />

              {/* Botones de autenticación */}              {status === 'authenticated' ? (
                <ProfileDropdown
                  user={session.user}
                  onClose={() => setDropdownOpen(false)}
                  handleLogout={handleLogout}
                />
              ) : (
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    href="/login"
                    className="text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                  >
                    Ingresar
                  </Button>
                  <Button 
                    href="/register"
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all duration-200 hover:shadow-md"
                  >
                    Registrarme
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Container>
      </nav>
    </header>
  )
}
