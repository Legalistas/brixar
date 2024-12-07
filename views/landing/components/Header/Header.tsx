'use client'

import { useState } from 'react'
import { Search, Menu, ShoppingCart, Home, Gift, Zap, ChevronDown, Car, Truck, FuelIcon as Oil, HardHat, Wrench, Gauge, Cog, Lightbulb, Tag, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCurrency } from '@/context/CurrencyContext'

interface HeaderProps {
    onCartClick: () => void
}

export default function Header({ onCartClick }: HeaderProps) {
    const [isOpenCategories, setIsOpenCategories] = useState(false)
    const [isOpenCurrency, setIsOpenCurrency] = useState(false)
    const { currencies, currentCurrency, setCurrentCurrency } = useCurrency()

    const categories = [
        { icon: <Car className="h-5 w-5" />, name: "Autos y Camionetas" },
        { icon: <Truck className="h-5 w-5" />, name: "Camiones - Colectivos" },
        { icon: <Oil className="h-5 w-5" />, name: "Aceites y filtros" },
        { icon: <HardHat className="h-5 w-5" />, name: "Accesorios" },
        { icon: <Wrench className="h-5 w-5" />, name: "Herramientas" },
        { icon: <Gauge className="h-5 w-5" />, name: "Neumáticos" },
        { icon: <Cog className="h-5 w-5" />, name: "Equipamiento 4x4" },
        { icon: <Lightbulb className="h-5 w-5" />, name: "Iluminación" },
        { icon: <Tag className="h-5 w-5" />, name: "Ofertas" },
    ]

    return (
        <header className="bg-[#1D1D1B] text-white">
            <div className="container mx-auto px-4">
                {/* Upper section with logo, search, and actions */}
                <div className="py-3 border-b border-white/10">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <button className="text-white md:hidden">
                                <Menu className="h-6 w-6" />
                            </button>
                            <div className="relative w-[100px] h-[100px]">
                                <Image
                                    src="/assets/Alta-Blanco.png"
                                    alt="Alta Telefonia Logo"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </div>

                        <div className="flex-1 max-w-xl">
                            <div className="relative">
                                <input
                                    placeholder="Busque em toda loja..."
                                    className="w-full bg-white text-black pl-4 pr-10 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                                />
                                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                    <Search className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <div className="relative">
                                <button
                                    onClick={() => setIsOpenCurrency(!isOpenCurrency)}
                                    className="flex items-center bg-transparent hover:bg-white/10 text-white px-3 py-2 rounded-lg transition-colors"
                                >
                                    <span className="mr-2">
                                        <span className={`fi fi-${currentCurrency.flagCode}`} />
                                    </span>
                                    <span className="hidden sm:inline">{currentCurrency.name}</span>
                                    <ChevronDown className="h-4 w-4 ml-2" />
                                </button>
                                {isOpenCurrency && (
                                    <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                            {currencies.map((currency, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => {
                                                        setCurrentCurrency(currency)
                                                        setIsOpenCurrency(false)
                                                    }}
                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                                                    role="menuitem"
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

                            <button
                                onClick={onCartClick}
                                className="hidden md:flex items-center hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
                            >
                                <ShoppingCart className="h-5 w-5 mr-2" />
                                Carrito
                            </button>
                            <Link href="/login" className="flex items-center hover:bg-white/10 px-3 py-2 rounded-lg transition-colors">
                                <User className="h-5 w-5 mr-2" />
                                Mi cuenta
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Navigation section */}
                <nav className="py-3 hidden md:block">
                    <ul className="flex gap-6">
                        <li className="relative">
                            <button
                                onClick={() => setIsOpenCategories(!isOpenCategories)}
                                className="text-white hover:text-gray-300 flex items-center transition-colors"
                            >
                                <Home className="h-4 w-4 mr-2" />
                                Todas as categorias
                                <ChevronDown className="h-4 w-4 ml-1" />
                            </button>
                            {isOpenCategories && (
                                <div className="absolute left-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                        {categories.map((category, index) => (
                                            <a
                                                key={index}
                                                href="#"
                                                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors border-b border-gray-100 last:border-b-0"
                                                role="menuitem"
                                            >
                                                <span className="text-gray-400 mr-3">{category.icon}</span>
                                                {category.name}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </li>
                        <li>
                            <button className="text-white hover:text-gray-300 flex items-center transition-colors">
                                <Gift className="h-4 w-4 mr-2" />
                                Novedades
                            </button>
                        </li>
                        <li>
                            <button className="text-white hover:text-gray-300 flex items-center transition-colors">
                                <Zap className="h-4 w-4 mr-2" />
                                Distribuidor Oficial
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}