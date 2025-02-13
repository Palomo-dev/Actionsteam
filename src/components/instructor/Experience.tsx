import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { Building2, Calendar } from "lucide-react";

export const Experience = () => {
  const experiences = [
    {
      company: "Super Patch",
      role: "CEO & Fundador",
      period: "2020 - Presente",
      description: "Liderando el desarrollo de soluciones innovadoras en IA y automatización.",
      achievements: [
        "Desarrollo de productos SaaS exitosos",
        "Gestión de equipos internacionales",
        "Implementación de metodologías ágiles"
      ]
    },
    {
      company: "Tech Innovators",
      role: "CTO",
      period: "2018 - 2020",
      description: "Dirección técnica y estratégica de proyectos de transformación digital.",
      achievements: [
        "Arquitectura de sistemas escalables",
        "Optimización de procesos de desarrollo",
        "Mentoring de equipos técnicos"
      ]
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
                Trayectoria
              </Badge>
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-red-600 to-red-800 text-transparent bg-clip-text">
                Experiencia Profesional
              </h2>
            </div>

            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gradient-to-b before:from-red-600 before:to-red-800"
                >
                  <div className="absolute left-0 top-0 w-2 h-2 bg-red-600 rounded-full -translate-x-[5px]" />
                  
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                    <div className="flex items-center gap-2 text-red-600">
                      <Building2 className="w-5 h-5" />
                      <h3 className="text-xl font-semibold">{exp.company}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{exp.period}</span>
                    </div>
                  </div>

                  <div className="bg-red-50/30 rounded-lg p-4 hover:bg-red-50/50 transition-colors">
                    <h4 className="font-medium text-gray-900 mb-2">{exp.role}</h4>
                    <p className="text-gray-600 mb-4">{exp.description}</p>
                    <ul className="space-y-2">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-center gap-2 text-gray-600">
                          <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {index < experiences.length - 1 && (
                    <Separator className="my-6" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};