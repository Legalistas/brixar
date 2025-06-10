import type React from "react"
import type { Metadata } from "next"
import "@/styles/globals.css"
import "react-toastify/dist/ReactToastify.css"
import "flag-icons/css/flag-icons.min.css"
import { ToastContainer } from "react-toastify"
import { Providers } from "./Providers"
import { Inter, Ubuntu } from "next/font/google"
import { GoogleAnalytics } from "@next/third-parties/google"
import Script from "next/script"
import { ChatbotBubble } from "@/components/ChatbotBubble"
import { Analytics } from "@vercel/analytics/react"
import WhatsAppButton from "@/components/wspBubble"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })
const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
})

export const metadata: Metadata = {
  title: "Brixar | Propiedades y Financiación en Argentina",
  description:
    "Cumplí el sueño del hogar propio con Brixar. Accedé a tu vivienda con financiamiento flexible y proyectos de calidad en Argentina.",
  keywords: [
    "Brixar",
    "propiedades en Argentina",
    "financiamiento inmobiliario",
    "vivienda propia",
    "proyectos habitacionales",
    "plataforma inmobiliaria",
    "compra de inmuebles",
    "créditos hipotecarios",
    "construcción de viviendas",
    "inversiones inmobiliarias",
  ],
  authors: [{ name: "Brixar Team", url: "https://www.brixar.ar" }],
  openGraph: {
    type: "website",
    title: "Brixar | Propiedades y Financiación",
    description:
      "Cumplí el sueño del hogar propio con Brixar. Accedé a tu vivienda con financiamiento flexible y proyectos de calidad en Argentina.",
    url: "https://www.brixar.ar",
    images: ["https://www.brixar.ar/images/og-image.jpg"],
    siteName: "Brixar",
  },
  icons: {
    icon: ["/favicon.ico"],
    apple: ["/images/apple-touch-icon.png"],
    shortcut: ["/images/favicon-32x32.png"],
  },
  manifest: "/site.webmanifest",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        <meta name="apple-mobile-web-app-title" content="Brix.ar" />
      </head>
      <body className={`${inter.className} antialiased bg-[#F1F5F9]`}>
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-5ZMJCRMC');
          `}
        </Script>

        {/* Facebook Pixel */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '699843239439100');
          fbq('track', 'PageView');
          `}
        </Script>

        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5ZMJCRMC"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* Facebook Pixel (noscript) */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=699843239439100&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        <Providers>
          <Suspense fallback={null}>
            {children}
            <ToastContainer />
            <WhatsAppButton />
            <ChatbotBubble />
          </Suspense>
        </Providers>

        {/* Google Analytics - usando solo el componente de Next.js */}
        <GoogleAnalytics gaId="G-TKDYP32F6F" />

        {/* Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  )
}