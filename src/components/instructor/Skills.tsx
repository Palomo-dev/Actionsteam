import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Brain, Lightbulb, Target, Users } from "lucide-react";

export const Skills = () => {
  const skillCategories = [
    {
      title: "Habilidades Técnicas",
      icon: <Brain className="w-6 h-6 text-red-600" />,
      skills: [
        { name: "Desarrollo Full Stack", level: 95 },
        { name: "Arquitectura de Software", level: 90 },
        { name: "DevOps & Cloud", level: 85 },
        { name: "Inteligencia Artificial", level: 88 }
      ]
    },
    {
      title: "Habilidades de Negocio",
      icon: <Target className="w-6 h-6 text-red-600" />,
      skills: [
        { name: "Estrategia Empresarial", level: 92 },
        { name: "Gestión de Proyectos", level: 88 },
        { name: "Análisis de Mercado", level: 85 },
        { name: "Optimización de Procesos", level: 90 }
      ]
    },
    {
      title: "Habilidades de Liderazgo",
      icon: <Users className="w-6 h-6 text-red-600" />,
      skills: [
        { name: "Gestión de Equipos", level: 95 },
        { name: "Mentoría", level: 92 },
        { name: "Comunicación", level: 90 },
        { name: "Resolución de Conflictos", level: 88 }
      ]
    },
    {
      title: "Habilidades de Innovación",
      icon: <Lightbulb className="w-6 h-6 text-red-600" />,
      skills: [
        { name: "Design Thinking", level: 90 },
        { name: "Metodologías Ágiles", level: 95 },
        { name: "Innovación Tecnológica", level: 92 },
        { name: "Transformación Digital", level: 88 }
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
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <Badge 
                variant="outline" 
                className="mb-4 px-3 py-1 border-red-200 text-red-700 bg-red-50/50"
              >
                Competencias
              </Badge>
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-red-600 to-red-800 text-transparent bg-clip-text">
                Habilidades y Competencias
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {skillCategories.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {category.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {category.title}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {category.skills.map((skill, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">
                            {skill.name}
                          </span>
                          <span className="text-sm font-medium text-red-600">
                            {skill.level}%
                          </span>
                        </div>
                        <Progress 
                          value={skill.level} 
                          className="h-2 bg-red-100"
                          indicatorClassName="bg-gradient-to-r from-red-600 to-red-800"
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};