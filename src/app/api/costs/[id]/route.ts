import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'

// Obtener un costo específico
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado. Se requiere iniciar sesión' },
        { status: 401 }
      )
    }

    const costId = parseInt(params.id)
    if (isNaN(costId)) {
      return NextResponse.json(
        { error: 'ID de costo inválido' },
        { status: 400 }
      )
    }

    const cost = await prisma.proyectCost.findUnique({
      where: { id: costId },
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

    if (!cost) {
      return NextResponse.json(
        { error: 'Costo no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(cost)
  } catch (error) {
    console.error('Error al obtener el costo:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Actualizar un costo existente
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticación y rol
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'BUILDERS')) {
      return NextResponse.json(
        { error: 'No autorizado. Se requiere rol de administrador o constructor' },
        { status: 401 }
      )
    }

    const costId = parseInt(params.id)
    if (isNaN(costId)) {
      return NextResponse.json(
        { error: 'ID de costo inválido' },
        { status: 400 }
      )
    }

    // Verificar si el costo existe
    const existingCost = await prisma.proyectCost.findUnique({
      where: { id: costId }
    })

    if (!existingCost) {
      return NextResponse.json(
        { error: 'Costo no encontrado' },
        { status: 404 }
      )
    }

    const data = await request.json()

    // Actualizar el costo
    const updatedCost = await prisma.proyectCost.update({
      where: { id: costId },
      data: {
        fecha: data.fecha ? new Date(data.fecha) : undefined,
        mes: data.mes,
        rubro: data.rubro,
        proveedor: data.proveedor,
        detalle: data.detalle,
        importePesos: data.importePesos,
        precioDolarBlue: data.precioDolarBlue,
        importeDolar: data.importeDolar,
        inversor: data.inversor,
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

    return NextResponse.json(updatedCost)
  } catch (error) {
    console.error('Error al actualizar el costo:', error)
    return NextResponse.json(
      { error: 'Error al actualizar el costo', details: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    )
  }
}

// Eliminar un costo
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticación y rol
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado. Se requiere rol de administrador' },
        { status: 401 }
      )
    }

    const costId = parseInt(params.id)
    if (isNaN(costId)) {
      return NextResponse.json(
        { error: 'ID de costo inválido' },
        { status: 400 }
      )
    }

    // Verificar si el costo existe
    const existingCost = await prisma.proyectCost.findUnique({
      where: { id: costId }
    })

    if (!existingCost) {
      return NextResponse.json(
        { error: 'Costo no encontrado' },
        { status: 404 }
      )
    }

    // Eliminar el costo
    await prisma.proyectCost.delete({
      where: { id: costId }
    })

    return NextResponse.json({ success: true, message: 'Costo eliminado correctamente' })
  } catch (error) {
    console.error('Error al eliminar el costo:', error)
    return NextResponse.json(
      { error: 'Error al eliminar el costo', details: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    )
  }
}