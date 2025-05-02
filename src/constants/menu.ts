// src/constants/menu.ts
import {
  Monitor,
  Package,
  ShoppingCart,
  Store,
  Users,
  Settings,
  BarChart2,
  FileText,
  HelpCircle,
  Circle,
  House,
  Box,
  List,
  ClipboardList,
  CircleDollarSign,
  Home,
  ChartNoAxesCombined,
  MessageSquare,
  LayoutDashboard,
  PlusCircle,
  Building2,
  Receipt,
} from 'lucide-react'

export interface MenuItem {
  icon: React.ElementType
  label: string
  href: string
  badge?: string
  beta?: boolean
  subItems?: MenuItem[]
}

export const MENU_DATA: MenuItem[] = [
  { icon: PlusCircle, label: 'Publicar', href: '/admin/dashboard/publicar' },
  {
    icon: Building2,
    label: 'Publicaciones',
    href: '/admin/dashboard/publicaciones',
  },
  {
    icon: MessageSquare,
    label: 'Consultas',
    href: '/admin/dashboard/consultas',
  },
  {
    icon: ShoppingCart,
    label: 'Ventas',
    href: '/admin/dashboard/ventas',
  },
]

export const REPORTS_DATA: MenuItem[] = [
  { icon: BarChart2, label: 'Gráficos', href: '/reports/charts' },
  {
    icon: FileText,
    label: 'Consulta de compras',
    href: '#',
    subItems: [
      {
        icon: Circle,
        label: 'Por fecha',
        href: '/reports/purchases/by-date',
      },
      {
        icon: Circle,
        label: 'Por producto',
        href: '/reports/purchases/by-product',
      },
    ],
  },
  {
    icon: FileText,
    label: 'Consulta Ventas',
    href: '#',
    subItems: [
      { icon: Circle, label: 'Por fecha', href: '/reports/sales/by-date' },
      {
        icon: Circle,
        label: 'Por producto',
        href: '/reports/sales/by-product',
      },
    ],
  },
  { icon: HelpCircle, label: 'Ayuda', href: '/help' },
]

export const MENU_CUSTOMERS_DATA: MenuItem[] = [
  { icon: Monitor, label: 'Panel de Control', href: '/customer/dashboard' },
  { icon: Home, label: 'Propiedades', href: '/customer/properties' },
  { icon: ClipboardList, label: 'Proyectos', href: '/customer/proyects' },
  { icon: MessageSquare, label: 'Mis consultas', href: '/customer/inquiries' },
  {
    icon: Settings,
    label: 'Configuración',
    href: '#',
    subItems: [
      {
        icon: Circle,
        label: 'Cambiar contraseña',
        href: '/change-password',
      },
      {
        icon: Circle,
        label: 'Configurar alertas',
        href: '/alerts',
      },
    ],
  },
]
