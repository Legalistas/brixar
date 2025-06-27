import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'

export async function GET(
  req: Request,
  { params }: { params: { slug: string; id: string } }
) {
  try {
    const unit = await prisma.projectUnit.findUnique({
      where: { id: parseInt(params.id) },
    })

    if (!unit) {
      return NextResponse.json({ error: 'Unidad no encontrada' }, { status: 404 })
    }

    return NextResponse.json(unit)
  } catch (error) {
    console.error('[UNIT_GET]', error)
    return NextResponse.json({ error: 'Error al obtener la unidad' }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { slug: string; id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const data = await req.json()

    const updated = await prisma.projectUnit.update({
      where: { id: parseInt(params.id) },
      data: {
        sku: data.sku,
        surface: data.surface,
        priceUsd: data.priceUsd,
        floor: data.floor,
        rooms: data.rooms,
        bathrooms: data.bathrooms,
        parking: data.parking ?? false,
        status: data.status,
        type: data.type,
        description: data.description,
        features: data.features,
        unitNumber: data.unitNumber,
        availabilityDate: data.availabilityDate ? new Date(data.availabilityDate) : undefined,
        isPublished: data.isPublished ?? true,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('[UNIT_PUT]', error)
    return NextResponse.json({ error: 'Error al actualizar unidad', details: error instanceof Error ? error.message : 'Error desconocido' }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { slug: string; id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const unit = await prisma.projectUnit.findUnique({
      where: { id: parseInt(params.id) },
    })

    if (!unit) {
      return NextResponse.json({ error: 'Unidad no encontrada' }, { status: 404 })
    }

    await prisma.projectUnit.delete({
      where: { id: unit.id },
    })

    return NextResponse.json({ success: true, message: 'Unidad eliminada correctamente' })
  } catch (error) {
    console.error('[UNIT_DELETE]', error)
    return NextResponse.json({ error: 'Error al eliminar unidad', details: error instanceof Error ? error.message : 'Error desconocido' }, { status: 500 })
  }
}
