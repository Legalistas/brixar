import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/libs/prisma'
import { authOptions } from '@/auth'

// GET mensajes de consulta
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const inquiryId = parseInt(params.id)
    
    const inquiry = await prisma.inquiry.findUnique({
      where: { id: inquiryId },
    })

    if (!inquiry) {
      return NextResponse.json({ error: 'Consulta no encontrada' }, { status: 404 })
    }

    // Verificar que el usuario sea el propietario o un administrador
    if (inquiry.userId !== parseInt(session.user.id) && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const messages = await prisma.inquiryMessage.findMany({
      where: { inquiryId },
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
      orderBy: {
        createdAt: 'asc',
      },
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error al obtener mensajes:', error)
    return NextResponse.json({ error: 'Error al obtener mensajes' }, { status: 500 })
  }
}

// POST crear nuevo mensaje
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const inquiryId = parseInt(params.id)
    const data = await req.json()
    
    const inquiry = await prisma.inquiry.findUnique({
      where: { id: inquiryId },
    })

    if (!inquiry) {
      return NextResponse.json({ error: 'Consulta no encontrada' }, { status: 404 })
    }

    // Verificar que el usuario sea el propietario o un administrador
    if (inquiry.userId !== parseInt(session.user.id) && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const isAdmin = session.user.role === 'ADMIN';
    
    const newMessage = await prisma.inquiryMessage.create({
      data: {
        inquiryId,
        userId: parseInt(session.user.id),
        message: data.message,
        isAdmin: isAdmin || data.isAdmin || false,
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
    })

    // Si el mensaje es una oferta del administrador, actualizamos el campo offeredPrice en la consulta
    if (data.isOffer && data.offerAmount && isAdmin) {
      await prisma.inquiry.update({
        where: { id: inquiryId },
        data: {
          offeredPrice: parseFloat(data.offerAmount)
        }
      });
    }
    
    // Si el mensaje es una oferta del cliente, actualizamos el campo offeredPrice en la consulta
    else if (data.isOffer && data.offerAmount && !isAdmin) {
      await prisma.inquiry.update({
        where: { id: inquiryId },
        data: {
          offeredPrice: parseFloat(data.offerAmount)
        }
      });
    }

    return NextResponse.json({
      ...newMessage,
      isOffer: data.isOffer,
      offerAmount: data.offerAmount,
      offerStatus: data.offerStatus
    })
  } catch (error) {
    console.error('Error al crear mensaje:', error)
    return NextResponse.json({ error: 'Error al crear mensaje' }, { status: 500 })
  }
}
