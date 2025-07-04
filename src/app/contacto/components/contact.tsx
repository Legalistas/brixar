
"use client"

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/useToast";
import dynamic from 'next/dynamic'

const DynamicMap = dynamic(() => import('./map'), {
    ssr: false,
    loading: () => <p>Cargando mapa...</p>
  })

const ContactPage = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    whatsapp: "",
    mensaje: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "¡Mensaje enviado exitosamente!",
      description: "Nos pondremos en contacto contigo muy pronto.",
    });
    
    setFormData({ nombre: "", email: "", whatsapp: "", mensaje: "" });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      {/* <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
            Contáctanos
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto animate-fade-in">
            Estamos aquí para ayudarte. Envíanos tu consulta y te responderemos a la brevedad.
          </p>
        </div>
      </div> */}

      <div className="container mx-auto px-4 py-12 -mt-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Send className="h-6 w-6 text-blue-600" />
                  Envíanos un mensaje
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="nombre" className="text-sm font-medium text-gray-700">
                        Nombre completo *
                      </label>
                      <Input
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        placeholder="Tu nombre"
                        required
                        className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="tu@email.com"
                        required
                        className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="whatsapp" className="text-sm font-medium text-gray-700">
                      WhatsApp
                    </label>
                    <Input
                      id="whatsapp"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      placeholder="+54 9 11 1234-5678"
                      className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="mensaje" className="text-sm font-medium text-gray-700">
                      Mensaje *
                    </label>
                    <Textarea
                      id="mensaje"
                      name="mensaje"
                      value={formData.mensaje}
                      onChange={handleInputChange}
                      placeholder="Cuéntanos cómo podemos ayudarte..."
                      required
                      rows={5}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Enviando...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="h-5 w-5" />
                        Enviar mensaje
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  Información de contacto
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 group hover:bg-gray-50 p-3 rounded-lg transition-colors">
                    <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <a href="mailto:contacto@brixar.ar" className="font-medium text-gray-800 hover:text-blue-600 transition-colors">
                        contacto@brixar.ar
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 group hover:bg-gray-50 p-3 rounded-lg transition-colors">
                    <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                      <Phone className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Teléfono</p>
                      <a href="tel:+543492282324" className="font-medium text-gray-800 hover:text-green-600 transition-colors">
                        3492 282324
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 group hover:bg-gray-50 p-3 rounded-lg transition-colors">
                    <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                      <MapPin className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Dirección</p>
                      <p className="font-medium text-gray-800">
                        Aconcagua 697, Rafaela, Santa Fe
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Nuestra ubicación
                  </h3>
                </div>
                <DynamicMap latitude={-31.2545} longitude={-61.4867} />
                {/* <div className="h-64 bg-gray-200 relative overflow-hidden">
                  <img 
                    src="/lovable-uploads/d7d14f59-f63d-4edd-a2ac-4249d7bf0279.png"
                    alt="Mapa de ubicación"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                </div> */}
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-400" />
                <h3 className="text-lg font-semibold mb-2">
                  Respuesta garantizada
                </h3>
                <p className="text-blue-100 text-sm">
                  Te respondemos en menos de 24 horas
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Trust Section */}
        <div className="mt-16 text-center">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Atención personalizada
              </h3>
              <p className="text-gray-600">
                Hablamos contigo directamente para entender tus necesidades
              </p>
            </div>
            
            <div className="p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Respuesta rápida
              </h3>
              <p className="text-gray-600">
                Nos comprometemos a responderte en el menor tiempo posible
              </p>
            </div>
            
            <div className="p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Múltiples canales
              </h3>
              <p className="text-gray-600">
                Contáctanos por email, teléfono o WhatsApp
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
