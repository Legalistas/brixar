import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Metadata } from "next";

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

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <main className="flex-auto">{children}</main>
            <Footer />
        </>
    );
}