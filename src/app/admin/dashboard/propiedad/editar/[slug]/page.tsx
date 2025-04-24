'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { API_ENDPOINTS } from '@/constants/api-endpoint'
import { PropertyState, ListingType } from '@prisma/client'
import CountryStateSelector from '@/components/common/CountryStateSelector'
import { Loader2 } from 'lucide-react'

export default function EditarPropiedad({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const { slug } = params
  
  const [loading, setLoading] = useState(false)
  const [loadingProperty, setLoadingProperty] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<{ id: number, url: string }[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const [imageUploadProgress, setImageUploadProgress] = useState(0)
  const [propertyNotFound, setPropertyNotFound] = useState(false)

  // IDs por defecto para Argentina y Santa Fe
  const defaultCountryId = 1 // Argentina
  const defaultStateId = 21 // Santa Fe
  const defaultCity = 'Rafaela'

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
    status: 'EN_VENTA',
    amenities: {} as Record<string, boolean>,
    address: {
      id: 0,
      countryId: defaultCountryId,
      stateId: defaultStateId,
      city: defaultCity,
      postalCode: '',
      streetName: '',
      description: '',
      positions: {
        id: 0,
        latitude: '',
        longitude: '',
      },
    },
  })

  // Cargar datos de la propiedad al montar el componente
  useEffect(() => {
    const fetchProperty = async () => {
      setLoadingProperty(true)
      try {
        const response = await fetch(API_ENDPOINTS.PROPERTY_GET(slug))
        
        if (!response.ok) {
          if (response.status === 404) {
            setPropertyNotFound(true)
          }
          throw new Error('Error al cargar la propiedad')
        }
        
        const property = await response.json()
        
        // Preparar datos de la propiedad para el formulario
        setFormData({
          title: property.title || '',
          description: property.description || '',
          price: property.price ? Number(property.price) : 0,
          bedrooms: property.bedrooms || 0,
          bathrooms: property.bathrooms || 0,
          squareMeters: property.squareMeters || 0,
          propertyType: property.propertyType || PropertyState.APARTMENT,
          listingType: property.listingType || ListingType.SALE,
          isAvailable: property.isAvailable ?? true,
          yearBuilt: property.yearBuilt || new Date().getFullYear(),
          parkingSpaces: property.parkingSpaces || 0,
          quantity: property.quantity || 1,
          status: property.status || 'EN_VENTA',
          amenities: property.amenities || {},
          address: {
            id: property.address && property.address[0] ? property.address[0].id : 0,
            countryId: property.address && property.address[0] ? property.address[0].countryId : defaultCountryId,
            stateId: property.address && property.address[0] ? property.address[0].stateId : defaultStateId,
            city: property.address && property.address[0] ? property.address[0].city : defaultCity,
            postalCode: property.address && property.address[0] ? property.address[0].postalCode : '',
            streetName: property.address && property.address[0] ? property.address[0].streetName : '',
            description: property.address && property.address[0] ? property.address[0].description : '',
            positions: {
              id: property.address && property.address[0] && property.address[0].positions && property.address[0].positions[0] 
                ? property.address[0].positions[0].id 
                : 0,
              latitude: property.address && property.address[0] && property.address[0].positions && property.address[0].positions[0] 
                ? property.address[0].positions[0].latitude 
                : '',
              longitude: property.address && property.address[0] && property.address[0].positions && property.address[0].positions[0] 
                ? property.address[0].positions[0].longitude 
                : '',
            },
          },
        })
        
        // Cargar imágenes existentes
        if (property.images && property.images.length > 0) {
          setExistingImages(property.images)
        }
      } catch (error) {
        console.error('Error al cargar la propiedad:', error)
        setError('Error al cargar los datos de la propiedad')
      } finally {
        setLoadingProperty(false)
      }
    }
    
    fetchProperty()
  }, [slug])

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

  // Manejador para el cambio de ciudad
  const handleCityChange = (city: string) => {
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        city,
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

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      status: e.target.value
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

  const removeExistingImage = (id: number) => {
    setExistingImages(existingImages.filter(img => img.id !== id))
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
      // Subir nuevas imágenes a Cloudinary
      let cloudinaryUrls: string[] = []
      if (imageFiles.length > 0) {
        cloudinaryUrls = await uploadToCloudinary(imageFiles)
      }

      // Preparar datos con imágenes de Cloudinary y existentes
      const propertyData = {
        ...formData,
        images: [
          ...existingImages.map(img => img.url),
          ...cloudinaryUrls
        ],
      }

      // Enviar a la API para actualizar la propiedad
      const response = await fetch(API_ENDPOINTS.PROPERTY_UPDATE(slug), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al actualizar la propiedad')
      }

      setSuccess(true)

      // Redireccionar después de 2 segundos
      setTimeout(() => {
        router.push('/admin/dashboard/publicaciones')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al actualizar la propiedad')
    } finally {
      setLoading(false)
    }
  }

  if (loadingProperty) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
          <p className="mt-3 text-gray-600">Cargando datos de la propiedad...</p>
        </div>
      </div>
    )
  }

  if (propertyNotFound) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded mb-4">
          <p className="font-medium text-lg">Propiedad no encontrada</p>
          <p>La propiedad que intentas editar no existe o ha sido eliminada.</p>
          <button 
            onClick={() => router.push('/admin/dashboard/publicaciones')}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Volver al listado
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Editar Propiedad</h1>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Propiedad actualizada con éxito. Redirigiendo...
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

          {/* Estado de la propiedad */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="status"
            >
              Estado
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleStatusChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            >
              <option value="EN_VENTA">En Venta</option>
              <option value="RESERVADA">Reservada</option>
              <option value="VENDIDA">Vendida</option>
            </select>
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
              defaultCity={formData.address.city || defaultCity}
              onCityChange={handleCityChange}
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

            {/* Imágenes existentes */}
            {existingImages.length > 0 && (
              <div className="mb-6">
                <h3 className="text-md font-medium mb-3">Imágenes actuales</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  {existingImages.map((img) => (
                    <div key={img.id} className="relative">
                      <img
                        src={img.url}
                        alt="Imagen de la propiedad"
                        className="w-full h-32 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(img.id)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Subir nuevas imágenes */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Agregar nuevas imágenes
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

            {/* Vista previa de nuevas imágenes */}
            {imageUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Vista previa ${index + 1}`}
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

        {/* Botones de acción */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/admin/dashboard/publicaciones')}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            disabled={loading || uploadingImages}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              (loading || uploadingImages) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading || uploadingImages ? 'Actualizando...' : 'Actualizar Propiedad'}
          </button>
        </div>
      </form>
    </div>
  )
}