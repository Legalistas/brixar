import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Calendar, Square, TrendingUp, AlertTriangle } from "lucide-react";
import { Proyect } from "@/types/proyect";

interface ProjectOverviewProps {
  project: Proyect;
}

export const ProjectOverview = ({ project }: ProjectOverviewProps) => {
  return (
    <div className="space-y-6">
      {/* Project Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Descripción del Proyecto</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 leading-relaxed text-lg">
            {project.description || project.openingLine || "Excelente oportunidad de inversión inmobiliaria en una ubicación estratégica. Este proyecto ofrece características únicas que lo convierten en una opción atractiva para inversionistas que buscan rentabilidad y crecimiento a largo plazo."}
          </p>
        </CardContent>
      </Card>

      {/* Project Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Características del Proyecto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Square className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {project.proyectDetails?.surface || 0}
              </div>
              <div className="text-sm text-gray-600">m² totales</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Building2 className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {project.proyectDetails?.rooms || 0}
              </div>
              <div className="text-sm text-gray-600">ambientes</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {project.proyectDetails?.investmentPeriod || 0}
              </div>
              <div className="text-sm text-gray-600">meses</div>
            </div>
            
            {/* <div className="text-center p-4 bg-gray-50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {project.proyectDetails?.profitabilityScore || 0}/10
              </div>
              <div className="text-sm text-gray-600">score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Investment Risk
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-orange-500" />
            Análisis de Riesgo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-700 font-medium">Nivel de Riesgo</span>
            <Badge variant={project.proyectDetails?.riskScore && project.proyectDetails?.riskScore <= 3 ? "default" : project.proyectDetails?.riskScore && project.proyectDetails?.riskScore <= 6 ? "secondary" : "destructive"}>
              {project.proyectDetails?.riskScore || 0}/10
            </Badge>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full ${
                (project.proyectDetails?.riskScore || 0) <= 3 
                  ? 'bg-green-500' 
                  : (project.proyectDetails?.riskScore || 0) <= 6 
                    ? 'bg-yellow-500' 
                    : 'bg-red-500'
              }`}
              style={{ width: `${((project.proyectDetails?.riskScore || 0) / 10) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Bajo Riesgo</span>
            <span>Alto Riesgo</span> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};