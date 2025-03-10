'use client'

import { useInquiryStore } from '@/store/inquiryStore'
import { useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'

const statusColors = {
  OPEN: 'bg-blue-500 hover:bg-blue-600',
  IN_PROGRESS: 'bg-yellow-500 hover:bg-yellow-600',
  CLOSED: 'bg-gray-500 hover:bg-gray-600',
  RESOLVED: 'bg-green-500 hover:bg-green-600'
}

const statusLabels = {
  OPEN: 'Abierta',
  IN_PROGRESS: 'En progreso',
  CLOSED: 'Cerrada',
  RESOLVED: 'Resuelta'
}

export default function InquiriesPage() {
  const { inquiries, fetchUserInquiries, isLoading } = useInquiryStore()

  useEffect(() => {
    fetchUserInquiries()
  }, [fetchUserInquiries])

  return (
    <DashboardShell>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Mis consultas</h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : inquiries.length === 0 ? (
          <div className="text-center p-6 bg-gray-50 rounded-md">
            <h3 className="text-lg font-medium">No tienes consultas</h3>
            <p className="text-gray-600 mt-1">
              Explora nuestras propiedades y realiza tus consultas.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {inquiries.map((inquiry) => (
              <Link 
                key={inquiry.id} 
                href={`/customer/inquiries/${inquiry.id}`}
                className="no-underline text-inherit"
              >
                <Card className="hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{inquiry.title}</CardTitle>
                      <Badge 
                        variant="secondary"
                        className={statusColors[inquiry.status] + " text-white"}
                      >
                        {statusLabels[inquiry.status]}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      {inquiry.property.images && inquiry.property.images.length > 0 ? (
                        <div className="relative w-20 h-20 shrink-0">
                          <Image
                            src={"/uploads" + inquiry.property.images[0].url}
                            alt={inquiry.property.title}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                      ) : (
                        <div className="bg-gray-200 w-20 h-20 rounded-md shrink-0" />
                      )}
                      <div>
                        <h4 className="font-medium line-clamp-1">{inquiry.property.title}</h4>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                          <span>{formatDistanceToNow(new Date(inquiry.updatedAt), { locale: es, addSuffix: true })}</span>
                          {inquiry._count && (
                            <span>• {inquiry._count.messages} mensaje{inquiry._count.messages !== 1 ? 's' : ''}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
