import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'

// Función auxiliar para crear fechas sin conversión de zona horaria
function createLocalDate(dateString: string): Date {
  // Si la fecha viene en formato YYYY-MM-DD, la parseamos como fecha local
  if (typeof dateString === 'string' && dateString.includes('-')) {
    const [year, month, day] = dateString.split('-').map(Number)
    return new Date(year, month - 1, day) // month - 1 porque Date usa índices basados en 0
  }
  // Si viene en otro formato, usar el constructor normal
  return new Date(dateString)
}

// Obtener todos los costos (se pueden filtrar por proyecto)
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
    
    const costs = await prisma.proyectCost.findMany({
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

    return NextResponse.json(costs)
  } catch (error) {
    console.error('Error al obtener los costos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Añadir un nuevo costo
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
    if (!data.proyectId || !data.fecha || !data.rubro || !data.proveedor || !data.importePesos || !data.precioDolarBlue || !data.importeDolar) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
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
    }    // Crear el nuevo costo
    const newCost = await prisma.proyectCost.create({
      data: {
        proyectId: data.proyectId,
        fecha: createLocalDate(data.fecha),
        mes: data.mes,
        rubro: data.rubro,
        proveedor: data.proveedor,
        detalle: data.detalle,
        importePesos: data.importePesos,
        precioDolarBlue: data.precioDolarBlue,
        importeDolar: data.importeDolar,
        inversor: data.inversor,
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

    return NextResponse.json(newCost, { status: 201 })
  } catch (error) {
    console.error('Error al crear el costo:', error)
    return NextResponse.json(
      { error: 'Error al crear el costo', details: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    )
  }
}