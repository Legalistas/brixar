import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/libs/prisma'
import { authOptions } from '@/auth'
import { Role } from '@prisma/client'

// Obtener cliente por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const customerId = parseInt(params.id)

  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar si el usuario es admin, vendedor o el propio cliente
    const user = await prisma.user.findUnique({
      where: { id: parseInt(session.user.id) },
    })

    if (
      !user ||
      (user.role !== Role.ADMIN &&
        user.role !== Role.SELLER &&
        user.id !== customerId)
    ) {
      return NextResponse.json(
        { error: 'No tiene permisos para ver este cliente' },
        { status: 403 }
      )
    }

    const customer = await prisma.user.findUnique({
      where: {
        id: customerId,
        role: Role.CUSTOMER,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    })

    if (!customer) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(customer)
  } catch (error) {
    console.error(`Error al obtener el cliente ${customerId}:`, error)
    return NextResponse.json(
      { error: 'Error al obtener el cliente' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// Actualizar cliente por ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const customerId = parseInt(params.id)

  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar si el usuario es admin o el propio cliente
    const user = await prisma.user.findUnique({
      where: { id: parseInt(session.user.id) },
    })

    if (!user || (user.role !== Role.ADMIN && user.id !== customerId)) {
      return NextResponse.json(
        { error: 'No tiene permisos para actualizar este cliente' },
        { status: 403 }
      )
    }

    const data = await request.json()

    // Actualizar el cliente
    const updatedCustomer = await prisma.user.update({
      where: {
        id: customerId,
        role: Role.CUSTOMER,
      },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    })

    return NextResponse.json(updatedCustomer)
  } catch (error) {
    console.error(`Error al actualizar el cliente ${customerId}:`, error)
    return NextResponse.json(
      { error: 'Error al actualizar el cliente' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// Eliminar cliente por ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const customerId = parseInt(params.id)

  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar si el usuario es admin
    const user = await prisma.user.findUnique({
      where: { id: parseInt(session.user.id) },
    })

    if (!user || user.role !== Role.ADMIN) {
      return NextResponse.json(
        { error: 'No tiene permisos para eliminar clientes' },
        { status: 403 }
      )
    }

    // Eliminar el cliente
    await prisma.user.delete({
      where: {
        id: customerId,
        role: Role.CUSTOMER,
      },
    })

    return NextResponse.json({ message: 'Cliente eliminado correctamente' })
  } catch (error) {
    console.error(`Error al eliminar el cliente ${customerId}:`, error)
    return NextResponse.json(
      { error: 'Error al eliminar el cliente' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
