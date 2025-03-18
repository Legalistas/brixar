import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/libs/prisma'
import { authOptions } from '@/auth'

// GET venta específica
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const saleId = parseInt(params.id)
    
    const sale = await prisma.sale.findUnique({
      where: { id: saleId },
      include: {
        property: true,
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        inquiry: {
          include: {
            messages: {
              orderBy: { createdAt: 'asc' },
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    image: true
                  }
                }
              }
            }
          }
        },
        transactions: true
      },
    })

    if (!sale) {
      return NextResponse.json({ error: 'Venta no encontrada' }, { status: 404 })
    }

    // Verificar que el usuario sea el comprador, vendedor o un administrador
    const isAuthorized = 
      sale.buyerId === parseInt(session.user.id) ||
      sale.sellerId === parseInt(session.user.id) ||
      session.user.role === 'ADMIN'

    if (!isAuthorized) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    return NextResponse.json(sale)
  } catch (error) {
    console.error('Error al obtener venta:', error)
    return NextResponse.json({ error: 'Error al obtener venta' }, { status: 500 })
  }
}

// PUT actualizar venta (admin)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const saleId = parseInt(params.id)
    const data = await req.json()
    
    const sale = await prisma.sale.findUnique({
      where: { id: saleId },
    })

    if (!sale) {
      return NextResponse.json({ error: 'Venta no encontrada' }, { status: 404 })
    }

    const updatedSale = await prisma.sale.update({
      where: { id: saleId },
      data: {
        status: data.status || undefined,
        paymentMethod: data.paymentMethod || undefined,
        paymentReference: data.paymentReference || undefined,
        notes: data.notes || undefined,
        documents: data.documents || undefined,
      },
    })

    return NextResponse.json(updatedSale)
  } catch (error) {
    console.error('Error al actualizar venta:', error)
    return NextResponse.json({ error: 'Error al actualizar venta' }, { status: 500 })
  }
}
