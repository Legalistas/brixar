import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";

interface ProjectFiltersProps {
  selectedPhase: string;
  selectedType: string;
  onPhaseChange: (phase: string) => void;
  onTypeChange: (type: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const ProjectFilters = ({
  selectedPhase,
  selectedType,
  onPhaseChange,
  onTypeChange,
  onClearFilters,
  hasActiveFilters
}: ProjectFiltersProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filtrar proyectos</h3>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Estado del proyecto</label>
              <Select value={selectedPhase} onValueChange={onPhaseChange}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="FUNDING">Financiamiento</SelectItem>
                  <SelectItem value="CONSTRUCTION">En construcción</SelectItem>
                  <SelectItem value="COMPLETED">Completado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tipo de proyecto</label>
              <Select value={selectedType} onValueChange={onTypeChange}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="Residencial">Residencial</SelectItem>
                  <SelectItem value="Comercial">Comercial</SelectItem>
                  <SelectItem value="Mixto">Mixto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="flex items-center gap-2 self-end"
            >
              <X className="w-4 h-4" />
              Limpiar filtros
            </Button>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-600">Filtros activos:</span>
          {selectedPhase !== "all" && (
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              Estado: {selectedPhase === "FUNDING" ? "Financiamiento" : 
                      selectedPhase === "CONSTRUCTION" ? "En construcción" : "Completado"}
            </Badge>
          )}
          {selectedType !== "all" && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Tipo: {selectedType}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};