import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import { ProjectInfo, Task } from './RoadmapTab'

interface DiagramaGanttProps {
  tasks: Task[]
  projectInfo: ProjectInfo
  visibleTasks: Task[]
}

export const DiagramaGantt = ({
  tasks,
  projectInfo,
  visibleTasks,
}: DiagramaGanttProps) => {
  const getTaskPositions = (task: Task) => {
    const { start: rangeStart, end: rangeEnd } = getDateRange()
    const totalDays = Math.ceil(
      (rangeEnd.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24)
    )

    const positions = {
      planned: { left: 0, width: 0, visible: false },
      real: { left: 0, width: 0, visible: false },
    }

    // Barra planificada
    if (task.plannedStart && task.plannedEnd) {
      const startOffset = Math.ceil(
        (task.plannedStart.getTime() - rangeStart.getTime()) /
          (1000 * 60 * 60 * 24)
      )
      const endOffset = Math.ceil(
        (task.plannedEnd.getTime() - rangeStart.getTime()) /
          (1000 * 60 * 60 * 24)
      )
      const duration = Math.max(1, endOffset - startOffset + 1)

      positions.planned = {
        left: Math.max(0, Math.min(100, (startOffset / totalDays) * 100)),
        width: Math.max(1, Math.min(100, (duration / totalDays) * 100)),
        visible: true,
      }
    }

    // Barra real - usar exactamente las mismas fechas que muestra la tabla
    if (task.start && task.end) {
      const startOffset = Math.ceil(
        (task.start.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24)
      )
      const endOffset = Math.ceil(
        (task.end.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24)
      )
      const duration = Math.max(1, endOffset - startOffset + 1)

      positions.real = {
        left: Math.max(0, Math.min(100, (startOffset / totalDays) * 100)),
        width: Math.max(2, Math.min(100, (duration / totalDays) * 100)),
        visible: true,
      }
    }

    return positions
  }

  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    })
  }

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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Diagrama de Gantt - Vista Semanal
        </CardTitle>
        <p className="text-sm text-gray-600">
          Reflejo visual exacto de las fechas calculadas en la tabla superior
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div style={{ minWidth: `${weeks.length * 60}px` }}>
            {/* Header de semanas */}
            <div className="flex border-b-2 border-gray-200 mb-4 sticky top-0 bg-white z-10">
              <div className="w-80 p-3 font-semibold bg-gray-50 border-r">
                Tarea
              </div>
              <div className="flex flex-1">
                {weeks.map((week, index) => (
                  <div
                    key={index}
                    className="w-14 text-xs p-2 border-l text-center bg-gray-50 font-medium"
                  >
                    <div>
                      {week.toLocaleDateString('es-ES', { day: '2-digit' })}
                    </div>
                    <div className="text-gray-500">
                      {week.toLocaleDateString('es-ES', { month: 'short' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Barras de tareas mejoradas */}
            <div className="space-y-1">
              {visibleTasks.map((task) => {
                const positions = getTaskPositions(task)
                return (
                  <div
                    key={task.id}
                    className={`flex items-center hover:bg-gray-50 rounded group transition-all duration-200 ${
                      task.status === 'Completado' ? 'h-8 opacity-75' : 'h-12'
                    } ${task.isHidden ? 'opacity-50' : ''}`}
                  >
                    <div className="w-80 p-3 text-sm border-r bg-white sticky left-0 z-10">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs px-1 py-0">
                          {task.id}
                        </Badge>
                        <span
                          className={`truncate ${
                            task.status === 'Completado'
                              ? 'text-gray-500 text-xs'
                              : ''
                          }`}
                          title={task.description}
                        >
                          {task.description.substring(
                            0,
                            task.status === 'Completado' ? 25 : 35
                          )}
                          ...
                        </span>
                        {/* Indicadores de retraso/adelanto */}
                        {task.isDelayed && (
                          <Badge
                            variant="destructive"
                            className="text-xs px-1 py-0"
                          >
                            +{task.delayDays}d
                          </Badge>
                        )}
                        {task.isAhead && (
                          <Badge
                            variant="default"
                            className="text-xs px-1 py-0 bg-green-100 text-green-800"
                          >
                            -{task.aheadDays}d
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div
                      className={`flex-1 relative bg-gray-50 ${
                        task.status === 'Completado' ? 'h-6' : 'h-10'
                      }`}
                    >
                      {/* Barra planificada (fondo) */}
                      {positions.planned.visible && (
                        <div
                          className={`absolute rounded-sm border-2 border-dashed border-gray-400 bg-gray-200 opacity-60 ${
                            task.status === 'Completado'
                              ? 'h-3 top-1.5'
                              : 'h-4 top-3'
                          }`}
                          style={{
                            left: `${positions.planned.left}%`,
                            width: `${Math.max(positions.planned.width, 1)}%`,
                          }}
                          title={`Planificado: ${formatDate(
                            task.plannedStart
                          )} - ${formatDate(task.plannedEnd)}`}
                        />
                      )}

                      {/* Barra real (encima) - usando exactamente las fechas de la tabla */}
                      {positions.real.visible && (
                        <div
                          className={`absolute rounded-md shadow-sm border-2 ${
                            task.status === 'Completado'
                              ? task.effectiveDays &&
                                task.effectiveDays > task.duration
                                ? 'bg-red-400 border-red-500' // Tomó más tiempo del estimado
                                : task.effectiveDays &&
                                  task.effectiveDays < task.duration
                                ? 'bg-green-500 border-green-600' // Tomó menos tiempo del estimado
                                : 'bg-green-400 border-green-green-500' // Tiempo exacto
                              : task.status === 'En Progreso'
                              ? task.isDelayed
                                ? 'bg-orange-400 border-orange-500' // En progreso con retraso
                                : 'bg-blue-400 border-blue-500' // En progreso a tiempo
                              : task.isDelayed
                              ? 'bg-red-300 border-red-400' // Pendiente con retraso
                              : 'bg-gray-300 border-gray-400' // Pendiente a tiempo
                          } ${
                            task.status === 'Completado'
                              ? 'h-4 top-1'
                              : 'h-6 top-2'
                          }`}
                          style={{
                            left: `${positions.real.left}%`,
                            width: `${Math.max(positions.real.width, 2)}%`,
                          }}
                          title={`Real: ${formatDate(
                            task.start
                          )} - ${formatDate(task.end)} | Duración: ${
                            task.effectiveDays || task.duration
                          }d`}
                        >
                          <div
                            className={`h-full flex items-center justify-center text-white font-medium ${
                              task.status === 'Completado'
                                ? 'text-xs'
                                : 'text-xs'
                            }`}
                          >
                            {task.effectiveDays || task.duration}d
                          </div>
                        </div>
                      )}

                      {/* Indicador de conexión entre barras si hay diferencia */}
                      {positions.planned.visible &&
                        positions.real.visible &&
                        Math.abs(positions.planned.left - positions.real.left) >
                          1 && (
                          <div
                            className={`absolute bg-yellow-500 opacity-75 ${
                              task.status === 'Completado'
                                ? 'h-0.5 top-3'
                                : 'h-0.5 top-5'
                            }`}
                            style={{
                              left: `${Math.min(
                                positions.planned.left,
                                positions.real.left
                              )}%`,
                              width: `${Math.abs(
                                positions.planned.left - positions.real.left
                              )}%`,
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
  )
}
