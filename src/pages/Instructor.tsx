import { Header } from "@/components/instructor/Header";
import { Profile } from "@/components/instructor/Profile";
import { Experience } from "@/components/instructor/Experience";
import { Education } from "@/components/instructor/Education";
import { TechnicalInfo } from "@/components/instructor/TechnicalInfo";
import { Skills } from "@/components/instructor/Skills";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Users, Trophy, Target } from "lucide-react";
import { motion } from "framer-motion";

const Instructor = () => {
  const features = [
    {
      icon: <Trophy className="w-5 h-5 text-red-600" />,
      title: "Experiencia Comprobada",
      description: "Más de 10 años formando líderes"
    },
    {
      icon: <Users className="w-5 h-5 text-red-600" />,
      title: "Comunidad Activa",
      description: "Red de profesionales en crecimiento"
    },
    {
      icon: <Target className="w-5 h-5 text-red-600" />,
      title: "Enfoque Práctico",
      description: "Metodología orientada a resultados"
    },
    {
      icon: <Calendar className="w-5 h-5 text-red-600" />,
      title: "Horarios Flexibles",
      description: "Aprende a tu propio ritmo"
    }
  ];

  return (
    <div className="w-full min-h-full relative bg-white">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.015]" />
      <div className="container mx-auto px-4 py-12 relative">
        <Header
          name="Juan Camilo Gallego Aguirre"
          birthDate="16 de abril de 1997"
          email="imagine.gallego@gmail.com"
          phone="+57 304 1315976"
          location="Medellín, Colombia"
        />
        <Profile />
        <Education />
        <Experience />
        <TechnicalInfo />
        <Skills />
        
        <section className="py-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative max-w-5xl mx-auto"
          >
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-50" />
              <div className="relative p-8 md:p-12">
                <div className="text-center mb-12">
                  <Badge 
                    variant="outline" 
                    className="mb-4 px-4 py-1 border-red-200 text-red-700 bg-red-50/50"
                  >
                    Formación Exclusiva
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-red-600 to-red-800 text-transparent bg-clip-text">
                    Transforma tu Futuro Profesional
                  </h2>
                  <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    Únete a nuestra comunidad de líderes y desarrolla las habilidades clave para destacar en el mundo empresarial.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="group p-4 rounded-lg hover:bg-red-50/50 transition-colors duration-300"
                    >
                      <div className="w-10 h-10 rounded-lg bg-red-100/50 flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                        {feature.icon}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {feature.description}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                  <Link to="/cursos">
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white px-8 py-6 rounded-full text-lg font-medium flex items-center gap-2 group shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Comienza Tu Desarrollo
                      <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/precios">
                    <Button 
                      variant="outline"
                      size="lg"
                      className="border-2 border-red-600 text-red-600 hover:bg-red-50 px-8 py-6 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Ver Planes
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Instructor;