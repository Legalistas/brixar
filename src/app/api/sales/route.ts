import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { prisma } from '@/libs/prisma'

// Obtener todas las ventas (solo admin/vendedor)
export async function GET(request: Request) {
  try {
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
    const body = await request.json()
    const { propertyId, buyerId, price, status, paymentMethod, paymentReference, notes } = body

    // Verificar si la propiedad existe
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    })
    
    if (!property) {
      return NextResponse.json(
        { error: 'La propiedad no existe' }, 
        { status: 404 }
      )
    }    const newSale = await prisma.sale.create({
      data: {
        propertyId,
        buyerId: buyerId || undefined,
        price,
        status: status || 'PENDING',
        paymentMethod,
        paymentReference,
        notes,
      },
      include: {
        property: true,
        buyer: true
      }
    })

    // Actualizar el estado de la propiedad a VENDIDA si no lo está ya
    if (property.status !== 'VENDIDA') {
      await prisma.property.update({
        where: { id: propertyId },
        data: { status: 'VENDIDA' }
      })
    }

    return NextResponse.json(newSale)
  } catch (error) {
    console.error('Error al crear la venta:', error)
    return NextResponse.json(
      { error: 'Error al crear la venta' },
      { status: 500 }
    )
  }
}
