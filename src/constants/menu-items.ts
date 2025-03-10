import {
  ChartNoAxesCombined,
  CircleDollarSign,
  ClipboardList,
  Home,
  Monitor,
  Settings,
  Circle,
  MessageSquare
} from 'lucide-react'

export type MenuItem = {
  icon: any
  label: string
  href: string
  subItems?: MenuItem[]
}

export const MENU_CUSTOMERS_DATA: MenuItem[] = [
  { icon: Monitor, label: 'Panel de Control', href: '/customer/dashboard' },
  {
    icon: ChartNoAxesCombined,
    label: 'Mis inversiones',
    href: '/customer/investments',
  },
  { icon: Home, label: 'Propiedades', href: '/customer/properties' },
  { icon: ClipboardList, label: 'Proyectos', href: '/customer/proyects' },
  { icon: MessageSquare, label: 'Mis consultas', href: '/customer/inquiries' },
  { icon: CircleDollarSign, label: 'Créditos', href: '/customer/credits' },
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
