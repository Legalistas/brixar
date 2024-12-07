'use client'

import { useState, useEffect } from 'react'
import { MessageCircle } from 'lucide-react'
import WhatsappIcon from '@/components/Icons/WhatsappIcon'

export default function WhatsAppButton() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
        }

        window.addEventListener('scroll', toggleVisibility)

        return () => window.removeEventListener('scroll', toggleVisibility)
    }, [])

    const openWhatsApp = () => {
        window.open('https://wa.me/1234567890', '_blank')
    }

    return (
        <button
            className={`fixed right-8 bottom-24 bg-green-500 text-white p-3 rounded-full shadow-lg transition-opacity duration-300`}
            onClick={openWhatsApp}
            aria-label="Contact us on WhatsApp"
        >
            <WhatsappIcon className="h-6 w-6" fill='#fff' />
        </button>
    )
}