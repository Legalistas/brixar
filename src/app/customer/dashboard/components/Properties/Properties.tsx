'use client'

import { useEffect, useState, useRef } from "react";
import GeneralCard from "@/components/ui/Cards/GeneralCard";
import { Property } from "@/types/property";
import { getAllProperties } from "@/services/properties-service";
import PropertiesCard from "./PropertiesCard";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Properties = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await getAllProperties();
                setProperties(response);
            } catch (error) {
                console.error('Error fetching properties:', error);
            }
        };

        fetchProperties();
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (carouselRef.current) {
            const { scrollLeft, clientWidth } = carouselRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            carouselRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <GeneralCard
            title="Inmuebles disponibles"
            className="h-[550px] p-4"
        >
            {properties.length > 0 ? (
                <div className="relative">
                    <div
                        ref={carouselRef}
                        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                    >
                        {properties.map((property, index) => (
                            <div key={index} className="flex-none w-full md:w-1/2 lg:w-1/3 snap-start">
                                <div className="p-2">
                                    <PropertiesCard property={property} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 shadow-md"
                        aria-label="Previous property"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 shadow-md"
                        aria-label="Next property"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            ) : (
                <p>No hay inmuebles disponibles.</p>
            )}
        </GeneralCard>
    )
};

export default Properties;

