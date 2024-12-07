// app/api/register/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import bcrypt from 'bcrypt'

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    // Validación básica
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'CUSTOMER',
        profile: {
          create: {
            countryId: 9, // Valor por defecto, ajusta según tus necesidades
            stateId: 129, // Valor por defecto, ajusta según tus necesidades
          },
        },
        activity: {
          create: {
            registerIp:
              req.headers.get('x-forwarded-for') ||
              req.headers.get('x-real-ip') ||
              'unknown',
            lastIp:
              req.headers.get('x-forwarded-for') ||
              req.headers.get('x-real-ip') ||
              'unknown',
            agent: req.headers.get('user-agent') || 'unknown',
          },
        },
      },
      include: {
        profile: true,
        activity: true,
      },
    })

    // Crear una entrada en la tabla Accounts para credenciales
    await prisma.account.create({
      data: {
        userId: user.id,
        type: 'credentials',
        provider: 'credentials',
        providerAccountId: user.id.toString(),
      },
    })

    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email },
    })
  } catch (error: any) {
    console.error('Error en el registro:', error)
    return NextResponse.json(
      { error: 'Error en el registro de usuario' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
