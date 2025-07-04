import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Calendar,
  Building2,
  Home,
  Maximize,
  type LucideIcon,
} from 'lucide-react'
import { generatePropertySku } from '@/lib/utils'
import { ProyectPhase } from '@prisma/client'

// type ProjectPhase = 'CONSTRUCTION' | 'COMPLETED' | 'PLANNING'
type ProjectType = 'APARTMENT' | 'HOUSE'

interface ProjectCardProps {
  project: {
    id: number
    slug: string
    title: string
    description: string
    phase: ProyectPhase
    address: Array<{
      city: string
      streetName: string
      state: {
        name: string
      }
      country: {
        name: string
      }
    }>
    proyectDetails: {
      type: ProjectType
      buildingYear: number
      surface: number | null
    }
    projectMedia: any[]
  }
}

const phaseColors: Record<ProyectPhase | 'DEFAULT', string> = {
  CONSTRUCTION: 'from-yellow-500 to-orange-500',
  COMPLETED: 'from-green-500 to-emerald-500',
  IN_STUDY: 'from-blue-500 to-indigo-500',
  FUNDING: 'from-blue-500 to-indigo-500',
  DEFAULT: 'from-gray-500 to-gray-700',
} as const

const projectTypeIcons: Record<ProjectType, LucideIcon> = {
  APARTMENT: Building2,
  HOUSE: Home,
} as const

const PLACEHOLDER_IMAGE = '/images/placeholder.svg'

const ProjectCard = ({ project }: ProjectCardProps) => {
  const mainAddress = project.address[0]

  const formatProjectType = (type: ProjectType): string => {
    const typeLabels: Record<ProjectType, string> = {
      APARTMENT: 'Departamento',
      HOUSE: 'Casa',
    }
    return typeLabels[type]
  }

  const getPhaseColor = (phase: ProyectPhase): string => {
    return phaseColors[phase] || phaseColors.DEFAULT
  }

  const ProjectTypeIcon =
    projectTypeIcons[project.proyectDetails.type] || Building2

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow border border-gray-200 transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg flex flex-col h-full">
      {/* Image Container with Phase Badge */}
      <div className="relative h-48 w-full flex-shrink-0">
        <div
          className={`absolute top-0 left-0 z-10 px-3 py-1 text-xs font-semibold text-white rounded-br-lg bg-gradient-to-r ${getPhaseColor(
            project.phase
          )}`}
        >
          {project.phase}
        </div>
        <Image
          src={project.projectMedia?.[0]?.link || PLACEHOLDER_IMAGE}
          alt={`Imagen de ${project.title}`}
          fill
          className="object-cover transition-transform duration-300 ease-in-out hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
          {project.title}
        </h3>

        {/* Project Details Grid */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="flex items-center gap-1 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span className="text-xs">
              Año {project.proyectDetails.buildingYear}
            </span>
          </div>

          <div className="flex items-center gap-1 text-gray-600">
            <ProjectTypeIcon className="h-4 w-4" />
            <span className="text-xs">
              {formatProjectType(project.proyectDetails.type)}
            </span>
          </div>

          {project.proyectDetails.surface && (
            <div className="flex items-center gap-1 text-gray-600">
              <Maximize className="h-4 w-4" />
              <span className="text-xs">
                {project.proyectDetails.surface} m²
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
          {project.description}
        </p>

        {/* Address */}
        <div className="text-xs text-gray-600 mb-2 flex-grow">
          <p>
            {mainAddress.streetName}, {mainAddress.city}
          </p>
          <p>
            {mainAddress?.state?.name}, {mainAddress?.country?.name}
          </p>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 mb-2">
        <div className="text-xs text-gray-600">
          <span className="font-semibold">SKU:</span> {generatePropertySku(project?.id, project?.title)}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 mt-auto">
        <Link
          href={`/proyectos/${project.slug}`}
          className="p-2 text-xs font-medium block text-center rounded-md bg-[#FB6107] hover:bg-[#FB6107]/90 text-white transition-colors"
        >
          Ver detalles
        </Link>
      </div>
    </div>
  )
}

export default ProjectCard
