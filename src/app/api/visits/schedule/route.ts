import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'

export async function POST(request: Request) {
  try {
    const { propertySlug, visitDate, userId } = await request.json()

    const property = await prisma.property.findUnique({
      where: { slug: propertySlug },
    })

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const visit = await prisma.visit.create({
      data: {
        propertyId: property.id,
        userId: parseInt(userId),
        visitDate: new Date(visitDate),
      },
    })

    return NextResponse.json(visit)
  } catch (error) {
    console.error('Error scheduling visit:', error)
    return NextResponse.json(
      { error: 'Error scheduling visit' },
      { status: 500 }
    )
  }
}
