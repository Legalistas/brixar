import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import bcrypt from 'bcrypt'
import { getSession } from 'next-auth/react'
import { prisma } from '@/libs/prisma'

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
          email: user.email,
          name: user.name || '',
          image: user.profile?.avatar || '',
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        console.log('User data from Google:', profile)
        if (account?.provider === 'google' && profile) {
          try {
            const existingUser = await prisma.user.findUnique({
              where: { email: profile?.email },
              include: {
                accounts: true,
                profile: true,
                activity: true,
              },
            })

            if (!existingUser) {
              // Si el usuario no existe, crear usuario, cuenta, perfil y actividad
              const newUser = await prisma.user.create({
                data: {
                  name: profile?.name || '',
                  email: profile?.email || '',
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
                      countryId: 9, // Valor por defecto, ajusta según tus necesidades
                      stateId: 129, // Valor por defecto, ajusta según tus necesidades
                      avatar: profile.picture || '',
                    },
                  },
                  activity: {
                    create: {
                      registerIp: 'unknown', // Actualiza esto si tienes acceso a la información de la solicitud
                      lastIp: 'unknown',
                      agent: 'Google Auth',
                    },
                  },
                },
              })
              return true
            } else {
              // Si el usuario ya existe, actualizamos su perfil
              if (existingUser.profile) {
                await prisma.userProfile.update({
                  where: { userId: existingUser.id },
                  data: {
                    avatar: profile.picture || '',
                  },
                })
              } else {
                // Si el usuario existe pero no tiene perfil, lo creamos
                await prisma.userProfile.create({
                  data: {
                    userId: existingUser.id,
                    countryId: 9, // Valor por defecto, ajusta según tus necesidades
                    stateId: 129, // Valor por defecto, ajusta según tus necesidades
                    avatar: profile.picture || '',
                  },
                })
              }

              if (!existingUser.accounts.length) {
                // Si el usuario existe pero no tiene cuenta vinculada, crear la cuenta
                await prisma.account.create({
                  data: {
                    userId: existingUser.id,
                    type: account.type,
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                    access_token: account.access_token,
                    expires_at: account.expires_at,
                    token_type: account.token_type,
                    scope: account.scope,
                    id_token: account.id_token,
                  },
                })
              }

              // Crear o actualizar actividad
              if (!existingUser.activity) {
                await prisma.userActivity.create({
                  data: {
                    userId: existingUser.id,
                    registerIp: 'unknown',
                    lastIp: 'unknown',
                    agent: 'Google Auth',
                  },
                })
              } else {
                await prisma.userActivity.update({
                  where: { userId: existingUser.id },
                  data: {
                    lastIp: 'unknown',
                    agent: 'Google Auth',
                    onlineTime: new Date(),
                  },
                })
              }
            }
            return true
          } catch (error) {
            console.error('Error during Google sign in:', error)
            return false
          }
        }
        return true
      } catch (error) {
        console.error('Error during sign in:', error)
        return false // Denegar el inicio de sesión en caso de error
      }
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.uid = user.id
        token.role = user.role
      }
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.uid as string
        session.user.role = token.role as string
        session.accessToken = token.accessToken as string
      }

      // Fetch user profile to include avatar
      const userProfile = await prisma.userProfile.findUnique({
        where: { userId: Number(session.user.id) },
      })

      session.user.image = (userProfile?.avatar as string) || ''
      return session
    },
    async redirect({ url, baseUrl }) {
      const session = await getSession({
        req: { headers: { cookie: undefined } },
      })

      if (session?.user?.role) {
        switch (session.user.role) {
          case 'ADMIN':
          case 'SELLER':
            return `${baseUrl}/admin`
          case 'WHOLESALER':
            return `${baseUrl}/wholesaler`
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
