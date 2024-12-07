import { Feature } from '../types'
import { InviteScreen, StocksScreen, InvestScreen } from '../components/Screens'
import DeviceUserIcon from '@/components/Icons/DeviceUserIcon'
import DeviceNotificationIcon from '@/components/Icons/DeviceNotificationIcon'
import DeviceTouchIcon from '@/components/Icons/DeviceTouchIcon'

export const features: Feature[] = [
  {
    name: 'Financiación a tu medida',
    description:
      'Ofrecemos planes de pago personalizados para que puedas acceder a tu vivienda sin preocuparte por grandes desembolsos iniciales. Nos adaptamos a tus posibilidades.',
    icon: DeviceUserIcon,
    screen: InviteScreen,
  },
  {
    name: 'Materiales de alta calidad',
    description:
      'Garantizamos el uso de materiales de primera categoría en todas nuestras construcciones, asegurando que tu hogar no solo sea accesible, sino también durable y cómodo.',
    icon: DeviceNotificationIcon,
    screen: StocksScreen,
  },
  {
    name: 'Cumplimos los plazos de construcción',
    description:
      'Nos comprometemos a entregarte tu vivienda en el menor tiempo posible, sin comprometer la calidad. ¡Mudate antes de lo que imaginas!',
    icon: DeviceTouchIcon,
    screen: InvestScreen,
  },
]
