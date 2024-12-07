import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'

export async function GET(
  request: Request,
  { params }: { params: { countryId: string } }
) {
  const countryId = parseInt(params.countryId)

  if (isNaN(countryId)) {
    return NextResponse.json({ error: 'Invalid country ID' }, { status: 400 })
  }

  try {
    const states = await prisma.state.findMany({
      where: {
        countryId: countryId,
        status: true,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(states)
  } catch (error) {
    console.error('Error fetching states:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
