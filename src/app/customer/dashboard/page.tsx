'use client'

import React, { useState, useEffect } from 'react'
import QuickStats from './components/QuickStats/QuickStats'
import Properties from './components/Properties/Properties'
import Projects from './components/Projects/Projects'
import { Property } from '@/types/property'

export default function AdminDashboard() {
  const [statistics, setStatistics] = useState({
    brixs: 0,
    totalBrixs: 0,
    projects: 0,
    properties: 0,
    allProperties: [] as Property[],
  })

  useEffect(() => {
    // Simulating data fetch
    setStatistics({
      brixs: 10,
      totalBrixs: 10 * 1000,
      projects: 1,
      properties: 2,
      allProperties: [],
    })
  }, [])

  return (
    <section className="p-8 rounded-xl bg-white shadow-lg border border-gray-100">
      <div className="flex flex-col gap-6">
        <div className="border-b pb-5">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
            Panel de Control
          </h1>
          <p className="mt-2 text-gray-600">
            Bienvenido al panel de control de Brixar
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 mt-4">
          <div className="flex-1 p-6 bg-orange-50 rounded-lg border border-orange-100 flex items-center">
            <div className="p-3 bg-orange-100 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-orange-900">Explora tus propiedades</p>
              <p className="text-sm text-gray-500">Gestiona tus inversiones inmobiliarias</p>
            </div>
          </div>
          
          <div className="flex-1 p-6 bg-blue-50 rounded-lg border border-blue-100 flex items-center">
            <div className="p-3 bg-blue-100 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-blue-900">Gestión financiera</p>
              <p className="text-sm text-gray-500">Revisa el rendimiento de tus Brixs</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-6 bg-gray-50 rounded-lg border border-gray-100 flex items-center">
          <div className="p-3 bg-gray-100 rounded-full mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Para comenzar</p>
            <p className="text-sm text-gray-500">Utiliza el menú lateral para navegar por las diferentes secciones</p>
          </div>
        </div>
      </div>
    </section>
  )
}
