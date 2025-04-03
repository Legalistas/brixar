import React from 'react';
import { Container } from '@/components/Container';
import { TikTokScript } from './TikTokScript';

interface TikTokVideo {
  url: string;
}

interface TikTokFeedProps {
  videos: TikTokVideo[];
  channelUrl: string;
}

export function TikTokFeed({ videos, channelUrl }: TikTokFeedProps) {
  // Extraer el ID del video de la URL de TikTok
  const getVideoId = (url: string) => {
    const regex = /video\/(\d+)/;
    const match = url.match(regex);
    return match ? match[1] : '';
  };

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
                <blockquote 
                  className="tiktok-embed" 
                  cite={video.url}
                  data-video-id={getVideoId(video.url)} 
                  style={{ maxWidth: '100%' }}
                >
                  <section></section>
                </blockquote>
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
