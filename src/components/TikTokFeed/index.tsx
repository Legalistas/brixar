"use client";

import React, { useState, useEffect } from 'react';
import { Container } from '@/components/Container';
import { TikTokScript } from './TikTokScript';
import Image from 'next/image';

interface TikTokVideo {
  url: string;
  previewImage?: string; // Nueva propiedad para la imagen de vista previa
}

interface TikTokFeedProps {
  videos: TikTokVideo[];
  channelUrl: string;
  previewImages?: boolean; // Nuevo parámetro para activar/desactivar las imágenes de vista previa
}

export function TikTokFeed({ videos, channelUrl, previewImages = true }: TikTokFeedProps) {
  // Estado para controlar qué videos se están reproduciendo
  const [playingVideos, setPlayingVideos] = useState<Record<number, boolean>>({});

  // Extraer el ID del video de la URL de TikTok
  const getVideoId = (url: string) => {
    const regex = /video\/(\d+)/;
    const match = url.match(regex);
    return match ? match[1] : '';
  };

  // Función para activar la reproducción de un video
  const handlePlayVideo = (index: number) => {
    setPlayingVideos(prev => ({
      ...prev,
      [index]: true
    }));
  };

  // Efecto para recargar el script de TikTok cuando se muestra un nuevo video
  useEffect(() => {
    if (Object.keys(playingVideos).length > 0) {
      // Si el script ya existe, lo eliminamos para volver a cargarlo
      const existingScript = document.getElementById('tiktok-embed-script');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
      
      // Crear y añadir el script de TikTok
      const script = document.createElement('script');
      script.id = 'tiktok-embed-script';
      script.src = 'https://www.tiktok.com/embed.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, [playingVideos]);

  // Imágenes de ejemplo por si no se proporcionan
  const defaultPreviewImages = [
    '/images/inmuebles/property1.jpg',
    '/images/inmuebles/property2.jpg',
    '/images/inmuebles/property3.jpg',
  ];

  return (
    <section id="tiktok-feed" className="py-20 bg-slate-50 sm:py-32">
      <TikTokScript />
      <Container>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Descubre nuestro contenido en TikTok
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Explora propiedades exclusivas y obtén consejos inmobiliarios a través de nuestros videos.
            </p>
          </div>
          
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video, index) => (
              <div key={index} className="overflow-hidden rounded-lg shadow-lg">
                {previewImages && !playingVideos[index] ? (
                  <div className="relative h-[600px] cursor-pointer" onClick={() => handlePlayVideo(index)}>
                    <Image 
                      src={video.previewImage || defaultPreviewImages[index % defaultPreviewImages.length]} 
                      alt={`Vista previa de TikTok ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                      <div className="w-16 h-16 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-black ml-1">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="tiktok-video-container" style={{ height: '600px' }}>
                    <blockquote 
                      className="tiktok-embed" 
                      cite={video.url}
                      data-video-id={getVideoId(video.url)}
                      style={{ maxWidth: '100%', minWidth: '325px' }}
                    >
                      <section></section>
                    </blockquote>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <a 
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Síguenos en TikTok
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-3 h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
