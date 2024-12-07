import { NextResponse } from 'next/server'
import axios from 'axios'
import { prisma } from '@/libs/prisma'

export async function GET() {
  console.log('GET request received for /api/currencies')
  try {
    console.log('Attempting to fetch currencies from database')
    const currencies = await prisma.currency.findMany()
    console.log('Currencies fetched successfully:', currencies)
    return NextResponse.json(currencies)
  } catch (error) {
    console.error('Error fetching currencies:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { code, rate } = await request.json()
    const updatedCurrency = await prisma.currency.update({
      where: { code },
      data: { rate },
    })
    return NextResponse.json(updatedCurrency)
  } catch (error) {
    console.error('Error updating currency rate:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function PUT() {
  try {
    const currencies = await prisma.currency.findMany()

    const updatePromises = currencies.map(async (currency) => {
      if (currency.apiUrl) {
        try {
          const response = await axios.get(currency.apiUrl)
          const rate = response.data.rate // Adjust this based on your API response structure
          return prisma.currency.update({
            where: { code: currency.code },
            data: { rate },
          })
        } catch (error) {
          console.error(`Error updating rate for ${currency.code}:`, error)
          return null
        }
      }
      return null
    })

    await Promise.all(updatePromises)

    const updatedCurrencies = await prisma.currency.findMany()
    return NextResponse.json(updatedCurrencies)
  } catch (error) {
    console.error('Error updating currency rates:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: (error as Error).message },
      { status: 500 }
    )
  }
}
