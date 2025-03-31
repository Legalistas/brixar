import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { prisma } from '@/libs/prisma'

// Obtener todas las ventas (solo admin/vendedor)
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Verificar si es admin o vendedor
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

// Crear una nueva venta
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Verificar si es admin o vendedor
    const user = await prisma.user.findUnique({
      where: { id: parseInt(session.user.id) },
    })

    if (!user || (user.role !== 'ADMIN' && user.role !== 'SELLER')) {
      return NextResponse.json(
        { error: 'No tiene permisos para crear ventas' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { propertyId, buyerId, price, status, paymentMethod, paymentReference, notes } = body

    const newSale = await prisma.sale.create({
      data: {
        propertyId,
        buyerId,
        sellerId: parseInt(session.user.id),
        price,
        status: status || 'PENDING',
        paymentMethod,
        paymentReference,
        notes,
      },
    })

    return NextResponse.json(newSale)
  } catch (error) {
    console.error('Error al crear la venta:', error)
    return NextResponse.json(
      { error: 'Error al crear la venta' },
      { status: 500 }
    )
  }
}
