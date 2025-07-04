'use client'
import { type ClassValue } from "class-variance-authority/types"
import clsx from "clsx"
import { twMerge } from "tailwind-merge"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useRef } from 'react'
 
export function cn(...inputs: any[]) {
  return twMerge(clsx(...inputs))
}

/**
 * Genera un SKU único para una propiedad basado en su ID y título
 * 
 * @param id - ID de la propiedad
 * @param title - Título de la propiedad
 * @returns Un SKU alfanumérico único
 */
export const generatePropertySku = (id: number, title: string): string => {
  // Convierte el título a minúsculas y remueve caracteres especiales
  const normalizedTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]/gi, '') // Elimina todos los caracteres que no son alfanuméricos
    .substring(0, 15); // Toma solo los primeros 15 caracteres como máximo
  
  // Formatea el SKU combinando el ID con el título normalizado
  return `BX-${id}-${normalizedTitle}`;
};

// export const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       //staleTime: 1000 * 60 * 5, // 5 minutos
//       retry: 1,
//       refetchOnWindowFocus: false,
//     },
//     mutations: {
//       retry: 1,
//     },
//   },
// })
