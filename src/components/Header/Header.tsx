import { useState } from 'react'
import { Menu, ChevronDown, HelpCircle, LogOut, DollarSign, RefreshCw } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import ProfileDropdown from '@/components/ui/Dropdowns/ProfileDropdown'
import LogoBrixar from '../LogoBrixar'
import { useCurrency } from '@/context/CurrencyContext'
import { useDollarRate } from '@/hooks/useDollarRate'

interface HeaderProps {
  onMenuClick: () => void
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isOpenCurrency, setIsOpenCurrency] = useState(false)
  const { currencies, currentCurrency, setCurrentCurrency } = useCurrency()
  const { dollarRate, isLoading, lastUpdated, updateDollarRate } = useDollarRate()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/login')
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 sm:px-6">
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="mr-2 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
        >
          <span className="sr-only">Open sidebar</span>
          <Menu
            className="h-6 w-6"
            aria-hidden="true"
            aria-label="Open sidebar"
          />
        </button>
        <div className="lg:hidden">
          <LogoBrixar className="w-28 h-28" />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative">
          <button
            onClick={() => setIsOpenCurrency(!isOpenCurrency)}
            className="flex items-center text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100 px-3 py-2 text-sm"
          >
            <span className="mr-2">
              <span className={`fi fi-${currentCurrency.flagCode}`} />
            </span>
            <span className="hidden sm:inline">{currentCurrency.name}</span>
            <ChevronDown className="h-4 w-4 ml-2" />
          </button>
          {isOpenCurrency && (
            <div className="absolute top-[calc(100%+0.5rem)] left-0 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black/5 z-50 overflow-hidden">
              <div className="py-1">
                {currencies.map((currency, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentCurrency(currency)
                      setIsOpenCurrency(false)
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                  >
                    <span className="mr-2">
                      <span className={`fi fi-${currency.flagCode}`} />
                    </span>
                    {currency.name}
                  </button>
                ))}
              </div>
            </div>          )}
        </div>        {/* Valor del Dólar */}
        <div className="flex items-center bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 min-w-[160px]">
          <DollarSign className="h-4 w-4 text-blue-600 mr-2" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <span className="text-xs text-blue-600 font-medium">Dólar</span>
                <span className="text-sm font-bold text-blue-700">
                  {isLoading ? (
                    <div className="flex items-center gap-1">
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      <span className="text-xs">Actualizando...</span>
                    </div>
                  ) : dollarRate ? (
                    `$${dollarRate.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
                  ) : (
                    'N/A'
                  )}
                </span>
              </div>
              <button
                onClick={updateDollarRate}
                disabled={isLoading}
                className="text-blue-600 hover:text-blue-700 disabled:opacity-50 p-1 rounded hover:bg-blue-100"
                title="Actualizar cotización del dólar"
              >
                <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            {lastUpdated && (
              <span className="text-xs text-blue-500">
                {lastUpdated.toLocaleTimeString('es-AR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            )}
          </div>
        </div>
        
        <button className="hidden sm:flex items-center gap-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100 px-3 py-2 text-sm">
          <HelpCircle className="h-5 w-5" />
        </button>
        {/*<NotificationDropdown />*/}
        <div className="hidden sm:block h-6 w-px bg-gray-200" />
        <div className="relative">
          <ProfileDropdown
            user={session?.user}
            onClose={() => setIsProfileOpen(false)}
            handleLogout={handleLogout}
          />
        </div>
      </div>
    </header>
  )
}

export default Header
