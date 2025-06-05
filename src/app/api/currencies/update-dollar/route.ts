import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import axios from 'axios'

// Actualizar específicamente el dólar blue argentino
export async function POST() {
  try {
    console.log('Actualizando cotización del dólar blue...');
    
    // Obtener la cotización actual del dólar blue
    const response = await axios.get('https://dolarapi.com/v1/dolares/blue');
    const dollarData = response.data;
    
    console.log('Datos del dólar:', dollarData);
    
    // Usar el precio de venta del dólar blue
    const dollarRate = dollarData.venta;
    
    // Actualizar el peso argentino con la nueva cotización
    const updatedCurrency = await prisma.currency.update({
      where: { code: 'ARS' },
      data: { 
        rate: dollarRate,
        updatedAt: new Date()
      },
    });
    
    console.log(`Cotización actualizada: $${dollarRate}`);
    
    return NextResponse.json({
      success: true,
      rate: dollarRate,
      currency: 'ARS',
      source: 'DolarAPI Blue',
      lastUpdated: updatedCurrency.updatedAt
    });
    
  } catch (error) {
    console.error('Error actualizando cotización del dólar:', error);
    return NextResponse.json(
      { 
        error: 'Error actualizando cotización', 
        details: (error as Error).message 
      },
      { status: 500 }
    );
  }
}
