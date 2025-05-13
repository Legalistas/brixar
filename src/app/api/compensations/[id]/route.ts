import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'

// Obtener una compensación específica
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

    const compensationId = parseInt(params.id)
    if (isNaN(compensationId)) {
      return NextResponse.json(
        { error: 'ID de compensación inválido' },
        { status: 400 }
      )
    }

    const compensation = await prisma.proyectCompensation.findUnique({
      where: { id: compensationId },
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

    if (!compensation) {
      return NextResponse.json(
        { error: 'Compensación no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(compensation)
  } catch (error) {
    console.error('Error al obtener la compensación:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Actualizar una compensación existente
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

    const compensationId = parseInt(params.id)
    if (isNaN(compensationId)) {
      return NextResponse.json(
        { error: 'ID de compensación inválido' },
        { status: 400 }
      )
    }

    // Verificar si la compensación existe
    const existingCompensation = await prisma.proyectCompensation.findUnique({
      where: { id: compensationId }
    })

    if (!existingCompensation) {
      return NextResponse.json(
        { error: 'Compensación no encontrada' },
        { status: 404 }
      )
    }

    const data = await request.json()

    // Actualizar la compensación
    const updatedCompensation = await prisma.proyectCompensation.update({
      where: { id: compensationId },
      data: {
        fecha: data.fecha ? new Date(data.fecha) : undefined,
        mes: data.mes,
        detalle: data.detalle,
        importePesos: data.importePesos,
        precioDolarBlue: data.precioDolarBlue,
        importeDolar: data.importeDolar,
        inversorOrigen: data.inversorOrigen,
        inversorDestino: data.inversorDestino,
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

    return NextResponse.json(updatedCompensation)
  } catch (error) {
    console.error('Error al actualizar la compensación:', error)
    return NextResponse.json(
      { error: 'Error al actualizar la compensación', details: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    )
  }
}

// Eliminar una compensación
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

    const compensationId = parseInt(params.id)
    if (isNaN(compensationId)) {
      return NextResponse.json(
        { error: 'ID de compensación inválido' },
        { status: 400 }
      )
    }

    // Verificar si la compensación existe
    const existingCompensation = await prisma.proyectCompensation.findUnique({
      where: { id: compensationId }
    })

    if (!existingCompensation) {
      return NextResponse.json(
        { error: 'Compensación no encontrada' },
        { status: 404 }
      )
    }

    // Eliminar la compensación
    await prisma.proyectCompensation.delete({
      where: { id: compensationId }
    })

    return NextResponse.json({ success: true, message: 'Compensación eliminada correctamente' })
  } catch (error) {
    console.error('Error al eliminar la compensación:', error)
    return NextResponse.json(
      { error: 'Error al eliminar la compensación', details: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    )
  }
}
