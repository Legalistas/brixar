import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'

export async function GET() {
  try {
    const proyects = await prisma.proyect.findMany({
      include: {
        address: {
          include: {
            state: true,
            country: true,
            positions: true,
          },
        },
        projectMedia: true,
        proyectDetails: true,
        proyectFound: true,
        promotor: true,
      },
    })
    return NextResponse.json(proyects)
  } catch (error) {
    console.error('Error fetching proyects:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    // Verificar autenticación y rol de administrador
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado. Se requiere rol de administrador' },
        { status: 401 }
      )
    }

    const data = await request.json()
    
    // Crear el proyecto con datos relacionados
    const newProyect = await prisma.proyect.create({
      data: {
        slug: data.slug,
        title: data.title,
        openingLine: data.openingLine,
        description: data.description,
        promotorId: data.promotorId,
        openingPhase: data.openingPhase,
        phase: data.phase,
        businessModel: data.businessModel,
        fundedDate: data.fundedDate ? new Date(data.fundedDate) : null,
        details: data.details,
        timeline: data.timeline,
        daysToEnd: data.daysToEnd,
        daysToStart: data.daysToStart,
        priority: data.priority,
        
        // Crear dirección si se proporciona
        address: data.address ? {
          create: {
            city: data.address.city,
            postalCode: data.address.postalCode,
            streetName: data.address.streetName,
            description: data.address.description,
            countryId: data.address.countryId,
            stateId: data.address.stateId,
            positions: data.address.positions ? {
              create: data.address.positions
            } : undefined
          }
        } : undefined,
        
        // Crear medios del proyecto si se proporciona
        projectMedia: data.projectMedia ? {
          create: data.projectMedia
        } : undefined,
        
        // Crear detalles del proyecto si se proporciona
        proyectDetails: data.proyectDetails ? {
          create: {
            type: data.proyectDetails.type,
            investmentPeriod: data.proyectDetails.investmentPeriod,
            surface: data.proyectDetails.surface,
            rooms: data.proyectDetails.rooms,
            floors: data.proyectDetails.floors,
            features: data.proyectDetails.features,
            buildingYear: data.proyectDetails.buildingYear,
            riskScore: data.proyectDetails.riskScore,
            profitabilityScore: data.proyectDetails.profitabilityScore,
          }
        } : undefined,
        
        // Crear información de financiación si se proporciona
        proyectFound: data.proyectFound ? {
          create: {
            startInvestDate: data.proyectFound.startInvestDate ? new Date(data.proyectFound.startInvestDate) : null,
            endInvestDate: data.proyectFound.endInvestDate ? new Date(data.proyectFound.endInvestDate) : null,
            startPreFundingDate: data.proyectFound.startPreFundingDate ? new Date(data.proyectFound.startPreFundingDate) : null,
            endPreFundingDate: data.proyectFound.endPreFundingDate ? new Date(data.proyectFound.endPreFundingDate) : null,
            companyCapital: data.proyectFound.companyCapital,
            quantityFunded: data.proyectFound.quantityFunded,
            quantityToFund: data.proyectFound.quantityToFund,
            maxOverfunding: data.proyectFound.maxOverfunding,
            investors: data.proyectFound.investors,
            fields: data.proyectFound.fields,
            rentProfitability: data.proyectFound.rentProfitability,
            totalNetProfitability: data.proyectFound.totalNetProfitability,
            totalNetProfitabilityToShow: data.proyectFound.totalNetProfitabilityToShow,
            apreciationProfitability: data.proyectFound.apreciationProfitability,
          }
        } : undefined,
      },
      include: {
        address: {
          include: {
            state: true,
            country: true,
            positions: true,
          },
        },
        projectMedia: true,
        proyectDetails: true,
        proyectFound: true,
        promotor: true,
      },
    })

    return NextResponse.json(newProyect, { status: 201 })
  } catch (error) {
    console.error('Error creating proyect:', error)
    return NextResponse.json(
      { error: 'Error al crear el proyecto', details: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    )
  }
}
