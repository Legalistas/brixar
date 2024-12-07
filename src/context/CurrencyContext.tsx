'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { getAllCurrencies, fetchAndUpdateRates } from '@/services/currency-service'

interface Currency {
    id: number
    code: string
    name: string
    symbol: string
    rate: number
    flagCode: string
}

interface CurrencyContextType {
    currencies: Currency[]
    currentCurrency: Currency
    setCurrentCurrency: (currency: Currency) => void
    convertPrice: (price: number) => number
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export const useCurrency = () => {
    const context = useContext(CurrencyContext)
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider')
    }
    return context
}

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currencies, setCurrencies] = useState<Currency[]>([])
    const [currentCurrency, setCurrentCurrency] = useState<Currency>({
        id: 0,
        code: 'USD',
        name: 'US Dollar',
        symbol: '$',
        rate: 1,
        flagCode: 'us'
    })

    useEffect(() => {
        const fetchCurrencies = async () => {
            const fetchedCurrencies = await getAllCurrencies()
            setCurrencies(fetchedCurrencies)
            if (fetchedCurrencies.length > 0) {
                setCurrentCurrency(fetchedCurrencies[0])
            }
        }

        fetchCurrencies()
        fetchAndUpdateRates() // Actualiza las tasas al inicio

        // Actualiza las tasas cada hora
        const interval = setInterval(fetchAndUpdateRates, 60 * 60 * 1000)

        return () => clearInterval(interval)
    }, [])

    const convertPrice = (price: number) => {
        return price * currentCurrency.rate
    }

    return (
        <CurrencyContext.Provider value={{ currencies, currentCurrency, setCurrentCurrency, convertPrice }}>
            {children}
        </CurrencyContext.Provider>
    )
}