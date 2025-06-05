'use client'

import { useEffect } from 'react'
import { updateDollarFromAPI } from '@/services/currency-service'

// Componente que actualiza el dólar al cargar el dashboard
export const DollarUpdater = () => {
  useEffect(() => {
    const updateDollar = async () => {
      try {
        console.log('Actualizando cotización del dólar al cargar el dashboard...')
        await updateDollarFromAPI()
        console.log('Cotización del dólar actualizada exitosamente')
      } catch (error) {
        console.error('Error actualizando cotización del dólar:', error)
      }
    }

    updateDollar()
  }, [])

  return null // Este componente no renderiza nada visible
}

export default DollarUpdater
