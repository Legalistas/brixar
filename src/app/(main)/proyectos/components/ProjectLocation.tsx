import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Navigation } from 'lucide-react'
import { GoogleMap } from '@/components/GoogleMap'
import { Proyect } from '@/store/proyectStore'

interface ProjectLocationProps {
  project: Proyect
}

export const ProjectLocation = ({ project }: ProjectLocationProps) => {
  const address = project.address?.[0]

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
              {address?.streetName}
              <br />
              {address?.city}, {address?.state?.name}
              <br />
              {address?.country?.name} {/* {address?.postalCode} */}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Área</h4>
            <p className="text-gray-600">
              Ciudad: {address?.city}
              <br />
              Provincia: {address?.state?.name}
              <br />
              País: {address?.country?.name}
            </p>
          </div>
        </div>

        {/* Map Placeholder */}
        {(address?.positions && address.positions.length > 0) ? (
          <div className="mt-4">
            {address.positions[0]?.latitude &&
              address.positions[0]?.longitude && (
                <div className="aspect-video rounded-lg overflow-hidden">
                  <GoogleMap
                    latitude={Number(address.positions[0].latitude)}
                    longitude={Number(address.positions[0].longitude)}
                  />
                </div>
              )}
          </div>
        ) : (
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Mapa no disponible en esta vista</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
