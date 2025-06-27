import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'

export async function GET(
  _: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const project = await prisma.proyect.findUnique({
      where: { slug: params.slug },
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
        projectUnits: true,
      },
    })

    if (!project) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const data = await request.json()
    const existingProyect = await prisma.proyect.findUnique({
      where: { slug: params.slug },
      include: {
        address: true,
        projectMedia: true,
        proyectDetails: true,
        proyectFound: true,
      },
    })

    if (!existingProyect) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 })
    }

    const updatedProyect = await prisma.proyect.update({
      where: { slug: params.slug },
      data: {
        title: data.title,
        slug: data.slug,
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
        estimatedDeadline: data.estimatedDeadline ? new Date(data.estimatedDeadline) : null,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        annualReturn: data.annualReturn,
        totalReturn: data.totalReturn,
        fundingGoal: data.fundingGoal,
        fundedAmount: data.fundedAmount,
        type: data.type,
        propertyType: data.propertyType,
        promotorName: data.promotorName,
        regulationCompliance: data.regulationCompliance,
        riskWarning: data.riskWarning,
        visible: data.visible ?? true,
      },
    })

    // DIRECCIÓN
    if (data.address) {
      const currentAddress = existingProyect.address?.[0]
      if (currentAddress) {
        await prisma.address.update({
          where: { id: currentAddress.id },
          data: {
            city: data.address.city,
            postalCode: data.address.postalCode,
            streetName: data.address.streetName,
            description: data.address.description,
            countryId: data.address.countryId,
            stateId: data.address.stateId,
          },
        })

        if (data.address.positions) {
          await prisma.positions.deleteMany({ where: { addressId: currentAddress.id } })
          await prisma.positions.createMany({
            data: data.address.positions.map((pos: any) => ({
              addressId: currentAddress.id,
              latitude: pos.latitude,
              longitude: pos.longitude,
            })),
          })
        }
      } else {
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
              create: data.address.positions,
            } : undefined,
          },
        })
      }
    }

    // MEDIA
    if (data.projectMedia) {
      await prisma.proyectMedia.deleteMany({ where: { proyectId: existingProyect.id } })
      for (const media of data.projectMedia) {
        await prisma.proyectMedia.create({
          data: {
            proyectId: existingProyect.id,
            link: media.link,
            type: media.type,
            title: media.title,
            description: media.description,
          },
        })
      }
    }

    // DETALLES
    if (data.proyectDetails) {
      if (existingProyect.proyectDetails) {
        await prisma.proyectDetails.update({
          where: { proyectId: existingProyect.id },
          data: data.proyectDetails,
        })
      } else {
        await prisma.proyectDetails.create({
          data: { proyectId: existingProyect.id, ...data.proyectDetails },
        })
      }
    }

    // FOUND
    if (data.proyectFound) {
      const pf = data.proyectFound
      const fields = {
        startInvestDate: pf.startInvestDate ? new Date(pf.startInvestDate) : null,
        endInvestDate: pf.endInvestDate ? new Date(pf.endInvestDate) : null,
        startPreFundingDate: pf.startPreFundingDate ? new Date(pf.startPreFundingDate) : null,
        endPreFundingDate: pf.endPreFundingDate ? new Date(pf.endPreFundingDate) : null,
        companyCapital: pf.companyCapital,
        quantityFunded: pf.quantityFunded,
        quantityToFund: pf.quantityToFund,
        maxOverfunding: pf.maxOverfunding,
        investors: pf.investors,
        fields: pf.fields,
        rentProfitability: pf.rentProfitability,
        totalNetProfitability: pf.totalNetProfitability,
        totalNetProfitabilityToShow: pf.totalNetProfitabilityToShow,
        apreciationProfitability: pf.apreciationProfitability,
      }

      if (existingProyect.proyectFound) {
        await prisma.proyectFound.update({
          where: { proyectId: existingProyect.id },
          data: fields,
        })
      } else {
        await prisma.proyectFound.create({
          data: { proyectId: existingProyect.id, ...fields },
        })
      }
    }

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
        projectUnits: true,
      },
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
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const existingProyect = await prisma.proyect.findUnique({
      where: { slug: params.slug },
    })

    if (!existingProyect) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 })
    }

    await prisma.proyect.delete({ where: { slug: params.slug } })

    return NextResponse.json({ success: true, message: 'Proyecto eliminado correctamente' })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Error al eliminar el proyecto', details: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    )
  }
}
