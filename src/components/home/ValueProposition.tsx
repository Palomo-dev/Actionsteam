import { TrendingUp, Globe, Users, Award, ChevronRight, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { WorldMap } from "@/components/ui/world-map";

export const ValueProposition = () => {
  const stats = [
    {
      number: "1000+",
      title: "Asociados Activos",
      description: "Profesionales transformando sus vidas",
      icon: <Users className="w-6 h-6 text-red-600" />
    },
    {
      number: "96%",
      title: "Tasa de Satisfacción",
      description: "Excelencia en formación ejecutiva",
      icon: <Award className="w-6 h-6 text-red-600" />
    },
    {
      number: "4",
      title: "Áreas de Expertise",
      description: "Liderazgo, Finanzas, Oratoria y Persuasión",
      icon: <TrendingUp className="w-6 h-6 text-red-600" />
    },
    {
      number: "24/7",
      title: "Soporte Continuo",
      description: "Acompañamiento personalizado",
      icon: <Globe className="w-6 h-6 text-red-600" />
    }
  ];

  const locations = [
    { name: "Madrid", country: "España", associates: "150+", lat: 40.4168, lng: -3.7038 },
    { name: "Berlín", country: "Alemania", associates: "180+", lat: 52.5200, lng: 13.4050 },
    { name: "Estambul", country: "Turquía", associates: "140+", lat: 41.0082, lng: 28.9784 },
    { name: "Nueva York", country: "Estados Unidos", associates: "200+", lat: 40.7128, lng: -74.0060 },
    { name: "Toronto", country: "Canadá", associates: "130+", lat: 43.6532, lng: -79.3832 },
    { name: "Ciudad de México", country: "México", associates: "170+", lat: 19.4326, lng: -99.1332 },
    { name: "Bogotá", country: "Colombia", associates: "160+", lat: 4.7110, lng: -74.0721 }
  ];

  const mapConnections = locations.slice(0, -1).map((start, index) => ({
    start: { lat: start.lat, lng: start.lng },
    end: { lat: locations[index + 1].lat, lng: locations[index + 1].lng }
  }));

  return (
    <>
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Badge 
                variant="outline" 
                className="mb-4 px-4 py-1 border-red-200 text-red-700 bg-red-50/50"
              >
                Formación Integral
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-red-600 to-red-800 text-transparent bg-clip-text">
                IMPACTO Y EXCELENCIA
              </h2>
              <Separator className="w-20 mx-auto bg-gradient-to-r from-red-600 to-red-800 my-6" />
              <p className="text-gray-600 text-lg">
                Formamos líderes excepcionales dentro de Super Patch, potenciando sus habilidades en liderazgo, finanzas personales, oratoria y persuasión.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="relative group hover:shadow-lg transition-all duration-300 border-red-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                  <CardHeader className="pb-4">
                    <div className="w-12 h-12 rounded-lg bg-red-50/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {stat.icon}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-red-600 mb-2">{stat.number}</div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">{stat.title}</h3>
                    <p className="text-gray-600">{stat.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Badge 
                variant="outline" 
                className="mb-4 px-4 py-1 border-red-200 text-red-700 bg-red-50/50"
              >
                Red Global
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-red-600 to-red-800 text-transparent bg-clip-text">
                PRESENCIA REGIONAL
              </h2>
              <Separator className="w-20 mx-auto bg-gradient-to-r from-red-600 to-red-800 my-6" />
              <p className="text-gray-600 text-lg">
                Nuestra red de asociados se extiende por toda Latinoamérica, creando una comunidad vibrante de líderes comprometidos con la excelencia.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr,1fr] gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:sticky lg:top-24 -mx-4 lg:mx-0"
            >
              <div className="bg-white shadow-[0_0_15px_rgba(0,0,0,0.05)] rounded-xl overflow-hidden">
                <WorldMap dots={mapConnections} lineColor="#dc2626" />
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {locations.map((location, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="group px-4 py-3 rounded-lg hover:bg-red-50/50 transition-colors duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-100/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MapPin className="w-4 h-4 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-800 truncate">{location.name}</h3>
                        <p className="text-xs text-gray-500">{location.country}</p>
                      </div>
                      <Badge variant="secondary" className="bg-red-50/50 text-red-600 text-xs">
                        {location.associates}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: locations.length * 0.1 }}
                className="sm:col-span-2 lg:col-span-1 mt-2"
              >
                <Button 
                  variant="outline" 
                  className="w-full group border-red-100 text-red-600 hover:border-transparent hover:bg-gradient-to-r hover:from-red-600 hover:to-red-800 hover:text-white text-sm transition-all duration-300"
                >
                  Conoce Nuestra Comunidad
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};