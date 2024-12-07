import { useState } from "react";
import { Menu, ChevronDown, HelpCircle, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import ProfileDropdown from "@/components/ui/Dropdowns/ProfileDropdown";
import Logo from "@/components/common/Logo"; // Ensure this path is correct

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 sm:px-6">
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="mr-4 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" aria-hidden="true" aria-label="Open sidebar" />
        </button>
        <div className="lg:hidden">
          <Logo
            color={"#000"}
            colorSecondary={"transparent"}
            stroke={"#000"}
            className={"w-36 h-36"}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button className="hidden sm:flex items-center gap-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100 px-3 py-2 text-sm">
          <HelpCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Ayuda</span>
        </button>
        <div className="hidden sm:block h-6 w-px bg-gray-200" />
        <div className="relative">
          <ProfileDropdown
            user={session?.user}
            onClose={() => setIsProfileOpen(false)}
          />
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100 px-3 py-2 text-sm"
          aria-label="Logout"
        >
          <LogOut className="h-5 w-5 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Cerrar sesión</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
