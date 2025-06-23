import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Proyect } from "@/types/proyect";
import { MapPin, Calendar, TrendingUp, Building2, Users, Square } from "lucide-react";

interface ProjectCardProps {
  project: Proyect;
  onViewDetails: (slug: string) => void;
}

export const ProjectCard = ({ project, onViewDetails }: ProjectCardProps) => {
  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "CONSTRUCTION":
        return "bg-orange-500 hover:bg-orange-600";
      case "FUNDING":
        return "bg-gray-500 hover:bg-gray-600";
      case "COMPLETED":
        return "bg-green-500 hover:bg-green-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getPhaseText = (phase: string) => {
    switch (phase) {
      case "CONSTRUCTION":
        return "EN CONSTRUCCIÓN";
      case "FUNDING":
        return "FINANCIAMIENTO";
      case "COMPLETED":
        return "COMPLETADO";
      default:
        return phase;
    }
  };

  const address = project.address[0];
  const location = `${address?.city}, ${address?.state?.name}`;
  console.log('project', project)
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white border border-gray-200">
      <CardHeader className="relative pb-2">
        <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
            {project.projectMedia && project.projectMedia.length > 0 ? (
              <img
                src={project.projectMedia[0].url}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-500 text-4xl font-light">600 × 400</span>
            )}
          </div>
        </div>
        
        <Badge 
          className={`absolute top-4 left-4 text-white text-xs font-medium px-3 py-1 ${getPhaseColor(project.phase)}`}
        >
          {getPhaseText(project.phase)}
        </Badge>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
            {project.title}
          </h3>
          
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{location}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-gray-600 text-sm leading-relaxed">
          {project.openingLine || "Excelente oportunidad de inversión inmobiliaria"}
        </p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Square className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">
              {project.proyectDetails?.surface || 0}m²
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">
              {project.proyectDetails?.rooms || 0} amb.
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">
              {project.proyectDetails?.investmentPeriod || 0} meses
            </span>
          </div>
          
          {/* <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-green-600 font-medium">
              Score: {project.proyectDetails?.profitabilityScore || 0}/10
            </span>
          </div> */}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            SKU: {project.slug}
          </div>
          {/* <div className="text-xs text-gray-500">
            Riesgo: {project.proyectDetails?.riskScore || 0}/10
          </div> */}
        </div>
      </CardContent>

      <CardFooter>
        <Button 
          onClick={() => onViewDetails(project.slug)}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium"
        >
          Ver detalles
        </Button>
      </CardFooter>
    </Card>
  );
};