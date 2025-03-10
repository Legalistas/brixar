import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/libs/prisma'
import { authOptions } from '@/auth'
export async function GET(
  req: NextRequest,
  { params }: { params: { propertyId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const propertyId = parseInt(params.propertyId)
    
    const inquiries = await prisma.inquiry.findMany({
      where: {
        propertyId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            messages: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return NextResponse.json(inquiries)
  } catch (error) {
    console.error('Error al obtener consultas de la propiedad:', error)
    return NextResponse.json({ error: 'Error al obtener consultas' }, { status: 500 })
  }
}
