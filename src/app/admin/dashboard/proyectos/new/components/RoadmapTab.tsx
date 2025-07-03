'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  CalendarDays,
  Save,
  Download,
  Eye,
  EyeOff,
  CalendarIcon,
  User,
  CheckCircle2,
  AlertCircle,
  Circle,
  Plus,
  Trash2,
  Settings,
  RefreshCw,
  ArrowRight,
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Proyect } from '@/store/proyectStore'
import { ReferenciasSection } from './ReferenciasSection'
import { DiagramaGantt } from './DiagramaGantt'
import DatePicker from './DatePicker'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProyectRoadmap, saveProyectRoadmap } from '@/services/proyects-service'
import { Task } from '@/types/roadmap'

export interface ProjectInfo {
  name: string
  objective: string
  startDate: Date
  plannedWorkDays: number
  endDate: Date
}

const defaultTasksTemplate: Omit<
  Task,
  | 'id'
  | 'start'
  | 'end'
  | 'plannedStart'
  | 'plannedEnd'
  | 'realStart'
  | 'realEnd'
  | 'realEndDate'
  | 'effectiveDays'
  | 'isDelayed'
  | 'delayDays'
  | 'isAhead'
  | 'aheadDays'
>[] = [
  {
    description:
      'Planos y permisos: Municipal, Gas, pluvial, herrería, aberturas, Conexión luz',
    duration: 31,
    dependentTask: null,
    dependencyType: 'none',
    dependencyDays: 0,
    responsible: '',
    status: 'Pendiente',
    isDefault: true,
    isHidden: false,
    order: 1,
    isCustom: false,
  },
  {
    description: 'Preparación del terreno',
    duration: 5,
    dependentTask: 1,
    dependencyType: 'FC',
    dependencyDays: 1,
    responsible: '',
    status: 'Pendiente',
    isDefault: true,
    isHidden: false,
    order: 2,
    isCustom: false,
  },
  {
    description: 'Cimientos - Fundaciones',
    duration: 15,
    dependentTask: 2,
    dependencyType: 'FC',
    dependencyDays: 1,
    responsible: '',
    status: 'Pendiente',
    isDefault: true,
    isHidden: false,
    order: 3,
    isCustom: false,
  },
  {
    description: 'Capa Aisladora - Estructura. (Encargar aberturas)',
    duration: 2,
    dependentTask: 3,
    dependencyType: 'FC',
    dependencyDays: 1,
    responsible: '',
    status: 'Pendiente',
    isDefault: true,
    isHidden: false,
    order: 4,
    isCustom: false,
  },
  {
    description: 'Mampostería',
    duration: 60,
    dependentTask: 4,
    dependencyType: 'FC',
    dependencyDays: 1,
    responsible: '',
    status: 'Pendiente',
    isDefault: true,
    isHidden: false,
    order: 5,
    isCustom: false,
  },
  {
    description: 'Plomería: cañería bocas, arañas de piso, pluviales',
    duration: 10,
    dependentTask: 5,
    dependencyType: 'CC',
    dependencyDays: 1,
    responsible: '',
    status: 'Pendiente',
    isDefault: true,
    isHidden: false,
    order: 6,
    isCustom: false,
  },
  {
    description: 'Contrapisos',
    duration: 20,
    dependentTask: 6,
    dependencyType: 'FC',
    dependencyDays: 1,
    responsible: '',
    status: 'Pendiente',
    isDefault: true,
    isHidden: false,
    order: 7,
    isCustom: false,
  },
  {
    description: 'Encadenado',
    duration: 10,
    dependentTask: 7,
    dependencyType: 'FC',
    dependencyDays: 1,
    responsible: '',
    status: 'Pendiente',
    isDefault: true,
    isHidden: false,
    order: 8,
    isCustom: false,
  },
  {
    description: 'Techado: cabriadas, chapas y babetas',
    duration: 30,
    dependentTask: 8,
    dependencyType: 'FC',
    dependencyDays: 0,
    responsible: '',
    status: 'Pendiente',
    isDefault: true,
    isHidden: false,
    order: 9,
    isCustom: false,
  },
  {
    description: 'Herrería: colocación de rejas y portones',
    duration: 5,
    dependentTask: 9,
    dependencyType: 'FC',
    dependencyDays: 0,
    responsible: '',
    status: 'Pendiente',
    isDefault: true,
    isHidden: false,
    order: 10,
    isCustom: false,
  },
  {
    description: 'Obra vial: veredas e ingresos',
    duration: 10,
    dependentTask: 10,
    dependencyType: 'CC',
    dependencyDays: 0,
    responsible: '',
    status: 'Pendiente',
    isDefault: true,
    isHidden: false,
    order: 11,
    isCustom: false,
  },
  {
    description: 'Plomería: cañería pvc en paredes, cañería de gas',
    duration: 10,
    dependentTask: 11,
    dependencyType: 'CC',
    dependencyDays: 0,
    responsible: '',
    status: 'Pendiente',
    isDefault: true,
    isHidden: false,
    order: 12,
    isCustom: false,
  },
  {
    description: 'Electricidad: colocación de caños y cajas en cielorrasos',
    duration: 10,
    dependentTask: 12,
    dependencyType: 'FC',
    dependencyDays: 0,
    responsible: '',
    status: 'Pendiente',
    isDefault: true,
    isHidden: false,
    order: 13,
    isCustom: false,
  },
  {
    description: 'Revoque grueso. (Encargar muebles)',
    duration: 30,
    dependentTask: 13,
    dependencyType: 'FC',
    dependencyDays: 0,
    responsible: '',
    status: 'Pendiente',
    isDefault: true,
    isHidden: false,
    order: 14,
    isCustom: false,
  },
  {
    description: 'Drylock: colocación de perfiles',
    duration: 10,
    dependentTask: 14,
    dependencyType: 'FC',
    dependencyDays: 0,
    responsible: '',
    status: 'Pendiente',
    isDefault: true,
    isHidden: false,
    order: 15,
    isCustom: false,
  },
  {
    description: 'Tejido patio',
    duration: 5,
    dependentTask: 15,
    dependencyType: 'FC',
    dependencyDays: 0,
    responsible: '',
    status: 'Pendiente',
    isDefault: true,
    isHidden: false,
    order: 16,
    isCustom: false,
  },
  {
    description: 'Colocación de aberturas',
    duration: 10,
    dependentTask: 16,
    dependencyType: 'FC',
    dependencyDays: 0,
    responsible: '',
    status: 'Pendiente',
    isDefault: true,
    isHidden: false,
    order: 17,
    isCustom: false,
  },
  {
    description: 'Carpetas',
    duration: 5,
    dependentTask: 17,
    dependencyType: 'FC',
    dependencyDays: 0,
    responsible: '',
    status: 'Pendiente',
    isDefault: true,
    isHidden: false,
    order: 18,
    isCustom: false,
  },
  {
    description: 'Drylock: terminación cielorrasos',
    duration: 15,
    dependentTask: 18,
    dependencyType: 'FC',
    dependencyDays: 0,
    responsible: '',
    status: 'Pendiente',
    isDefault: true,
    isHidden: false,
    order: 19,
    isCustom: false,
  },
  {
    description: 'Revoque fino - Enduido',
    duration: 15,
    dependentTask: 19,
    dependencyType: 'FC',
    dependencyDays: 0,
    responsible: '',
    status: 'Pendiente',
    isDefault: true,
    isHidden: false,
    order: 20,
    isCustom: false,
  },
  {
    description: 'Cerámicas - Azulejos',
    duration: 30,
    dependentTask: 20,
    dependencyType: 'FC',
    dependencyDays: 0,
    responsible: '',
    status: 'Pendiente',
    isDefault: true,
    isHidden: false,
    order: 21,
    isCustom: false,
  },
  {
    description: 'Pintura: primera etapa interior, exterior',
    duration: 20,
    dependentTask: 21,
    dependencyType: 'FC',
    dependencyDays: 0,
    responsible: '',
    status: 'Pendiente',
    isDefault: true,
    isHidden: false,
    order: 22,
    isCustom: false,
  },
  {
    description: 'Carpintería: muebles cocina y baño',
    duration: 5,
    dependentTask: 22,
    dependencyType: 'FC',
    dependencyDays: 0,
    responsible: '',
    status: 'Pendiente',
    isDefault: true,
    isHidden: false,
    order: 23,
    isCustom: false,
  },
  {
    description: 'Plomería: artefactos y grifería',
    duration: 5,
    dependentTask: 23,
    dependencyType: 'FC',
    dependencyDays: 0,
    responsible: '',
    status: 'Pendiente',
    isDefault: true,
    isHidden: false,
    order: 24,
    isCustom: false,
  },
  {
    description: 'Electricidad: cableado, artefactos y bambinones',
    duration: 5,
    dependentTask: 24,
    dependencyType: 'FC',
    dependencyDays: 0,
    responsible: '',
    status: 'Pendiente',
    isDefault: true,
    isHidden: false,
    order: 25,
    isCustom: false,
  },
  {
    description: 'Pedido Final de Obra y Mensura PH',
    duration: 1,
    dependentTask: 25,
    dependencyType: 'FC',
    dependencyDays: 0,
    responsible: '',
    status: 'Pendiente',
    isDefault: true,
    isHidden: false,
    order: 26,
    isCustom: false,
  },
  {
    description: 'Pintura: terminaciones interior',
    duration: 5,
    dependentTask: 26,
    dependencyType: 'FC',
    dependencyDays: 0,
    responsible: '',
    status: 'Pendiente',
    isDefault: true,
    isHidden: false,
    order: 27,
    isCustom: false,
  },
  {
    description: 'Limpieza',
    duration: 3,
    dependentTask: 27,
    dependencyType: 'FC',
    dependencyDays: 0,
    responsible: '',
    status: 'Pendiente',
    isDefault: true,
    isHidden: false,
    order: 28,
    isCustom: false,
  },
  {
    description: 'Pedido Reglamento PH',
    duration: 1,
    dependentTask: 28,
    dependencyType: 'FC',
    dependencyDays: 0,
    responsible: '',
    status: 'Pendiente',
    isDefault: true,
    isHidden: false,
    order: 29,
    isCustom: false,
  },
]

interface RoadmapProps {
  initialData: Proyect
}

export default function RoadmapTab({ initialData }: RoadmapProps) {
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    name: initialData.title,
    objective:
      initialData.description || 'Finalizar el proyecto en tiempo y forma',
    startDate: new Date('2025-01-01'),
    plannedWorkDays: 300,
    endDate: new Date('2025-12-31'),
  })

  const [tasks, setTasks] = useState<Task[]>([])
  const [showGantt, setShowGantt] = useState(true)
  const [showHiddenTasks, setShowHiddenTasks] = useState(false)
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [newTaskData, setNewTaskData] = useState({
    description: '',
    duration: 1,
    insertAfter: 0, // 0 significa al inicio
  })

  const [isGanttGenerated, setIsGanttGenerated] = useState(false)

  const queryClient = useQueryClient()

  const { data: roadmap, isLoading, isError, refetch } = useQuery(
    {
      queryKey: ['roadmap', initialData.slug],
      queryFn: () => getProyectRoadmap(initialData.slug),
    },
    // () => getProyectRoadmap(initialData.slug)
  )

  // Cuando roadmap cambie, setea las tareas
  useEffect(() => {
    if (roadmap && roadmap.tasks) {
      setTasks(roadmap.tasks.map(parseTaskDates))
    }
  }, [roadmap])

  // Generar template inicial
  const generateDefaultTasks = () => {
    const newTasks: Task[] = defaultTasksTemplate.map((template, index) => ({
      ...template,
      id: index + 1,
      start: null,
      end: null,
      plannedStart: null,
      plannedEnd: null,
      realStart: null,
      realEnd: null,
      realEndDate: null,
      effectiveDays: null,
      isDelayed: false,
      delayDays: 0,
      isAhead: false,
      aheadDays: 0,
    }))
    setTasks(newTasks)
  }

  const calculateDates = (tasks: Task[], projectStartDate: Date) => {
    if (!tasks.length) return tasks

    const updatedTasks = [...tasks].sort((a, b) => a.order - b.order)

    // Primero calcular fechas planificadas (originales)
    updatedTasks.forEach((task) => {
      if (task.dependentTask === null) {
        // Para tareas sin dependencias, usar la fecha real seleccionada como base planificada
        // Si no hay fecha real, usar la fecha de inicio del proyecto
        task.plannedStart = task.realStart || new Date(projectStartDate)
      } else {
        const dependentTask = updatedTasks.find(
          (t) => t.id === task.dependentTask
        )
        if (dependentTask && dependentTask.plannedEnd) {
          const startDate = new Date(dependentTask.plannedEnd)
          if (task.dependencyType === 'FC') {
            startDate.setDate(startDate.getDate() + task.dependencyDays + 1)
          } else if (task.dependencyType === 'CC') {
            startDate.setTime(
              dependentTask.plannedStart?.getTime() ||
                projectStartDate.getTime()
            )
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

    // Luego calcular fechas reales/actuales
    updatedTasks.forEach((task) => {
      if (task.dependentTask === null) {
        // Tarea sin dependencias - usar fecha real si existe, sino la planificada
        task.start = task.realStart || task.plannedStart
      } else {
        // Tarea con dependencias
        const dependentTask = updatedTasks.find(
          (t) => t.id === task.dependentTask
        )
        if (dependentTask) {
          const dependentEndDate =
            dependentTask.realEnd ||
            dependentTask.realEndDate ||
            dependentTask.end ||
            dependentTask.plannedEnd

          if (dependentEndDate) {
            const startDate = new Date(dependentEndDate)
            if (task.dependencyType === 'FC') {
              startDate.setDate(startDate.getDate() + task.dependencyDays + 1)
            } else if (task.dependencyType === 'CC') {
              const depStartDate =
                dependentTask.start ||
                dependentTask.plannedStart ||
                projectStartDate
              startDate.setTime(depStartDate.getTime())
              startDate.setDate(startDate.getDate() + task.dependencyDays)
            }

            task.start = task.realStart || startDate
          }
        }
      }

      // Calcular fecha de fin
      if (task.status === 'Completado' && task.realEndDate) {
        task.realEnd = task.realEndDate
        task.end = task.realEndDate
      } else if (task.start && task.duration > 0) {
        const endDate = new Date(task.start)
        endDate.setDate(endDate.getDate() + task.duration - 1)
        task.end = endDate
      }

      // Calcular retrasos y adelantos SOLO para tareas con dependencias
      // Para tareas sin dependencias, no hay retraso si se selecciona una fecha específica
      if (task.dependentTask !== null && task.plannedStart && task.start) {
        const daysDiff = Math.ceil(
          (task.start.getTime() - task.plannedStart.getTime()) /
            (1000 * 3600 * 24)
        )
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
      } else {
        // Para tareas sin dependencias, no marcar retraso
        task.isDelayed = false
        task.delayDays = 0
        task.isAhead = false
        task.aheadDays = 0
      }

      // Calcular días efectivos
      if (task.status === 'Completado' && task.realEnd && task.realStart) {
        const timeDiff = task.realEnd.getTime() - task.realStart.getTime()
        task.effectiveDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1
      } else {
        task.effectiveDays = null
      }
    })

    return updatedTasks
  }

  useEffect(() => {
    if (tasks.length > 0) {
      const updatedTasks = calculateDates(tasks, projectInfo.startDate)
      // Solo actualizar si realmente hay cambios
      const hasChanges = updatedTasks.some((task, index) => {
        const originalTask = tasks[index]
        return (
          !originalTask ||
          task.start?.getTime() !== originalTask.start?.getTime() ||
          task.end?.getTime() !== originalTask.end?.getTime()
        )
      })

      if (hasChanges) {
        setTasks(updatedTasks)
        setIsGanttGenerated(false) // Reset Gantt cuando cambien las fechas
      }
    }
  }, [projectInfo.startDate])

  const updateTask = (taskId: number, field: keyof Task, value: any) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, [field]: value } : task
    )
    const recalculatedTasks = calculateDates(
      updatedTasks,
      projectInfo.startDate
    )
    setTasks(recalculatedTasks)
  }

  const updateProjectInfo = (field: keyof ProjectInfo, value: any) => {
    setProjectInfo((prev) => ({ ...prev, [field]: value }))
  }

  // Agregar nueva tarea
  const addCustomTask = () => {
    if (!newTaskData.description.trim()) return

    const maxId = Math.max(...tasks.map((t) => t.id), 0)
    const newId = maxId + 1

    // Encontrar el orden correcto
    const insertAfterTask = tasks.find((t) => t.id === newTaskData.insertAfter)
    const newOrder = insertAfterTask ? insertAfterTask.order + 0.5 : 0.5

    const newTask: Task = {
      id: newId,
      description: newTaskData.description,
      duration: newTaskData.duration,
      dependentTask: newTaskData.insertAfter || null,
      dependencyType: newTaskData.insertAfter ? 'FC' : 'none',
      dependencyDays: 0,
      start: null,
      end: null,
      plannedStart: null,
      plannedEnd: null,
      realStart: null,
      realEnd: null,
      responsible: '',
      status: 'Pendiente',
      realEndDate: null,
      effectiveDays: null,
      isDelayed: false,
      delayDays: 0,
      isAhead: false,
      aheadDays: 0,
      isDefault: false,
      isHidden: false,
      order: newOrder,
      isCustom: true,
    }

    // Reordenar tareas existentes
    const updatedTasks = tasks.map((task) => {
      if (task.order > newOrder) {
        return { ...task, order: task.order + 1 }
      }
      return task
    })

    setTasks([...updatedTasks, newTask])
    setNewTaskData({ description: '', duration: 1, insertAfter: 0 })
    setIsAddingTask(false)
  }

  // Renumerar tareas automáticamente cuando se ocultan/muestran
  const renumberTasks = (tasks: Task[]) => {
    const visibleTasks = tasks
      .filter((t) => !t.isHidden)
      .sort((a, b) => a.order - b.order)
    const hiddenTasks = tasks.filter((t) => t.isHidden)

    // Renumerar tareas visibles
    const renumberedVisible = visibleTasks.map((task, index) => ({
      ...task,
      id: index + 1,
    }))

    // Mantener tareas ocultas con sus IDs originales pero marcadas
    return [...renumberedVisible, ...hiddenTasks]
  }

  // Ocultar/mostrar tarea con renumeración
  const toggleTaskVisibility = (taskId: number) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, isHidden: !task.isHidden } : task
    )
    const renumberedTasks = renumberTasks(updatedTasks)
    const recalculatedTasks = calculateDates(
      renumberedTasks,
      projectInfo.startDate
    )
    setTasks(recalculatedTasks)
    setIsGanttGenerated(false) // Reset Gantt cuando cambian las tareas
  }

  const generateGanttChart = () => {
    // Recalcular todas las fechas antes de generar el Gantt
    const recalculatedTasks = calculateDates(tasks, projectInfo.startDate)
    setTasks(recalculatedTasks)
    setIsGanttGenerated(true)
  }

  // Eliminar tarea personalizada
  const deleteCustomTask = (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId)
    if (task && task.isCustom) {
      setTasks(tasks.filter((t) => t.id !== taskId))
    }
  }

  // Guardar roadmap
  const mutation = useMutation({
    mutationFn: (tasks: Task[]) => saveProyectRoadmap(initialData.slug, tasks),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmap', initialData.slug] })
      alert('Roadmap guardado exitosamente!')
    },
    onError: () => {
      alert('Error al guardar roadmap')
    }
  })

  const saveRoadmap = () => {
    mutation.mutate(tasks)
  }

  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    })
  }

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'Completado':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'En Progreso':
        return <AlertCircle className="h-4 w-4 text-blue-600" />
      default:
        return <Circle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'Completado':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'En Progreso':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  // Calcular el rango de fechas dinámicamente basado en las fechas calculadas de las tareas
  const getDateRange = () => {
    const visibleTasks = tasks.filter((t) => !t.isHidden && t.start && t.end)
    if (visibleTasks.length === 0) {
      // Si no hay tareas con fechas, usar un rango basado en la fecha de inicio del proyecto
      const start = new Date(projectInfo.startDate)
      const end = new Date(projectInfo.startDate)
      end.setDate(end.getDate() + 365) // Un año por defecto
      return { start, end }
    }

    const allStartDates = visibleTasks.map((t) => t.start!).filter(Boolean)
    const allEndDates = visibleTasks.map((t) => t.end!).filter(Boolean)

    if (allStartDates.length === 0 || allEndDates.length === 0) {
      const start = new Date(projectInfo.startDate)
      const end = new Date(projectInfo.startDate)
      end.setDate(end.getDate() + 365)
      return { start, end }
    }

    const minDate = new Date(Math.min(...allStartDates.map((d) => d.getTime())))
    const maxDate = new Date(Math.max(...allEndDates.map((d) => d.getTime())))

    // Agregar margen más pequeño para mejor precisión
    minDate.setDate(minDate.getDate() - 3)
    maxDate.setDate(maxDate.getDate() + 7)

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

  const completedTasks = tasks.filter(
    (t) => t.status === 'Completado' && !t.isHidden
  ).length
  const inProgressTasks = tasks.filter(
    (t) => t.status === 'En Progreso' && !t.isHidden
  ).length
  const pendingTasks = tasks.filter(
    (t) => t.status === 'Pendiente' && !t.isHidden
  ).length
  const hiddenTasks = tasks.filter((t) => t.isHidden).length

  // Filtrar y ordenar tareas visibles
  const visibleTasks = tasks
    .filter((t) => !t.isHidden || showHiddenTasks)
    .sort((a, b) => a.order - b.order)

  function parseTaskDates(task: any): any {
    const dateFields = [
      'start', 'end', 'plannedStart', 'plannedEnd',
      'realStart', 'realEnd', 'realEndDate'
    ];
    const parsed: any = { ...task };
    dateFields.forEach(field => {
      if (parsed[field]) parsed[field] = new Date(parsed[field]);
      else parsed[field] = null;
    });
    return parsed;
  }

  return (
    <div className="w-full space-y-6">
      {/* Estado inicial - sin tareas */}
      {tasks.length === 0 && (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CalendarDays className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Roadmap Vacío
            </h3>
            <p className="text-gray-500 text-center mb-6">
              Este proyecto no tiene tareas definidas. Puedes generar el
              template por defecto con las 29 etapas estándar de construcción.
            </p>
            <Button onClick={generateDefaultTasks} size="lg" className="gap-2">
              <RefreshCw className="h-5 w-5" />
              Generar Template por Defecto (29 tareas)
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Header del proyecto mejorado */}
      {tasks.length > 0 && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-xl">
                <CalendarDays className="h-6 w-6 text-blue-600" />
                ROADMAP DEL PROYECTO
              </CardTitle>
              <div className="flex gap-2">
                <Button onClick={saveRoadmap} size="sm" className="gap-2">
                  <Save className="h-4 w-4" />
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
                  onChange={(e) => updateProjectInfo('name', e.target.value)}
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
                  onChange={(e) =>
                    updateProjectInfo('objective', e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-sm font-medium">
                  Fecha de inicio:
                </Label>
                <DatePicker
                  date={projectInfo.startDate}
                  onDateChange={(date) =>
                    updateProjectInfo('startDate', date || new Date())
                  }
                  placeholder="Seleccionar fecha de inicio"
                />
              </div>
            </div>

            <Separator />

            {/* Estadísticas del proyecto */}
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-700">
                  {completedTasks}
                </div>
                <div className="text-sm text-green-600">Completadas</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-700">
                  {inProgressTasks}
                </div>
                <div className="text-sm text-blue-600">En Progreso</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-gray-700">
                  {pendingTasks}
                </div>
                <div className="text-sm text-gray-600">Pendientes</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="text-2xl font-bold text-orange-700">
                  {hiddenTasks}
                </div>
                <div className="text-sm text-orange-600">Ocultas</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabla mejorada con diseño de cards */}
      {tasks.length > 0 && (
        <Card>
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">
                Cronograma de Tareas ({visibleTasks.length}{' '}
                {showHiddenTasks ? 'total' : 'visibles'})
              </CardTitle>
              <div className="flex gap-2">
                <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Tarea
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Agregar Nueva Tarea</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="taskDescription">Descripción</Label>
                        <Textarea
                          id="taskDescription"
                          value={newTaskData.description}
                          onChange={(e) =>
                            setNewTaskData({
                              ...newTaskData,
                              description: e.target.value,
                            })
                          }
                          placeholder="Descripción de la nueva tarea..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="taskDuration">Duración (días)</Label>
                        <Input
                          id="taskDuration"
                          type="number"
                          value={newTaskData.duration}
                          onChange={(e) =>
                            setNewTaskData({
                              ...newTaskData,
                              duration: Number.parseInt(e.target.value) || 1,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="insertAfter">Insertar después de</Label>
                        <Select
                          value={newTaskData.insertAfter.toString()}
                          onValueChange={(value) =>
                            setNewTaskData({
                              ...newTaskData,
                              insertAfter: Number.parseInt(value),
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Al inicio</SelectItem>
                            {visibleTasks.map((task) => (
                              <SelectItem
                                key={task.id}
                                value={task.id.toString()}
                              >
                                #{task.id} - {task.description.substring(0, 50)}
                                ...
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={addCustomTask} className="flex-1">
                          Agregar Tarea
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsAddingTask(false)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {hiddenTasks > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowHiddenTasks(!showHiddenTasks)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {showHiddenTasks ? 'Ocultar' : 'Ver'} Tareas Ocultas (
                    {hiddenTasks})
                  </Button>
                )}

                {!isGanttGenerated ? (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={generateGanttChart}
                  >
                    <CalendarDays className="h-4 w-4 mr-2" />
                    Generar Diagrama
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowGantt(!showGantt)}
                    >
                      {showGantt ? (
                        <EyeOff className="h-4 w-4 mr-2" />
                      ) : (
                        <Eye className="h-4 w-4 mr-2" />
                      )}
                      {showGantt ? 'Ocultar' : 'Mostrar'} Gantt
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsGanttGenerated(false)}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerar
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-2 max-h-[600px] overflow-y-auto px-6 pb-6">
              {visibleTasks.map((task, index) => (
                <Card
                  key={task.id}
                  className={`border-l-4 transition-all duration-200 ${
                    task.isHidden
                      ? 'opacity-50 border-l-gray-400 bg-gray-50'
                      : task.status === 'Completado'
                      ? 'border-l-green-500 bg-green-50/30'
                      : task.status === 'En Progreso'
                      ? 'border-l-blue-500 bg-blue-50/30'
                      : 'border-l-gray-300'
                  } ${task.status === 'Completado' ? 'scale-95' : ''}`}
                >
                  <CardContent
                    className={`${
                      task.status === 'Completado' ? 'p-3' : 'p-4'
                    }`}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                      {/* Número y descripción */}
                      <div
                        className={`${
                          task.status === 'Completado'
                            ? 'lg:col-span-6'
                            : 'lg:col-span-4'
                        } space-y-2`}
                      >
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="text-xs px-2 py-1"
                          >
                            #{task.id}
                          </Badge>
                          {getStatusIcon(task.status)}
                          {task.isCustom && (
                            <Badge variant="secondary" className="text-xs">
                              Custom
                            </Badge>
                          )}
                          {task.isHidden && (
                            <Badge
                              variant="outline"
                              className="text-xs text-gray-500"
                            >
                              Oculta
                            </Badge>
                          )}
                        </div>
                        <Input
                          value={task.description}
                          onChange={(e) =>
                            updateTask(task.id, 'description', e.target.value)
                          }
                          className={`text-sm font-medium border-0 p-0 h-auto bg-transparent focus-visible:ring-0 ${
                            task.status === 'Completado' ? 'text-gray-600' : ''
                          }`}
                          placeholder="Descripción de la tarea..."
                          disabled={task.isHidden}
                        />
                      </div>

                      {/* Controles compactos para tareas completadas */}
                      {task.status === 'Completado' ? (
                        <div className="lg:col-span-6 flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>
                              Duración: {task.effectiveDays || task.duration}d
                            </span>
                            <span>Fin: {formatDate(task.end)}</span>
                            <span>
                              Responsable: {task.responsible || 'Sin asignar'}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleTaskVisibility(task.id)}
                              className="h-8 w-8 p-0"
                            >
                              {task.isHidden ? (
                                <Eye className="h-4 w-4" />
                              ) : (
                                <EyeOff className="h-4 w-4" />
                              )}
                            </Button>
                            {task.isCustom && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteCustomTask(task.id)}
                                className="h-8 w-8 p-0 text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* Duración y dependencias */}
                          <div className="lg:col-span-3 grid grid-cols-3 gap-2">
                            <div className="space-y-1">
                              <Label className="text-xs text-gray-500">
                                Días
                              </Label>
                              <Input
                                type="number"
                                value={task.duration}
                                onChange={(e) =>
                                  updateTask(
                                    task.id,
                                    'duration',
                                    Number.parseInt(e.target.value) || 0
                                  )
                                }
                                className="h-8 text-sm"
                                disabled={task.isHidden}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-gray-500">
                                Dep.
                              </Label>
                              <Select
                                value={task.dependentTask?.toString() || 'none'}
                                onValueChange={(value) =>
                                  updateTask(
                                    task.id,
                                    'dependentTask',
                                    value === 'none'
                                      ? null
                                      : Number.parseInt(value)
                                  )
                                }
                                disabled={task.isHidden}
                              >
                                <SelectTrigger className="h-8 text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">-</SelectItem>
                                  {tasks
                                    .filter(
                                      (t) => t.id !== task.id && !t.isHidden
                                    )
                                    .map((t) => (
                                      <SelectItem
                                        key={t.id}
                                        value={t.id.toString()}
                                      >
                                        {t.id}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-gray-500">
                                Tipo
                              </Label>
                              <Select
                                value={task.dependencyType}
                                onValueChange={(value: 'FC' | 'CC' | 'none') =>
                                  updateTask(task.id, 'dependencyType', value)
                                }
                                disabled={task.isHidden}
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

                          {/* Fechas mejoradas */}
                          <div className="lg:col-span-2 grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <Label className="text-xs text-gray-500 flex items-center gap-1">
                                <CalendarIcon className="h-3 w-3" />
                                Inicio
                              </Label>
                              {task.dependentTask === null ? (
                                <div className="space-y-1">
                                  <DatePicker
                                    date={task.realStart}
                                    onDateChange={(date) =>
                                      updateTask(task.id, 'realStart', date)
                                    }
                                    placeholder="Seleccionar"
                                    disabled={task.isHidden}
                                  />
                                  {task.start && (
                                    <div className="flex items-center gap-1 text-xs text-gray-600">
                                      <ArrowRight className="h-3 w-3" />
                                      <span className="font-mono">
                                        {formatDate(task.start)}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-sm font-mono bg-gray-50 p-2 rounded text-center h-8 flex items-center justify-center">
                                  {formatDate(task.start)}
                                </div>
                              )}
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-gray-500 flex items-center gap-1">
                                <CalendarIcon className="h-3 w-3" />
                                Fin
                              </Label>
                              <div className="text-sm font-mono bg-gray-50 p-2 rounded text-center h-8 flex items-center justify-center">
                                {formatDate(task.end)}
                              </div>
                            </div>
                          </div>

                          {/* Responsable y estado - CORREGIDA LA ALINEACIÓN */}
                          <div className="lg:col-span-2 grid grid-cols-2 gap-2 items-end">
                            <div className="space-y-1">
                              <Label className="text-xs text-gray-500 flex items-center gap-1">
                                <User className="h-3 w-3" />
                                Responsable
                              </Label>
                              <Input
                                value={task.responsible}
                                onChange={(e) =>
                                  updateTask(
                                    task.id,
                                    'responsible',
                                    e.target.value
                                  )
                                }
                                placeholder="Asignar..."
                                className="h-8 text-sm"
                                disabled={task.isHidden}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-gray-500">
                                Estado
                              </Label>
                              <Select
                                value={task.status}
                                onValueChange={(value: Task['status']) =>
                                  updateTask(task.id, 'status', value)
                                }
                                disabled={task.isHidden}
                              >
                                <SelectTrigger
                                  className={`h-8 text-sm ${getStatusColor(
                                    task.status
                                  )}`}
                                >
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Pendiente">
                                    Pendiente
                                  </SelectItem>
                                  <SelectItem value="En Progreso">
                                    En Progreso
                                  </SelectItem>
                                  <SelectItem value="Completado">
                                    Completado
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {/* Controles de tarea */}
                          <div className="lg:col-span-1 flex flex-col gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleTaskVisibility(task.id)}
                              className="h-8 w-full text-xs"
                            >
                              {task.isHidden ? (
                                <Eye className="h-4 w-4" />
                              ) : (
                                <EyeOff className="h-4 w-4" />
                              )}
                            </Button>
                            {task.isCustom && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteCustomTask(task.id)}
                                className="h-8 w-full text-xs text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Fechas reales para tareas en progreso o completadas */}
                    {(task.status === 'En Progreso' ||
                      task.status === 'Completado') &&
                      !task.isHidden &&
                      task.status !== 'Completado' && (
                        <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label className="text-xs text-gray-500">
                              Fecha real de inicio
                            </Label>
                            <DatePicker
                              date={task.realStart}
                              onDateChange={(date) =>
                                updateTask(task.id, 'realStart', date)
                              }
                              placeholder="Seleccionar fecha"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-gray-500">
                              Fecha real de finalización
                            </Label>
                            <DatePicker
                              date={task.realEndDate}
                              onDateChange={(date) =>
                                updateTask(task.id, 'realEndDate', date)
                              }
                              placeholder="Seleccionar fecha"
                              disabled={
                                task.status !==
                                ('Completado' as typeof task.status)
                              }
                            />
                          </div>
                        </div>
                      )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Diagrama de Gantt sincronizado con la tabla */}
      {isGanttGenerated && showGantt && tasks.length > 0 && (
        <DiagramaGantt tasks={tasks} projectInfo={projectInfo} visibleTasks={visibleTasks} />
      )}

      {/* Referencias mejoradas */}
      {tasks.length > 0 && (
        <ReferenciasSection />
      )}
    </div>
  )
}
