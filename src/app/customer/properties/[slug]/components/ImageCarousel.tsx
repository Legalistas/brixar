'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Image {
    id: string
    url: string
}

export default function ImageCarousel({ images }: { images: Image[] }) {
    const [currentIndex, setCurrentIndex] = useState(0)

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }

    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
    }

    return (
        <div className="relative w-full h-96 mb-8">
            <Image
                src={process.env.NEXT_PUBLIC_BASE_URL + '/uploads/' + images[currentIndex].url}
                alt={`Property image ${currentIndex + 1}`}
                fill
                className="object-cover rounded-lg"
            />
            <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
            >
                &#10094;
            </button>
            <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
            >
                &#10095;
            </button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-sm">
                {currentIndex + 1} / {images.length}
            </div>
        </div>
    )
}
