import { Mail, Phone, Clock, MapPin, Linkedin, Twitter, Facebook, Instagram } from "lucide-react";
import { motion } from "framer-motion";
import * as Separator from "@radix-ui/react-separator";
import * as HoverCard from "@radix-ui/react-hover-card";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export const ContactSection = () => {
  const contactInfo = [
    {
      icon: <Mail className="text-red-600" size={24} />,
      title: "Correo Electrónico",
      description: "Estamos disponibles 24/7 para responder tus consultas",
      value: "info@actionsteam.com",
      action: "Enviar correo"
    },
    {
      icon: <Phone className="text-red-600" size={24} />,
      title: "WhatsApp",
      description: "Soporte inmediato vía WhatsApp Business",
      value: "+34 626 738 160",
      action: "Iniciar chat"
    },
    {
      icon: <Clock className="text-red-600" size={24} />,
      title: "Horario de Atención",
      description: "Lunes a Viernes: 9:00 - 18:00",
      value: "Hora de España (CET)",
      action: "Ver calendario"
    }
  ];

  const socialMedia = [
    { icon: <Linkedin size={24} />, name: "LinkedIn", url: "#", color: "hover:bg-[#0077B5]/10 hover:text-[#0077B5]" },
    { icon: <Twitter size={24} />, name: "Twitter", url: "#", color: "hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2]" },
    { icon: <Facebook size={24} />, name: "Facebook", url: "#", color: "hover:bg-[#4267B2]/10 hover:text-[#4267B2]" },
    { icon: <Instagram size={24} />, name: "Instagram", url: "#", color: "hover:bg-[#E4405F]/10 hover:text-[#E4405F]" }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center rounded-full bg-red-50 px-6 py-2 text-sm font-medium text-red-700 ring-1 ring-inset ring-red-600/10 mb-4">
            Estamos aquí para ayudarte
          </span>
          <h2 className="text-4xl font-bold text-[#1a2238] mb-4">
            Contáctanos
          </h2>
          <Separator.Root className="h-1 w-20 mx-auto bg-gradient-to-r from-red-500 to-red-600 rounded-full my-6" />
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            ¿Listo para transformar tu carrera y alcanzar tu máximo potencial como asociado?
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group hover:shadow-lg transition-all duration-300 border-none ring-1 ring-gray-200 hover:ring-red-200">
                <CardHeader className="space-y-1">
                  <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {info.icon}
                  </div>
                  <h4 className="text-xl font-semibold text-[#1a2238]">{info.title}</h4>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{info.description}</p>
                  <p className="text-red-600 font-medium mb-6">{info.value}</p>
                  <Button
                    variant="outline"
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    {info.action}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300 border-none ring-1 ring-gray-200">
              <CardHeader>
                <h4 className="text-xl font-semibold text-[#1a2238] flex items-center gap-2">
                  <MapPin className="text-red-600" size={20} />
                  Oficina Principal
                </h4>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="font-medium">Barcelona, España</span>
                </div>
                <div className="space-y-2 text-gray-600">
                  <p>Servicio Internacional</p>
                  <p>Soporte en Español e Inglés</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300 border-none ring-1 ring-gray-200">
              <CardHeader>
                <h4 className="text-xl font-semibold text-[#1a2238]">Redes Sociales</h4>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Síguenos para mantenerte actualizado sobre nuestros programas y eventos exclusivos.
                </p>
                <div className="flex gap-4 justify-center">
                  {socialMedia.map((social, index) => (
                    <HoverCard.Root key={index}>
                      <HoverCard.Trigger asChild>
                        <a
                          href={social.url}
                          className={`p-3 rounded-full transition-all duration-300 ${social.color}`}
                          aria-label={social.name}
                        >
                          {social.icon}
                        </a>
                      </HoverCard.Trigger>
                      <HoverCard.Portal>
                        <HoverCard.Content
                          className="data-[side=bottom]:animate-slideUpAndFade data-[side=right]:animate-slideLeftAndFade data-[side=left]:animate-slideRightAndFade data-[side=top]:animate-slideDownAndFade w-[300px] rounded-md bg-white p-5 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] data-[state=open]:transition-all"
                          sideOffset={5}
                        >
                          <div className="flex flex-col gap-[7px]">
                            <div className="flex items-center gap-4">
                              {social.icon}
                              <div className="flex flex-col">
                                <div className="text-[15px] font-medium leading-[1.5]">{social.name}</div>
                                <div className="text-[15px] leading-[1.5] text-gray-600">Síguenos en {social.name}</div>
                              </div>
                            </div>
                          </div>
                          <HoverCard.Arrow className="fill-white" />
                        </HoverCard.Content>
                      </HoverCard.Portal>
                    </HoverCard.Root>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mt-12"
        >
          <span className="inline-flex items-center rounded-full bg-green-50 px-6 py-2 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-600/10">
            Respuesta garantizada en menos de 24 horas
          </span>
        </motion.div>
      </div>
    </section>
  );
};
