import React from 'react'

interface Purchase {
    id: string;
    date: Date;
    amount: number;
    price: number;
}

interface PurchaseHistoryProps {
    history: Purchase[];
    formatCurrency: (value: number) => string;
    convertPrice: (value: number) => number;
}

export default function PurchaseHistory({ history, formatCurrency, convertPrice }: PurchaseHistoryProps) {
    const formatDate = (date: Date) => {
        return date.toLocaleString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Historial de Compras</h2>
            </div>
            {history.length === 0 ? (
                <p className="text-gray-700 p-6">No hay compras registradas.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fecha
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cantidad de Brixs
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Precio Total
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {history
                                .slice() // Crear una copia para no mutar el array original
                                .sort((a, b) => parseInt(b.id) - parseInt(a.id))  // Ordenar por id de mayor a menor
                                .map((purchase) => (
                                    <tr key={purchase.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(purchase.date)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {purchase.amount}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatCurrency(convertPrice(purchase.price))}
                                        </td>
                                    </tr>
                                ))}

                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

