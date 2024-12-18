'use client'

import { useEffect, useState, useRef } from "react";
import GeneralCard from "@/components/ui/Cards/GeneralCard";
import { Property } from "@/types/property";
import PropertiesCard from "./PropertiesCard";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllVisits } from "@/services/visit-service";
import { useSession } from "next-auth/react";
import EmptyVisits from "../EmptyVisits/EmptyVisits";

interface Visit {
    id: number;
    propertyId: number;
    userId: number;
    visitDate: Date;
    createdAt: string;
    updatedAt: string;
    property: Property;
}

const Properties = () => {
    const [visits, setVisits] = useState<Visit[]>([]);
    const carouselRef = useRef<HTMLDivElement>(null);
    const { data: session } = useSession()

    useEffect(() => {
        const fetchVisits = async () => {
            try {
                const response = await getAllVisits(Number(session?.user.id));
                setVisits(response.existingVisit);
            } catch (error) {
                console.error('Error fetching visits:', error);
            }
        };

        if (session?.user.id) {
            fetchVisits();
        }
    }, [session?.user.id]);

    const scroll = (direction: 'left' | 'right') => {
        if (carouselRef.current) {
            const { scrollLeft, clientWidth } = carouselRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            carouselRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <GeneralCard
            title="Visitas programadas"
            className="h-auto p-4"
        >
            {visits.length > 0 ? (
                <div className="relative">
                    <div
                        ref={carouselRef}
                        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                    >
                        {visits.map((visit, index) => (
                            <div key={visit.id} className="flex-none w-full md:w-1/2 lg:w-1/3 snap-start">
                                <div className="p-2">
                                    <PropertiesCard property={visit.property} visitDate={visit.visitDate} />
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
                <EmptyVisits />
            )}
        </GeneralCard>
    )
};

export default Properties;
