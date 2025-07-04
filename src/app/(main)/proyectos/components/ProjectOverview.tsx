import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Bath, Square, Home, Hash, DollarSign, Layers, CheckCircle, XCircle, ParkingCircle, Info, EyeOff, Eye } from "lucide-react";
import { Proyect, ProjectUnit } from "@/store/proyectStore";
import React from "react";

interface ProjectOverviewProps {
  project: Proyect;
}

// Traduce el status de la unidad a un label en español y retorna color
function getStatusLabel(status?: string): { label: string; color: string } {
  switch ((status || '')) {
    case 'AVAILABLE':
      return { label: 'Disponible', color: 'bg-green-100 text-green-700 border-green-200' };
    case 'RESERVED':
      return { label: 'Reservada', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    case 'SOLD':
    case 'VENDIDA':
      return { label: 'Vendida', color: 'bg-gray-200 text-gray-600 border-gray-300' };
    case 'EN_VENTA':
      return { label: 'En venta', color: 'bg-blue-100 text-blue-700 border-blue-200' };
    case 'NO_DISPONIBLE':
      return { label: 'No disponible', color: 'bg-gray-100 text-gray-400 border-gray-200' };
    default:
      return { label: status || 'Sin estado', color: 'bg-gray-100 text-gray-400 border-gray-200' };
  }
}

// Icono según tipo de unidad
function getUnitTypeIcon(type?: string) {
  switch ((type || '').toUpperCase()) {
    case 'APARTMENT':
      return <Home className="w-5 h-5 text-blue-500" />;
    case 'HOUSE':
      return <Home className="w-5 h-5 text-orange-500" />;
    case 'LOT':
      return <Square className="w-5 h-5 text-green-700" />;
    default:
      return <Square className="w-5 h-5 text-gray-400" />;
  }
}

// Formato de fecha en español
function formatDateEs(dateStr?: string) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Extrae amenities/features en chips
function renderFeatures(features: any) {
  if (!features || typeof features !== 'object') return null;
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {Object.entries(features).map(([key, value]) =>
        value ? (
          <span key={key} className="px-2 py-1 rounded bg-gray-100 text-xs text-gray-700 border border-gray-200">{key}</span>
        ) : null
      )}
    </div>
  );
}

// Barra de progreso del proyecto
function ProjectProgressBar({ daysToStart, daysToEnd }: { daysToStart?: number; daysToEnd?: number }) {
  if (typeof daysToStart !== 'number' || typeof daysToEnd !== 'number') return null;
  const total = daysToStart + daysToEnd;
  const percent = total === 0 ? 100 : Math.round((daysToStart / total) * 100);
  return (
    <div className="mb-4">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>Inicio</span>
        <span>Finalización</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div className="h-3 rounded-full bg-orange-500" style={{ width: `${percent}%` }}></div>
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{daysToStart} días para iniciar</span>
        <span>{daysToEnd} días para finalizar</span>
      </div>
    </div>
  );
}

// Estadísticas rápidas
function ProjectStats({ units }: { units: ProjectUnit[] }) {
  const disponibles = units.filter(u => u.status === 'AVAILABLE').length;
  const reservadas = units.filter(u => u.status === 'RESERVED').length;
  const vendidas = units.filter(u => u.status === 'SOLD' || u.status === 'VENDIDA').length;
  const superficieTotal = units.reduce((acc, u) => acc + (u.surface || 0), 0);
  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <span className="text-sm text-green-700 font-semibold">{disponibles} disponibles</span>
      <span className="text-sm text-yellow-700 font-semibold">{reservadas} reservadas</span>
      <span className="text-sm text-gray-600 font-semibold">{vendidas} vendidas</span>
      <span className="text-sm text-blue-700 font-semibold">Superficie total: {superficieTotal} m²</span>
      <span className="text-sm text-orange-700 font-semibold">Unidades: {units.length}</span>
    </div>
  );
}

// Ordenar unidades: publicadas primero, luego disponibles, reservadas, vendidas
function sortUnits(units: ProjectUnit[]): ProjectUnit[] {
  return [...units].sort((a, b) => {
    // Publicadas primero
    if (a.isPublished && !b.isPublished) return -1;
    if (!a.isPublished && b.isPublished) return 1;
    // Disponibles primero
    if (a.status === 'AVAILABLE' && b.status !== 'AVAILABLE') return -1;
    if (a.status !== 'AVAILABLE' && b.status === 'AVAILABLE') return 1;
    // Reservadas después
    if (a.status === 'RESERVED' && b.status !== 'RESERVED') return -1;
    if (a.status !== 'RESERVED' && b.status === 'RESERVED') return 1;
    // Vendidas al final
    if ((a.status === 'SOLD' || a.status === 'VENDIDA') && (b.status !== 'SOLD' && b.status !== 'VENDIDA')) return 1;
    if ((b.status === 'SOLD' || b.status === 'VENDIDA') && (a.status !== 'SOLD' && a.status !== 'VENDIDA')) return -1;
    return 0;
  });
}

export const ProjectOverview = ({ project }: ProjectOverviewProps) => {
  // Datos del promotor
  const promotor = project.promotor;
  // Unidades ordenadas
  const units = sortUnits(project.projectUnits || []);
  // Rentabilidad, inversión mínima, etc.
  const annualReturn = project.proyectFound?.rentProfitability;
  const totalReturn = project.proyectFound?.totalNetProfitabilityToShow;
  // Timeline visual (si hay datos)
  const timeline = project.timeline && Object.keys(project.timeline).length > 0 ? project.timeline : null;

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

      {/* Barra de progreso del proyecto */}
      <ProjectProgressBar daysToStart={project.daysToStart} daysToEnd={project.daysToEnd} />

      {/* Estadísticas rápidas */}
      <ProjectStats units={units} />

      {/* Info del promotor */}
      {promotor && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold">Promotor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              {promotor.image && <img src={promotor.image} alt={promotor.name} className="w-10 h-10 rounded-full" />}
              <div>
                <div className="font-semibold text-gray-900">{promotor.name}</div>
                {promotor.email && <div className="text-xs text-gray-500">{promotor.email}</div>}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rentabilidad, inversión mínima, etc. */}
      {(annualReturn || totalReturn) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold">Datos de Inversión</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-6">
              {annualReturn && <span className="text-green-700 font-semibold">Rentabilidad anual: {annualReturn}%</span>}
              {totalReturn && <span className="text-orange-700 font-semibold">Rentabilidad total: {totalReturn}%</span>}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline visual */}
      {timeline && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold">Hitos del Proyecto</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              {Object.entries(timeline).map(([key, value]) => (
                <li key={key}><span className="font-semibold capitalize">{key}:</span> {String(value)}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Project Units Section - Nueva UI */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Unidades del Proyecto</CardTitle>
        </CardHeader>
        <CardContent>
          {units && units.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {units.map((unit: ProjectUnit, idx: number) => {
                const status = getStatusLabel(unit.status);
                const pricePerM2 = unit.surface ? (Number(unit.priceUsd) / unit.surface).toFixed(0) : null;
                return (
                  <div
                    key={unit.id || idx}
                    className="flex flex-col border border-gray-200 rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow p-5 relative"
                  >
                    {/* Badge de estado */}
                    <span className={`absolute top-4 right-4`}>
                      <Badge className={status.color} variant="outline">
                        {status.label}
                      </Badge>
                    </span>
                    {/* Título y tipo */}
                    <div className="flex items-center gap-2 mb-2">
                      {getUnitTypeIcon(unit.type)}
                      <span className="font-semibold text-lg text-gray-900">
                        {unit.sku || `Unidad #${idx + 1}`}
                      </span>
                      {unit.type && (
                        <Badge variant="secondary" className="ml-2 text-xs">{unit.type}</Badge>
                      )}
                    </div>
                    {/* Superficie y precio */}
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-gray-700 text-base font-medium">
                        {unit.surface} m²
                      </span>
                      <span className="text-orange-600 font-bold text-xl">
                        $ {Number(unit.priceUsd).toLocaleString()}
                      </span>
                      {pricePerM2 && (
                        <span className="text-xs text-gray-500">${pricePerM2}/m²</span>
                      )}
                    </div>
                    {/* Características principales */}
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1"><Layers className="w-4 h-4" /> Piso {unit.floor ?? '-'}</div>
                      <div className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {unit.rooms ?? 0} hab</div>
                      <div className="flex items-center gap-1"><Bath className="w-4 h-4" /> {unit.bathrooms ?? 0} baños</div>
                      <div className="flex items-center gap-1"><ParkingCircle className="w-4 h-4" />{unit.parking ? 'Estacionamiento' : 'Sin estacionamiento'}</div>
                    </div>
                    {/* Features/amenities */}
                    {unit.features && renderFeatures(unit.features)}
                    {/* Descripción */}
                    {unit.description && (
                      <div className="mb-1 text-gray-500 text-sm line-clamp-2">{unit.description}</div>
                    )}
                    {/* Fecha de disponibilidad */}
                    {unit.availabilityDate && (
                      <div className="text-xs text-gray-400 mt-auto">Disponible desde: {formatDateEs(unit.availabilityDate)}</div>
                    )}
                    {/* Botón de interés */}
                    <a
                      href={`https://wa.me/5493492282324?text=Hola! Me interesa la unidad ${unit.sku || unit.unitNumber || idx + 1} del proyecto ${project.title}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center justify-center rounded-md border border-green-300 bg-green-50 px-4 py-2 text-sm font-medium text-green-800 hover:bg-green-100 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" /> Me interesa esta unidad
                    </a>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-gray-500 text-center">No hay unidades registradas para este proyecto.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};