'use client'

import React, { useState } from 'react'
import BrixPurchaseForm from './components/BrixPurchaseForm'
import BrixSummary from './components/BrixSummary'
import PurchaseHistory from './components/PurchaseHistory'
import { formatCurrency } from '@/utils/formatUtils'
import { useCurrency } from '@/context/CurrencyContext'

const exampleHistory: Purchase[] = [
    { id: '1', date: new Date('2023-06-01T10:30:00'), amount: 5, price: 5000 },
    { id: '2', date: new Date('2023-06-15T14:45:00'), amount: 2, price: 2000 },
    { id: '3', date: new Date('2023-07-03T09:15:00'), amount: 10, price: 10000 },
    { id: '4', date: new Date('2023-07-20T16:00:00'), amount: 1, price: 1000 },
    { id: '5', date: new Date('2023-08-05T11:30:00'), amount: 3, price: 3000 },
];

interface Purchase {
    id: string;
    date: Date;
    amount: number;
    price: number;
}

export default function InvestmentsPage() {
    const [currentBrixs, setCurrentBrixs] = useState(0)
    const [purchaseHistory, setPurchaseHistory] = useState<Purchase[]>(exampleHistory);
    const [brixPrice, setBrixPrice] = useState(1000); // Precio base en USD
    const { convertPrice } = useCurrency();

    const handlePurchase = (amount: number) => {
        const price = amount * brixPrice
        setCurrentBrixs(prev => prev + amount)
        setPurchaseHistory(prev => [
            ...prev,
            {
                id: Date.now().toString(),
                date: new Date(),
                amount,
                price
            }
        ])
    }

    const handleCurrencyChange = (newBrixPrice: number) => {
        setBrixPrice(newBrixPrice);
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Inversiones en Brixs</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <BrixPurchaseForm onPurchase={handlePurchase} brixPrice={brixPrice} formatCurrency={formatCurrency} convertPrice={convertPrice} />
                <BrixSummary currentBrixs={currentBrixs} purchaseHistory={purchaseHistory} brixPrice={brixPrice} />
            </div>
            <PurchaseHistory history={purchaseHistory} formatCurrency={formatCurrency} convertPrice={convertPrice} />
        </div>
    )
}

