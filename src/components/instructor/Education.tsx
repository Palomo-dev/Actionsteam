import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { GraduationCap, Calendar, MapPin } from "lucide-react";

export const Education = () => {
  const education = [
    {
      degree: "Máster en Inteligencia Artificial",
      institution: "Universidad de Stanford",
      location: "California, USA",
      period: "2018 - 2020",
      achievements: [
        "Especialización en Machine Learning",
        "Investigación en Deep Learning",
        "Proyectos de NLP"
      ]
    },
    {
      degree: "Ingeniería de Software",
      institution: "Universidad Nacional",
      location: "Medellín, Colombia",
      period: "2014 - 2018",
      achievements: [
        "Mejor Promedio de la Promoción",
        "Líder de Proyectos Estudiantiles",
        "Premio a la Innovación"
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
                Formación Académica
              </Badge>
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-red-600 to-red-800 text-transparent bg-clip-text">
                Educación y Certificaciones
              </h2>
            </div>

            <div className="space-y-6">
              {education.map((edu, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <GraduationCap className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {edu.degree}
                      </h3>
                      <p className="text-gray-600">{edu.institution}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{edu.period}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{edu.location}</span>
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {edu.achievements.map((achievement, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-600">
                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};