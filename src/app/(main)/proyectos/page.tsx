"use client";

import { getAllProyects } from "@/services/proyects-service";
import { useEffect, useState } from "react";
import { Proyect } from "@/types/proyect";
import Loading from "@/components/ui/Loading";
import ProjectCard from "./components/ProjectCard";

export default function Projects() {
    const [projects, setProjects] = useState<Proyect[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setIsLoading(true);
                const response = await getAllProyects();
                setProjects(response || []); // If response is undefined/null, use empty array
            } catch (error) {
                console.error('Error fetching projects:', error);
                setError('Error al cargar los proyectos');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProjects();
    }, []);

    if (isLoading) return (
        <div className="container mx-auto px-4 py-8">
            <Loading />
        </div>
    );

    if (error) return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-red-500 text-center">{error}</div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8 max-w-[1280px]">
            <h1 className="text-3xl font-bold mb-6 text-center">Proyectos abiertos</h1>
            {projects.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                    <p className="text-lg font-medium">No hay proyectos disponibles</p>
                    <p className="text-sm text-gray-400 mt-2">Vuelve más tarde para ver nuevos proyectos</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            )}
        </div>
    );
}