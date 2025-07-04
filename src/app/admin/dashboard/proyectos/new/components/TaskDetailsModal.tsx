import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Task } from "@/types/roadmap"
import { Clock, Info, Target } from "lucide-react"
import DatePicker from "./DatePicker"
import { Badge } from "@/components/ui/badge"

export default function TaskDetailsModal({
    task,
    isOpen,
    onClose,
    onUpdate,
  }: {
    task: Task
    isOpen: boolean
    onClose: () => void
    onUpdate: (taskId: number, field: keyof Task, value: any) => void
  }) {
    const formatDate = (date: Date | null) => {
      if (!date) return "No definida"
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        weekday: "short",
      })
    }
  
    const getDependentTaskName = (dependentId: number | null) => {
      if (!dependentId) return "Ninguna"
      return `Tarea #${dependentId}`
    }
  
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              Detalles de Tarea #{task.id}
            </DialogTitle>
          </DialogHeader>
  
          <div className="space-y-6">
            {/* Información General */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Target className="h-4 w-4" />
                Información General
              </h3>
  
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Descripción</Label>
                  <Textarea
                    value={task.description}
                    onChange={(e) => onUpdate(task.id, "description", e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
  
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Duración (días)</Label>
                      <Input
                        type="number"
                        value={task.duration}
                        onChange={(e) => onUpdate(task.id, "duration", Number.parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Estado</Label>
                      <Select
                        value={task.status}
                        onValueChange={(value: Task["status"]) => onUpdate(task.id, "status", value)}
                      >
                        <SelectTrigger>
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
  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Responsable</Label>
                    <Input
                      value={task.responsible}
                      onChange={(e) => onUpdate(task.id, "responsible", e.target.value)}
                      placeholder="Asignar responsable..."
                    />
                  </div>
                </div>
              </div>
            </div>
  
            <Separator />
  
            {/* Dependencias */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Dependencias</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Tarea dependiente</Label>
                  <div className="text-sm p-2 bg-gray-50 rounded">{getDependentTaskName(task.dependentTask)}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Tipo de dependencia</Label>
                  <div className="text-sm p-2 bg-gray-50 rounded">
                    {task.dependencyType === "FC"
                      ? "Fin-Comienzo"
                      : task.dependencyType === "CC"
                        ? "Comienzo-Comienzo"
                        : "Ninguna"}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Días de diferencia</Label>
                  <div className="text-sm p-2 bg-gray-50 rounded">{task.dependencyDays} días</div>
                </div>
              </div>
            </div>
  
            <Separator />
  
            {/* Fechas Planificadas vs Reales */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Cronograma
              </h3>
  
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fechas Planificadas */}
                <div className="space-y-3">
                  <h4 className="font-medium text-blue-600">📋 Fechas Planificadas</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                      <span className="text-sm font-medium">Inicio:</span>
                      <span className="text-sm">{formatDate(task.plannedStart)}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                      <span className="text-sm font-medium">Fin:</span>
                      <span className="text-sm">{formatDate(task.plannedEnd)}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                      <span className="text-sm font-medium">Duración:</span>
                      <span className="text-sm font-mono">{task.duration} días</span>
                    </div>
                  </div>
                </div>
  
                {/* Fechas Reales */}
                <div className="space-y-3">
                  <h4 className="font-medium text-green-600">✅ Fechas Reales</h4>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Inicio real</Label>
                      <DatePicker
                        date={task.realStart}
                        onDateChange={(date) => onUpdate(task.id, "realStart", date)}
                        placeholder="Seleccionar fecha real"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Fin real</Label>
                      <DatePicker
                        date={task.realEndDate}
                        onDateChange={(date) => onUpdate(task.id, "realEndDate", date)}
                        placeholder="Seleccionar fecha real"
                      />
                    </div>
                    {task.effectiveDays && (
                      <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                        <span className="text-sm font-medium">Días efectivos:</span>
                        <span className="text-sm font-mono">{task.effectiveDays} días</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
  
            {/* Indicadores de Rendimiento */}
            {(task.isDelayed || task.isAhead || (task.effectiveDays && task.effectiveDays !== task.duration)) && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">📊 Indicadores de Rendimiento</h3>
                  <div className="flex flex-wrap gap-2">
                    {task.isDelayed && <Badge variant="destructive">Retraso: +{task.delayDays} días</Badge>}
                    {task.isAhead && (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Adelanto: -{task.aheadDays} días
                      </Badge>
                    )}
                    {task.effectiveDays && task.effectiveDays !== task.duration && (
                      <Badge variant={task.effectiveDays > task.duration ? "destructive" : "default"}>
                        {task.effectiveDays > task.duration
                          ? `+${task.effectiveDays - task.duration} días extra`
                          : `${task.duration - task.effectiveDays} días menos`}
                      </Badge>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    )
  }