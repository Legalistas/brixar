import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'

export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      include: {
        images: true,
        address: {
          include: {
            state: true,
            country: true,
            positions: true,
          },
        },
      },
    })

    return NextResponse.json(properties)
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching properties' },
      { status: 500 }
    )
  }
}