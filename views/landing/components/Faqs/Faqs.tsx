'use client'

import { useState } from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'

const faqData = [
    {
        question: "¿Por qué elegir Alta Telefonía para la reparación?",
        answer: "Alta Telefonía cuenta con técnicos altamente capacitados y utiliza repuestos originales, garantizando reparaciones de calidad para dispositivos de alta gama."
    },
    {
        question: "¿Qué tipos de dispositivos reparan?",
        answer: "Reparamos una amplia gama de dispositivos, incluyendo smartphones, tablets, laptops y smartwatches de todas las marcas principales."
    },
    {
        question: "¿Cuánto tiempo toma una reparación típica?",
        answer: "La mayoría de las reparaciones se completan en el mismo día. Para casos más complejos, nos comprometemos a mantenerle informado sobre el progreso."
    },
    {
        question: "¿Ofrecen garantía en sus servicios?",
        answer: "Sí, todos nuestros servicios de reparación vienen con una garantía. La duración depende del tipo de reparación realizada."
    },
    {
        question: "¿Utilizan repuestos originales?",
        answer: "Absolutamente. Solo utilizamos repuestos originales para asegurar la mejor calidad y rendimiento de su dispositivo."
    },
    {
        question: "¿Tienen servicio a domicilio?",
        answer: "Sí, ofrecemos servicio a domicilio para ciertas reparaciones. Contáctenos para más detalles sobre esta opción."
    },
    {
        question: "¿Cómo puedo contactar al soporte técnico?",
        answer: "Puede contactarnos por teléfono, email o a través de nuestro chat en línea. Nuestro equipo de soporte está disponible de lunes a sábado."
    },
    {
        question: "¿Realizan presupuestos sin cargo?",
        answer: "Sí, ofrecemos presupuestos gratuitos para todas las reparaciones. No hay compromiso hasta que usted apruebe el presupuesto."
    }
]

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    const toggleQuestion = (index: number) => {
        setOpenIndex(prevIndex => prevIndex === index ? null : index)
    }

    return (
        <section className="my-16 max-w-6xl mx-auto px-4">
            <div className="text-center mb-8">
                <p className="text-gray-600 mb-2">Solicitá tu consulta</p>
                <h2 className="text-3xl font-bold text-[#FF0000]">Preguntas Frecuentes</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {faqData.map((item, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <button
                            onClick={() => toggleQuestion(index)}
                            className="p-4 w-full text-left flex justify-between items-center group hover:bg-gray-50 transition-colors"
                        >
                            <span className="text-gray-800 font-medium">{item.question}</span>
                            {openIndex === index ? (
                                <ChevronDown className="h-5 w-5 text-[#FF0000] transition-transform" />
                            ) : (
                                <ChevronRight className="h-5 w-5 text-[#FF0000] group-hover:translate-x-1 transition-transform" />
                            )}
                        </button>
                        {openIndex === index && (
                            <div className="p-4 bg-gray-50 border-t border-gray-100">
                                <p className="text-gray-600">{item.answer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    )
}