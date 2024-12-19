"use client";

import { getAllProyects } from "@/services/proyects-service";
import { useEffect, useState } from "react";
import { Proyect } from "@/types/proyect";
import Loading from "@/components/ui/Loading";

export default function Projects() {
    const [projects, setProjects] = useState<Proyect[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setIsLoading(true);
                const response = await getAllProyects();
                setProjects(response.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
                setError('Error al cargar los proyectos');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProjects();
    }, []);

    if (isLoading) return <Loading />;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Proyectos</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
                            <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">
                                    {project.address[0]?.city}, {project.address[0]?.state.name}
                                </span>
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    {project.phase}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
