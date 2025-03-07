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
      
      const response = await signIn("google", { 
        callbackUrl: "/customer",
        redirect: false
      });
      
      if (response?.error) {
        console.error("Error de autenticación:", response.error);
        if (response.error === "OAuthAccountNotLinked") {
          setError("Esta cuenta de Google usa el mismo correo que ya tienes registrado. Estamos intentando vincular ambas cuentas.");
          
          // Intentar iniciar sesión de nuevo, esta vez forzando la vinculación
          // Esto funcionará solo si modificaste la configuración de NextAuth como se indicó arriba
          await signIn("google", {
            callbackUrl: "/customer",
            redirect: true
          });
        } else {
          setError(`Error al iniciar sesión: ${response.error}`);
        }
      } else if (response?.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      setError("Ocurrió un error inesperado. Por favor intenta nuevamente.");
    } finally {
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
