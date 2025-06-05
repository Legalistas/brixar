'use client'

import { useState, useRef, useEffect } from 'react'
import { DollarSign, ArrowLeftRight } from 'lucide-react'
import { useCurrency } from '@/context/CurrencyContext'

const CurrencyFloatingBubble = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { currencies, currentCurrency, setCurrentCurrency } = useCurrency()
  const bubbleRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Filtrar solo pesos argentinos y dólares
  const availableCurrencies = currencies.filter(currency => 
    currency.code === 'ARS' || currency.code === 'USD'
  )

  const toggleCurrency = () => {
    const otherCurrency = availableCurrencies.find(currency => 
      currency.code !== currentCurrency.code
    )
    if (otherCurrency) {
      setCurrentCurrency(otherCurrency)
    }
  }

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsExpanded(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsExpanded(false)
    }, 300) // Delay de 300ms antes de cerrar
  }

  // Cleanup del timeout al desmontar el componente
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])
  return (
    <div className="fixed bottom-6 left-6 z-[9999]" ref={bubbleRef}>
      <div className="relative">
        {/* Burbuja principal */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          title="Cambiar moneda"
        >
          <div className="flex items-center gap-2">
            <span className={`fi fi-${currentCurrency.flagCode} text-sm`} />
            <span className="text-sm font-medium">
              {currentCurrency.code}
            </span>
            <ArrowLeftRight className="h-4 w-4" />
          </div>
        </button>

        {/* Menu expandido */}
        {isExpanded && (
          <div 
            className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden min-w-[180px] z-[10000]"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >            <div className="py-1">
              {availableCurrencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => {
                    setCurrentCurrency(currency)
                    setIsExpanded(false)
                    if (timeoutRef.current) {
                      clearTimeout(timeoutRef.current)
                      timeoutRef.current = null
                    }
                  }}
                  className={`flex items-center w-full px-4 py-3 text-sm transition-colors ${
                    currentCurrency.code === currency.code
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-3">
                    <span className={`fi fi-${currency.flagCode} text-base`} />
                  </span>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{currency.code}</span>
                    <span className="text-xs text-gray-500 truncate">
                      {currency.name}
                    </span>
                  </div>
                  {currentCurrency.code === currency.code && (
                    <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
            
            {/* Botón de intercambio rápido */}
            <div className="border-t border-gray-100">
              <button
                onClick={() => {
                  toggleCurrency()
                  setIsExpanded(false)
                  if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current)
                    timeoutRef.current = null
                  }
                }}
                className="flex items-center justify-center w-full px-4 py-3 text-sm text-blue-600 hover:bg-blue-50 transition-colors font-medium"
              >
                <ArrowLeftRight className="h-4 w-4 mr-2" />
                Intercambiar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CurrencyFloatingBubble
