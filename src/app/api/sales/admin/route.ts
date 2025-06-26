import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { prisma } from '@/libs/prisma'

export const dynamic = 'force-dynamic';

// Obtener todas las ventas (solo admin/vendedor)
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Verificar si el usuario es admin o vendedor
    const user = await prisma.user.findUnique({
      where: { id: parseInt(session.user.id) },
    })

    if (!user || (user.role !== 'ADMIN' && user.role !== 'SELLER')) {
      return NextResponse.json(
        { error: 'No tiene permisos para ver todas las ventas' },
        { status: 403 }
      )
    }

    const sales = await prisma.sale.findMany({
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
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
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
    console.error('Error al obtener las ventas:', error)
    return NextResponse.json(
      { error: 'Error al obtener las ventas' },
      { status: 500 }
    )
  }
}
