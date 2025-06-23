import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation } from "lucide-react";
import { Proyect } from "@/types/proyect";

interface ProjectLocationProps {
  project: Proyect;
}

export const ProjectLocation = ({ project }: ProjectLocationProps) => {
  const address = project.address[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <MapPin className="w-6 h-6 text-orange-500" />
          Ubicación
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Address Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Dirección</h4>
            <p className="text-gray-600">
              {address?.streetName}<br />
              {address?.city}, {address?.state?.name}<br />
              {address?.country?.name} {/* {address?.postalCode} */}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Área</h4>
            <p className="text-gray-600">
              Ciudad: {address?.city}<br />
              Provincia: {address?.state?.name}<br />
              País: {address?.country?.name}
            </p>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">Mapa de ubicación</h4>
            <button className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium">
              <Navigation className="w-4 h-4" />
              Ver en mapa
            </button>
          </div>
          
          <div className="aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden border">
            <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center relative">
              {/* Simple map mockup */}
              <div className="absolute inset-4 bg-white/20 rounded border-2 border-dashed border-white/40"></div>
              <div className="text-center">
                <MapPin className="w-12 h-12 text-orange-500 mx-auto mb-2" />
                <div className="text-gray-700 font-medium">{address?.city}</div>
                <div className="text-sm text-gray-600">{address?.state?.name}</div>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 text-center">
            Ubicación aproximada del proyecto en {address?.city}, {address?.state?.name}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};