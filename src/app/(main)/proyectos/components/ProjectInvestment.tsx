import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Clock, Shield, DollarSign, Link } from 'lucide-react'
import { Proyect } from '@/types/proyect'
import WhatsappIcon from '../../../../components/Icons/WhatsappIcon'

interface ProjectInvestmentProps {
  project: Proyect
}

export const ProjectInvestment = ({ project }: ProjectInvestmentProps) => {
  const getBusinessModelText = (model: string) => {
    return model === 'SOLD' ? 'Venta' : 'Alquiler'
  }

  return (
    <div className="space-y-6">
      {/* Investment Summary */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-orange-900">
            Resumen de Inversión
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Modelo de negocio</span>
            <Badge
              variant="outline"
              className="border-orange-300 text-orange-700"
            >
              {getBusinessModelText(project.businessModel)}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-700">Período de inversión</span>
            <span className="font-semibold text-gray-900">
              {project.proyectDetails?.investmentPeriod || 0} meses
            </span>
          </div>

          {/* <div className="flex items-center justify-between">
            <span className="text-gray-700">Score de rentabilidad</span>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="font-semibold text-green-600">
                {project.proyectDetails?.profitabilityScore || 0}/10
              </span>
            </div>
          </div> */}
        </CardContent>
      </Card>

      {/* Project Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            Estado del Proyecto
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {project.phase === 'CONSTRUCTION'
                ? 'En Construcción'
                : project.phase === 'COMPLETED'
                ? 'Buscando Financiamiento'
                : 'Completado'}
            </div>
            <div className="text-sm text-gray-600">Estado actual</div>
          </div>

          {project.daysToEnd && project.daysToEnd > 0 && (
            <div className="text-center">
              <div className="text-lg font-semibold text-orange-600">
                {project.daysToEnd} días restantes
              </div>
              <div className="text-sm text-gray-600">para finalización</div>
            </div>
          )}
          {/* </CardContent>
      </Card>

      {/* Risk Assessment
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-500" />
            Evaluación de Riesgo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-4">
            <div className="text-3xl font-bold mb-2" 
                 style={{ 
                   color: (project.proyectDetails?.riskScore || 0) <= 3 ? '#22c55e' : 
                          (project.proyectDetails?.riskScore || 0) <= 6 ? '#f59e0b' : '#ef4444' 
                 }}>
              {project.proyectDetails?.riskScore || 0}/10
            </div>
            <div className="text-sm text-gray-600 mb-3">Nivel de riesgo</div>
            <Badge variant={
              (project.proyectDetails?.riskScore || 0) <= 3 ? "default" : 
              (project.proyectDetails?.riskScore || 0) <= 6 ? "secondary" : "destructive"
            }>
              {(project.proyectDetails?.riskScore || 0) <= 3 ? "Bajo" : 
               (project.proyectDetails?.riskScore || 0) <= 6 ? "Medio" : "Alto"}
            </Badge>
          </div> */}
        </CardContent>
      </Card>

      {/* Call to Action */}
      <div className="space-y-3">
        <div className="flex justify-center">
          <a
            href="https://wa.me/5493492282324"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-5 py-3 text-base font-medium text-black hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="#25D366" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
            </svg>
            Contactanos
          </a>
        </div>
        <p className="text-xs text-gray-500 text-center">SKU: {project.slug}</p>
      </div>
    </div>
  )
}
