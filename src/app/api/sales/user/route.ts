import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { prisma } from '@/libs/prisma'

export const dynamic = 'force-dynamic';

// Obtener ventas del usuario
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const userId = parseInt(session.user.id)

    const sales = await prisma.sale.findMany({
      where: {
        buyerId: userId,
      },
      include: {
        property: {
          select: {
            id: true,
            slug: true,
            title: true,
            images: {
              select: {
                url: true,
              },
              take: 1,
            },
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(sales)
  } catch (error) {
    console.error('Error al obtener las ventas del usuario:', error)
    return NextResponse.json(
      { error: 'Error al obtener las ventas' },
      { status: 500 }
    )
  }
}
