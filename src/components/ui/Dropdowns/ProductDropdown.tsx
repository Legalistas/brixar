"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronUp, Logs, Medal, SlidersHorizontal, Tag } from "lucide-react";
import Link from "next/link";

const ProductDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Toggle the dropdown
  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        onClick={handleToggle}
        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-600 border border-gray-300 hover:bg-gray-100"
      >
        <Logs className="h-4 w-4" />
        Menu
        <ChevronUp className={`h-4 w-4 ${isOpen ? "" : "rotate-180"}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <ul className="py-1 text-gray-700">
            <li>
              <Link
                href="/admin/categories"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
              >
                <Tag className="h-4 w-4" />
                Categorías
              </Link>
            </li>
            <li>
              <Link
                href="/admin/brands"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
              >
                <Medal className="h-4 w-4" />
                Marcas
              </Link>
            </li>
            <li>
              <Link
                href="/admin/attributes"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Atributos
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductDropdown;
