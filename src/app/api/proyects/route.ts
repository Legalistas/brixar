import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'

export async function GET() {
  try {
    const proyects = await prisma.proyect.findMany({
      include: {
        address: {
          include: {
            state: true,
            country: true,
            positions: true,
          },
        },
        projectMedia: true,
        proyectDetails: true,
        proyectFound: true,
        promotor: true,
      },
    })
    return NextResponse.json(proyects)
  } catch (error) {
    console.error('Error fetching proyects:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
