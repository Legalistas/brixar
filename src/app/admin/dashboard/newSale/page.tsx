'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { API_ENDPOINTS } from '@/constants/api-endpoint'
import { Loader2, ArrowLeft, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { getAllProperties } from '@/services/properties-service'

interface Property {
  id: number
  title: string
  price: number
  status: string
  images: { url: string }[]
}

interface User {
  id: string
  name: string
  email: string
}

export default function NewSalePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const propertyId = searchParams.get('propertyId')
  
  console.log('propertyId:', propertyId);

  const [property, setProperty] = useState<Property | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
    // Form state
  const [formData, setFormData] = useState({
    propertyId: Number(propertyId) || 0,
    buyerId: '',
    price: '',
    paymentMethod: 'CASH',
    paymentReference: '',
    notes: ''
  })
  useEffect(() => {
    // Si no hay propertyId, redirigir a la lista de propiedades
    if (!propertyId) {
      router.push('/admin/dashboard/publicaciones')
      return
    }
    
    // Cargar los datos de la propiedad y los usuarios
    const fetchData = async () => {
      setLoading(true)
      try {
        // Obtener todas las propiedades y filtrar por ID
        const propertyData = await getAllProperties()
        
        // Buscar la propiedad con el ID solicitado
        const foundProperty = propertyData.find(
          (prop: Property) => prop.id === Number(propertyId)
        )
        
        if (!foundProperty) {
          throw new Error('No se encontró la propiedad con el ID proporcionado')
        }
        
        setProperty(foundProperty)
        
        // Inicializar precio con el de la propiedad
        setFormData(prev => ({
          ...prev,
          price: foundProperty.price.toString()
        }))
        
        // Obtener usuarios para el selector de compradores
        const usersResponse = await fetch(API_ENDPOINTS.USERS_INDEX)
        if (!usersResponse.ok) {
          throw new Error('No se pudieron cargar los usuarios')
        }
        const usersData = await usersResponse.json()
        setUsers(usersData)
      } catch (err: any) {
        setError(err.message || 'Ocurrió un error al cargar los datos')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [propertyId, router])
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    
    try {
      // Crear la venta con buyerId convertido a número
      const response = await fetch(API_ENDPOINTS.SALE_CREATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          buyerId: formData.buyerId ? parseInt(formData.buyerId) : undefined,
          price: parseFloat(formData.price),
          status: 'PENDING'
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear la venta')
      }
      
      const saleData = await response.json()
      setSuccess(true)
      
      // Redirigir a la página de detalles de la venta después de 2 segundos
      setTimeout(() => {
        router.push(`/admin/dashboard/ventas/${saleData.id}`)
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al crear la venta')
    } finally {
      setSubmitting(false)
    }
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-slate-400 animate-spin" />
          <p className="mt-2 text-slate-500">Cargando datos...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto py-8 px-4 bg-white">
      <div className="mb-6">
        <Link
          href="/admin/dashboard/publicaciones"
          className="inline-flex items-center text-slate-600 hover:text-slate-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Volver a publicaciones
        </Link>
        <h1 className="text-2xl font-medium text-slate-800">
          Registrar Nueva Venta
        </h1>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4">
          Venta creada exitosamente. Redirigiendo...
        </div>
      )}
      
      {property && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Información de la propiedad */}
          <div className="md:col-span-1">
            <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
              <h2 className="font-medium text-lg text-slate-800 mb-3">Propiedad</h2>
              <div className="mb-3">
                <img
                  src={property.images[0]?.url || '/placeholder-property.jpg'}
                  alt={property.title}
                  className="w-full h-48 object-cover rounded-md border border-slate-200"
                />
              </div>
              <h3 className="font-medium text-slate-800 mb-2">{property.title}</h3>
              <p className="text-slate-600 mb-2">
                <span className="font-medium">Precio: </span>
                {new Intl.NumberFormat('es-ES', {
                  style: 'currency',
                  currency: 'EUR',
                  minimumFractionDigits: 0,
                }).format(Number(property.price))}
              </p>
              <p className="text-slate-600">
                <span className="font-medium">Estado: </span>
                <span className="inline-block bg-amber-50 text-amber-700 rounded-md px-2 py-1 text-xs">
                  {property.status}
                </span>
              </p>
            </div>
          </div>
          
          {/* Formulario de venta */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-slate-200 p-6">
              <h2 className="font-medium text-lg text-slate-800 mb-4">Detalles de la Venta</h2>
              
              <div className="mb-4">
                <label htmlFor="buyerId" className="block mb-2 text-sm font-medium text-slate-700">
                  Comprador *
                </label>
                <select
                  id="buyerId"
                  name="buyerId"
                  value={formData.buyerId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                  <option value="">Seleccionar comprador</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="price" className="block mb-2 text-sm font-medium text-slate-700">
                  Precio de Venta *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="paymentMethod" className="block mb-2 text-sm font-medium text-slate-700">
                  Método de Pago
                </label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                  <option value="CASH">Efectivo</option>
                  <option value="BANK_TRANSFER">Transferencia Bancaria</option>
                  <option value="MORTGAGE">Hipoteca</option>
                  <option value="OTHER">Otro</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="paymentReference" className="block mb-2 text-sm font-medium text-slate-700">
                  Referencia de Pago
                </label>
                <input
                  type="text"
                  id="paymentReference"
                  name="paymentReference"
                  value={formData.paymentReference}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="notes" className="block mb-2 text-sm font-medium text-slate-700">
                  Notas
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 px-6 rounded-md transition-colors ${
                    submitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {submitting ? (
                    <span className="flex items-center">
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Guardando...
                    </span>
                  ) : (
                    'Guardar Venta'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
