import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { prisma } from '@/libs/prisma'

// Obtener una venta por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const saleId = parseInt(params.id)
    const userId = parseInt(session.user.id)

    // Verificar si el usuario es admin o vendedor
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    const sale = await prisma.sale.findUnique({
      where: { id: saleId },
      include: {
        property: {
          select: {
            id: true,
            slug: true,
            title: true,
            price: true,
            images: {
              select: {
                url: true,
              },
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
        transactions: true,
        inquiry: {
          include: {
            messages: {
              orderBy: {
                createdAt: 'asc',
              },
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!sale) {
      return NextResponse.json(
        { error: 'Venta no encontrada' },
        { status: 404 }
      )
    }

    // Verificar permisos: solo admin/vendedor o el comprador pueden ver la venta
    if (user?.role !== 'ADMIN' && user?.role !== 'SELLER' && sale.buyerId !== userId) {
      return NextResponse.json(
        { error: 'No tiene permisos para ver esta venta' },
        { status: 403 }
      )
    }

    return NextResponse.json(sale)
  } catch (error) {
    console.error('Error al obtener la venta:', error)
    return NextResponse.json(
      { error: 'Error al obtener la venta' },
      { status: 500 }
    )
  }
}

// Actualizar una venta
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
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
        { error: 'No tiene permisos para actualizar ventas' },
        { status: 403 }
      )
    }

    const saleId = parseInt(params.id)
    const body = await request.json()
    
    // Actualizar solo los campos proporcionados
    const updatedSale = await prisma.sale.update({
      where: { id: saleId },
      data: {
        ...body,
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
        transactions: true,
      },
    })

    return NextResponse.json(updatedSale)
  } catch (error) {
    console.error('Error al actualizar la venta:', error)
    return NextResponse.json(
      { error: 'Error al actualizar la venta' },
      { status: 500 }
    )
  }
}
