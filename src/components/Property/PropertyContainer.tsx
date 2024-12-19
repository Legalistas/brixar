"use client";

import { useEffect, useState } from "react";
import { getAllProperties } from "@/services/properties-service";
import PropertyCard from "./PropertyCard";

const PropertyContainer = () => {
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await getAllProperties();
                setProperties(response);
            } catch (error) {
                console.error("Error fetching properties:", error);
            }
        };

        fetchProperties();
    }, []);

    return (
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pb-32 pt-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {properties.map((property, index) => (
                    <PropertyCard key={index} property={property} />
                ))}
            </div>
        </div>
    );
};

export default PropertyContainer;