'use client'

import React from 'react'
import PropertyDetail from './components/PropertyDetail'
import { useParams } from 'next/navigation'

function PropertyView() {
const params = useParams()
  const slug = params.slug as string
  return (
    <div>
        <PropertyDetail slug={slug} />
    </div>
  )
}

export default PropertyView