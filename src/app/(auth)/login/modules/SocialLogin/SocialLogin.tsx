import { signIn } from "next-auth/react";
import GoogleIcon from "@/components/Icons/GoogleIcon";

const SocialLogin = () => {
  const handleGoogleSignIn = () => {
    signIn("google");
  };

  return (
    <div className="mb-3 w-full">
      <button
        onClick={handleGoogleSignIn}
        className="w-full p-3 text-slate-800 bg-gray-100 hover:bg-gray-50 text-lg rounded-lg flex items-center justify-center"
      >
        <GoogleIcon className="w-6 h-6 mr-2" /> Inicia sesión con Google
      </button>
    </div>
  );
};

export default SocialLogin;
