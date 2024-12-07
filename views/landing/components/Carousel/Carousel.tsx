'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Carousel() {
    const [currentSlide, setCurrentSlide] = useState(0)

    const carouselItems = [
        { title: "Oferta 1", description: "Desconto incrível em smartphones!", image: "/assets/carousel/alta telefonia - press_page-0004.jpg" },
        { title: "Oferta 2", description: "50% OFF em acessórios!", image: "/assets/carousel/alta telefonia - press_page-0017.jpg" },
        { title: "Oferta 3", description: "Frete grátis em compras acima de $100!", image: "/assets/carousel/alta telefonia - press_page-0006.jpg" },
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev === carouselItems.length - 1 ? 0 : prev + 1))
        }, 5000) // Change slide every 5 seconds

        return () => clearInterval(interval)
    }, [carouselItems.length])

    const goToSlide = (index: number) => {
        setCurrentSlide(index)
    }

    return (
        <div className="relative rounded-lg overflow-hidden mb-8 h-[500px]">
            <div className="flex h-full transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {carouselItems.map((item, index) => (
                    <div key={index} className="w-full flex-shrink-0 relative">
                        <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover object-center"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority={index === 0}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="text-center text-white px-4">
                                <h2 className="text-5xl font-bold mb-4">{item.title}</h2>
                                <p className="text-2xl">{item.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <button
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                onClick={() => goToSlide(currentSlide === 0 ? carouselItems.length - 1 : currentSlide - 1)}
            >
                <ChevronLeft className="h-6 w-6" />
            </button>
            <button
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                onClick={() => goToSlide(currentSlide === carouselItems.length - 1 ? 0 : currentSlide + 1)}
            >
                <ChevronRight className="h-6 w-6" />
            </button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {carouselItems.map((_, index) => (
                    <button
                        key={index}
                        className={`w-3 h-3 rounded-full ${index === currentSlide ? 'bg-white' : 'bg-gray-300'}`}
                        onClick={() => goToSlide(index)}
                    />
                ))}
            </div>
        </div>
    )
}