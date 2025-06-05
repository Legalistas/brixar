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
    console.log('Iniciando actualización de tasas de cambio...');
    
    // Obtener el dólar blue desde la API argentina
    try {
      const response = await axios.get('https://dolarapi.com/v1/dolares/blue');
      const dollarData = response.data;
      
      console.log('Datos del dólar obtenidos:', dollarData);
      
      // Usar el precio de venta del dólar blue
      const dollarRate = dollarData.venta;
      
      // Actualizar el peso argentino con la cotización del dólar
      const updatedARS = await prisma.currency.update({
        where: { code: 'ARS' },
        data: { 
          rate: dollarRate,
          updatedAt: new Date()
        },
      });
      
      console.log(`Peso argentino actualizado con tasa: ${dollarRate}`);
      
    } catch (error) {
      console.error('Error obteniendo cotización del dólar:', error);
    }

    // Actualizar otras monedas si tienen apiUrl configurada
    const currencies = await prisma.currency.findMany({
      where: {
        apiUrl: { not: null },
        code: { not: 'ARS' } // Excluir ARS ya que lo actualizamos arriba
      }
    });

    const updatePromises = currencies.map(async (currency) => {
      if (currency.apiUrl) {
        try {
          const response = await axios.get(currency.apiUrl)
          const rate = response.data.rate || response.data.venta || 1
          return prisma.currency.update({
            where: { code: currency.code },
            data: { 
              rate,
              updatedAt: new Date()
            },
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
    console.log('Monedas actualizadas:', updatedCurrencies)
    
    return NextResponse.json(updatedCurrencies)
  } catch (error) {
    console.error('Error updating currency rates:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: (error as Error).message },
      { status: 500 }
    )
  }
}
