import { Settings, Shield, Smartphone } from "lucide-react"

const OurServices = () => {
    return (
        <section className="my-12">
            <h2 className="text-3xl font-bold mb-6 text-center">Nuestros Servicios</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center">
                    <Smartphone className="w-16 h-16 text-red-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Reparación de Pantalla</h3>
                    <p>Reparamos pantallas de dispositivos de alta gama con precisión y calidad.</p>
                </div>
                <div className="flex flex-col items-center text-center">
                    <Settings className="w-16 h-16 text-red-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Servicio Técnico</h3>
                    <p>Ofrecemos servicio técnico especializado para todo tipo de problemas.</p>
                </div>
                <div className="flex flex-col items-center text-center">
                    <Shield className="w-16 h-16 text-red-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Repuestos Originales</h3>
                    <p>Utilizamos solo repuestos originales para garantizar la mejor calidad.</p>
                </div>
            </div>
        </section>
    )
}

export default OurServices