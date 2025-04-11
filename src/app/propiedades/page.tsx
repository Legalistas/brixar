"use client";

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import Properties from '@/components/Property/PropertyContainer'
import { useState } from 'react'
import Sidebar from './sidebar'

export default function Home() {
  const [filters, setFilters] = useState({})

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
  }

  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar onFilterChange={handleFilterChange} />
        <Properties filters={filters} separateByStatus={true} />
      </div>
      <Footer />
    </>
  )
}