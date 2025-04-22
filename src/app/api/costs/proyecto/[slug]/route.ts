import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'

// Obtener todos los costos de un proyecto por slug
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

    // Obtener los costos del proyecto
    const costs = await prisma.proyectCost.findMany({
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
    const totalPesos = costs.reduce((sum, cost) => sum + Number(cost.importePesos), 0);
    const totalDolares = costs.reduce((sum, cost) => sum + Number(cost.importeDolar), 0);
    
    // Agrupar costos por rubro para estadísticas
    const costosPorRubro = costs.reduce((acc: Record<string, number>, cost) => {
      const rubro = cost.rubro;
      if (!acc[rubro]) {
        acc[rubro] = 0;
      }
      acc[rubro] += Number(cost.importeDolar);
      return acc;
    }, {});

    // Agrupar costos por mes para gráficos de evolución
    const costosPorMes = costs.reduce((acc: Record<string, number>, cost) => {
      const mes = cost.mes;
      if (!acc[mes]) {
        acc[mes] = 0;
      }
      acc[mes] += Number(cost.importeDolar);
      return acc;
    }, {});

    return NextResponse.json({
      costs,
      proyecto: {
        id: proyecto.id,
        title: proyecto.title,
        slug: proyecto.slug
      },
      metrics: {
        totalPesos,
        totalDolares,
        costosPorRubro,
        costosPorMes
      }
    })
  } catch (error) {
    console.error('Error al obtener los costos del proyecto:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}