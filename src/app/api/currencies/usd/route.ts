import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'

// Obtener la cotización actual del dólar
export async function GET() {
  try {
    // En Argentina, mostramos la cotización del peso argentino que refleja el valor del dólar
    const arsCurrency = await prisma.currency.findUnique({
      where: { code: 'ARS' },
      select: {
        rate: true,
        updatedAt: true,
        symbol: true
      }
    })

    if (!arsCurrency) {
      return NextResponse.json(
        { error: 'ARS currency not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      rate: arsCurrency.rate,
      symbol: '$',
      lastUpdated: arsCurrency.updatedAt
    })
  } catch (error) {
    console.error('Error fetching USD rate:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: (error as Error).message },
      { status: 500 }
    )
  }
}
