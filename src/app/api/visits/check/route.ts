import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const propertyId = searchParams.get('propertyId')
  const userId = searchParams.get('userId')

  if (!propertyId || !userId) {
    return NextResponse.json(
      { error: 'Missing propertyId or userId' },
      { status: 400 }
    )
  }

  try {
    const existingVisit = await prisma.visit.findFirst({
      where: {
        propertyId: parseInt(propertyId),
        userId: parseInt(userId),
        visitDate: {
          gte: new Date(),
        },
      },
    })

    return NextResponse.json({
      hasExistingVisit: !!existingVisit,
      visitDate: existingVisit?.visitDate,
    })
  } catch (error) {
    console.error('Error checking existing visit:', error)
    return NextResponse.json(
      { error: 'Error checking existing visit' },
      { status: 500 }
    )
  }
}
