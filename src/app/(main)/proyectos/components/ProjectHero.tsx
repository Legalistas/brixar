import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Expand, MapPin, X } from 'lucide-react'
import { Proyect } from '@/types/proyect'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface ProjectHeroProps {
  project: Proyect
}

export const ProjectHero = ({ project }: ProjectHeroProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'CONSTRUCTION':
        return 'bg-orange-500 hover:bg-orange-600'
      case 'FUNDING':
        return 'bg-gray-500 hover:bg-gray-600'
      case 'COMPLETED':
        return 'bg-green-500 hover:bg-green-600'
      default:
        return 'bg-gray-500 hover:bg-gray-600'
    }
  }

  const getPhaseText = (phase: string) => {
    switch (phase) {
      case 'CONSTRUCTION':
        return 'EN CONSTRUCCIÓN'
      case 'FUNDING':
        return 'FINANCIAMIENTO'
      case 'COMPLETED':
        return 'COMPLETADO'
      default:
        return phase
    }
  }

  const address = project.address[0]
  const location = `${address?.streetName}, ${address?.city}, ${address?.state?.name}`

  // Mock images for demonstration - in real app these would come from project.projectMedia
  const images =
    project.projectMedia && project.projectMedia.length > 0
      ? project.projectMedia.map((media) => media.url)
      : [
          `https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1920&h=800&fit=crop`,
          `https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1920&h=800&fit=crop`,
          `https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=1920&h=800&fit=crop`,
        ]

  const nextImage = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
    }
  }

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
    }
  }

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <div className="relative group">
        {/* Hero Image */}
        <div className="aspect-[16/9] md:aspect-[21/9] bg-gray-200 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
            <img
              src={images[currentImageIndex]}
              alt={`${project.title} - Imagen ${currentImageIndex + 1}`}
              className="w-full h-full object-cover cursor-pointer"
              onClick={openModal}
            />

            {/* Expand button */}
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/70 text-white border-0"
              onClick={openModal}
            >
              <Expand className="w-4 h-4" />
            </Button>

            {/* Navigation arrows - only show if more than one image */}
            {images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  className={`absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-0 ${
                    currentImageIndex === 0
                      ? 'opacity-50 cursor-not-allowed'
                      : 'opacity-0 group-hover:opacity-100'
                  } transition-opacity`}
                  onClick={prevImage}
                  disabled={currentImageIndex === 0}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  className={`absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-0 ${
                    currentImageIndex === images.length - 1
                      ? 'opacity-50 cursor-not-allowed'
                      : 'opacity-0 group-hover:opacity-100'
                  } transition-opacity`}
                  onClick={nextImage}
                  disabled={currentImageIndex === images.length - 1}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}

            {/* Image indicators */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Project Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 md:p-8">
          <div className="container mx-auto">
            <div className="flex flex-col gap-4">
              <Badge
                className={`self-start text-white text-sm font-medium px-4 py-2 ${getPhaseColor(
                  project.phase
                )}`}
              >
                {getPhaseText(project.phase)}
              </Badge>

              <div>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
                  {project.title}
                </h1>

                <div className="flex items-center text-white/90 text-lg">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
            <div className="max-w-4xl w-full h-auto">
              <img
                src={images[currentImageIndex]}
                alt={`${project.title} - Imagen ${currentImageIndex + 1}`}
                className="w-full h-auto"
              />
            </div>
          </div>
        )}
      </div>

      {/* Modal for expanded image view */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full">
            <Button
              variant="secondary"
              size="sm"
              className="absolute -top-12 right-0 bg-white/20 hover:bg-white/30 text-white border-0"
              onClick={closeModal}
            >
              <X className="w-4 h-4" />
            </Button>

            <img
              src={images[currentImageIndex]}
              alt={`${project.title} - Imagen ${currentImageIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain"
            />

            {/* Modal navigation */}
            {images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  className={`absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-0 ${
                    currentImageIndex === 0
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                  onClick={prevImage}
                  disabled={currentImageIndex === 0}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  className={`absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-0 ${
                    currentImageIndex === images.length - 1
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                  onClick={nextImage}
                  disabled={currentImageIndex === images.length - 1}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>

                {/* Modal image counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
