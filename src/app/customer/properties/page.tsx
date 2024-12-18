'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { LayoutGrid, List, Maximize, Home, Bath, BedDouble, Building2 } from 'lucide-react'
import { getAllProperties } from '@/services/properties-service'
import { formatCurrency } from '@/utils/formatUtils'
import { useCurrency } from '@/context/CurrencyContext'

interface PropertyImage {
    id: number;
    url: string;
    propertyId: number;
}

interface PropertyAddress {
    city: string;
    streetName: string;
    state: {
        name: string;
    };
    country: {
        name: string;
    };
}

interface Property {
    id: number;
    slug: string;
    title: string;
    price: string;
    bedrooms: number;
    bathrooms: number;
    squareMeters: number;
    propertyType: 'HOUSE' | 'APARTMENT';
    listingType: 'SALE' | 'RENT';
    images: PropertyImage[];
    address: PropertyAddress[];
}

const propertyTypeIcons = {
    HOUSE: Home,
    APARTMENT: Building2
};

const sortProperties = (properties: Property[], sortBy: string) => {
    return [...properties].sort((a, b) => {
        switch (sortBy) {
            case 'price_asc':
                return Number(a.price) - Number(b.price);
            case 'price_desc':
                return Number(b.price) - Number(a.price);
            case 'recent':
            default:
                // Asumiendo que el ID más alto es el más reciente
                return b.id - a.id;
        }
    });
};

export default function PropertiesPage() {
    const { convertPrice } = useCurrency();
    const [properties, setProperties] = useState<Property[]>([])
    const [view, setView] = useState<'grid' | 'list'>('grid')
    const [propertyTypeFilter, setPropertyTypeFilter] = useState<string[]>(['HOUSE', 'APARTMENT'])
    const [sortBy, setSortBy] = useState('recent')
    const [isLoading, setIsLoading] = useState(true)


    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const data = await getAllProperties()
                setProperties(sortProperties(data, sortBy))
            } catch (error) {
                console.error('Error fetching properties:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchProperties()
    }, [sortBy])

    const toggleFilter = (filter: string) => {
        setPropertyTypeFilter(prev =>
            prev.includes(filter)
                ? prev.filter(f => f !== filter)
                : [...prev, filter]
        )
    }

    const formatPropertyType = (type: string) => {
        return type === 'HOUSE' ? 'Casa' : 'Departamento'
    }

    const formatListingType = (type: string) => {
        return type === 'SALE' ? 'Venta' : 'Alquiler'
    }

    return (
        <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">
                        Propiedades <span className="text-[#FB6107]">en venta</span>
                    </h1>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <span className="text-gray-600">Ver:</span>
                        <div className="flex gap-2">
                            {['HOUSE', 'APARTMENT'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => toggleFilter(type)}
                                    className={`px-3 w-full py-2 rounded text-xs transition-colors
                                    ${propertyTypeFilter.includes(type)
                                            ? 'bg-[#FB6107] text-white'
                                            : 'bg-white border border-gray-300 text-gray-700 hover:border-[#FB6107]'
                                        }`}
                                >
                                    {formatPropertyType(type)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setView('grid')}
                                className={`p-2 rounded ${view === 'grid' ? 'text-[#FB6107]' : 'text-gray-400'}`}
                            >
                                <LayoutGrid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setView('list')}
                                className={`p-2 rounded ${view === 'list' ? 'text-[#FB6107]' : 'text-gray-400'}`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>

                        <select
                            value={sortBy}
                            onChange={(e) => {
                                setSortBy(e.target.value);
                                setProperties(prevProperties => sortProperties(prevProperties, e.target.value));
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white"
                        >
                            <option value="recent">Más recientes</option>
                            <option value="price_asc">Precio: Menor a Mayor</option>
                            <option value="price_desc">Precio: Mayor a Menor</option>
                        </select>

                    </div>
                </div>

                {/* Property Grid/List */}
                <div className={`grid ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                    {properties
                        .filter(property => propertyTypeFilter.includes(property.propertyType))
                        .map((property) => {
                            const mainAddress = property.address[0];
                            return (
                                <div key={property.id} className={`bg-white rounded-lg overflow-hidden shadow border border-gray-200 transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg ${view === 'list' ? 'flex' : ''}`}>
                                    {/* Image Container */}
                                    <div className={`relative ${view === 'grid' ? 'h-48 w-full' : 'h-40 w-40'} overflow-hidden`}>
                                        <Image
                                            src={process.env.NEXT_PUBLIC_BASE_URL + '/uploads/' + property.images[0]?.url || "/placeholder.svg"}
                                            alt={`Imagen de ${property.title}`}
                                            fill
                                            className="object-cover transition-transform duration-300 ease-in-out hover:scale-110"
                                        />
                                        {/* Price Tag */}
                                        <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                            {formatCurrency(convertPrice(Number(property.price)))}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className={`p-4 ${view === 'list' ? 'flex-grow' : ''}`}>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {property.title}
                                        </h3>

                                        {/* Property Details Grid */}
                                        <div className="grid grid-cols-2 gap-2 mb-2">
                                            {/* Area */}
                                            <div className="flex items-center gap-1 text-gray-600">
                                                <Maximize className="h-4 w-4" />
                                                <span className="text-xs">{property.squareMeters} m²</span>
                                            </div>

                                            {/* Property Type */}
                                            <div className="flex items-center gap-1 text-gray-600">
                                                {React.createElement(propertyTypeIcons[property.propertyType] || Home, { className: "h-4 w-4" })}
                                                <span className="text-xs">{formatPropertyType(property.propertyType)}</span>
                                            </div>

                                            {/* Bathrooms */}
                                            <div className="flex items-center gap-1 text-gray-600">
                                                <Bath className="h-4 w-4" />
                                                <span className="text-xs">{property.bathrooms} Baño{property.bathrooms > 1 ? 's' : ''}</span>
                                            </div>

                                            {/* Bedrooms */}
                                            <div className="flex items-center gap-1 text-gray-600">
                                                <BedDouble className="h-4 w-4" />
                                                <span className="text-xs">{property.bedrooms} Dormitorio{property.bedrooms > 1 ? 's' : ''}</span>
                                            </div>
                                        </div>

                                        {/* Address */}
                                        <div className="text-xs text-gray-600 mb-2">
                                            <p>{mainAddress.streetName}, {mainAddress.city}</p>
                                            <p>{mainAddress.state.name}, {mainAddress.country.name}</p>
                                        </div>

                                        {/* Listing Type */}
                                        <div className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">
                                            {formatListingType(property.listingType)}
                                        </div>
                                    </div>
                                    <div className={`p-4 ${view === 'list' ? 'border-l' : 'border-t'} border-gray-200`}>
                                        <Link href={`/customer/properties/${property.slug}`} className="p-2 text-xs font-medium block text-center rounded-md bg-[#FB6107] hover:bg-[#FB6107]/90 text-white transition-colors">Ver detalles</Link>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    )
}

