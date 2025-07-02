export interface Task {
  id: number
  description: string
  proyectId?: number
  duration: number
  dependentTask: number | null
  dependencyType: "FC" | "CC" | "none"
  dependencyDays: number
  start: string | null // ISO date string
  end: string | null // ISO date string
  plannedStart: string | null
  plannedEnd: string | null
  realStart: string | null
  realEnd: string | null
  responsible: string
  status: "Pendiente" | "En Progreso" | "Completado"
  realEndDate: string | null
  effectiveDays: number | null
  isDelayed: boolean
  delayDays: number
  isAhead: boolean
  aheadDays: number
}

export interface Roadmap {
  id: number
  proyectId: number
  tasks: Task[]
  createdAt: string
  updatedAt: string
} 