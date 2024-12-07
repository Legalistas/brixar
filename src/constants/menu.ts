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
    icon: Package,
    label: 'Almacen',
    href: '#',
    subItems: [
      { icon: Circle, label: 'Productos', href: '/admin/products' },
      { icon: Circle, label: 'Categorías', href: '/admin/categories' },
      { icon: Circle, label: 'Marcas', href: '/admin/brands' },
    ],
  },
  {
    icon: ShoppingCart,
    label: 'Ordenes',
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
