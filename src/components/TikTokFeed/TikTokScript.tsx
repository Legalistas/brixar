'use client';

import { useEffect } from 'react';

export function TikTokScript() {
  useEffect(() => {
    // Verificar si el script ya existe
    if (!document.querySelector('script#tiktok-embed-script')) {
      // Crear y añadir el script de TikTok
      const script = document.createElement('script');
      script.id = 'tiktok-embed-script';
      script.src = 'https://www.tiktok.com/embed.js';
      script.async = true;
      document.body.appendChild(script);

      // Limpiar el script al desmontar
      return () => {
        const existingScript = document.getElementById('tiktok-embed-script');
        if (existingScript) {
          document.body.removeChild(existingScript);
        }
      };
    }
  }, []);

  return null;
}
