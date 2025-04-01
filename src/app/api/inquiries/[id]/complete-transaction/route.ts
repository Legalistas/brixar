import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { prisma } from '@/libs/prisma'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      )
    }

    const inquiryId = parseInt(params.id)
    
    if (isNaN(inquiryId)) {
      return NextResponse.json(
        { error: 'ID de consulta inválido' },
        { status: 400 }
      )
    }

    const body = await req.json()
    const { propertyId, price, buyerId } = body

    if (!propertyId || !price) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      )
    }

    // Buscar la consulta
    const inquiry = await prisma.inquiry.findUnique({
      where: { id: inquiryId },
      include: {
        user: true,
        property: true,
      },
    })

    if (!inquiry) {
      return NextResponse.json(
        { error: 'Consulta no encontrada' },
        { status: 404 }
      )
    }

    // Verificar que ambas partes hayan aceptado
    if (!inquiry.adminAccepted || !inquiry.clientAccepted) {
      return NextResponse.json(
        { error: 'Ambas partes deben aceptar la oferta para completar la transacción' },
        { status: 400 }
      )
    }

    // Crear la venta
    const sale = await prisma.sale.create({
      data: {
        propertyId,
        price,
        buyerId: buyerId || inquiry.userId,
        sellerId: session.user.role === 'ADMIN' ? session.user.id : undefined,
        inquiryId,
        status: 'PENDING',
        notes: `Venta generada automáticamente a partir de la consulta #${inquiryId}`,
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            slug: true,
            images: true,
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
    })

    // Marcar la consulta como resuelta
    await prisma.inquiry.update({
      where: { id: inquiryId },
      data: {
        status: 'RESOLVED',
      },
    })

    // Crear un mensaje en el sistema sobre la creación de la venta
    await prisma.inquiryMessage.create({
      data: {
        inquiryId,
        userId: session.user.id,
        message: `Se ha completado la transacción y creado la venta #${sale.id}`,
        isAdmin: session.user.role === 'ADMIN',
      },
    })

    return NextResponse.json({ 
      sale,
      saleId: sale.id
    })
  } catch (error) {
    console.error('Error al completar la transacción:', error)
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
}
