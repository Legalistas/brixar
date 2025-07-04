"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function AccessDenied() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <ShieldAlert className="mx-auto h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Acceso denegado
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Lo sentimos, no tienes permiso para acceder a esta página.
        </p>
        <div className="space-x-4">
          <Link href="/">
            <Button asChild>
              <span className="inline-flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </span>
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" asChild>
              <span className="inline-flex items-center">
                Iniciar sesión
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
