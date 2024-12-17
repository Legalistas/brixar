import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const property = await prisma.property.findUnique({
      where: {
        slug: params.slug,
      },
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

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    return NextResponse.json(property)
  } catch (error) {
    console.error('Error fetching property:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching the property' },
      { status: 500 }
    )
  }
}
