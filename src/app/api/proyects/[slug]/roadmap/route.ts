import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'

// GET /api/proyects/[slug]/roadmap
export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params
  const proyect = await prisma.proyect.findUnique({
    where: { slug },
    include: { roadmap: true },
  })
  if (!proyect) return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 })
  if (!proyect.roadmap) return NextResponse.json({ error: 'Roadmap no encontrado' }, { status: 404 })
  return NextResponse.json(proyect.roadmap)
}

// PUT /api/proyects/[slug]/roadmap
export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params
  const body = await req.json()
  const proyect = await prisma.proyect.findUnique({ where: { slug } })
  console.log('project endpoint response', proyect)
  if (!proyect) return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 })

  // Si ya existe, actualiza. Si no, crea.
  const existing = await prisma.roadmap.findUnique({ where: { proyectId: proyect.id } })
  let roadmap
  console.log('existing', existing)
  if (existing) {
    roadmap = await prisma.roadmap.update({
      where: { proyectId: proyect.id },
      data: { tasks: body.tasks },
    })
  } else {
    roadmap = await prisma.roadmap.create({
      data: { proyectId: proyect.id, tasks: body.tasks },
    })
  }
  return NextResponse.json(roadmap)
} 