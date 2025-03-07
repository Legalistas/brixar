import { signIn } from "next-auth/react";
import GoogleIcon from "@/components/Icons/GoogleIcon";
import { useState } from "react";

const SocialLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await signIn("google", { 
        callbackUrl: "/customer",
        redirect: true
      });
      
      // No necesitamos manejar la respuesta aquí ya que estamos usando redirect: true
      // El usuario será redirigido automáticamente al callbackUrl o a la página de error
      
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      setError("Ocurrió un error inesperado. Por favor intenta nuevamente.");
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-3 w-full">
      {error && (
        <div className="mb-3 text-red-500 text-sm">
          {error}
        </div>
      )}
      
      <button
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="w-full p-3 text-slate-800 bg-gray-100 hover:bg-gray-50 text-lg rounded-lg flex items-center justify-center"
      >
        {isLoading ? (
          <span>Procesando...</span>
        ) : (
          <>
            <GoogleIcon className="w-6 h-6 mr-2" /> Inicia sesión con Google
          </>
        )}
      </button>
    </div>
  );
};

export default SocialLogin;
