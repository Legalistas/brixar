"use client"
import { useState } from 'react';
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

    const [activeIndex, setActiveIndex] = useState<number | null>(null)

    const toggleIndex = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index)
    }

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

            <section className="mx-auto mb-16 max-w-2xl space-y-6 text-center pt-12">
                <div className="grid md:grid-cols-1 gap-8">
                    {/* Calculator CTA */}
                    <Card className="shadow-2xl border-0 bg-gradient-to-br from-blue-600 to-blue-700 text-white overflow-hidden relative flex flex-col">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                        <CardContent className="p-8 relative z-10 flex flex-col justify-between flex-1">
                            <div className="flex flex-col gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                        <Calculator className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-left">Calculá tu cuota</h3>
                                        <p className="text-blue-100">Descubre cuánto puedes pagar mensualmente</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8">
                                <Button className="w-full bg-black text-blue-700 hover:bg-blue-300 font-semibold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                                    <Link href="/creditos/calculadora-uva">
                                        Ir a la calculadora
                                    </Link>
                                </Button>
                            </div>
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


            <section
                id="faqs"
                aria-labelledby="faqs-title"
                className="border-t border-gray-200 py-20 sm:py-32"
            >
                <Container>
                    <section className="max-w-4xl mx-auto py-10 px-4">
                        <h2 className="text-3xl font-bold text-center mb-8">Condiciones del crédito</h2>
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div key={faq.id} className="border rounded-xl overflow-hidden">
                                    <button
                                        onClick={() => toggleIndex(index)}
                                        className="w-full text-left px-6 py-4 bg-gray-100 hover:bg-gray-200 focus:outline-none flex justify-between items-center"
                                    >
                                        <span className="font-medium">{faq.title}</span>
                                        <span className="text-xl">{activeIndex === index ? "−" : "+"}</span>
                                    </button>
                                    {activeIndex === index && (
                                        <div className="px-6 py-4 text-gray-700 bg-white">
                                            {faq.description}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
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


const faqs = [
    {
        id: 1,
        title: "Modalidad",
        description:
            'Préstamo en Unidades de Valor Adquisitivo actualizables por Coeficiente de Estabilización de Referencia "CER" Ley 25.827 ("UVA") con garantía hipotecaria en primer grado.',
    },
    {
        id: 2,
        title: "Amortización",
        description:
            "Las cuotas se liquidarán en forma mensual y por sistema francés.",
    },
    {
        id: 3,
        title: "Comisiones",
        description:
            "Se acepta la cancelación total o parcial en cualquier momento de la vigencia del préstamo. Comisión equivalente al 4% del monto a cancelar.",
    },
    {
        id: 4,
        title: "Interés",
        description:
            "Para vivienda única y de ocupación permanente que perciban sus haberes a través del BNA: 4.50% TNA fijo. El resto: 8.00% TNA fijo.",
    },
]