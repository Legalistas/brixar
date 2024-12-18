import React, { useState } from 'react'

interface BrixPurchaseFormProps {
    onPurchase: (amount: number) => void;
    brixPrice: number;
    formatCurrency: (value: number) => string;
    convertPrice: (value: number) => number;
}

export default function BrixPurchaseForm({ onPurchase, brixPrice, formatCurrency, convertPrice }: BrixPurchaseFormProps) {
    const [quantity, setQuantity] = useState(1)

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuantity(parseInt(e.target.value))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onPurchase(quantity)
        setQuantity(1)
    }

    return (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-2xl font-bold mb-4">Comprar Brixs</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="quantity" className="block text-gray-700 text-sm font-bold mb-2">
                        Cantidad de Brixs
                    </label>
                    <input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div>
                    <label htmlFor="total" className="block text-gray-700 text-sm font-bold mb-2">
                        Total a Pagar
                    </label>
                    <input
                        id="total"
                        type="text"
                        value={formatCurrency(convertPrice(quantity * brixPrice))}
                        disabled
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-[#FB6107] hover:bg-[#FB6107]/90 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                >
                    Comprar Brixs
                </button>
            </form>
        </div>
    )
}

