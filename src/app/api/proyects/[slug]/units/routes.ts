import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const proyect = await prisma.proyect.findUnique({
      where: { slug: params.slug },
      select: { id: true },
    })

    if (!proyect) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 })
    }

    const units = await prisma.projectUnit.findMany({
      where: { proyectId: proyect.id },
    })

    return NextResponse.json(units)
  } catch (error) {
    console.error('[UNITS_GET]', error)
    return NextResponse.json({ error: 'Error al obtener las unidades' }, { status: 500 })
  }
}

export async function POST(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const proyect = await prisma.proyect.findUnique({
      where: { slug: params.slug },
      select: { id: true },
    })

    if (!proyect) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 })
    }

    const body = await req.json()

    const unit = await prisma.projectUnit.create({
      data: {
        proyectId: proyect.id,
        sku: body.sku,
        surface: body.surface,
        priceUsd: body.priceUsd,
        floor: body.floor,
        rooms: body.rooms,
        bathrooms: body.bathrooms,
        parking: body.parking ?? false,
        status: body.status,
        type: body.type,
        description: body.description,
        features: body.features,
        unitNumber: body.unitNumber,
        availabilityDate: body.availabilityDate ? new Date(body.availabilityDate) : undefined,
        isPublished: body.isPublished ?? true,
      },
    })

    return NextResponse.json(unit, { status: 201 })
  } catch (error) {
    console.error('[UNITS_POST]', error)
    return NextResponse.json({ error: 'Error al crear unidad', details: error instanceof Error ? error.message : 'Error desconocido' }, { status: 500 })
  }
}
