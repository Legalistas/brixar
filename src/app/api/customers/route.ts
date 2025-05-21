import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/libs/prisma'
import { authOptions } from '@/auth';
import { Role } from '@prisma/client';

// Obtener todos los clientes (usuarios con rol CUSTOMER)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Verificar si el usuario es admin o vendedor
    const user = await prisma.user.findUnique({
      where: { id: parseInt(session.user.id) },
    });

    if (!user || (user.role !== Role.ADMIN && user.role !== Role.SELLER)) {
      return NextResponse.json(
        { error: 'No tiene permisos para ver los clientes' },
        { status: 403 }
      );
    }

    const customers = await prisma.user.findMany({
      where: {
        role: Role.CUSTOMER
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      }
    });

    return NextResponse.json(customers);
  } catch (error) {
    console.error('Error al obtener los clientes:', error);
    return NextResponse.json(
      { error: 'Error al obtener los clientes' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Crear un nuevo cliente
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Verificar si el usuario es admin
    const user = await prisma.user.findUnique({
      where: { id: parseInt(session.user.id) },
    });

    if (!user || user.role !== Role.ADMIN) {
      return NextResponse.json(
        { error: 'No tiene permisos para crear clientes' },
        { status: 403 }
      );
    }

    const data = await request.json();
    
    // Crear el nuevo cliente con rol CUSTOMER
    const newCustomer = await prisma.user.create({
      data: {
        ...data,
        role: Role.CUSTOMER
      }
    });

    return NextResponse.json(newCustomer);
  } catch (error) {
    console.error('Error al crear el cliente:', error);
    return NextResponse.json(
      { error: 'Error al crear el cliente' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
