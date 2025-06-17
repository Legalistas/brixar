"use client"
import { motion } from 'framer-motion'
import type { LucideIcon } from "lucide-react"
import { Users, Briefcase, BotIcon as Robot, CheckCircle, FileText, Calculator } from 'lucide-react'

import { HeroSection } from "@/components/HeroSection";
import DestinationsSection from '@/components/DestinationsSection';


import { destinationData } from '@/data/destination';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { CircleBackground } from '@/components/CircleBackground';
import Link from 'next/link';
import WhatsappIcon from '@/components/Icons/WhatsappIcon';
import { TikTok } from '@/components/TikTok/TikTok';
import { Reviews } from '@/components/Reviews';

interface FeatureCardProps {
    Icon: LucideIcon
    title: string
    description: React.ReactNode // ⬅️ cambiar esto de string a ReactNode
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
}

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
    },
}

const FeatureCard = ({ Icon, title, description }: FeatureCardProps) => {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="flex h-full flex-col rounded-[30px] bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-xl hover:ring-1 hover:ring-[#FB6107]"
        >
            <motion.div
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
                className="mb-4 flex items-center justify-start"
            >
                <Icon className="mr-2 h-8 w-8 text-[#09A4B5]" />
                <h3 className="text-start text-xl font-semibold">{title}</h3>
            </motion.div>

            <div className="flex-grow text-start text-gray-600">
                {description} {/* JSX directamente */}
            </div>
        </motion.div>
    )
}

export default function Page() {
    return (
        <>
            <HeroSection />

            <section className="mx-auto mb-16 max-w-7xl space-y-6 text-center pt-12">
                <span className="mb-6 inline-block rounded-full bg-[#e5f0f0] px-4 py-1 text-sm font-medium text-[#1a1a1a]">Hogares</span>
                <h1 className="text-4xl font-bold tracking-tight md:text-5xl">¿Quiénes pueden solicitarlo?</h1>
                <p className=" mx-auto max-w-3xl text-md leading-relaxed">Conoce los requisitos y condiciones para acceder a nuestro crédito hipotecario</p>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="mx-auto grid max-w-6xl grid-cols-2 gap-12 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2"
                >
                    <motion.div variants={itemVariants} className="h-full">
                        <FeatureCard
                            Icon={Users}
                            title="Solicitantes Elegibles."
                            description={<div className="space-y-3">
                                {[
                                    "Empleados en relación de dependencia (planta permanente)",
                                    "Jubilados y pensionados",
                                    "Trabajadores autónomos",
                                    "Monotributistas",
                                    "Personal contratado (con contrato vigente)",
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-[#FB6107] flex-shrink-0" />
                                        <span className="text-gray-700 text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>}
                        />
                    </motion.div>

                    <motion.div variants={itemVariants} className="h-full">
                        <FeatureCard
                            Icon={Briefcase}
                            title="Condiciones Especiales"
                            description={<div className="space-y-4 pl-8">
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-1">Edad límite para cancelación</h4>
                                    <p className="text-gray-700">85 años inclusive</p>
                                </div>

                                <div>
                                    <h4 className="font-medium text-gray-900 mb-1">Usuarios permitidos</h4>
                                    <p className="text-gray-700">Hasta 2 titulares + hasta 2 codeudores</p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Los codeudores deben ser familiares directos (padres, hijos o hermanos)
                                    </p>
                                </div>
                            </div>}
                        />
                    </motion.div>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="mx-auto grid max-w-6xl "
                >
                    <div className="border-l-4 border-orange-400 bg-orange-50 p-6 rounded-[30px] shadow-sm">
                        <h3 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Requisitos Especiales para Personal Contratado
                        </h3>
                        <p className="text-orange-700 mb-3 text-start">
                            El personal contratado debe presentar <strong>obligatoriamente</strong> un codeudor que sea familiar
                            directo (padres, hijos o hermanos) en actividad laboral bajo relación de dependencia en planta permanente,
                            jubilados/pensionados o autónomos.
                        </p>
                        <p className="text-sm text-orange-700">
                            <strong>Importante:</strong> Los codeudores deben presentar ingresos iguales o superiores al titular, pero
                            no se computarán para el cálculo del monto prestable.
                        </p>
                    </div>
                </motion.div>
            </section>

            <section className="mx-auto mb-16 max-w-7xl space-y-6 text-center pt-12">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Calculator CTA */}
                    <Card className="shadow-2xl border-0 bg-gradient-to-br from-blue-600 to-blue-700 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                        <CardContent className="p-8 relative z-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                    <Calculator className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold">Calculá tu cuota</h3>
                                    <p className="text-blue-100">Descubre cuánto puedes pagar mensualmente</p>
                                </div>
                            </div>
                            <Button
                                className="w-full bg-black text-blue-700 hover:bg-blue-300 font-semibold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                Ir al simulador
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Application CTA */}
                    <Card className="shadow-2xl border-0 bg-gradient-to-br from-orange-500 to-red-500 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                        <CardContent className="p-8 relative z-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold">¡Comprá, construí, ampliá o terminá tu próximo hogar!</h3>
                                    <p className="text-orange-100">Inicia tu solicitud ahora mismo</p>
                                </div>
                            </div>
                            <Button
                                className="w-full bg-black text-orange-700 hover:bg-orange-300 font-semibold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                Iniciar solicitud
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </section>


            {/* Loan Conditions - Simplified
            <section className="space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Condiciones Generales</h2>
                </div>

                <div className="space-y-6">
                    {[
                        {
                            title: "Modalidad",
                            content:
                                'Préstamo en Unidades de Valor Adquisitivo actualizables por Coeficiente de Estabilización de Referencia "CER" Ley 25.827 ("UVA") con garantía hipotecaria en primer grado.',
                        },
                        {
                            title: "Amortización",
                            content: "Las cuotas se liquidarán en forma mensual y por sistema francés.",
                        },
                        {
                            title: "Comisiones",
                            content:
                                "Se acepta la cancelación total o parcial en cualquier momento de la vigencia del préstamo. Comisión equivalente al 4% del monto a cancelar.",
                        },
                        {
                            title: "Interés",
                            content:
                                "Para vivienda única y de ocupación permanente que perciban sus haberes a través del BNA: 4.50% TNA fijo. El resto: 8.00% TNA fijo.",
                        },
                    ].map((item, index) => (
                        <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                            <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                            <p className="text-gray-700 leading-relaxed">{item.content}</p>
                        </div>
                    ))}
                </div>
            </section> */}

            <DestinationsSection data={destinationData} />

            <section className="mx-auto mb-16 max-w-7xl space-y-6 text-center pt-12">
                <h1 className="text-4xl font-bold tracking-tight md:text-5xl">¿Quiénes pueden solicitarlo?</h1>
                <p className=" mx-auto max-w-3xl text-md leading-relaxed">Conoce los requisitos y condiciones para acceder a nuestro crédito hipotecario</p>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="mx-auto grid max-w-6xl grid-cols-3 gap-12 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3"
                >
                    <motion.div variants={itemVariants} className="h-full">
                        <FeatureCard
                            Icon={Users}
                            title="Adquisición o cambio"
                            description={`Adquisición o cambio de vivienda única de ocupación permanente o de segunda vivienda`}
                        />
                    </motion.div>

                    <motion.div variants={itemVariants} className="h-full">
                        <FeatureCard
                            Icon={Briefcase}
                            title="Construcción"
                            description={`Construcción de vivienda única de ocupación permanente y de segunda vivienda sobre terreno propio`}
                        />
                    </motion.div>

                    <motion.div variants={itemVariants} className="h-full">
                        <FeatureCard
                            Icon={Briefcase}
                            title="Ampliación, refacción o terminación"
                            description={`Ampliación, refacción o terminación de vivienda única de ocupación permanente y de segunda vivienda sobre terreno propio`}
                        />
                    </motion.div>
                </motion.div>
            </section>


            <section
                id="faqs"
                aria-labelledby="faqs-title"
                className="border-t border-gray-200 py-20 sm:py-32"
            >
                <Container>
                    <div className="mx-auto max-w-2xl lg:mx-0">
                        <h2
                            id="faqs-title"
                            className="text-3xl font-medium tracking-tight text-gray-900"
                        >
                            Preguntas frecuentes
                        </h2>
                        <p className="mt-2 text-lg text-gray-600">
                            Si hay algo más que quieras consultar,{' '}
                            <a
                                href="mailto:sembrar.construcciones@gmail.com"
                                className="text-gray-900 underline"
                            >
                                contactanos
                            </a>
                            .
                        </p>
                    </div>
                    <ul
                        role="list"
                        className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:max-w-none lg:grid-cols-3"
                    >
                        {faqs.map((column, columnIndex) => (
                            <li key={columnIndex}>
                                <ul role="list" className="space-y-10">
                                    {column.map((faq, faqIndex) => (
                                        <li key={faqIndex}>
                                            <h3 className="text-lg font-semibold leading-6 text-gray-900">
                                                {faq.question}
                                            </h3>
                                            <p className="mt-4 text-sm text-gray-700">{faq.answer}</p>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </Container>
            </section>

            <section
                id="get-free-shares-today"
                className="relative overflow-hidden bg-gray-900 py-20 sm:py-28"
            >
                <div className="absolute left-20 top-1/2 -translate-y-1/2 sm:left-1/2 sm:-translate-x-1/2">
                    <CircleBackground color="#fff" className="animate-spin-slower" />
                </div>
                <Container className="relative">
                    <div className="mx-auto max-w-md sm:text-center">
                        <h2 className="text-3xl font-medium tracking-tight text-white sm:text-4xl">
                            ¿Querés convertirte en dueño?
                        </h2>
                        {/* <p className="mt-4 text-lg text-gray-300">
                            Invertir en una propiedad es una decisión importante. Con nuestros inmuebles, te aseguramos una elección acertada y opciones de financiación.
                        </p> */}
                        <div className="mt-8 flex justify-center">
                            <Link href="https://wa.me/5493492282324">
                                <button className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-black hover:bg-gray-50 sm:px-8">
                                    <WhatsappIcon className='w-6 h-6 mr-1 text-[#25D366]' /> Consulta Hoy
                                </button>
                            </Link>
                        </div>
                    </div>
                </Container>
            </section>

            <TikTok />

            <Reviews />
        </>
    )
}


export const faqs = [
    [
        {
            question: '¿Quienes pueden solicitar el crédito Hipotecario Banco Nación?',
            answer: `
                Pueden solicitarlo:
                - Empleados planta permanente.
                - Jubilados o pensionados.
                - Autónomos o monotributistas.
                - Contratados con codeudor familiar
                Edad máxima: Hasta 85 años para cancelar.
            `,
        },
        {
            question: '¿Se pueden sumar ingresos para solicitar el crédito?',
            answer:
                'En todos los casos se admite la participación de hasta dos usuarios titulares y hasta dos codeudores en la solicitud del crédito. Los codeudores deberán ser familiares directos del o los titulares (padres, hijos o hermanos) y cumplir con los requisitos establecidos para la obtención del presente crédito hipotecario. Esta modalidad está pensada para facilitar el acceso al financiamiento, permitiendo sumar ingresos entre los participantes y mejorar la evaluación crediticia del grupo. La inclusión de codeudores amplía la capacidad de pago, lo que puede impactar positivamente en el monto aprobado o en las condiciones del préstamo.',
        },
        {
            question: '¿A qué tasa de interés?',
            answer:
                'Préstamo en Unidades de Valor Adquisitivo (UVA), actualizables por el Coeficiente de Estabilización de Referencia (CER), según lo establecido por la Ley 25.827. Este crédito hipotecario se otorga con garantía real en primer grado y está diseñado para acompañar la evolución de la inflación. Las cuotas se abonan de forma mensual y se calculan mediante el sistema francés de amortización, permitiendo pagos iniciales más bajos que aumentan progresivamente con el tiempo.',
        },
    ],
    [
        {
            question: '¿Cuál es el plazo y el monto máximo que puedo obtener?',
            answer:
                'El financiamiento puede extenderse hasta un plazo máximo de 30 años, dependiendo del destino del crédito, ya sea para compra o construcción de vivienda. En términos generales, se podrá cubrir hasta el 75% del valor de la propiedad a adquirir o del proyecto a construir, lo que permite acceder al préstamo con una inversión inicial moderada. No obstante, para empleados públicos o personas adheridas al régimen CERA, el monto financiable se amplía hasta el 90% del valor, facilitando aún más el acceso a la vivienda propia con un menor requerimiento de ahorro previo.',
        },

    ],
    [
        {
            question: '¿Cómo es el proceso?',
            answer:
                `
1. Primero, acercate a la sucursal del Banco Nación en Rafaela, ubicada en San Martín 175, para iniciar el trámite de precalificación y conocer si calificás para el crédito hipotecario. Allí evaluarán tu situación financiera y te informarán el monto que podrías obtener.

2. Luego, elegí la casa que más te guste de nuestro catálogo de viviendas disponibles. Podés acercarte a nuestras oficinas en Aconcagua 697, donde te vamos a asesorar personalmente, mostrarte opciones, y ayudarte a elegir la propiedad ideal para vos y tu familia.

3. Una vez elegida la propiedad, firmás un acuerdo de reserva con nosotros, lo cual asegura que la unidad se mantenga disponible mientras avanzás con el trámite bancario.

4. El Banco Nación realiza la tasación de la vivienda, para confirmar que el valor coincide con el monto del crédito solicitado y validar las condiciones del inmueble.

5. Si todo está en orden, se procede a la firma de la escritura en la escribanía designada por el banco. En ese acto se otorga el crédito y se transfiere oficialmente la propiedad.

6. ¡Y listo! Llegó el momento de mudarte y disfrutar de tu nueva casa. Te acompañamos en todo el proceso para que vivas esta experiencia de forma simple, segura y transparente.
                `,
        },
    ],
]