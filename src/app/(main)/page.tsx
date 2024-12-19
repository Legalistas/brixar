import { CallToAction } from '@/components/CallToAction'
import { Faqs } from '@/components/Faqs'
import { Hero } from '@/components/Hero'
import { PrimaryFeatures } from '@/components/PrimaryFeatures'
import { Reviews } from '@/components/Reviews'
import CardContainer from '@/components/Property/PropertyContainer'
import { SecondaryFeatures } from '@/components/SecondaryFeatures'

export const metadata = {
    title: 'Brixar | Construyendo sueños',
    description: '¿Buscás un inmueble? Brixar te ofrece una amplia variedad de propiedades para que encuentres la que más se adapte a tus necesidades y presupuesto.',
}


export default function Home() {
    return (
        <>
            <Hero />
            <CardContainer />
            <PrimaryFeatures />
            <SecondaryFeatures />
            <CallToAction />
            <Reviews />
            <Faqs />
        </>
    );
}