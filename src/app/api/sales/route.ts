import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/libs/prisma'
import { authOptions } from '@/auth'

// GET todas las ventas (admin)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const sales = await prisma.sale.findMany({
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
          select: {
            id: true,
            title: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(sales)
  } catch (error) {
    console.error('Error al obtener ventas:', error)
    return NextResponse.json({ error: 'Error al obtener ventas' }, { status: 500 })
  }
}

// POST crear nueva venta (admin)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const data = await req.json()
    const { propertyId, buyerId, price, inquiryId, status, paymentMethod, notes } = data

    // Verificar si la propiedad existe
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    })

    if (!property) {
      return NextResponse.json({ error: 'Propiedad no encontrada' }, { status: 404 })
    }

    // Crear la venta
    const sale = await prisma.sale.create({
      data: {
        propertyId,
        buyerId,
        sellerId: parseInt(session.user.id),
        price,
        status: status || 'PENDING',
        inquiryId,
        paymentMethod,
        notes,
      },
    })

    // Si hay una consulta asociada, la marcamos como cerrada
    if (inquiryId) {
      await prisma.inquiry.update({
        where: { id: inquiryId },
        data: { status: 'CLOSED' }
      })
    }

    return NextResponse.json(sale)
  } catch (error) {
    console.error('Error al crear venta:', error)
    return NextResponse.json({ error: 'Error al crear venta' }, { status: 500 })
  }
}
