'use client';

import { useEffect, useRef } from 'react';

interface GoogleMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  height?: string;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export function GoogleMap({ latitude, longitude, zoom = 15, height = '400px' }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  useEffect(() => {
    // Función para inicializar el mapa
    const initializeMap = () => {
      if (!mapRef.current) return;
      
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: latitude, lng: longitude },
        zoom,
        mapTypeControl: false,
      });
      
      // Agregar marcador
      new window.google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map,
        animation: window.google.maps.Animation.DROP,
      });
    };

    // Si la API de Google Maps ya está cargada
    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }

    // Si la API no está cargada, la cargamos
    window.initMap = initializeMap;
    
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
    script.async = true;
    script.defer = true;
    
    document.head.appendChild(script);

    return () => {
      // Limpiar el script cuando el componente se desmonte
      if (window.initMap === initializeMap) {
        window.initMap = () => {};
      }
    };
  }, [latitude, longitude, zoom, apiKey]);

  return (
    <div 
      ref={mapRef} 
      className="w-full rounded-lg overflow-hidden"
      style={{ height }}
    />
  );
}