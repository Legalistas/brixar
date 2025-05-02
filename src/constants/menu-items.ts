import {
  ChartNoAxesCombined,
  CircleDollarSign,
  ClipboardList,
  Home,
  Monitor,
  Settings,
  Circle,
  MessageSquare,
  MessageCircle
} from 'lucide-react'

export type MenuItem = {
  icon: any
  label: string
  href: string
  subItems?: MenuItem[]
}

export const MENU_CUSTOMERS_DATA: MenuItem[] = [
  { icon: Monitor, label: 'Panel de Control', href: '/customer/dashboard' },
  { icon: Home, label: 'Propiedades', href: '/customer/properties' },
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
