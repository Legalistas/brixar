import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'

// Obtener todas las compensaciones (se pueden filtrar por proyecto)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const proyectId = searchParams.get('proyectId')
    
    // Verificar autenticación
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado. Se requiere iniciar sesión' },
        { status: 401 }
      )
    }

    // Filtrar por proyecto si se especifica
    const whereClause = proyectId ? { proyectId: parseInt(proyectId) } : {}
    
    const compensations = await prisma.proyectCompensation.findMany({
      where: whereClause,
      include: {
        proyect: {
          select: {
            title: true,
            slug: true,
          }
        },
        usuario: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
      orderBy: {
        fecha: 'desc'
      }
    })

    return NextResponse.json(compensations)
  } catch (error) {
    console.error('Error al obtener las compensaciones:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Añadir una nueva compensación
export async function POST(request: Request) {
  try {
    // Verificar autenticación y rol de administrador
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'BUILDERS')) {
      return NextResponse.json(
        { error: 'No autorizado. Se requiere rol de administrador o constructor' },
        { status: 401 }
      )
    }

    const data = await request.json()
    
    // Validar datos requeridos
    if (!data.proyectId || !data.fecha || !data.importePesos || !data.precioDolarBlue || !data.importeDolar || !data.inversorOrigen || !data.inversorDestino) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos para la compensación' },
        { status: 400 }
      )
    }

    // Verificar que el proyecto exista
    const proyect = await prisma.proyect.findUnique({
      where: { id: data.proyectId }
    })
    
    if (!proyect) {
      return NextResponse.json(
        { error: 'El proyecto especificado no existe' },
        { status: 404 }
      )
    }

    // Crear la nueva compensación
    const newCompensation = await prisma.proyectCompensation.create({
      data: {
        proyectId: data.proyectId,
        fecha: new Date(data.fecha),
        mes: data.mes,
        detalle: data.detalle,
        importePesos: data.importePesos,
        precioDolarBlue: data.precioDolarBlue,
        importeDolar: data.importeDolar,
        inversorOrigen: data.inversorOrigen,
        inversorDestino: data.inversorDestino,
        usuarioId: parseInt(session.user.id, 10)
      },
      include: {
        proyect: {
          select: {
            title: true,
            slug: true,
          }
        },
        usuario: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })

    return NextResponse.json(newCompensation, { status: 201 })
  } catch (error) {
    console.error('Error al crear la compensación:', error)
    return NextResponse.json(
      { error: 'Error al crear la compensación', details: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    )
  }
}
