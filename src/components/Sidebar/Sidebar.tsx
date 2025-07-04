"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MENU_DATA, MENU_CUSTOMERS_DATA, MenuItem } from "@/constants/menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronUp } from 'lucide-react';
import LogoBrixar from "../LogoBrixar";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({});
  const pathname = usePathname();
  const { data: session } = useSession();

  const menuData = session?.user?.role === "CUSTOMER" ? MENU_CUSTOMERS_DATA : MENU_DATA;

  const isItemActive = useCallback(
    (item: MenuItem): boolean => {
      if (pathname.startsWith(item.href)) return true;
      if (item.subItems) {
        return item.subItems.some((subItem) => pathname.startsWith(subItem.href));
      }
      return false;
    },
    [pathname]
  );

  const toggleSubmenu = (label: string) => {
    setOpenSubmenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  useEffect(() => {
    const newOpenSubmenus: { [key: string]: boolean } = {};
    menuData.forEach((item) => {
      if (item.subItems) {
        const isActive = isItemActive(item);
        newOpenSubmenus[item.label] = isActive;
      }
    });

    setOpenSubmenus(newOpenSubmenus);
  }, [isItemActive, menuData]);

  const renderMenuItem = (item: MenuItem) => {
    const Icon = item.icon;
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isOpen = openSubmenus[item.label];
    const active = isItemActive(item);

    return (
      <div key={item.label}>
        <Link
          href={item.href}
          className={`w-full flex items-center justify-start gap-3 px-3 py-2 rounded-md text-gray-300 hover:bg-white/10 hover:text-white ${active ? "bg-white/10 text-white" : ""
            }`}
          onClick={(e) => {
            if (hasSubItems) {
              e.preventDefault();
              toggleSubmenu(item.label);
            }
          }}
        >
          <Icon className="h-4 w-4" />
          <span className="flex-1 text-left text-md font-normal">{item.label}</span>
          {item.badge && (
            <span className="ml-2 rounded-full bg-gray-600 px-2 py-0.5 text-xs">
              {item.badge}
            </span>
          )}
          {item.beta && (
            <span className="ml-2 rounded bg-emerald-400/20 px-1.5 py-0.5 text-xs text-emerald-400">
              BETA
            </span>
          )}
          {hasSubItems && (
            <div className="transition-transform duration-200">
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          )}
        </Link>
        {hasSubItems && item.subItems && (
          <div
            className={`overflow-hidden transition-all duration-200 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
          >
            <div className="pl-4 mt-1 space-y-1">
              {item.subItems.map((subItem) => (
                <Link
                  key={subItem.label}
                  href={subItem.href}
                  className={`flex items-center text-sm gap-3 px-2.5 py-2 rounded-md text-gray-300 hover:bg-white/10 hover:text-white ${pathname.startsWith(subItem.href) ? "bg-white/10 text-white" : ""
                    }`}
                >
                  <subItem.icon className="h-4 w-4" />
                  <span>{subItem.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-60 bg-gray-900 overflow-y-auto transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="p-4 flex justify-center">
          <Link href="/" className="flex items-center p-2 rounded-md">
            <Image
              src="/images/logos/BRIXAR_png-Logo-05.png"
              alt="Logo"
              width={1000}
              height={300}
              className="h-10 w-auto lg:h-16"
              quality={100}
              priority
            />
          </Link>
        </div>
        <div className="p-4">
          <h2 className="px-3 text-xs font-semibold text-gray-400 uppercase">Menu</h2>
          <nav className="mt-4 space-y-1">{menuData.map((item) => renderMenuItem(item))}</nav>
        </div>
      </aside>
    </>
  );
}

