import { NextResponse } from "next/server"
import { prisma } from "@/libs/prisma"
import { authOptions } from "@/auth"
import { getServerSession } from "next-auth"

// GET consultas del usuario actual
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const inquiries = await prisma.inquiry.findMany({
      where: { userId: parseInt(session?.user.id) },
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
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(inquiries)
  } catch (error) {
    console.error('Error al obtener consultas del usuario:', error)
    return NextResponse.json({ error: 'Error al obtener consultas' }, { status: 500 })
  }
}
