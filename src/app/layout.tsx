import type { Metadata } from "next";
import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import "flag-icons/css/flag-icons.min.css";
import { ToastContainer } from "react-toastify";
import { Providers } from "./Providers";
import { Inter, Ubuntu } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ['latin'] })
const ubuntu = Ubuntu({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
})

export const metadata: Metadata = {
  title: 'Brixar | Propiedades y Financiación en Argentina',
  description: 'Cumplí el sueño del hogar propio con Brixar. Accedé a tu vivienda con financiamiento flexible y proyectos de calidad en Argentina.',
  keywords: [
    'Brixar',
    'propiedades en Argentina',
    'financiamiento inmobiliario',
    'vivienda propia',
    'proyectos habitacionales',
    'plataforma inmobiliaria',
    'compra de inmuebles',
    'créditos hipotecarios',
    'construcción de viviendas',
    'inversiones inmobiliarias'
  ],
  authors: [
    { name: 'Brixar Team', url: 'https://www.brixar.ar' }
  ],
  openGraph: {
    type: 'website',
    title: 'Brixar | Propiedades y Financiación',
    description: 'Cumplí el sueño del hogar propio con Brixar. Accedé a tu vivienda con financiamiento flexible y proyectos de calidad en Argentina.',
    url: 'https://www.brixar.ar',
    images: ['https://www.brixar.ar/images/og-image.jpg'],
    siteName: 'Brixar',
  },
  icons: {
    icon: ['/favicon.ico'],
    apple: ['/apple-touch-icon.png'],
    shortcut: ['/shortcut-icon.png'],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="Brix.ar" />
      </head>
      <body
        className={`${inter.className} antialiased bg-[#F1F5F9]`}
      >
        <Providers>
          {children}
          <GoogleAnalytics gaId={`${process.env.NEXT_PUBLIC_GID}`} />
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
