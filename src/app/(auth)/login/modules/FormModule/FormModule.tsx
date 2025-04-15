'use client'

import React, { FormEvent, useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { InputElement } from '@/components/InputElement'
import { Asterisk, Lock, Mail } from 'lucide-react'

const FormModule = ({ redirectBasedOnRole }: { redirectBasedOnRole: any }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        setError(
          'Credenciales inválidas. Por favor, verifica tu correo y contraseña.'
        )
      } else if (result.error === 'EmailNotVerified') {
        setError(
          'Por favor, verifica tu correo electrónico antes de iniciar sesión.'
        )
      } else if (result.error === 'UserNotFound') {
        setError(
          'Usuario no encontrado. Por favor, verifica tu correo electrónico.'
        )
      } else if (result.error === 'PasswordIncorrect') {
        setError('Contraseña incorrecta. Por favor, verifica tu contraseña.')
      } else if (result.error === 'AccountInactive') {
        setError('Tu cuenta está inactiva. Por favor, contacta al soporte.')
      } else if (result.error === 'AccountLocked') {
        setError('Tu cuenta está bloqueada. Por favor, contacta al soporte.')
      } else if (result.error === 'AccountExpired') {
        setError('Tu cuenta ha expirado. Por favor, contacta al soporte.')
      } else if (result.error === 'AccountSuspended') {
        setError(
          'Tu cuenta ha sido suspendida. Por favor, contacta al soporte.'
        )
      } else {
        setError('Error desconocido. Por favor, intenta de nuevo más tarde.')
      }

      console.error(result.error)
    } else {
      const session = await getSession()
      redirectBasedOnRole(session?.user?.role)
    }
  }

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <div className="mb-3">
        <InputElement
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
          aria-label="Correo electrónico"
          required
          autoComplete="email"
          autoFocus
          leftIcon={
            <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white" />
          } // Pasa el icono que desees
        />
      </div>
      <div className="mb-1">
        <InputElement
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg text-slate-500"
          placeholder="Contraseña"
          aria-label="Password"
          required
          autoComplete="current-password"
          leftIcon={
            <Lock className="w-5 h-5 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white" />
          }
          showPasswordIcon={true} // Muestra el ícono de visibilidad
        />
      </div>
      <div className="mb-5 mt-3 flex justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="rememberMe"
            name="remember"
            className="form-check-input"
          />
          <label className="ml-2 text-slate-600" htmlFor="rememberMe">
            Recuérdame
          </label>
        </div>
      </div>

      {error && (
        <div className="mb-3 text-red-600 text-sm font-semibold">
          <Asterisk className="inline mr-1" size={16} />
          {error}
        </div>
      )}
      
      <div className="mb-3">
        <button
          type="submit"
          className="w-full p-3 bg-[#fb6107] hover:bg-[#fb6107]/90 text-white text-lg rounded-lg"
        >
          Ingresar
        </button>
      </div>
    </form>
  )
}

export default FormModule
