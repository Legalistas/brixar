import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const project = await prisma.proyect.findUnique({
      where: {
        slug: params.slug,
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

    if (!project) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
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
    
    // Verificar si el proyecto existe
    const existingProyect = await prisma.proyect.findUnique({
      where: { slug: params.slug },
      include: {
        address: true,
        projectMedia: true,
        proyectDetails: true,
        proyectFound: true,
      }
    })
    
    if (!existingProyect) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      )
    }

    // Actualizar la información básica del proyecto
    const updatedProyect = await prisma.proyect.update({
      where: { slug: params.slug },
      data: {
        title: data.title,
        slug: data.slug, // Permitir actualizar el slug
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

    // Si hay datos de dirección para actualizar
    if (data.address) {
      // Si el proyecto ya tiene una dirección, actualizarla
      if (existingProyect.address && existingProyect.address.length > 0) {
        await prisma.address.update({
          where: { id: existingProyect.address[0].id },
          data: {
            city: data.address.city,
            postalCode: data.address.postalCode,
            streetName: data.address.streetName,
            description: data.address.description,
            countryId: data.address.countryId,
            stateId: data.address.stateId,
          }
        })

        // Gestionar posiciones si existen
        if (data.address.positions) {
          // Eliminar posiciones existentes
          await prisma.positions.deleteMany({
            where: { addressId: existingProyect.address[0].id }
          })

          // Crear nuevas posiciones
          for (const position of data.address.positions) {
            await prisma.positions.create({
              data: {
                addressId: existingProyect.address[0].id,
                longitude: position.longitude,
                latitude: position.latitude,
              }
            })
          }
        }
      } else {
        // Si no tiene dirección, crear una nueva
        await prisma.address.create({
          data: {
            proyectId: existingProyect.id,
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
        })
      }
    }

    // Actualizar medios del proyecto si se proporcionan
    if (data.projectMedia) {
      // Eliminar medios existentes
      await prisma.proyectMedia.deleteMany({
        where: { proyectId: existingProyect.id }
      })

      // Crear nuevos medios
      for (const media of data.projectMedia) {
        await prisma.proyectMedia.create({
          data: {
            proyectId: existingProyect.id,
            link: media.link,
            type: media.type,
            title: media.title,
            description: media.description,
          }
        })
      }
    }

    // Actualizar detalles del proyecto si se proporcionan
    if (data.proyectDetails) {
      if (existingProyect.proyectDetails) {
        await prisma.proyectDetails.update({
          where: { proyectId: existingProyect.id },
          data: {
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
        })
      } else {
        await prisma.proyectDetails.create({
          data: {
            proyectId: existingProyect.id,
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
        })
      }
    }

    // Actualizar información de financiación si se proporciona
    if (data.proyectFound) {
      if (existingProyect.proyectFound) {
        await prisma.proyectFound.update({
          where: { proyectId: existingProyect.id },
          data: {
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
        })
      } else {
        await prisma.proyectFound.create({
          data: {
            proyectId: existingProyect.id,
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
        })
      }
    }

    // Cargar el proyecto actualizado con todas las relaciones para devolverlo
    const finalProyect = await prisma.proyect.findUnique({
      where: { slug: data.slug || params.slug },
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
      }
    })

    return NextResponse.json(finalProyect)
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Error al actualizar el proyecto', details: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // Verificar autenticación y rol de administrador
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado. Se requiere rol de administrador' },
        { status: 401 }
      )
    }

    // Verificar si el proyecto existe
    const existingProyect = await prisma.proyect.findUnique({
      where: { slug: params.slug }
    })
    
    if (!existingProyect) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      )
    }

    // Eliminar el proyecto (las relaciones se eliminarán en cascada según el esquema)
    await prisma.proyect.delete({
      where: { slug: params.slug }
    })

    return NextResponse.json({ success: true, message: 'Proyecto eliminado correctamente' })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Error al eliminar el proyecto', details: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    )
  }
}