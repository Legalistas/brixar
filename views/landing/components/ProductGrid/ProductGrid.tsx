"use client"

import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import Image from 'next/image'
import { getAllProducts } from '@/services/products-service'
import { useCurrency } from '@/context/CurrencyContext'

interface Attribute {
    id: number
    productId: number
    name: string
    value: string
    qty: number
    price: string
    priceWholesaler: string
}

interface Product {
    id: number
    name: string
    price: string
    category: {
        name: string
    }
    productImage: Array<{
        url: string
    }>
    attributes: Attribute[]
}

export default function ProductGrid() {
    const [products, setProducts] = useState<Product[]>([])
    const imagePlaceholder = "/assets/placeholder.svg"
    const { convertPrice, currentCurrency } = useCurrency()

    const formatPrice = (price: number) => {
        const convertedPrice = convertPrice(price)
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: currentCurrency.code,
            currencyDisplay: 'symbol'
        }).format(convertedPrice)
    }

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await getAllProducts();
            setProducts(response)
        }
        fetchProducts()
    }, [])

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {products.map((product: Product, index: number) => (
                <div key={index} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-4">
                        <div className="aspect-square relative mb-4">
                            <Image
                                src={product?.productImage?.length > 0 ? `${process.env.NEXT_PUBLIC_BASE_URL}${product.productImage[0].url}` : imagePlaceholder}
                                alt={product?.name}
                                title={product?.name}
                                className="w-full h-full object-cover"
                                width={200}
                                height={200}
                            />
                            {index % 2 === 0 && (
                                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                                    -24%
                                </span>
                            )}
                        </div>
                        <h3 className="text-sm font-medium truncate mb-1">{product.name}</h3>
                        <p className="text-xs text-gray-500 mb-2">{product?.category?.name}</p>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center justify-between">
                                <div className="text-lg font-bold">
                                    {formatPrice(parseFloat(product?.attributes?.length > 0 ? product.attributes[0].price : product.price))}
                                </div>
                            </div>
                        </div>
                        {product?.attributes?.length > 0 && (
                            <div className="mt-2">
                                <select className="w-full p-2 text-sm border rounded">
                                    {product?.attributes.map((attr: Attribute, attrIndex: number) => (
                                        <option key={attrIndex} value={attr.id}>
                                            {attr.value} - {formatPrice(parseFloat(attr.price))}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}