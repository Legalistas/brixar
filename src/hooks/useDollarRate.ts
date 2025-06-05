'use client'

import { useState, useEffect } from 'react'
import { getDollarRate, updateDollarFromAPI } from '@/services/currency-service'

export const useDollarRate = () => {
  const [dollarRate, setDollarRate] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchDollarRate = async () => {
    try {
      const dollarData = await getDollarRate()
      setDollarRate(dollarData.rate)
      setLastUpdated(new Date(dollarData.lastUpdated))
    } catch (error) {
      console.error('Error fetching dollar rate:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateDollarRate = async () => {
    try {
      setIsLoading(true)
      
      // Primero actualizar desde la API externa
      await updateDollarFromAPI()
      
      // Luego obtener el valor actualizado
      await fetchDollarRate()
      
    } catch (error) {
      console.error('Error updating dollar rate:', error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Al cargar el componente, primero actualizar y luego obtener
    const initializeDollar = async () => {
      try {
        // Actualizar desde la API al entrar
        await updateDollarFromAPI()
        // Obtener el valor actualizado
        await fetchDollarRate()
      } catch (error) {
        console.error('Error initializing dollar rate:', error)
        // Si falla la actualización, al menos intentar obtener el valor existente
        await fetchDollarRate()
      }
    }

    initializeDollar()

    // Configurar actualización automática cada 30 minutos
    const interval = setInterval(() => {
      updateDollarRate()
    }, 30 * 60 * 1000) // 30 minutos

    return () => clearInterval(interval)
  }, [])

  return {
    dollarRate,
    isLoading,
    lastUpdated,
    updateDollarRate,
    refreshRate: fetchDollarRate
  }
}
