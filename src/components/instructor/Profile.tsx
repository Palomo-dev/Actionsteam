import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Code2, Briefcase, Brain, Users } from "lucide-react";

export const Profile = () => {
  const highlights = [
    {
      icon: <Code2 className="w-5 h-5 text-red-600" />,
      title: "Desarrollo Full Stack",
      description: "Especializado en tecnologías modernas"
    },
    {
      icon: <Briefcase className="w-5 h-5 text-red-600" />,
      title: "Emprendedor",
      description: "Fundador de múltiples startups"
    },
    {
      icon: <Brain className="w-5 h-5 text-red-600" />,
      title: "Mentor",
      description: "Formación de nuevos talentos"
    },
    {
      icon: <Users className="w-5 h-5 text-red-600" />,
      title: "Líder de Equipo",
      description: "Gestión de equipos ágiles"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-12"
    >
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-50" />
        <div className="relative p-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <Badge 
                variant="outline" 
                className="mb-4 px-3 py-1 border-red-200 text-red-700 bg-red-50/50"
              >
                Sobre Mí
              </Badge>
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-red-600 to-red-800 text-transparent bg-clip-text">
                Desarrollador y Emprendedor Apasionado
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Con más de una década de experiencia en el desarrollo de software y emprendimiento, 
                me especializo en ayudar a otros desarrolladores a alcanzar su máximo potencial. 
                Mi enfoque combina conocimientos técnicos profundos con una visión empresarial práctica.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {highlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group p-4 rounded-lg hover:bg-red-50/50 transition-colors duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-red-100/50 flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                    {highlight.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {highlight.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {highlight.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};