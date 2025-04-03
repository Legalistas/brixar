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
    
    if (!session || session.user.role !== 'ADMIN') {
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

    // Buscar la consulta
    const inquiry = await prisma.inquiry.findUnique({
      where: { id: inquiryId },
    })

    if (!inquiry) {
      return NextResponse.json(
        { error: 'Consulta no encontrada' },
        { status: 404 }
      )
    }

    // Verificar que la consulta tenga un precio negociado
    if (!inquiry.negotiatedPrice) {
      return NextResponse.json(
        { error: 'No hay precio negociado para esta consulta' },
        { status: 400 }
      )
    }

    // Actualizar la consulta con la aceptación del administrador
    const updatedInquiry = await prisma.inquiry.update({
      where: { id: inquiryId },
      data: {
        adminAccepted: true,
      },
      include: {
        property: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // Crear un mensaje en el sistema sobre la aceptación
    await prisma.inquiryMessage.create({
      data: {
        inquiryId,
        userId: parseInt(session.user.id, 10),
        message: 'El administrador ha aceptado la oferta',
        isAdmin: true,
      },
    })

    return NextResponse.json(updatedInquiry)
  } catch (error) {
    console.error('Error al aceptar la oferta como administrador:', error)
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
}
