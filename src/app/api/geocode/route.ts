import { NextResponse } from 'next/server';

// Reemplaza esto con tu clave real de API de Google Maps
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json(
        { error: 'La dirección es obligatoria' },
        { status: 400 }
      );
    }

    if (!GOOGLE_MAPS_API_KEY) {
      console.error('No se ha configurado la clave de la API de Google Maps');
      return NextResponse.json(
        { error: 'Error de configuración del servidor' },
        { status: 500 }
      );
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results && data.results.length > 0) {
      return NextResponse.json({
        success: true,
        results: data.results
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'No se encontraron resultados para la dirección proporcionada',
        status: data.status
      });
    }
  } catch (error) {
    console.error('Error al geocodificar:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud de geocodificación' },
      { status: 500 }
    );
  }
}