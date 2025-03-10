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
    DisclosurePanel
} from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { NavLinks } from '@/components/NavLinks'
import LogoBrixar from './LogoBrixar'
import { ChevronDown, FileText, Gift, LogOut, User } from 'lucide-react'
import { useSession, signOut } from "next-auth/react"
import { useCurrency } from '@/context/CurrencyContext'

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

interface MobileNavLinkProps extends React.ComponentPropsWithoutRef<typeof Link> { }

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ href, ...props }: MobileNavLinkProps) => {
    return (
        <PopoverButton
            as={Link as any}
            href={href}
            className="text-base font-medium text-black hover:text-gray-700"
            {...props}
        />
    )
}

const ProfileDropdown: React.FC<{ user: any; onClose: () => void; handleLogout: () => void }> = ({ user, onClose, handleLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();


    const toggleDropdown = () => setIsOpen(!isOpen);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    const handleProfileClick = () => {
        if (user.role === "ADMIN") {
            router.push("/admin");
        } else if (user.role === "CUSTOMER") {
            router.push("/customer");
        }
        setIsOpen(false);
        onClose();
    };

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
                    className={`hidden sm:block h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
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
                        <button className="flex w-full items-center px-4 py-2 text-md text-gray-700 hover:bg-gray-100">
                            <FileText className="h-6 w-6 mr-2" />
                            Documentos personales
                        </button>
                        <button className="flex w-full items-center px-4 py-2 text-md text-gray-700 hover:bg-gray-100">
                            <Gift className="h-6 w-6 mr-2" />
                            Invitar
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
    );
};

export const Header: React.FC = () => {
    const { data: session, status } = useSession()
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [isOpenCurrency, setIsOpenCurrency] = useState(false)
    const { currencies, currentCurrency, setCurrentCurrency } = useCurrency()

    const handleLogout = async () => {
        await signOut()
    }

    return (
        <header>
            <nav>
                <Container className="relative z-50 flex justify-between py-8  rounded-e-md">
                    <div className="relative z-10 flex items-center gap-16">
                        <Link href="/" aria-label="Home">
                            <LogoBrixar className="h-8 w-auto hidden lg:flex" />
                            <Popover className="lg:hidden">
                                {({ open }) => (
                                    <>
                                        <LogoBrixar
                                            className={`h-8 w-auto transition-colors duration-200 ${open ? '[&>path]:fill-white' : '[&>path]:fill-black'}`}
                                            data-headlessui-state={open ? 'open' : undefined}
                                        />
                                    </>
                                )}
                            </Popover>
                        </Link>
                        <div className="hidden lg:flex lg:gap-10">
                            <NavLinks />
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <Popover className="lg:hidden">
                            {({ open }) => (
                                <>

                                    <PopoverButton
                                        className="relative z-10 -m-2 inline-flex items-center text-white rounded-lg stroke-gray-900 p-2 hover:bg-gray-200/50 hover:stroke-gray-600 active:stroke-gray-900 ui-not-focus-visible:outline-none"
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
                                                />
                                                <PopoverPanel
                                                    static
                                                    as={motion.div}
                                                    initial={{ opacity: 0, y: -32 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{
                                                        opacity: 0,
                                                        y: -32,
                                                        transition: { duration: 0.2 },
                                                    }}
                                                    className="absolute inset-x-0 top-0 z-0 origin-top bg-white px-0 pb-6 pt-32 shadow-2xl shadow-gray-900/20"
                                                >
                                                    <div className="flex flex-col">
                                                        <MobileNavLink href="/" className="w-full px-4 py-3 text-left bg-white text-black hover:bg-gray-100">
                                                            Inicio
                                                        </MobileNavLink>

                                                        <Disclosure>
                                                            {({ open }) => (
                                                                <>
                                                                    <DisclosureButton className="flex justify-between w-full px-4 py-3 bg-white text-black hover:bg-gray-100">
                                                                        <span>Propiedades</span>
                                                                        <ChevronDown className={`w-5 h-5 transition-transform ${open ? 'transform rotate-180' : ''}`} />
                                                                    </DisclosureButton>
                                                                    <DisclosurePanel className="bg-gray-100">
                                                                        <MobileNavLink href="/propiedades/venta" className="block w-full px-6 py-2 text-black hover:bg-gray-200">
                                                                            En venta
                                                                        </MobileNavLink>
                                                                        <MobileNavLink href="/propiedades/alquiler" className="block w-full px-6 py-2 text-black hover:bg-gray-200">
                                                                            En alquiler
                                                                        </MobileNavLink>
                                                                    </DisclosurePanel>
                                                                </>
                                                            )}
                                                        </Disclosure>

                                                        <Disclosure>
                                                            {({ open }) => (
                                                                <>
                                                                    <DisclosureButton className="flex justify-between w-full px-4 py-3 bg-white text-black hover:bg-gray-100">
                                                                        <span>Proyectos</span>
                                                                        <ChevronDown className={`w-5 h-5 transition-transform ${open ? 'transform rotate-180' : ''}`} />
                                                                    </DisclosureButton>
                                                                    <DisclosurePanel className="bg-gray-100">
                                                                        <MobileNavLink href="/proyectos/residenciales" className="block w-full px-6 py-2 text-black hover:bg-gray-200">
                                                                            Residenciales
                                                                        </MobileNavLink>
                                                                        <MobileNavLink href="/proyectos/comerciales" className="block w-full px-6 py-2 text-black hover:bg-gray-200">
                                                                            Comerciales
                                                                        </MobileNavLink>
                                                                    </DisclosurePanel>
                                                                </>
                                                            )}
                                                        </Disclosure>

                                                        <MobileNavLink href="/creditos" className="w-full px-4 py-3 text-left bg-white text-black hover:bg-gray-100">
                                                            Créditos
                                                        </MobileNavLink>

                                                        <Disclosure>
                                                            {({ open }) => (
                                                                <>
                                                                    <DisclosureButton className="flex justify-between w-full px-4 py-3 bg-white text-black hover:bg-gray-100">
                                                                        <span>Opiniones</span>
                                                                        <ChevronDown className={`w-5 h-5 transition-transform ${open ? 'transform rotate-180' : ''}`} />
                                                                    </DisclosureButton>
                                                                    <DisclosurePanel className="bg-gray-100">
                                                                        <MobileNavLink href="/#reviews" className="block w-full px-6 py-2 text-black hover:bg-gray-200">
                                                                            Ver todas
                                                                        </MobileNavLink>
                                                                        <MobileNavLink href="/opiniones/destacadas" className="block w-full px-6 py-2 text-black hover:bg-gray-200">
                                                                            Destacadas
                                                                        </MobileNavLink>
                                                                    </DisclosurePanel>
                                                                </>
                                                            )}
                                                        </Disclosure>

                                                        <MobileNavLink href="/contacto" className="w-full px-4 py-3 text-left bg-white text-black hover:bg-gray-100">
                                                            Contacto
                                                        </MobileNavLink>
                                                    </div>
                                                    <div className="mt-8 flex flex-col gap-4 p-4">
                                                        {status === 'authenticated' ? (
                                                            <ProfileDropdown
                                                                user={session.user}
                                                                onClose={() => setDropdownOpen(false)}
                                                                handleLogout={handleLogout}
                                                            />
                                                        ) : (
                                                            <>
                                                                <Button href="/login" variant="outline" className='text-black'>
                                                                    Ingresar
                                                                </Button>
                                                                <Button href="/register" variant='solid' className='bg-blue-600 hover:bg-blue-700 text-white'>Registrarme</Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </PopoverPanel>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </>
                            )}
                        </Popover>
                        <div className='hidden lg:flex space-x-3'>
                            <div className="relative">
                                <button
                                    onClick={() => setIsOpenCurrency(!isOpenCurrency)}
                                    className="flex items-center text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100 px-3 py-2 text-sm"
                                >
                                    <span className="mr-2">
                                        <span className={`fi fi-${currentCurrency.flagCode}`} />
                                    </span>
                                    <span className="hidden sm:inline">{currentCurrency.name}</span>
                                    <ChevronDown className="h-4 w-4 ml-2" />
                                </button>
                                {isOpenCurrency && (
                                    <div
                                        className="absolute top-[calc(100%+0.5rem)] left-0 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black/5 z-50 overflow-hidden">
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
                            {status === 'authenticated' ? (
                                <ProfileDropdown
                                    user={session.user}
                                    onClose={() => setDropdownOpen(false)}
                                    handleLogout={handleLogout}
                                />
                            ) : (
                                <>
                                    <Button variant="outline" href="/login" className='text-white'>
                                        Ingresar
                                    </Button>
                                    <Button href="/register">Registrarme</Button>
                                </>
                            )}
                        </div>
                    </div>
                </Container>
            </nav>
        </header>
    )
}

