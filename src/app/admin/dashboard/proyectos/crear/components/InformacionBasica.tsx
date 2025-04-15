'use client'

import { ProyectPhase, BusinessModel } from '@prisma/client'

interface InformacionBasicaProps {
  title: string
  setTitle: (value: string) => void
  slug: string
  setSlug: (value: string) => void
  openingLine: string
  setOpeningLine: (value: string) => void
  description: string
  setDescription: (value: string) => void
  phase: ProyectPhase
  setPhase: (value: ProyectPhase) => void
  businessModel: BusinessModel
  setBusinessModel: (value: BusinessModel) => void
  openingPhase: number
  setOpeningPhase: (value: number) => void
  priority: number
  setPriority: (value: number) => void
  daysToEnd: number
  setDaysToEnd: (value: number) => void
  daysToStart: number
  setDaysToStart: (value: number) => void
}

export default function InformacionBasica({
  title,
  setTitle,
  slug,
  setSlug,
  openingLine,
  setOpeningLine,
  description,
  setDescription,
  phase,
  setPhase,
  businessModel,
  setBusinessModel,
  openingPhase,
  setOpeningPhase,
  priority,
  setPriority,
  daysToEnd,
  setDaysToEnd,
  daysToStart,
  setDaysToStart
}: InformacionBasicaProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
        <h2 className="text-lg font-medium text-slate-800">Información del Proyecto</h2>
        <p className="text-sm text-slate-500">Datos básicos del proyecto</p>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
            Título <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-slate-700 mb-1">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
            required
          />
          <p className="mt-1 text-xs text-slate-500">
            URL amigable para el proyecto (sin espacios ni caracteres especiales)
          </p>
        </div>
        
        <div>
          <label htmlFor="businessModel" className="block text-sm font-medium text-slate-700 mb-1">
            Modelo de Negocio <span className="text-red-500">*</span>
          </label>
          <select
            id="businessModel"
            value={businessModel}
            onChange={(e) => setBusinessModel(e.target.value as BusinessModel)}
            className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
            required
          >
            <option value="SOLD">Venta</option>
            <option value="RENT">Alquiler</option>
            <option value="LEADING">Leasing</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="phase" className="block text-sm font-medium text-slate-700 mb-1">
            Fase del Proyecto <span className="text-red-500">*</span>
          </label>
          <select
            id="phase"
            value={phase}
            onChange={(e) => setPhase(e.target.value as ProyectPhase)}
            className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
            required
          >
            <option value="IN_STUDY">En Estudio</option>
            <option value="FUNDING">Financiación</option>
            <option value="CONSTRUCTION">Construcción</option>
            <option value="COMPLETED">Completado</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="openingPhase" className="block text-sm font-medium text-slate-700 mb-1">
            Fase de Apertura
          </label>
          <input
            id="openingPhase"
            type="number"
            value={openingPhase}
            onChange={(e) => setOpeningPhase(parseInt(e.target.value) || 0)}
            className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
          />
        </div>
        
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-slate-700 mb-1">
            Prioridad
          </label>
          <input
            id="priority"
            type="number"
            value={priority}
            onChange={(e) => setPriority(parseInt(e.target.value) || 0)}
            className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
          />
          <p className="mt-1 text-xs text-slate-500">
            Valor numérico que determina la prioridad de visualización (mayor número = mayor prioridad)
          </p>
        </div>
        
        <div>
          <label htmlFor="daysToEnd" className="block text-sm font-medium text-slate-700 mb-1">
            Días para finalizar
          </label>
          <input
            id="daysToEnd"
            type="number"
            value={daysToEnd}
            onChange={(e) => setDaysToEnd(parseInt(e.target.value) || 0)}
            className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
          />
        </div>
        
        <div>
          <label htmlFor="daysToStart" className="block text-sm font-medium text-slate-700 mb-1">
            Días para comenzar
          </label>
          <input
            id="daysToStart"
            type="number"
            value={daysToStart}
            onChange={(e) => setDaysToStart(parseInt(e.target.value) || 0)}
            className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
          />
        </div>
        
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="openingLine" className="block text-sm font-medium text-slate-700 mb-1">
            Línea de Apertura
          </label>
          <input
            id="openingLine"
            type="text"
            value={openingLine}
            onChange={(e) => setOpeningLine(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
          />
          <p className="mt-1 text-xs text-slate-500">
            Una breve introducción o eslogan para el proyecto
          </p>
        </div>
        
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
            Descripción
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-slate-500 focus:ring-slate-500"
          />
        </div>
      </div>
    </div>
  )
}