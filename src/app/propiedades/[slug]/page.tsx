'use client'

import { useParams } from 'next/navigation'
import PropertyDetail from '@/components/Property/PropiedadDetail'

export default function PropertyDetailPage() {
  const params = useParams()
  const slug = params.slug as string

  return <PropertyDetail slug={slug} />
} 