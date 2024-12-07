'use client'

import Image from 'next/image'
import { Facebook, Instagram, Twitter, CreditCard } from 'lucide-react'
import FacebookIcon from '@/components/Icons/FacebookIcon'
import InstagramIcon from '@/components/Icons/InstagramIcon'
import XIcon from '@/components/Icons/XIcon'

export default function Footer() {
    return (
        <footer className="bg-[#1D1D1B] text-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    <div>
                        <div className="relative h-16 w-40 mb-6">
                            <Image
                                src="/assets/Alta-Blanco.png"
                                alt="Alta Telefonia"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <h3 className="font-bold text-lg mb-4">CONTACTATE CON NOSOTROS</h3>
                        <div className="space-y-2">
                            <p className="text-sm">Teléfono: 3492-643820</p>
                            <p className="text-sm">Email: contacto@altatelefonia.com</p>
                            <div className="flex space-x-4 mt-4">
                                <a href="#" className="text-white hover:text-[#DD1031] transition-colors">
                                    <FacebookIcon className="h-6 w-6" fill="currentColor" />
                                </a>
                                <a href="#" className="text-white hover:text-[#DD1031] transition-colors">
                                    <InstagramIcon className="h-6 w-6" fill="currentColor" />
                                </a>
                                <a href="#" className="text-white hover:text-[#DD1031] transition-colors">
                                    <XIcon className="h-6 w-6" fill="currentColor" />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-4">PRODUCTOS</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-[#DD1031] transition-colors">Celulares</a></li>
                            <li><a href="#" className="hover:text-[#DD1031] transition-colors">Tablets</a></li>
                            <li><a href="#" className="hover:text-[#DD1031] transition-colors">Accesorios</a></li>
                            <li><a href="#" className="hover:text-[#DD1031] transition-colors">Servicio Técnico</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-4">INFORMACIÓN</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-[#DD1031] transition-colors">Preguntas Frecuentes</a></li>
                            <li><a href="#" className="hover:text-[#DD1031] transition-colors">Garantía</a></li>
                            <li><a href="#" className="hover:text-[#DD1031] transition-colors">Términos y Condiciones</a></li>
                            <li><a href="#" className="hover:text-[#DD1031] transition-colors">Política de Privacidad</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-4">MEDIOS DE PAGO</h3>
                        <div className="flex flex-wrap gap-2">
                            <div className="bg-white p-2 rounded">
                                <CreditCard className="h-6 w-6 text-[#1D1D1B]" />
                            </div>
                            <div className="bg-white p-2 rounded">
                                <Image
                                    src="/assets/mercado-pago.svg"
                                    alt="Mercado Pago"
                                    width={24}
                                    height={24}
                                />
                            </div>
                            <div className="bg-white p-2 rounded">
                                <Image
                                    src="/assets/visa.svg"
                                    alt="Visa"
                                    width={24}
                                    height={24}
                                />
                            </div>
                            <div className="bg-white p-2 rounded">
                                <Image
                                    src="/assets/american-express.svg"
                                    alt="American Express"
                                    width={24}
                                    height={24}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8">
                    <div className="flex justify-center md:justify-center">
                        <p className="text-sm text-gray-400">
                            © {new Date().getFullYear()} Alta Telefonia. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}