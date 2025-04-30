import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configuración de Cloudinary con las variables de entorno
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: Request) {
  try {
    // Verificar si la solicitud es multipart/form-data
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file || typeof file === 'string') {
      return NextResponse.json(
        { error: 'No se ha proporcionado ningún archivo' },
        { status: 400 }
      )
    }

    // Convertir el archivo a un buffer para subirlo a Cloudinary
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Crear una promesa para la carga a Cloudinary
    const uploadPromise = new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: 'auto', // Detecta automáticamente el tipo de archivo
          },
          (error, result) => {
            if (error) {
              reject(error)
              return
            }
            resolve(result)
          }
        )
        .end(buffer)
    })

    // Esperar a que se complete la carga
    const result = (await uploadPromise) as any

    // Devolver la URL y otros datos relevantes
    return NextResponse.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
    })
  } catch (error) {
    console.error('Error al subir archivo a Cloudinary:', error)
    return NextResponse.json(
      {
        error: 'Error al procesar la carga del archivo',
        details: (error as Error).message,
      },
      { status: 500 }
    )
  }
}
