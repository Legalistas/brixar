import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Circle, AlertCircle, CheckCircle2, Plus, EyeOff, Trash2 } from 'lucide-react'
import React from 'react'

export const ReferenciasSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Referencias y Ayuda</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tipos de Dependencia */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">
              Tipos de Dependencia:
            </h4>
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

          {/* Estados de Tarea */}
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

          {/* Gestión de Tareas */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Gestión de Tareas:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4 text-blue-600" />
                <span>Agregar tareas personalizadas</span>
              </div>
              <div className="flex items-center gap-2">
                <EyeOff className="h-4 w-4 text-gray-600" />
                <span>Ocultar tareas no necesarias</span>
              </div>
              <div className="flex items-center gap-2">
                <Trash2 className="h-4 w-4 text-red-600" />
                <span>Eliminar tareas personalizadas</span>
              </div>
            </div>
          </div>

          {/* Colores del Gantt */}
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
  )
}
