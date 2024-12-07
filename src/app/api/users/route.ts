import { NextResponse } from 'next/server' // Conect to Prisma
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/libs/prisma'
import { Role } from '@prisma/client'

const userUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['ADMIN', 'CUSTOMER', 'EMPLOYEE']),
  password: z.string().optional(),
})

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: {
          in: [Role.ADMIN, Role.SELLER],
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })
    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.error()
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password, role } = body

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user with associated profile and activity
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        profile: {
          create: {
            countryId: 9,
            stateId: 149,
          },
        },
        activity: {
          create: {
            lastIp: request.headers.get('x-forwarded-for') || 'unknown',
            registerIp:
              request.headers.get('x-forwarded-for') ||
              request.headers.get('x-real-ip') ||
              'unknown',
            agent: request.headers.get('user-agent') || 'unknown',
          },
        },
      },
      include: {
        profile: true,
        activity: true,
      },
    })

    // Remove sensitive information before sending the response
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
