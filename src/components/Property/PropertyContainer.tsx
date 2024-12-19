'use client'

import { useEffect, useState } from 'react'
import { getAllProperties } from '@/services/properties-service'
import PropertyCard from './PropertyCard'

interface Filters {
  price?: number
  bedrooms?: number
  bathrooms?: number
  propertyType?: string
}

const PropertyContainer = ({ filters = {} as Filters }) => {
  interface Property {
    id: number
    slug: string
    title: string
    price: number
    bedrooms: number
    bathrooms: number
    squareMeters: number
    propertyType: 'HOUSE' | 'APARTMENT'
    listingType: 'SALE' | 'RENT'
    images: PropertyImage[]
    address: PropertyAddress[]
  }

  interface PropertyImage {
    url: string
    description?: string
  }

  interface PropertyAddress {
    street: string
    city: string
    state: string
    zipCode: string
  }

  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await getAllProperties()
        setProperties(response)
        setFilteredProperties(response)
      } catch (error) {
        console.error('Error fetching properties:', error)
      }
    }

    fetchProperties()
  }, [])

  useEffect(() => {
    let filtered = properties

    if (filters.price !== undefined) {
      filtered = filtered.filter(
        (property) =>
          filters.price !== undefined && property.price <= filters.price
      )
    }

    if (filters.bedrooms) {
      filtered = filtered.filter(
        (property) =>
          filters.bedrooms !== undefined &&
          property.bedrooms >= filters.bedrooms
      )
    }

    if (filters.bathrooms !== undefined) {
      filtered = filtered.filter(
        (property) =>
          filters.bathrooms !== undefined &&
          property.bathrooms >= filters.bathrooms
      )
    }

    if (filters.propertyType) {
      filtered = filtered.filter(
        (property) => property.propertyType === filters.propertyType
      )
    }

    setFilteredProperties(filtered)
  }, [filters, properties])

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pb-32 pt-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredProperties.map((property, index) => (
          <PropertyCard
            key={index}
            // @ts-expect-error PropertyCard expects an id, not an index
            property={property}
          />
        ))}
      </div>
    </div>
  )
}

export default PropertyContainer
