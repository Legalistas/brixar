"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_ENDPOINTS } from "@/constants/api-endpoint";
import { PropertyState, ListingType } from "@prisma/client";

export default function PublicarPropiedad() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Estados para el formulario
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    bedrooms: 0,
    bathrooms: 0,
    squareMeters: 0,
    propertyType: PropertyState.APARTMENT,
    listingType: ListingType.SALE,
    isAvailable: true,
    yearBuilt: new Date().getFullYear(),
    parkingSpaces: 0,
    quantity: 1,
    amenities: {},
    address: {
      countryId: 0,
      stateId: 0,
      city: "",
      postalCode: "",
      streetName: "",
      description: "",
      positions: {
        latitude: "",
        longitude: "",
      },
    },
  });

  // Cargar países al montar el componente
  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.COUNTRIES_INDEX);
      const data = await res.json();
      setCountries(data);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  // ...existing code...

  return (
    // ...existing code...
  );
}
