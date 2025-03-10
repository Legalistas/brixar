import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/libs/prisma'
import { authOptions } from '@/auth'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const inquiries = await prisma.inquiry.findMany({
      where: {
        userId: Number(session.user.id),
      },
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
        _count: {
          select: {
            messages: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return NextResponse.json(inquiries)
  } catch (error) {
    console.error('Error al obtener consultas del usuario:', error)
    return NextResponse.json({ error: 'Error al obtener consultas' }, { status: 500 })
  }
}
