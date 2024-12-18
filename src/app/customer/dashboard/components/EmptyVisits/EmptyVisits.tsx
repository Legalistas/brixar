import React from 'react'
import Link from 'next/link'
import { Home } from 'lucide-react'

const EmptyVisits = () => {
    return (
        <div className="max-w-sm mx-auto bg-transparent rounded-lg overflow-hidden border-2 border-orange-500 border-dashed p-6">
            <div className="flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-orange-100 rounded-full">
                    <Home className="w-12 h-12 text-orange-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                    No tienes visitas programadas
                </h3>
                <p className="text-sm text-gray-600 text-center">
                    Explora nuestras propiedades y programa una visita
                </p>
                <Link
                    href="/customer/properties"
                    className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                >
                    Ver propiedades
                </Link>
            </div>
        </div>
    )
}

export default EmptyVisits

