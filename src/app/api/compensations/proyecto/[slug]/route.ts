import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'

// Obtener todas las compensaciones de un proyecto por slug
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
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

    // Buscar el proyecto por slug
    const proyecto = await prisma.proyect.findUnique({
      where: { slug: params.slug }
    })

    if (!proyecto) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      )
    }

    // Obtener las compensaciones del proyecto
    const compensations = await prisma.proyectCompensation.findMany({
      where: { proyectId: proyecto.id },
      include: {
        usuario: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
      },
      orderBy: {
        fecha: 'desc'
      }
    })

    // Calcular totales para métricas
    const totalPesos = compensations.reduce((sum, comp) => sum + Number(comp.importePesos), 0);
    const totalDolares = compensations.reduce((sum, comp) => sum + Number(comp.importeDolar), 0);
    
    // Agrupar compensaciones por mes para gráficos de evolución
    const compensacionesPorMes = compensations.reduce((acc: Record<string, number>, comp) => {
      const mes = comp.mes;
      if (!acc[mes]) {
        acc[mes] = 0;
      }
      acc[mes] += Number(comp.importeDolar);
      return acc;
    }, {});

    return NextResponse.json({
      compensations,
      proyecto: {
        id: proyecto.id,
        title: proyecto.title,
        slug: proyecto.slug
      },
      metrics: {
        totalPesos,
        totalDolares,
        compensacionesPorMes
      }
    })
  } catch (error) {
    console.error('Error al obtener las compensaciones del proyecto:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
