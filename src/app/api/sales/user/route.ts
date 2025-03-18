import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/libs/prisma'
import { authOptions } from '@/auth'

// GET ventas del usuario actual (como comprador)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const sales = await prisma.sale.findMany({
      where: { buyerId: parseInt(session.user.id) },
      include: {
        property: {
          select: {
            id: true,
            slug: true,
            title: true,
            images: {
              take: 1,
              select: {
                url: true
              }
            }
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(sales)
  } catch (error) {
    console.error('Error al obtener ventas del usuario:', error)
    return NextResponse.json({ error: 'Error al obtener ventas' }, { status: 500 })
  }
}
