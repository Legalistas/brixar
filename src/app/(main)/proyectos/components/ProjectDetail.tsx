'use client'
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { getAllProyects } from "@/services/proyects-service";
import { ProjectHero } from "./ProjectHero";
import { ProjectOverview } from "./ProjectOverview";
import { ProjectLocation } from "./ProjectLocation";
import { ProjectInvestment } from "./ProjectInvestment";


const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['proyects'],
    queryFn: getAllProyects,
  });

  const project = projects?.find(p => p.slug === slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando proyecto...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Proyecto no encontrado</h1>
          <p className="text-gray-600 mb-6">El proyecto que buscas no existe o ha sido removido.</p>
          <Button onClick={() => {}} className="bg-orange-500 hover:bg-orange-600">
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => router.push('/proyectos')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a proyectos
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Compartir
            </Button>
          </div>
        </div>
      </div>

      {/* Project Hero Section */}
      <ProjectHero project={project} />

      {/* Content Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <ProjectOverview project={project} />
            <ProjectLocation project={project} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ProjectInvestment project={project} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;