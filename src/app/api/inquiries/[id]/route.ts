import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/libs/prisma'
import { authOptions } from '@/auth'

// GET consulta específica
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
      include: {
        property: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        messages: {
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
        },
      },
    })

    if (!inquiry) {
      return NextResponse.json({ error: 'Consulta no encontrada' }, { status: 404 })
    }

    // Verificar que el usuario sea el propietario o un administrador
    if (inquiry.userId !== parseInt(session.user.id) && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    return NextResponse.json(inquiry)
  } catch (error) {
    console.error('Error al obtener consulta:', error)
    return NextResponse.json({ error: 'Error al obtener consulta' }, { status: 500 })
  }
}

// PUT actualizar consulta
export async function PUT(
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

    // Solo admin puede actualizar status y negotiatedPrice
    if (session.user.role === 'ADMIN') {
      const updatedInquiry = await prisma.inquiry.update({
        where: { id: inquiryId },
        data: {
          status: data.status || undefined,
          negotiatedPrice: data.negotiatedPrice ? parseFloat(data.negotiatedPrice) : undefined,
        },
      })
      return NextResponse.json(updatedInquiry)
    } 
    // Usuario solo puede actualizar offeredPrice
    else if (inquiry.userId === parseInt(session.user.id)) {
      const updatedInquiry = await prisma.inquiry.update({
        where: { id: inquiryId },
        data: {
          offeredPrice: data.offeredPrice ? parseFloat(data.offeredPrice) : undefined,
        },
      })
      return NextResponse.json(updatedInquiry)
    } else {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
  } catch (error) {
    console.error('Error al actualizar consulta:', error)
    return NextResponse.json({ error: 'Error al actualizar consulta' }, { status: 500 })
  }
}

// DELETE eliminar consulta (solo admin)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const inquiryId = parseInt(params.id)
    
    await prisma.inquiryMessage.deleteMany({
      where: { inquiryId },
    })

    await prisma.inquiry.delete({
      where: { id: inquiryId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error al eliminar consulta:', error)
    return NextResponse.json({ error: 'Error al eliminar consulta' }, { status: 500 })
  }
}
