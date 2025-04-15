'use client'

import { Upload, Trash2 } from 'lucide-react'

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
  // Añadir medio al proyecto
  const handleAddMedia = () => {
    if (tempMedia.link && tempMedia.title) {
      setMediaItems([...mediaItems, { ...tempMedia }])
      setTempMedia({
        link: '',
        type: 'image',
        title: '',
        description: ''
      })
      setShowMediaForm(false)
    }
  }
  
  // Eliminar medio del proyecto
  const handleRemoveMedia = (index: number) => {
    const updatedMedia = [...mediaItems]
    updatedMedia.splice(index, 1)
    setMediaItems(updatedMedia)
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
                  <div>
                    <p className="font-medium text-slate-800">{media.title}</p>
                    <p className="text-xs text-slate-500">{media.type} • {media.link}</p>
                    {media.description && <p className="text-sm text-slate-600 mt-1">{media.description}</p>}
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
            <h3 className="text-sm font-medium text-slate-700 mb-3">Añadir Nuevo Medio</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="mediaType" className="block text-sm font-medium text-slate-700 mb-1">
                  Tipo
                </label>
                <select
                  id="mediaType"
                  value={tempMedia.type}
                  onChange={(e) => setTempMedia({ ...tempMedia, type: e.target.value })}
                  className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
                >
                  <option value="image">Imagen</option>
                  <option value="video">Video</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="mediaLink" className="block text-sm font-medium text-slate-700 mb-1">
                  Enlace <span className="text-red-500">*</span>
                </label>
                <input
                  id="mediaLink"
                  type="text"
                  value={tempMedia.link}
                  onChange={(e) => setTempMedia({ ...tempMedia, link: e.target.value })}
                  className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="mediaTitle" className="block text-sm font-medium text-slate-700 mb-1">
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  id="mediaTitle"
                  type="text"
                  value={tempMedia.title}
                  onChange={(e) => setTempMedia({ ...tempMedia, title: e.target.value })}
                  className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="mediaDescription" className="block text-sm font-medium text-slate-700 mb-1">
                  Descripción
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
                  onClick={() => setShowMediaForm(false)}
                  className="px-4 py-2 border border-slate-300 rounded-md text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleAddMedia}
                  disabled={!tempMedia.link || !tempMedia.title}
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
            <Upload className="h-5 w-5 mr-2" />
            Añadir Medio
          </button>
        )}
      </div>
    </div>
  )
}