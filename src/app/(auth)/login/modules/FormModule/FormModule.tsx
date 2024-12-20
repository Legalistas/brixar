"use client";

import React, { FormEvent, useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { InputElement } from "@/components/InputElement";
import { Asterisk, Lock, Mail } from "lucide-react";

const FormModule = ({ redirectBasedOnRole }: { redirectBasedOnRole: any }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      console.error(result.error);
    } else {
      const session = await getSession();
      redirectBasedOnRole(session?.user?.role);
    }
  };

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
      <div className="mb-3">
        <button
          type="submit"
          className="w-full p-3 bg-[#fb6107] hover:bg-[#fb6107]/90 text-white text-lg rounded-lg"
        >
          Ingresar
        </button>
      </div>
    </form>
  );
};

export default FormModule;
