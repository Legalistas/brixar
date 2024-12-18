import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params

  if (!id) {
    return NextResponse.json(
      { error: 'Missing user ID in the URL' },
      { status: 400 }
    )
  }

  const userId = parseInt(id, 10)

  if (isNaN(userId)) {
    return NextResponse.json(
      { error: 'Invalid user ID provided' },
      { status: 400 }
    )
  }

  try {
    const existingVisit = await prisma.visit.findMany({
      where: {
        userId: userId,
      },
      include: {
        property: {
          include: {
            images: true,
            address: { include: { state: true, country: true } },
          },
        },
      },
    })

    if (!existingVisit) {
      return NextResponse.json(
        { message: 'No visit found for this user' },
        { status: 404 }
      )
    }

    return NextResponse.json({ existingVisit })
  } catch (error) {
    console.error('Error checking existing visit:', error)

    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Error checking existing visit: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
