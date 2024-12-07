import { Star } from 'lucide-react'
import Image from 'next/image'

export default function OfferOfTheDay() {
    return (
        <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Ofertas del día</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="p-4">
                            <div className="aspect-square relative mb-4">
                                <Image
                                    src="/assets/placeholder.svg?height=200&width=200"
                                    alt="Oferta del día"
                                    className="w-full h-full object-cover"
                                    width={200}
                                    height={200}
                                />
                                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                                    -30%
                                </span>
                            </div>
                            <h3 className="text-sm font-medium truncate mb-1">Oferta Especial {i + 1}</h3>
                            <p className="text-xs text-gray-500 mb-2">Categoria</p>
                            <div className="flex items-center justify-between">
                                <div className="text-lg font-bold">US$ {(49.99 - i * 5).toFixed(2)}</div>
                                <div className="flex items-center">
                                    {Array.from({ length: 5 }).map((_, starIndex) => (
                                        <Star key={starIndex} className={`h-4 w-4 ${starIndex < 4 ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}