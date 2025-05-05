import type { Metadata } from "next";
import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import "flag-icons/css/flag-icons.min.css";
import { ToastContainer } from "react-toastify";
import { Providers } from "./Providers";
import { Inter, Ubuntu } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import Script from 'next/script'
import WhatsAppButton from "@/components/wspBubble";

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
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l;'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-5ZMJCRMC');
          `}
        </Script>
        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-TKDYP32F6F" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-TKDYP32F6F');
          `}
        </Script>
      </head>
      <body
        className={`${inter.className} antialiased bg-[#F1F5F9]`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5ZMJCRMC"
            height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe>
        </noscript>
        <Providers>
          {children}
          <GoogleAnalytics gaId={`${process.env.NEXT_PUBLIC_GID}`} />
          <ToastContainer />

          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}
