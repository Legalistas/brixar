import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { prisma } from '@/libs/prisma'

export async function POST(
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

    const inquiryId = parseInt(params.id)
    const body = await request.json()
    const { propertyId, price } = body
    
    // Verificar que la consulta existe y tiene los estados correctos
    const inquiry = await prisma.inquiry.findUnique({
      where: { id: inquiryId },
      include: {
        property: true,
        user: true,
      },
    })

    if (!inquiry) {
      return NextResponse.json(
        { error: 'La consulta no existe' },
        { status: 404 }
      )
    }

    // Crear la venta
    const newSale = await prisma.sale.create({
      data: {
        propertyId: propertyId,
        buyerId: inquiry.userId,
        sellerId: parseInt(session.user.id) !== inquiry.userId ? parseInt(session.user.id) : null,
        inquiryId: inquiryId,
        price: price,
        status: 'PENDING',
        notes: `Venta generada a partir de la consulta #${inquiryId}`,
      },
    })

    // Actualizar la propiedad a RESERVADA
    await prisma.property.update({
      where: { id: propertyId },
      data: { status: 'RESERVADA' },
    })

    // Actualizar la consulta a RESOLVED
    await prisma.inquiry.update({
      where: { id: inquiryId },
      data: { status: 'RESOLVED' },
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Transacción completada con éxito',
      saleId: newSale.id 
    })
  } catch (error) {
    console.error('Error al completar la transacción:', error)
    return NextResponse.json(
      { error: 'Error al procesar la transacción' },
      { status: 500 }
    )
  }
}
