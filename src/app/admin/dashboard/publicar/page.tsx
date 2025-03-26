'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { API_ENDPOINTS } from '@/constants/api-endpoint'
import { PropertyState, ListingType } from '@prisma/client'
import CountryStateSelector from '@/components/common/CountryStateSelector'

export default function PublicarPropiedad() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const [imageUploadProgress, setImageUploadProgress] = useState(0)

  // Estados para el formulario
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    bedrooms: 0,
    bathrooms: 0,
    squareMeters: 0,
    propertyType: PropertyState.APARTMENT,
    listingType: ListingType.SALE,
    isAvailable: true,
    yearBuilt: new Date().getFullYear(),
    parkingSpaces: 0,
    quantity: 1,
    amenities: {} as Record<string, boolean>,
    address: {
      countryId: 0,
      stateId: 0,
      city: '',
      postalCode: '',
      streetName: '',
      description: '',
      positions: {
        latitude: '',
        longitude: '',
      },
    },
  })

  // Manejadores para el cambio de país y estado
  const handleCountryChange = (countryId: number) => {
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        countryId,
        stateId: 0, // Reseteamos el estado cuando cambia el país
      },
    })
  }

  const handleStateChange = (stateId: number) => {
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        stateId,
      },
    })
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target

    // Manejo de campos nested
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      if (parent === 'address') {
        if (child === 'positions.latitude' || child === 'positions.longitude') {
          const posKey = child.split('.')[1]
          setFormData({
            ...formData,
            address: {
              ...formData.address,
              positions: {
                ...formData.address.positions,
                [posKey]: value,
              },
            },
          })
        } else {
          setFormData({
            ...formData,
            address: {
              ...formData.address,
              [child]: value,
            },
          })
        }
      }
    } else {
      // Manejo según tipo de campo
      let parsedValue: any = value
      if (type === 'number') {
        parsedValue = Number(value)
      } else if (type === 'checkbox') {
        parsedValue = (e.target as HTMLInputElement).checked
      }

      setFormData({
        ...formData,
        [name]: parsedValue,
      })
    }
  }

  const handleAmenityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData({
      ...formData,
      amenities: {
        ...formData.amenities,
        [name]: checked,
      },
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      
      // Crear URLs temporales para previsualización
      const newImageUrls = newFiles.map(file => URL.createObjectURL(file))
      
      // Actualizar estado de archivos y URLs
      setImageFiles(prev => [...prev, ...newFiles])
      setImageUrls(prev => [...prev, ...newImageUrls])
    }
  }

  const removeImage = (index: number) => {
    const newImageUrls = [...imageUrls]
    const newImageFiles = [...imageFiles]
    
    // Liberar URL del objeto
    URL.revokeObjectURL(newImageUrls[index])
    
    newImageUrls.splice(index, 1)
    newImageFiles.splice(index, 1)
    
    setImageUrls(newImageUrls)
    setImageFiles(newImageFiles)
  }

  const uploadToCloudinary = async (files: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = []
    setUploadingImages(true)
    
    try {
      // Subir cada archivo a Cloudinary
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append('file', file)
        
        const response = await fetch('/api/uploadFile', {
          method: 'POST',
          body: formData
        })
        
        if (!response.ok) {
          throw new Error('Error al subir imagen')
        }
        
        const data = await response.json()
        if (data.success) {
          uploadedUrls.push(data.url)
        }
        
        // Actualizar progreso
        setImageUploadProgress(Math.round(((i + 1) / files.length) * 100))
      }
      
      return uploadedUrls
    } catch (error) {
      console.error('Error subiendo imágenes:', error)
      throw error
    } finally {
      setUploadingImages(false)
      setImageUploadProgress(0)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      // Subir imágenes a Cloudinary
      let cloudinaryUrls: string[] = []
      if (imageFiles.length > 0) {
        cloudinaryUrls = await uploadToCloudinary(imageFiles)
      }

      // Preparar datos con imágenes de Cloudinary
      const propertyData = {
        ...formData,
        images: cloudinaryUrls, // URLs reales de Cloudinary
      }

      // Enviar a la API
      const response = await fetch(API_ENDPOINTS.PROPERTY_CREATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear la propiedad')
      }

      const data = await response.json()
      setSuccess(true)

      // Redireccionar después de 2 segundos
      setTimeout(() => {
        router.push('/admin/propiedades')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al publicar la propiedad')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Publicar Nueva Propiedad</h1>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Propiedad publicada con éxito. Redirigiendo...
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Información básica */}
          <div className="col-span-2">
            <h2 className="text-xl font-semibold mb-4">Información Básica</h2>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="title"
            >
              Título
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="price"
            >
              Precio
            </label>
            <input
              id="price"
              name="price"
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            />
          </div>

          <div className="col-span-2 mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description || ''}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            />
          </div>

          {/* Características */}
          <div className="col-span-2 mt-6">
            <h2 className="text-xl font-semibold mb-4">Características</h2>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="bedrooms"
            >
              Dormitorios
            </label>
            <input
              id="bedrooms"
              name="bedrooms"
              type="number"
              required
              min="0"
              value={formData.bedrooms}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="bathrooms"
            >
              Baños
            </label>
            <input
              id="bathrooms"
              name="bathrooms"
              type="number"
              required
              min="0"
              value={formData.bathrooms}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="squareMeters"
            >
              Metros Cuadrados
            </label>
            <input
              id="squareMeters"
              name="squareMeters"
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.squareMeters}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="parkingSpaces"
            >
              Plazas de Estacionamiento
            </label>
            <input
              id="parkingSpaces"
              name="parkingSpaces"
              type="number"
              min="0"
              value={formData.parkingSpaces || 0}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="yearBuilt"
            >
              Año de Construcción
            </label>
            <input
              id="yearBuilt"
              name="yearBuilt"
              type="number"
              min="1900"
              value={formData.yearBuilt || new Date().getFullYear()}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="quantity"
            >
              Cantidad
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            />
          </div>

          {/* Tipo de propiedad y tipo de oferta */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="propertyType"
            >
              Tipo de Propiedad
            </label>
            <select
              id="propertyType"
              name="propertyType"
              value={formData.propertyType}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            >
              <option value={PropertyState.APARTMENT}>Apartamento</option>
              <option value={PropertyState.HOUSE}>Casa</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="listingType"
            >
              Tipo de Oferta
            </label>
            <select
              id="listingType"
              name="listingType"
              value={formData.listingType}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            >
              <option value={ListingType.SALE}>Venta</option>
              <option value={ListingType.RENT}>Alquiler</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Disponibilidad
            </label>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={(e) =>
                    setFormData({ ...formData, isAvailable: e.target.checked })
                  }
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Disponible</span>
              </label>
            </div>
          </div>

          {/* Amenidades */}
          <div className="col-span-2 mt-6">
            <h2 className="text-xl font-semibold mb-4">Amenidades</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                'wifi',
                'pool',
                'gym',
                'parking',
                'security',
                'airConditioning',
                'heating',
                'laundry',
                'elevator',
                'petFriendly',
                'garden',
                'terrace',
                'balcony',
              ].map((amenity) => (
                <div key={amenity} className="mb-2">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name={amenity}
                      checked={!!formData.amenities[amenity]}
                      onChange={handleAmenityChange}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">{amenity}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Ubicación */}
          <div className="col-span-2 mt-6">
            <h2 className="text-xl font-semibold mb-4">Ubicación</h2>
          </div>

          {/* Reemplazamos los selectores de país y estado con nuestro componente */}
          <div className="col-span-2">
            <CountryStateSelector
              selectedCountryId={formData.address.countryId}
              selectedStateId={formData.address.stateId}
              onCountryChange={handleCountryChange}
              onStateChange={handleStateChange}
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="address.city"
            >
              Ciudad
            </label>
            <input
              id="address.city"
              name="address.city"
              type="text"
              value={formData.address.city || ''}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="address.postalCode"
            >
              Código Postal
            </label>
            <input
              id="address.postalCode"
              name="address.postalCode"
              type="text"
              value={formData.address.postalCode || ''}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            />
          </div>

          <div className="col-span-2 mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="address.streetName"
            >
              Dirección
            </label>
            <input
              id="address.streetName"
              name="address.streetName"
              type="text"
              value={formData.address.streetName || ''}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="address.positions.latitude"
            >
              Latitud
            </label>
            <input
              id="address.positions.latitude"
              name="address.positions.latitude"
              type="text"
              value={formData.address.positions.latitude || ''}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="address.positions.longitude"
            >
              Longitud
            </label>
            <input
              id="address.positions.longitude"
              name="address.positions.longitude"
              type="text"
              value={formData.address.positions.longitude || ''}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            />
          </div>

          <div className="col-span-2 mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="address.description"
            >
              Descripción adicional de la ubicación
            </label>
            <textarea
              id="address.description"
              name="address.description"
              rows={2}
              value={formData.address.description || ''}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            />
          </div>

          {/* Imágenes */}
          <div className="col-span-2 mt-6">
            <h2 className="text-xl font-semibold mb-4">Imágenes</h2>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Subir Imágenes
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="block w-full text-gray-700 bg-white py-2 px-3 border border-gray-300 rounded shadow-sm cursor-pointer"
              />
              <p className="mt-1 text-sm text-gray-500">Puede seleccionar múltiples imágenes</p>
            </div>

            {/* Vista previa de imágenes */}
            {imageUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Progreso de carga de imágenes */}
            {uploadingImages && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{width: `${imageUploadProgress}%`}}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Subiendo imágenes: {imageUploadProgress}%
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Botón de envío */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={loading || uploadingImages}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              (loading || uploadingImages) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading || uploadingImages ? 'Procesando...' : 'Publicar Propiedad'}
          </button>
        </div>
      </form>
    </div>
  )
}
