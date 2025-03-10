import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/libs/prisma'
import { authOptions } from '@/auth'

// GET mensajes de una consulta
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
    if (inquiry.userId !== session.user.id && session.user.role !== 'ADMIN') {
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

// POST nuevo mensaje en una consulta
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
    const { message } = await req.json()
    
    const inquiry = await prisma.inquiry.findUnique({
      where: { id: inquiryId },
    })

    if (!inquiry) {
      return NextResponse.json({ error: 'Consulta no encontrada' }, { status: 404 })
    }

    // Verificar que el usuario sea el propietario o un administrador
    if (inquiry.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Si la consulta estaba cerrada y llega un mensaje nuevo, la pasamos a en progreso
    if (inquiry.status === 'CLOSED' || inquiry.status === 'RESOLVED') {
      await prisma.inquiry.update({
        where: { id: inquiryId },
        data: { status: 'IN_PROGRESS' },
      })
    }

    // Crear mensaje
    const newMessage = await prisma.inquiryMessage.create({
      data: {
        inquiryId,
        userId: session.user.id,
        message,
        isAdmin: session.user.role === 'ADMIN',
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
      }
    })

    return NextResponse.json(newMessage)
  } catch (error) {
    console.error('Error al crear mensaje:', error)
    return NextResponse.json({ error: 'Error al crear mensaje' }, { status: 500 })
  }
}
