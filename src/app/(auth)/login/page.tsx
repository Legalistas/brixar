'use client'

import React, { useEffect, useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Loading from '@/components/ui/Loading'

import { CirclesBackground } from '@/components/CirclesBackground'
import Link from 'next/link'
import FormModule from './modules/FormModule/FormModule'
import SocialLogin from './modules/SocialLogin/SocialLogin'
import LogoBrixar from '@/components/LogoBrixar'

export default function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const redirectBasedOnRole = useCallback(
    (role?: string) => {
      switch (role) {
        case 'ADMIN':
        case 'SELLER':
          router.push('/admin')
          break
        case 'WHOLESALER':
          router.push('/Wholesaler')
          break
        case 'CUSTOMER':
          router.push('/customer')
          break
        default:
          router.push('/')
      }
    },
    [router]
  )

  useEffect(() => {
    if (status === 'authenticated') {
      redirectBasedOnRole(session?.user?.role)
    }
  }, [status, session, redirectBasedOnRole])

  if (status === 'loading') {
    return <Loading /> // Show loading component while session is loading
  }

  return (
    // <div className="flex justify-center items-center min-h-screen px-4">
    //   {/* Login Container */}
    //   <div className="flex flex-col md:flex-row border rounded-[30px] p-4 bg-white shadow-lg w-full max-w-[930px] mx-auto">
    //     {/* Left Box */}
    //     <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-black rounded-[30px] p-6 md:p-4">
    //       <div className="mb-4">
    //         <Image
    //           src="/assets/Alta-Blanco.png"
    //           alt="Alta Telefonia Logo"
    //           width={200}
    //           height={200}
    //         />
    //       </div>
    //     </div>
    //     {/* Right Box */}
    //     <div className="w-full md:w-1/2 p-6 md:p-8">
    //       <div className="flex flex-col items-center">
    //         <Header />
    //         <FormModule redirectBasedOnRole={redirectBasedOnRole} />
    //         <SocialLogin />
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <main className="flex min-h-full overflow-hidden pt-10">
      <div className="mx-auto flex w-full max-w-2xl flex-col px-4 sm:px-6">
        <Link href="/" aria-label="Home">
          <LogoBrixar className="h-8 w-auto" />
        </Link>

        <div className="relative mt-12 sm:mt-16">
          <CirclesBackground
            width="1090"
            height="1090"
            className="absolute -top-7 left-1/2 -z-10 h-[788px] -translate-x-1/2 stroke-gray-300/30 [mask-image:linear-gradient(to_bottom,white_20%,transparent_75%)] sm:-top-9 sm:h-auto"
          />
          <h1 className="text-center text-2xl font-medium tracking-tight text-gray-900">
            Iniciar sesión
          </h1>
          <p className="mt-3 text-center text-md text-gray-600 font-semibold mr-1">
            ¿No tienes una cuenta?
            <Link
              href="/register"
              className="text-[#fb6107] ml-1 hover:underline"
            >
              Registrate
            </Link>
          </p>
        </div>
        <div className="-mx-4 mt-10 flex-auto bg-white px-4 py-10 shadow-2xl shadow-gray-900/10 sm:mx-0 sm:flex-none sm:rounded-5xl sm:p-24">
          <FormModule redirectBasedOnRole={redirectBasedOnRole} />
          <SocialLogin />
        </div>
      </div>
    </main>
  )
}
