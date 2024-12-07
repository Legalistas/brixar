'use client'

import { useState, useEffect } from 'react'
import Header from './landing/components/Header/Header'
import Carousel from './landing/components/Carousel/Carousel'
import OfferOfTheDay from './landing/components/OfferOfTheDay/OfferOfTheDay'
import ProductGrid from './landing/components/ProductGrid/ProductGrid'
import CategoryIcons from './landing/components/CategoryIcons/CategoryIcons'
import Footer from './landing/components/Footer/Footer'
import ScrollToTopButton from './landing/components/ScrollToTopButton/ScrollToTopButton'
import Faqs from './landing/components/Faqs/Faqs'
import OurServices from './landing/components/OurServices/OurServices'
import CallActionBanner from './landing/components/CallActionBanner/CallActionBanner'
import CartModal from './landing/components/CartModal/CartModal'
import "flag-icons/css/flag-icons.min.css";
import WhatsAppButton from './landing/components/WhatsAppButton/WhatsAppButton'

export default function LandingPage() {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-red-600 text-white p-2 text-center">
        <p className="text-sm font-semibold">Servicio técnico especializado en dispositivos de alta gama</p>
      </div>
      {/* <TopBanner /> */}
      <Header onCartClick={handleCartToggle} />
      <main className="container mx-auto px-4 py-8">
        <Carousel />
        {/* Sección de Nuestros Servicios */}
        <OurServices />
        <OfferOfTheDay />
        {/* Banner de Reparación de Alta Gama */}
        <CallActionBanner />
        <h2 className="text-2xl font-bold mb-6">Nuestros productos</h2>
        <ProductGrid />
        <CategoryIcons />
        <Faqs />
      </main>
      <Footer />
      <WhatsAppButton />
      <ScrollToTopButton show={showScrollTop} />
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  )
}