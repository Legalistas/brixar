'use client'

import { useState } from 'react'
import { Upload, Trash2, Image as ImageIcon, Video, FileText, Loader2, Plus } from 'lucide-react'

interface MediaItemsProps {
  mediaItems: {link: string, type: string, title: string, description: string}[]
  setMediaItems: (value: {link: string, type: string, title: string, description: string}[]) => void
  showMediaForm: boolean
  setShowMediaForm: (value: boolean) => void
  tempMedia: {link: string, type: string, title: string, description: string}
  setTempMedia: (value: {link: string, type: string, title: string, description: string}) => void
}

export default function MediaItems({
  mediaItems,
  setMediaItems,
  showMediaForm,
  setShowMediaForm,
  tempMedia,
  setTempMedia
}: MediaItemsProps) {
  // Estado para manejar la carga de archivos
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])

  // Añadir medio al proyecto
  const handleAddMedia = () => {
    if (tempMedia.link && tempMedia.title) {
      setMediaItems([...mediaItems, { ...tempMedia }])
      resetForm()
    } else if (uploadedUrls.length > 0) {
      // Añadir todos los medios subidos
      const newMediaItems = uploadedUrls.map((url, index) => ({
        link: url,
        type: 'image',
        title: tempMedia.title || `Imagen ${mediaItems.length + index + 1}`,
        description: tempMedia.description
      }));
      
      setMediaItems([...mediaItems, ...newMediaItems]);
      resetForm();
    }
  }
  
  // Limpiar el formulario
  const resetForm = () => {
    setTempMedia({
      link: '',
      type: 'image',
      title: '',
      description: ''
    })
    setShowMediaForm(false)
    
    // Limpiar las vistas previas y archivos seleccionados
    previewUrls.forEach(url => URL.revokeObjectURL(url))
    setPreviewUrls([])
    setSelectedFiles([])
    setUploadedUrls([])
  }
  
  // Eliminar medio del proyecto
  const handleRemoveMedia = (index: number) => {
    const updatedMedia = [...mediaItems]
    updatedMedia.splice(index, 1)
    setMediaItems(updatedMedia)
  }

  // Manejar la selección de archivos
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      setSelectedFiles(files)
      
      // Crear URLs de vista previa y almacenarlas
      const urls = files.map(file => URL.createObjectURL(file))
      setPreviewUrls(urls)
      
      // Actualizar el tipo en tempMedia
      setTempMedia({
        ...tempMedia,
        type: 'image'
      })
    }
  }

  // Subir archivos a Cloudinary
  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return

    try {
      setUploading(true)
      setUploadProgress(10)
      
      const urls: string[] = []
      const totalFiles = selectedFiles.length
      
      for (let i = 0; i < totalFiles; i++) {
        const file = selectedFiles[i]
        const formData = new FormData()
        formData.append('file', file)
        
        const response = await fetch('/api/uploadFile', {
          method: 'POST',
          body: formData
        })
        
        if (!response.ok) {
          throw new Error(`Error al subir el archivo ${i + 1}`)
        }
        
        const data = await response.json()
        
        if (data.success) {
          urls.push(data.url)
        } else {
          throw new Error(data.error || `Error desconocido al subir el archivo ${i + 1}`)
        }
        
        // Actualizar el progreso de carga
        setUploadProgress(Math.floor(((i + 1) / totalFiles) * 90) + 10)
      }
      
      setUploadedUrls(urls)
      
      // Si solo hay un archivo, actualizamos el tempMedia directamente
      if (urls.length === 1) {
        setTempMedia({
          ...tempMedia,
          link: urls[0],
          title: tempMedia.title || `Imagen ${mediaItems.length + 1}`
        })
      }
      
      setUploadProgress(100)
    } catch (error) {
      console.error('Error al subir archivos:', error)
      alert('Error al subir los archivos. Por favor, inténtelo de nuevo.')
    } finally {
      setUploading(false)
    }
  }

  // Limpiar recursos cuando se cancela
  const handleCancel = () => {
    previewUrls.forEach(url => URL.revokeObjectURL(url))
    resetForm()
  }
  
  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
        <h2 className="text-lg font-medium text-slate-800">Medios del Proyecto</h2>
        <p className="text-sm text-slate-500">Imágenes y videos relacionados con el proyecto</p>
      </div>
      
      <div className="p-6">
        {/* Lista de medios existentes */}
        {mediaItems.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-slate-700 mb-3">Medios Añadidos</h3>
            <ul className="space-y-3">
              {mediaItems.map((media, index) => (
                <li key={index} className="flex items-center justify-between bg-slate-50 p-3 rounded-md">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-slate-200 rounded-md overflow-hidden mr-3 flex-shrink-0">
                      {media.type === 'image' && media.link && (
                        <img src={media.link} alt={media.title} className="w-full h-full object-cover" />
                      )}
                      {media.type === 'video' && (
                        <div className="w-full h-full flex items-center justify-center bg-slate-300">
                          <Video className="h-6 w-6 text-slate-600" />
                        </div>
                      )}
                      {media.type !== 'image' && media.type !== 'video' && (
                        <div className="w-full h-full flex items-center justify-center bg-slate-300">
                          <FileText className="h-6 w-6 text-slate-600" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{media.title}</p>
                      <p className="text-xs text-slate-500">{media.type} • {media.link.substring(0, 30)}...</p>
                      {media.description && <p className="text-sm text-slate-600 mt-1">{media.description}</p>}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveMedia(index)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Formulario para añadir medios */}
        {showMediaForm ? (
          <div className="border border-slate-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">Añadir Nuevos Medios</h3>
            <div className="space-y-4">
              {/* Sección para cargar archivos */}
              <div className="border-b border-slate-200 pb-4">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Subir archivos (múltiples)
                  </label>
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    accept="image/*"
                    multiple
                    className="block w-full text-sm text-slate-500
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-md file:border-0
                              file:text-sm file:font-semibold
                              file:bg-slate-50 file:text-slate-700
                              hover:file:bg-slate-100"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Puede seleccionar múltiples imágenes a la vez
                  </p>
                </div>
                
                {/* Vista previa de imágenes seleccionadas */}
                {previewUrls.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-slate-700 mb-2">
                      Vista previa ({previewUrls.length} {previewUrls.length === 1 ? 'imagen' : 'imágenes'})
                    </h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <div className="w-full h-24 rounded-md overflow-hidden">
                            <img src={url} alt={`Vista previa ${index + 1}`} className="w-full h-full object-cover" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Botón para subir archivos a Cloudinary */}
                {selectedFiles.length > 0 && uploadedUrls.length === 0 && (
                  <div className="mb-4">
                    <button
                      type="button"
                      onClick={uploadFiles}
                      disabled={uploading}
                      className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Subiendo... {uploadProgress}%
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Subir {selectedFiles.length} {selectedFiles.length === 1 ? 'archivo' : 'archivos'}
                        </>
                      )}
                    </button>
                    
                    {uploading && (
                      <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full" 
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Mostrar URLs subidas */}
                {uploadedUrls.length > 0 && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded-md">
                    <p className="text-sm text-green-700 font-medium mb-1">
                      {uploadedUrls.length} {uploadedUrls.length === 1 ? 'archivo subido' : 'archivos subidos'} correctamente
                    </p>
                    <p className="text-xs text-green-600">
                      Las imágenes se guardarán en el proyecto cuando haga clic en &quot;Añadir&quot;
                    </p>
                  </div>
                )}
              </div>
              
              {/* Información común para todos los archivos */}
              <div>
                <label htmlFor="mediaTitle" className="block text-sm font-medium text-slate-700 mb-1">
                  Título común {uploadedUrls.length > 1 ? '(opcional)' : <span className="text-red-500">*</span>}
                </label>
                <input
                  id="mediaTitle"
                  type="text"
                  value={tempMedia.title}
                  onChange={(e) => setTempMedia({ ...tempMedia, title: e.target.value })}
                  className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
                  required={uploadedUrls.length <= 1}
                />
                {uploadedUrls.length > 1 && (
                  <p className="text-xs text-slate-500 mt-1">
                    Si no especifica un título, se generará automáticamente uno para cada imagen
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="mediaDescription" className="block text-sm font-medium text-slate-700 mb-1">
                  Descripción común (opcional)
                </label>
                <textarea
                  id="mediaDescription"
                  value={tempMedia.description}
                  onChange={(e) => setTempMedia({ ...tempMedia, description: e.target.value })}
                  rows={2}
                  className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-slate-300 rounded-md text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleAddMedia}
                  disabled={(uploadedUrls.length === 0 && !tempMedia.link) || (uploadedUrls.length <= 1 && !tempMedia.title)}
                  className="px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-900 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  Añadir
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowMediaForm(true)}
            className="flex items-center justify-center w-full py-3 border-2 border-dashed border-slate-300 rounded-md text-slate-600 hover:border-slate-400 hover:text-slate-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Añadir Medios
          </button>
        )}
      </div>
    </div>
  )
}