'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { scheduleVisit } from '@/services/visit-service'

export default function ScheduleVisit({ params }: { params: { slug: string } }) {
    const [selectedDate, setSelectedDate] = useState('')
    const router = useRouter()
    const { data: session } = useSession()

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!session?.user?.id) {
            alert('Por favor, inicie sesión para programar una visita.')
            return
        }
        try {
            await scheduleVisit(params.slug, selectedDate, session?.user.id)
            alert('Visita programada con éxito')
            router.push(`/customer/properties/${params.slug}`)
        } catch (error) {
            console.error('Error scheduling visit:', error)
            alert('Error al programar la visita')
        }
    }

    const today = new Date()
    const minDate = today.toISOString().split('T')[0]
    const maxDate = new Date(today.setMonth(today.getMonth() + 3)).toISOString().split('T')[0]

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Programar visita</h1>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="mb-4">
                    <label htmlFor="visitDate" className="block text-gray-700 text-sm font-bold mb-2">
                        Fecha de visita
                    </label>
                    <input
                        type="datetime-local"
                        id="visitDate"
                        value={selectedDate}
                        onChange={handleDateChange}
                        min={minDate}
                        max={maxDate}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Programar visita
                </button>
            </form>
        </div>
    )
}

