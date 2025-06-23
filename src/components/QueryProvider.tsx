'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useRef } from 'react'

export default function QueryProvider({ children }: { children: ReactNode }) {
  const queryClientRef = useRef<QueryClient>()
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient({
      defaultOptions: {
        queries: {
          retry: 1,
          refetchOnWindowFocus: false,
        },
        mutations: {
          retry: 1,
        },
      },
    })
  }

  return (
    <QueryClientProvider client={queryClientRef.current}>
      {children}
    </QueryClientProvider>
  )
}