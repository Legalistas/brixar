import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import { Role, User } from '@prisma/client'

export async function GET() {
  try {
    const countries = await prisma.country.findMany({
      where: { status: true },
      select: {
        id: true,
        name: true,
        prefix: true,
        code: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(countries)
  } catch (error) {
    console.error('Error fetching countries:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
