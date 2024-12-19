'use client'

<<<<<<< HEAD
import { useEffect, useState } from "react";
import { getAllProperties } from "@/services/properties-service";
import PropertyCard from "./PropertyCard";
import Loading from "../ui/Loading";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

const PropertyContainer = () => {
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                setIsLoading(true);
                const response = await getAllProperties();
                setProperties(response);
            } catch (error) {
                console.error("Error fetching properties:", error);
            } finally {
                setIsLoading(false);
            }
        };
=======
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
>>>>>>> ac7e2fdde4c54eabab05ec1cfbbed16a06c6d3f8

  interface PropertyImage {
    url: string
    description?: string
  }

<<<<<<< HEAD

    return (
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pb-32 pt-20">
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {properties.map((property, index) => (
                            <PropertyCard key={index} property={property} />
                        ))}
                    </div>
                    {properties.length > 0 && (
                        <div className="mt-8 flex justify-center">
                            <Link href="/properties" className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-[#1c1c1c] hover:bg-gray-50 sm:px-8">
                                Ver más propiedades
                            </Link>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default PropertyContainer;

=======
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
>>>>>>> ac7e2fdde4c54eabab05ec1cfbbed16a06c6d3f8
