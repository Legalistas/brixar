import { getSession, signIn } from 'next-auth/react'
import GoogleIcon from '@/components/Icons/GoogleIcon'
import { useRouter } from 'next/navigation'

const SocialRegister = () => {
  // const handleGoogleSignIn = async () => {
  //   signIn('google', { callbackUrl: '/dashboard' })
  // }

  const router = useRouter()

  const handleGoogleSignIn = async () => {
    try {
      const result = await signIn('google', {
        callbackUrl: '/customer',
        redirect: false
      });

      if (result?.error) {
        console.error('Error en el inicio de sesión con Google:', result.error);
      } else if (result?.ok) {
        // Redirigir al usuario a la página de cliente
        router.push('/customer');
      }
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
    }
  }
  
  return (
    <div className="mb-3 w-full">
      <button
        onClick={handleGoogleSignIn}
        className="w-full p-3 text-slate-800 bg-gray-100 hover:bg-gray-50 text-lg rounded-lg flex items-center justify-center"
      >
        <GoogleIcon className="w-6 h-6 mr-2" /> Regístrate con Google
      </button>
    </div>
  )
}

export default SocialRegister
