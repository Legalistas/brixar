"use client"

import { useState, ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserNav } from "@/components/dashboard/UserNav"
import { MENU_CUSTOMERS_DATA } from "@/constants/menu-items"
import { Menu, X, ChevronDown } from "lucide-react"

interface DashboardShellProps {
  children: ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const pathname = usePathname()

  const toggleSubmenu = (href: string) => {
    setOpenSubmenu(openSubmenu === href ? null : href)
  }

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          <Link href="/customer/dashboard" className="text-xl font-bold">
            Brixar
          </Link>
          <button 
            className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-1 px-3 py-2">
          {MENU_CUSTOMERS_DATA.map((item) => (
            <div key={item.href}>
              {item.subItems ? (
                <div>
                  <button
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm ${
                      isActive(item.href)
                        ? "bg-gray-100 font-medium text-gray-900"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => toggleSubmenu(item.href)}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={16} />
                      {item.label}
                    </div>
                    <ChevronDown 
                      size={16} 
                      className={`transition-transform ${
                        openSubmenu === item.href ? "rotate-180" : ""
                      }`} 
                    />
                  </button>
                  {openSubmenu === item.href && (
                    <div className="ml-6 space-y-1 pt-1">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                            isActive(subItem.href)
                              ? "bg-gray-100 font-medium text-gray-900"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <subItem.icon size={16} />
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                    isActive(item.href)
                      ? "bg-gray-100 font-medium text-gray-900"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon size={16} />
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b bg-white shadow-sm">
          <div className="flex h-16 items-center justify-between px-4">
            <button 
              className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="ml-auto">
              <UserNav />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t bg-white p-4">
          <div className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Brixar. Todos los derechos reservados.
          </div>
        </footer>
      </div>
    </div>
  )
}
