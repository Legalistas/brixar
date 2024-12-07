"use client";
import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Customer = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <div>
      <h1>Bienvenido: Cliente</h1>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100 px-3 py-2 text-sm"
        aria-label="Logout"
      >
        <LogOut className="h-5 w-5 sm:h-4 sm:w-4" />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </div>
  );
};

export default Customer;
