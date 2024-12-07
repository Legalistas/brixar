'use client'

import { X, ShoppingBag } from 'lucide-react'

interface CartModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
    return (
        <div
            className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
        >
            {/* Header */}
            <div className="bg-[#1D1D1B] text-white p-4 flex justify-between items-center">
                <div className="flex items-center">
                    <ShoppingBag className="h-6 w-6 mr-2" />
                    <h2 className="text-lg font-semibold">Carrito</h2>
                </div>
                <button
                    onClick={onClose}
                    className="text-white hover:text-gray-300 transition-colors"
                >
                    <X className="h-6 w-6" />
                </button>
            </div>

            {/* Empty Cart Content */}
            <div className="p-6 flex flex-col items-center justify-center h-[calc(100vh-200px)]">
                <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-lg text-gray-600 mb-6">El carrito está vacío</p>
                <button
                    onClick={onClose}
                    className="bg-[#FF0000] text-white px-6 py-2 rounded-lg hover:bg-[#CC0000] transition-colors mb-4"
                >
                    Volver a los productos
                </button>
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
                <button
                    onClick={onClose}
                    className="w-full bg-[#FF0000] text-white py-3 rounded-lg hover:bg-[#CC0000] transition-colors"
                >
                    Continuar Comprando
                </button>
            </div>
        </div>
    )
}