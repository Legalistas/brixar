import { useState, useEffect, useRef } from "react";
import { ChevronDown, LogOut, User } from "lucide-react";
import Image from "next/image";

interface UserProps {
  user?: {
    id: string;
    name: string;
    email: string;
    image: string;
    role: string;
  };
  onClose: () => void;
}

const ProfileDropdown = ({ user, onClose }: UserProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!user) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <div
        className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 sm:px-4 py-2 rounded-md"
        onClick={toggleDropdown}
      >
        <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-sm font-medium text-gray-600">
              {user.name?.charAt(0)}
            </span>
          )}
        </div>
        {/* Name only shows on desktop */}
        <span className="hidden sm:inline text-sm text-gray-600">
          {user.name}
        </span>
        <ChevronDown
          className={`hidden sm:block h-4 w-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          {/* Show user info at top of dropdown only on mobile */}
          <div className="sm:hidden px-4 py-2 border-b">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <div className="py-1">
            <button
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                console.log("Profile clicked");
                setIsOpen(false);
                onClose();
              }}
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </button>
            <button
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                console.log("Logout clicked");
                setIsOpen(false);
                onClose();
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
