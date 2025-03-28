import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/libs/prisma'
import { authOptions } from '@/auth'

// GET todas las consultas (protegido para admin)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const inquiries = await prisma.inquiry.findMany({
      include: {
        property: {
          select: {
            id: true,
            slug: true,
            title: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(inquiries)
  } catch (error) {
    console.error('Error al obtener consultas:', error)
    return NextResponse.json({ error: 'Error al obtener consultas' }, { status: 500 })
  }
}

// POST crear nueva consulta
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    console.log('Session data:', session);

    const data = await req.json()
    const { propertyId, title, message, offeredPrice } = data

    // Verificar si la propiedad existe
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    })

    if (!property) {
      return NextResponse.json({ error: 'Propiedad no encontrada' }, { status: 404 })
    }

    // Verificar si el usuario existe
    const userId = typeof session.user.id === 'string' ? parseInt(session.user.id, 10) : session.user.id;
    
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'ID de usuario inválido' }, { status: 400 });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Crear la consulta
    const inquiry = await prisma.inquiry.create({
      data: {
        title,
        propertyId,
        userId: userId,
        offeredPrice: offeredPrice ? parseFloat(offeredPrice.toString()) : undefined,
      },
    })

    // Crear el primer mensaje
    if (message) {
      await prisma.inquiryMessage.create({
        data: {
          inquiryId: inquiry.id,
          userId: userId,
          message,
          isAdmin: session.user.role === 'ADMIN',
        },
      })
    }

    return NextResponse.json(inquiry)
  } catch (error) {
    console.error('Error al crear consulta:', error)
    return NextResponse.json({ error: 'Error al crear consulta' }, { status: 500 })
  }
}
