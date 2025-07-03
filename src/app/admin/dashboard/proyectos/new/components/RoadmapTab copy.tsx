"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CalendarDays,
  Save,
  Download,
  Eye,
  EyeOff,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  Circle,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Proyect } from "@/store/proyectStore"

interface Task {
  id: number
  description: string
  proyectId?: number
  duration: number
  dependentTask: number | null
  dependencyType: "FC" | "CC" | "none"
  dependencyDays: number
  start: Date | null
  end: Date | null
  // Fechas planificadas originales
  plannedStart: Date | null
  plannedEnd: Date | null
  // Fechas reales
  realStart: Date | null
  realEnd: Date | null
  responsible: string
  status: "Pendiente" | "En Progreso" | "Completado"
  realEndDate: Date | null // Mantener para compatibilidad
  effectiveDays: number | null
  // Nuevos campos para tracking
  isDelayed: boolean
  delayDays: number
  isAhead: boolean
  aheadDays: number
}

interface ProjectInfo {
  name: string
  objective: string
  startDate: Date
  plannedWorkDays: number
  endDate: Date
}

const initialTasks: Task[] = [
  {
    id: 1,
    description: "Planos y permisos: Municipal, Gas, pluvial, herrería, aberturas, Conexión luz",
    duration: 31,
    proyectId: 11,
    dependentTask: null,
    dependencyType: "none",
    dependencyDays: 0,
    start: null,
    end: null,
    plannedStart: null,
    plannedEnd: null,
    realStart: new Date("2025-01-01"),
    realEnd: null,
    responsible: "Martina",
    status: "Completado",
    realEndDate: new Date("2025-02-05"),
    effectiveDays: null,
    isDelayed: false,
    delayDays: 0,
    isAhead: false,
    aheadDays: 0,
  },
  {
    id: 2,
    description: "Preparación del terreno",
    proyectId: 11,
    duration: 5,
    dependentTask: 1,
    dependencyType: "FC",
    dependencyDays: 1,
    start: null,
    end: null,
    plannedStart: null,
    plannedEnd: null,
    realStart: null,
    realEnd: null,
    responsible: "",
    status: "Pendiente",
    realEndDate: null,
    effectiveDays: null,
    isDelayed: false,
    delayDays: 0,
    isAhead: false,
    aheadDays: 0,
  },
  {
    id: 3,
    description: "Cimientos - Fundaciones",
    proyectId: 11,
    duration: 15,
    dependentTask: 2,
    dependencyType: "FC",
    dependencyDays: 1,
    start: null,
    end: null,
    plannedStart: null,
    plannedEnd: null,
    realStart: null,
    realEnd: null,
    responsible: "",
    status: "Pendiente",
    realEndDate: null,
    effectiveDays: null,
    isDelayed: false,
    delayDays: 0,
    isAhead: false,
    aheadDays: 0,
  },
  {
    id: 4,
    description: "Capa Aisladora - Estructura. (Encargar aberturas)",
    duration: 2,
    proyectId: 11,
    dependentTask: 3,
    dependencyType: "FC",
    dependencyDays: 1,
    start: null,
    end: null,
    plannedStart: null,
    plannedEnd: null,
    realStart: null,
    realEnd: null,
    responsible: "",
    status: "Pendiente",
    realEndDate: null,
    effectiveDays: null,
    isDelayed: false,
    delayDays: 0,
    isAhead: false,
    aheadDays: 0,
  },
  {
    id: 5,
    description: "Mampostería",
    duration: 60,
    proyectId: 11,
    dependentTask: 4,
    dependencyType: "FC",
    dependencyDays: 1,
    start: null,
    end: null,
    plannedStart: null,
    plannedEnd: null,
    realStart: null,
    realEnd: null,
    responsible: "",
    status: "Pendiente",
    realEndDate: null,
    effectiveDays: null,
    isDelayed: false,
    delayDays: 0,
    isAhead: false,
    aheadDays: 0,
  },
  {
    id: 6,
    description: "Plomería: cañería bocas, arañas de piso, pluviales",
    duration: 10,
    dependentTask: 5,
    proyectId: 11,
    dependencyType: "CC",
    dependencyDays: 1,
    start: null,
    end: null,
    plannedStart: null,
    plannedEnd: null,
    realStart: null,
    realEnd: null,
    responsible: "",
    status: "Pendiente",
    realEndDate: null,
    effectiveDays: null,
    isDelayed: false,
    delayDays: 0,
    isAhead: false,
    aheadDays: 0,
  },
  {
    id: 7,
    description: "Contrapisos",
    duration: 20,
    dependentTask: 6,
    proyectId: 11,
    dependencyType: "FC",
    dependencyDays: 1,
    start: null,
    end: null,
    plannedStart: null,
    plannedEnd: null,
    realStart: null,
    realEnd: null,
    responsible: "",
    status: "Pendiente",
    realEndDate: null,
    effectiveDays: null,
    isDelayed: false,
    delayDays: 0,
    isAhead: false,
    aheadDays: 0,
  },
  {
    id: 8,
    description: "Encadenado",
    duration: 10,
    dependentTask: 7,
    proyectId: 11,
    dependencyType: "FC",
    dependencyDays: 1,
    start: null,
    end: null,
    plannedStart: null,
    plannedEnd: null,
    realStart: null,
    realEnd: null,
    responsible: "",
    status: "Pendiente",
    realEndDate: null,
    effectiveDays: null,
    isDelayed: false,
    delayDays: 0,
    isAhead: false,
    aheadDays: 0,
  },
  {
    id: 9,
    description: "Techado: cabriadas, chapas y babetas",
    duration: 30,
    dependentTask: 8,
    proyectId: 11,
    dependencyType: "FC",
    dependencyDays: 0,
    start: null,
    end: null,
    plannedStart: null,
    plannedEnd: null,
    realStart: null,
    realEnd: null,
    responsible: "",
    status: "Pendiente",
    realEndDate: null,
    effectiveDays: null,
    isDelayed: false,
    delayDays: 0,
    isAhead: false,
    aheadDays: 0,
  },
  {
    id: 10,
    description: "Herrería: colocación de rejas y portones",
    duration: 5,
    dependentTask: 9,
    proyectId: 11,
    dependencyType: "FC",
    dependencyDays: 0,
    start: null,
    end: null,
    plannedStart: null,
    plannedEnd: null,
    realStart: null,
    realEnd: null,
    responsible: "",
    status: "Pendiente",
    realEndDate: null,
    effectiveDays: null,
    isDelayed: false,
    delayDays: 0,
    isAhead: false,
    aheadDays: 0,
  },
  {
    id: 11,
    description: "Obra vial: veredas e ingresos",
    duration: 10,
    dependentTask: 10,
    proyectId: 11,
    dependencyType: "CC",
    dependencyDays: 0,
    start: null,
    end: null,
    plannedStart: null,
    plannedEnd: null,
    realStart: null,
    realEnd: null,
    responsible: "",
    status: "Pendiente",
    realEndDate: null,
    effectiveDays: null,
    isDelayed: false,
    delayDays: 0,
    isAhead: false,
    aheadDays: 0,
  },
  {
    id: 12,
    description: "Plomería: cañería pvc en paredes, cañería de gas",
    duration: 10,
    dependentTask: 11,
    proyectId: 11,
    dependencyType: "CC",
    dependencyDays: 0,
    start: null,
    end: null,
    plannedStart: null,
    plannedEnd: null,
    realStart: null,
    realEnd: null,
    responsible: "",
    status: "Pendiente",
    realEndDate: null,
    effectiveDays: null,
    isDelayed: false,
    delayDays: 0,
    isAhead: false,
    aheadDays: 0,
  },
  {
    id: 13,
    description: "Electricidad: colocación de caños y cajas en cielorrasos",
    duration: 10,
    dependentTask: 12,
    proyectId: 11,
    dependencyType: "FC",
    dependencyDays: 0,
    start: null,
    end: null,
    plannedStart: null,
    plannedEnd: null,
    realStart: null,
    realEnd: null,
    responsible: "",
    status: "Pendiente",
    realEndDate: null,
    effectiveDays: null,
    isDelayed: false,
    delayDays: 0,
    isAhead: false,
    aheadDays: 0,
  },
  {
    id: 14,
    description: "Revoque grueso. (Encargar muebles)",
    duration: 30,
    dependentTask: 13,
    proyectId: 11,
    dependencyType: "FC",
    dependencyDays: 0,
    start: null,
    end: null,
    plannedStart: null,
    plannedEnd: null,
    realStart: null,
    realEnd: null,
    responsible: "",
    status: "Pendiente",
    realEndDate: null,
    effectiveDays: null,
    isDelayed: false,
    delayDays: 0,
    isAhead: false,
    aheadDays: 0,
  },
  {
    id: 15,
    description: "Drylock: colocación de perfiles",
    duration: 10,
    dependentTask: 14,
    proyectId: 11,
    dependencyType: "FC",
    dependencyDays: 0,
    start: null,
    end: null,
    plannedStart: null,
    plannedEnd: null,
    realStart: null,
    realEnd: null,
    responsible: "",
    status: "Pendiente",
    realEndDate: null,
    effectiveDays: null,
    isDelayed: false,
    delayDays: 0,
    isAhead: false,
    aheadDays: 0,
  },
  {
    id: 16,
    description: "Tejido patio",
    duration: 5,
    dependentTask: 15,
    proyectId: 11,
    dependencyType: "FC",
    dependencyDays: 0,
    start: null,
    end: null,
    plannedStart: null,
    plannedEnd: null,
    realStart: null,
    realEnd: null,
    responsible: "",
    status: "Pendiente",
    realEndDate: null,
    effectiveDays: null,
    isDelayed: false,
    delayDays: 0,
    isAhead: false,
    aheadDays: 0,
  },
  {
    id: 17,
    description: "Colocación de aberturas",
    duration: 10,
    dependentTask: 16,
    proyectId: 11,
    dependencyType: "FC",
    dependencyDays: 0,
    start: null,
    end: null,
    plannedStart: null,
    plannedEnd: null,
    realStart: null,
    realEnd: null,
    responsible: "",
    status: "Pendiente",
    realEndDate: null,
    effectiveDays: null,
    isDelayed: false,
    delayDays: 0,
    isAhead: false,
    aheadDays: 0,
  },
  {
    id: 18,
    description: "Carpetas",
    duration: 5,
    dependentTask: 17,
    proyectId: 11,
    dependencyType: "FC",
    dependencyDays: 0,
    start: null,
    end: null,
    plannedStart: null,
    plannedEnd: null,
    realStart: null,
    realEnd: null,
    responsible: "",
    status: "Pendiente",
    realEndDate: null,
    effectiveDays: null,
    isDelayed: false,
    delayDays: 0,
    isAhead: false,
    aheadDays: 0,
  },
  {
    id: 19,
    description: "Drylock: terminación cielorrasos",
    duration: 15,
    dependentTask: 18,
    proyectId: 11,
    dependencyType: "FC",
    dependencyDays: 0,
    start: null,
    end: null,
    plannedStart: null,
    plannedEnd: null,
    realStart: null,
    realEnd: null,
    responsible: "",
    status: "Pendiente",
    realEndDate: null,
    effectiveDays: null,
    isDelayed: false,
    delayDays: 0,
    isAhead: false,
    aheadDays: 0,
  },
  {
    id: 20,
    description: "Revoque fino - Enduido",
    duration: 15,
    dependentTask: 19,
    proyectId: 11,
    dependencyType: "FC",
    dependencyDays: 0,
    start: null,
    end: null,
    plannedStart: null,
    plannedEnd: null,
    realStart: null,
    realEnd: null,
    responsible: "",
    status: "Pendiente",
    realEndDate: null,
    effectiveDays: null,
    isDelayed: false,
    delayDays: 0,
    isAhead: false,
    aheadDays: 0,
  },
  {
    id: 21,
    description: "Cerámicas - Azulejos",
    duration: 30,
    dependentTask: 20,
    proyectId: 11,
    dependencyType: "FC",
    dependencyDays: 0,
    start: null,
    end: null,
    plannedStart: null,
    plannedEnd: null,
    realStart: null,
    realEnd: null,
    responsible: "",
    status: "Pendiente",
    realEndDate: null,
    effectiveDays: null,
    isDelayed: false,
    delayDays: 0,
    isAhead: false,
    aheadDays: 0,
  },
  {
    id: 22,
    description: "Pintura: primera etapa interior, exterior",
    duration: 20,
    dependentTask: 21,
    proyectId: 11,
    dependencyType: "FC",
    dependencyDays: 0,
    start: null,
    end: null,
    plannedStart: null,
    plannedEnd: null,
    realStart: null,
    realEnd: null,
    responsible: "",
    status: "Pendiente",
    realEndDate: null,
    effectiveDays: null,
    isDelayed: false,
    delayDays: 0,
    isAhead: false,
    aheadDays: 0,
  },
  {
    id: 23,
    description: "Carpintería: muebles cocina y baño",
    duration: 5,
    dependentTask: 22,
    proyectId: 11,
    dependencyType: "FC",
    dependencyDays: 0,
    start: null,
    end: null,
    plannedStart: null,
    plannedEnd: null,
    realStart: null,
    realEnd: null,
    responsible: "",
    status: "Pendiente",
    realEndDate: null,
    effectiveDays: null,
    isDelayed: false,
    delayDays: 0,
    isAhead: false,
    aheadDays: 0,
  },
  {
    id: 24,
    description: "Plomería: artefactos y grifería",
    duration: 5,
    dependentTask: 23,
    proyectId: 11,
    dependencyType: "FC",
    dependencyDays: 0,
    start: null,
    end: null,
    plannedStart: null,
    plannedEnd: null,
    realStart: null,
    realEnd: null,
    responsible: "",
    status: "Pendiente",
    realEndDate: null,
    effectiveDays: null,
    isDelayed: false,
    delayDays: 0,
    isAhead: false,
    aheadDays: 0,
  },
  {
    id: 25,
    description: "Electricidad: cableado, artefactos y bambinones",
    duration: 5,
    dependentTask: 24,
    proyectId: 11,
    dependencyType: "FC",
    dependencyDays: 0,
    start: null,
    end: null,
    plannedStart: null,
    plannedEnd: null,
    realStart: null,
    realEnd: null,
    responsible: "",
    status: "Pendiente",
    realEndDate: null,
    effectiveDays: null,
    isDelayed: false,
    delayDays: 0,
    isAhead: false,
    aheadDays: 0,
  },
  {
    id: 26,
    description: "Pedido Final de Obra y Mensura PH",
    duration: 1,
    dependentTask: 25,
    proyectId: 11,
    dependencyType: "FC",
    dependencyDays: 0,
    start: null,
    end: null,
    plannedStart: null,
    plannedEnd: null,
    realStart: null,
    realEnd: null,
    responsible: "",
    status: "Pendiente",
    realEndDate: null,
    effectiveDays: null,
    isDelayed: false,
    delayDays: 0,
    isAhead: false,
    aheadDays: 0,
  },
  {
    id: 27,
    description: "Pintura: terminaciones interior",
    duration: 5,
    dependentTask: 26,
    proyectId: 11,
    dependencyType: "FC",
    dependencyDays: 0,
    start: null,
    end: null,
    plannedStart: null,
    plannedEnd: null,
    realStart: null,
    realEnd: null,
    responsible: "",
    status: "Pendiente",
    realEndDate: null,
    effectiveDays: null,
    isDelayed: false,
    delayDays: 0,
    isAhead: false,
    aheadDays: 0,
  },
  {
    id: 28,
    description: "Limpieza",
    duration: 3,
    dependentTask: 27,
    proyectId: 11,
    dependencyType: "FC",
    dependencyDays: 0,
    start: null,
    end: null,
    plannedStart: null,
    plannedEnd: null,
    realStart: null,
    realEnd: null,
    responsible: "",
    status: "Pendiente",
    realEndDate: null,
    effectiveDays: null,
    isDelayed: false,
    delayDays: 0,
    isAhead: false,
    aheadDays: 0,
  },
  {
    id: 29,
    description: "Pedido Reglamento PH",
    duration: 1,
    dependentTask: 28,
    proyectId: 11,
    dependencyType: "FC",
    dependencyDays: 0,
    start: null,
    end: null,
    plannedStart: null,
    plannedEnd: null,
    realStart: null,
    realEnd: null,
    responsible: "",
    status: "Pendiente",
    realEndDate: null,
    effectiveDays: null,
    isDelayed: false,
    delayDays: 0,
    isAhead: false,
    aheadDays: 0,
  },
]

interface RoadmapProps {
  initialData: Proyect;
}

export default function RoadmapTab({ initialData }: RoadmapProps) {
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    name: initialData.title,
    objective: initialData.description || "Finalizar el proyecto en tiempo y forma",
    startDate: new Date("2025-01-01"),
    plannedWorkDays: 300,
    endDate: new Date("2025-12-31"),
  })

//   const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
//     name: initialData.title,
//     objective: initialData.description || "Finalizar el proyecto en tiempo y forma",
//     startDate: initialData.daysToStart || "Iniciado",
//     plannedWorkDays: 300,
//     endDate: initialData.daysToEnd || "En progreso o finalizado",
//   })

  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [showGantt, setShowGantt] = useState(true)

  // Función para calcular fechas basada en dependencias
  const calculateDates = (tasks: Task[], projectStartDate: Date) => {
    const updatedTasks = [...tasks]

    // Primero calcular fechas planificadas (originales)
    updatedTasks.forEach((task) => {
      if (task.dependentTask === null) {
        task.plannedStart = new Date(projectStartDate)
      } else {
        const dependentTask = updatedTasks.find((t) => t.id === task.dependentTask)
        if (dependentTask && dependentTask.plannedEnd) {
          const startDate = new Date(dependentTask.plannedEnd)
          if (task.dependencyType === "FC") {
            startDate.setDate(startDate.getDate() + task.dependencyDays + 1)
          } else if (task.dependencyType === "CC") {
            startDate.setTime(dependentTask.plannedStart?.getTime() || projectStartDate.getTime())
            startDate.setDate(startDate.getDate() + task.dependencyDays)
          }
          task.plannedStart = startDate
        }
      }

      if (task.plannedStart && task.duration > 0) {
        const endDate = new Date(task.plannedStart)
        endDate.setDate(endDate.getDate() + task.duration - 1)
        task.plannedEnd = endDate
      }
    })

    // Luego calcular fechas reales basadas en el progreso actual
    updatedTasks.forEach((task) => {
      if (task.dependentTask === null) {
        // Tarea sin dependencias
        if (task.status !== "Pendiente") {
          task.realStart = task.realStart || new Date(projectStartDate)
        }
        task.start = task.realStart || task.plannedStart
      } else {
        // Tarea con dependencias
        const dependentTask = updatedTasks.find((t) => t.id === task.dependentTask)
        if (dependentTask) {
          const dependentEndDate = dependentTask.realEnd || dependentTask.realEndDate || dependentTask.plannedEnd

          if (dependentEndDate) {
            const startDate = new Date(dependentEndDate)
            if (task.dependencyType === "FC") {
              startDate.setDate(startDate.getDate() + task.dependencyDays + 1)
            } else if (task.dependencyType === "CC") {
              const depStartDate = dependentTask.realStart || dependentTask.plannedStart || projectStartDate
              startDate.setTime(depStartDate.getTime())
              startDate.setDate(startDate.getDate() + task.dependencyDays)
            }

            if (task.status !== "Pendiente") {
              task.realStart = task.realStart || startDate
            }
            task.start = task.realStart || startDate
          }
        }
      }

      // Calcular fecha de fin real o estimada
      if (task.status === "Completado" && task.realEndDate) {
        task.realEnd = task.realEndDate
        task.end = task.realEndDate
      } else if (task.start && task.duration > 0) {
        const endDate = new Date(task.start)
        endDate.setDate(endDate.getDate() + task.duration - 1)
        task.end = endDate
      }

      // Calcular retrasos y adelantos
      if (task.plannedStart && task.start) {
        const daysDiff = Math.ceil((task.start.getTime() - task.plannedStart.getTime()) / (1000 * 3600 * 24))
        if (daysDiff > 0) {
          task.isDelayed = true
          task.delayDays = daysDiff
          task.isAhead = false
          task.aheadDays = 0
        } else if (daysDiff < 0) {
          task.isAhead = true
          task.aheadDays = Math.abs(daysDiff)
          task.isDelayed = false
          task.delayDays = 0
        } else {
          task.isDelayed = false
          task.delayDays = 0
          task.isAhead = false
          task.aheadDays = 0
        }
      }

      // Calcular días efectivos
      if (task.status === "Completado" && task.realEnd && task.realStart) {
        const timeDiff = task.realEnd.getTime() - task.realStart.getTime()
        task.effectiveDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1
      } else if (task.status === "Completado" && !task.realEnd) {
        task.effectiveDays = null
      } else {
        task.effectiveDays = null
      }
    })

    return updatedTasks
  }

  useEffect(() => {
    const updatedTasks = calculateDates(tasks, projectInfo.startDate)
    setTasks(updatedTasks)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectInfo.startDate])

  const updateTask = (taskId: number, field: keyof Task, value: any) => {
    const updatedTasks = tasks.map((task) => (task.id === taskId ? { ...task, [field]: value } : task))
    const recalculatedTasks = calculateDates(updatedTasks, projectInfo.startDate)
    setTasks(recalculatedTasks)
  }

  const updateProjectInfo = (field: keyof ProjectInfo, value: any) => {
    setProjectInfo((prev) => ({ ...prev, [field]: value }))
  }

  const formatDate = (date: Date | null) => {
    if (!date) return ""
    return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "2-digit" })
  }

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "Completado":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case "En Progreso":
        return <AlertCircle className="h-4 w-4 text-blue-600" />
      default:
        return <Circle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "Completado":
        return "bg-green-50 text-green-700 border-green-200"
      case "En Progreso":
        return "bg-blue-50 text-blue-700 border-blue-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  // Calcular el rango de fechas dinámicamente
  const getDateRange = () => {
    const allDates = tasks.filter((t) => t.start && t.end).flatMap((t) => [t.start!, t.end!])
    if (allDates.length === 0) return { start: projectInfo.startDate, end: projectInfo.endDate }

    const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())))
    const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())))

    // Agregar margen
    minDate.setDate(minDate.getDate() - 7)
    maxDate.setDate(maxDate.getDate() + 14)

    return { start: minDate, end: maxDate }
  }

  const generateWeeks = () => {
    const { start, end } = getDateRange()
    const weeks = []
    const currentDate = new Date(start)
    currentDate.setDate(currentDate.getDate() - currentDate.getDay())

    while (currentDate <= end) {
      weeks.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 7)
    }

    return weeks
  }

  const weeks = generateWeeks()

  const getTaskPosition = (task: Task) => {
    if (!task.start || !task.end) return { left: 0, width: 0 }

    const { start: rangeStart, end: rangeEnd } = getDateRange()
    const totalDays = (rangeEnd.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24)
    const startOffset = (task.start.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24)
    const duration = (task.end.getTime() - task.start.getTime()) / (1000 * 60 * 60 * 24) + 1

    const left = (startOffset / totalDays) * 100
    const width = (duration / totalDays) * 100

    return { left: Math.max(0, left), width: Math.min(width, 100 - left) }
  }

  const completedTasks = tasks.filter((t) => t.status === "Completado").length
  const inProgressTasks = tasks.filter((t) => t.status === "En Progreso").length
  const pendingTasks = tasks.filter((t) => t.status === "Pendiente").length

  const getTaskPositions = (task: Task) => {
    const { start: rangeStart, end: rangeEnd } = getDateRange()
    const totalDays = (rangeEnd.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24)

    const positions = {
      planned: { left: 0, width: 0, visible: false },
      real: { left: 0, width: 0, visible: false },
    }

    // Barra planificada
    if (task.plannedStart && task.plannedEnd) {
      const startOffset = (task.plannedStart.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24)
      const duration = (task.plannedEnd.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24) + 1
      positions.planned = {
        left: Math.max(0, (startOffset / totalDays) * 100),
        width: Math.min((duration / totalDays) * 100, 100),
        visible: true,
      }
    }

    // Barra real
    if (task.start && task.end) {
      const startOffset = (task.start.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24)
      const duration = (task.end.getTime() - task.start.getTime()) / (1000 * 60 * 60 * 24) + 1
      positions.real = {
        left: Math.max(0, (startOffset / totalDays) * 100),
        width: Math.min((duration / totalDays) * 100, 100),
        visible: true,
      }
    }

    return positions
  }

  return (
    <div className="w-full space-y-6">
      {/* Header del proyecto mejorado */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <CalendarDays className="h-6 w-6 text-blue-600" />
              ROADMAP DEL PROYECTO
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectName" className="text-sm font-medium">
                Proyecto:
              </Label>
              <Input
                id="projectName"
                value={projectInfo.name}
                onChange={(e) => updateProjectInfo("name", e.target.value)}
                className="font-semibold"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="objective" className="text-sm font-medium">
                Objetivo:
              </Label>
              <Input
                id="objective"
                value={projectInfo.objective}
                onChange={(e) => updateProjectInfo("objective", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-sm font-medium">
                Fecha de inicio:
              </Label>
              <Input
                id="startDate"
                type="date"
                value={projectInfo.startDate.toISOString().split("T")[0]}
                onChange={(e) => updateProjectInfo("startDate", new Date(e.target.value))}
              />
            </div>
          </div>

          <Separator />

          {/* Estadísticas del proyecto */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-700">{completedTasks}</div>
              <div className="text-sm text-green-600">Completadas</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{inProgressTasks}</div>
              <div className="text-sm text-blue-600">En Progreso</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-700">{pendingTasks}</div>
              <div className="text-sm text-gray-600">Pendientes</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla mejorada con diseño de cards */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Cronograma de Tareas ({tasks.length} etapas)</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setShowGantt(!showGantt)}>
              {showGantt ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showGantt ? "Ocultar" : "Mostrar"} Gantt
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-2 max-h-[600px] overflow-y-auto px-6 pb-6">
            {tasks.map((task, index) => (
              <Card
                key={task.id}
                className={`border-l-4 ${
                  task.status === "Completado"
                    ? "border-l-green-500 bg-green-50/30"
                    : task.status === "En Progreso"
                      ? "border-l-blue-500 bg-blue-50/30"
                      : "border-l-gray-300"
                }`}
              >
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                    {/* Número y descripción */}
                    <div className="lg:col-span-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs px-2 py-1">
                          #{task.id}
                        </Badge>
                        {getStatusIcon(task.status)}
                      </div>
                      <Input
                        value={task.description}
                        onChange={(e) => updateTask(task.id, "description", e.target.value)}
                        className="text-sm font-medium border-0 p-0 h-auto bg-transparent focus-visible:ring-0"
                        placeholder="Descripción de la tarea..."
                      />
                    </div>

                    {/* Duración y dependencias */}
                    <div className="lg:col-span-3 grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-500">Días</Label>
                        <Input
                          type="number"
                          value={task.duration}
                          onChange={(e) => updateTask(task.id, "duration", Number.parseInt(e.target.value) || 0)}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-500">Dep.</Label>
                        <Select
                          value={task.dependentTask?.toString() || "none"}
                          onValueChange={(value) =>
                            updateTask(task.id, "dependentTask", value === "none" ? null : Number.parseInt(value))
                          }
                        >
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">-</SelectItem>
                            {tasks
                              .filter((t) => t.id !== task.id)
                              .map((t) => (
                                <SelectItem key={t.id} value={t.id.toString()}>
                                  {t.id}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-500">Tipo</Label>
                        <Select
                          value={task.dependencyType}
                          onValueChange={(value: "FC" | "CC" | "none") => updateTask(task.id, "dependencyType", value)}
                        >
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">-</SelectItem>
                            <SelectItem value="FC">FC</SelectItem>
                            <SelectItem value="CC">CC</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Fechas */}
                    <div className="lg:col-span-2 grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Inicio
                        </Label>
                        <div className="text-sm font-mono bg-gray-50 p-2 rounded text-center">
                          {formatDate(task.start)}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Fin
                        </Label>
                        <div className="text-sm font-mono bg-gray-50 p-2 rounded text-center">
                          {formatDate(task.end)}
                        </div>
                      </div>
                    </div>

                    {/* Responsable y estado */}
                    <div className="lg:col-span-3 grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-500 flex items-center gap-1">
                          <User className="h-3 w-3" />
                          Responsable
                        </Label>
                        <Input
                          value={task.responsible}
                          onChange={(e) => updateTask(task.id, "responsible", e.target.value)}
                          placeholder="Asignar..."
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-500">Estado</Label>
                        <Select
                          value={task.status}
                          onValueChange={(value: Task["status"]) => updateTask(task.id, "status", value)}
                        >
                          <SelectTrigger className={`h-8 text-sm ${getStatusColor(task.status)}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pendiente">Pendiente</SelectItem>
                            <SelectItem value="En Progreso">En Progreso</SelectItem>
                            <SelectItem value="Completado">Completado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Fechas reales para tareas en progreso o completadas */}
                  {(task.status === "En Progreso" || task.status === "Completado") && (
                    <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-500">Fecha real de inicio</Label>
                        <Input
                          type="date"
                          value={task.realStart ? task.realStart.toISOString().split("T")[0] : ""}
                          onChange={(e) =>
                            updateTask(task.id, "realStart", e.target.value ? new Date(e.target.value) : null)
                          }
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-500">Fecha real de finalización</Label>
                        <Input
                          type="date"
                          value={task.realEndDate ? task.realEndDate.toISOString().split("T")[0] : ""}
                          onChange={(e) =>
                            updateTask(task.id, "realEndDate", e.target.value ? new Date(e.target.value) : null)
                          }
                          className="h-8 text-sm"
                          disabled={task.status !== "Completado"}
                        />
                      </div>
                    </div>
                  )}

                  {/* Información adicional para tareas completadas */}
                  {task.status === "Completado" && (
                    <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-500">Fecha real de finalización</Label>
                        <Input
                          type="date"
                          value={task.realEndDate ? task.realEndDate.toISOString().split("T")[0] : ""}
                          onChange={(e) =>
                            updateTask(task.id, "realEndDate", e.target.value ? new Date(e.target.value) : null)
                          }
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Días efectivos
                        </Label>
                        <div className="h-8 bg-gray-50 rounded px-3 flex items-center text-sm">
                          {task.status === "Completado" && !task.realEndDate ? (
                            <span className="text-red-600 text-xs">Completar fecha</span>
                          ) : (
                            task.effectiveDays || "-"
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Diagrama de Gantt mejorado y dinámico */}
      {showGantt && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Diagrama de Gantt - Vista Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div style={{ minWidth: `${weeks.length * 60}px` }}>
                {/* Header de semanas */}
                <div className="flex border-b-2 border-gray-200 mb-4 sticky top-0 bg-white z-10">
                  <div className="w-80 p-3 font-semibold bg-gray-50 border-r">Tarea</div>
                  <div className="flex flex-1">
                    {weeks.map((week, index) => (
                      <div key={index} className="w-14 text-xs p-2 border-l text-center bg-gray-50 font-medium">
                        <div>{week.toLocaleDateString("es-ES", { day: "2-digit" })}</div>
                        <div className="text-gray-500">{week.toLocaleDateString("es-ES", { month: "short" })}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Barras de tareas mejoradas */}
                <div className="space-y-1">
                  {tasks.map((task) => {
                    const positions = getTaskPositions(task)
                    return (
                      <div key={task.id} className="flex items-center h-12 hover:bg-gray-50 rounded group">
                        <div className="w-80 p-3 text-sm border-r bg-white sticky left-0 z-10">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs px-1 py-0">
                              {task.id}
                            </Badge>
                            <span className="truncate" title={task.description}>
                              {task.description.substring(0, 35)}...
                            </span>
                            {/* Indicadores de retraso/adelanto */}
                            {task.isDelayed && (
                              <Badge variant="destructive" className="text-xs px-1 py-0">
                                +{task.delayDays}d
                              </Badge>
                            )}
                            {task.isAhead && (
                              <Badge variant="default" className="text-xs px-1 py-0 bg-green-100 text-green-800">
                                -{task.aheadDays}d
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 relative h-10 bg-gray-50">
                          {/* Barra planificada (fondo) */}
                          {positions.planned.visible && (
                            <div
                              className="absolute h-4 top-3 rounded-sm border-2 border-dashed border-gray-400 bg-gray-200 opacity-60"
                              style={{
                                left: `${positions.planned.left}%`,
                                width: `${Math.max(positions.planned.width, 1)}%`,
                              }}
                              title={`Planificado: ${formatDate(task.plannedStart)} - ${formatDate(task.plannedEnd)}`}
                            />
                          )}

                          {/* Barra real (encima) */}
                          {positions.real.visible && (
                            <div
                              className={`absolute h-6 top-2 rounded-md shadow-sm border-2 ${
                                task.status === "Completado"
                                  ? task.effectiveDays && task.effectiveDays > task.duration
                                    ? "bg-red-400 border-red-500" // Tomó más tiempo del estimado
                                    : task.effectiveDays && task.effectiveDays < task.duration
                                      ? "bg-green-500 border-green-600" // Tomó menos tiempo del estimado
                                      : "bg-green-400 border-green-500" // Tiempo exacto
                                  : task.status === "En Progreso"
                                    ? task.isDelayed
                                      ? "bg-orange-400 border-orange-500" // En progreso con retraso
                                      : "bg-blue-400 border-blue-500" // En progreso a tiempo
                                    : task.isDelayed
                                      ? "bg-red-300 border-red-400" // Pendiente con retraso
                                      : "bg-gray-300 border-gray-400" // Pendiente a tiempo
                              }`}
                              style={{
                                left: `${positions.real.left}%`,
                                width: `${Math.max(positions.real.width, 2)}%`,
                              }}
                              title={`Real: ${formatDate(task.start)} - ${formatDate(task.end)} | Duración: ${task.effectiveDays || task.duration}d`}
                            >
                              <div className="h-full flex items-center justify-center text-white text-xs font-medium">
                                {task.effectiveDays || task.duration}d
                              </div>
                            </div>
                          )}

                          {/* Indicador de conexión entre barras si hay diferencia */}
                          {positions.planned.visible &&
                            positions.real.visible &&
                            Math.abs(positions.planned.left - positions.real.left) > 1 && (
                              <div
                                className="absolute h-0.5 top-5 bg-yellow-500 opacity-75"
                                style={{
                                  left: `${Math.min(positions.planned.left, positions.real.left)}%`,
                                  width: `${Math.abs(positions.planned.left - positions.real.left)}%`,
                                }}
                                title="Diferencia entre planificado y real"
                              />
                            )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Referencias mejoradas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Referencias y Ayuda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-sm">Tipos de Dependencia:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    FC
                  </Badge>
                  <span>Fin-Comienzo (Secuencial)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    CC
                  </Badge>
                  <span>Comienzo-Comienzo (Paralelo)</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Estados de Tarea:</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Circle className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Pendiente</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">En Progreso</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Completado</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Colores del Gantt:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 border-2 border-dashed border-gray-400 rounded-sm"></div>
                  <span>Tiempo planificado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>Completado antes de tiempo</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-400 rounded"></div>
                  <span>Completado a tiempo</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-400 rounded"></div>
                  <span>Completado con retraso</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-400 rounded"></div>
                  <span>En progreso a tiempo</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-400 rounded"></div>
                  <span>En progreso con retraso</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-2 bg-yellow-500"></div>
                  <span>Diferencia planificado vs real</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
