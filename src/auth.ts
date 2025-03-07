import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import bcrypt from 'bcrypt'
import { getSession } from 'next-auth/react'
import { prisma } from '@/libs/prisma'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      image: string
      role: string
    }
    accessToken?: string
  }

  interface User {
    id: string
    name: string
    email: string
    image: string
    role: string
  }

  interface Profile {
    userId: string
    picture: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
  }
}

export const authOptions: NextAuthOptions = {
  debug: true,
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
          include: {
            profile: true,
          },
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id.toString(),
          name: user.name || '',
          email: user.email,
          image: user.profile?.avatar || '',
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }): Promise<boolean> {
      try {
        console.log('User data from Google:', profile)
        if (account?.provider === 'google' && profile) {
          const existingUser = await prisma.user.findUnique({
            where: { email: profile.email },
            include: {
              accounts: true,
              profile: true,
              activity: true,
            },
          })

          if (!existingUser) {
            // Si el usuario no existe, crear nuevo usuario con rol CUSTOMER
            const newUser = await prisma.user.create({
              data: {
                name: profile.name || '',
                email: profile.email || '',
                emailVerified: new Date(),
                role: 'CUSTOMER',
                accounts: {
                  create: {
                    type: account.type,
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                    access_token: account.access_token,
                    expires_at: account.expires_at,
                    token_type: account.token_type,
                    scope: account.scope,
                    id_token: account.id_token,
                  },
                },
                profile: {
                  create: {
                    countryId: 9,
                    stateId: 129,
                    avatar: profile.picture || '',
                  },
                },
                activity: {
                  create: {
                    registerIp: 'unknown',
                    lastIp: 'unknown',
                    agent: 'Google Auth',
                  },
                },
              },
            })
            user.id = newUser.id.toString()
            user.role = newUser.role
          } else {
            // Si el usuario ya existe, actualizar su información
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                name: profile.name || existingUser.name,
                image: profile.picture || existingUser.image,
              },
            })
            user.id = existingUser.id.toString()
            user.role = existingUser.role
          }
        }
        return true
      } catch (error) {
        console.error('Error during sign in:', error)
        return false
      }
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.accessToken = token.accessToken as string
      }

      const userProfile = await prisma.userProfile.findUnique({
        where: { userId: Number(session.user.id) },
      })

      session.user.image = (userProfile?.avatar as string) || ''
      return session
    },
    async redirect({ url, baseUrl }) {
      // Obtener la sesión actual
      const session = await prisma.session.findFirst({
        where: { expires: { gt: new Date() } },
        include: { user: true },
        orderBy: { expires: 'desc' },
      })

      if (session?.user?.role) {
        switch (session.user.role) {
          case 'ADMIN':
          case 'SELLER':
            return `${baseUrl}/admin`
          case 'CUSTOMER':
            return `${baseUrl}/customer`
          default:
            return baseUrl
        }
      }
      if (url.startsWith('/')) return `${baseUrl}${url}`
      if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}