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
  { icon: Monitor, label: 'Escritorio', href: '/admin/dashboard' },
  {
    icon: House,
    label: 'Productos',
    href: '#',
    subItems: [
      { icon: Circle, label: 'Departamentos', href: '/admin/departamentos' },
      { icon: Circle, label: 'Casas', href: '/admin/casas' },
      { icon: Circle, label: 'Invertir en un Brix', href: '/admin/brix' },
    ],
  },
  {
    icon: House,
    label: 'Proyectos',
    href: '#',
    subItems: [
      { icon: Circle, label: 'Abiertos', href: '/admin/abiertos' },
      { icon: Circle, label: 'Finalizados', href: '/admin/finalizados' },
    ],
  },
  {
    icon: House,
    label: 'Créditos',
    href: '#',
    subItems: [
      { icon: Circle, label: 'Créditos hipotecarios', href: '/admin/creditos' },
      { icon: Circle, label: 'Solicitar financiación', href: '/admin/financiacion' },
    ],
  },
  {
    icon: ShoppingCart,
    label: 'Mis inversiones',
    href: '#',
    badge: '0',
    subItems: [
      { icon: Circle, label: 'Nueva', href: '/orders/new' },
      { icon: Circle, label: 'Listado', href: '/orders' },
    ],
  },
  {
    icon: Store,
    label: 'Ventas',
    href: '#',
    subItems: [
      { icon: Circle, label: 'Nueva Venta', href: '/admin/sales/create' },
      { icon: Circle, label: 'Listado', href: '/admin/sales/list' },
      { icon: Circle, label: 'Clientes', href: '/admin/customers' },
    ],
  },
  { icon: Users, label: 'Usuarios', href: '/admin/users' },
  { icon: Settings, label: 'Configuración', href: '/settings' },
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
