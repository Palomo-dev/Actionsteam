import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Code2, Database, Cloud, Lock } from "lucide-react";

export const TechnicalInfo = () => {
  const technologies = [
    {
      category: "Desarrollo Frontend",
      icon: <Code2 className="w-6 h-6 text-red-600" />,
      items: [
        "React.js", "Next.js", "TypeScript",
        "Tailwind CSS", "Framer Motion",
        "Vue.js", "Angular"
      ]
    },
    {
      category: "Backend & Bases de Datos",
      icon: <Database className="w-6 h-6 text-red-600" />,
      items: [
        "Node.js", "Python", "Django",
        "PostgreSQL", "MongoDB", "Redis",
        "GraphQL"
      ]
    },
    {
      category: "Cloud & DevOps",
      icon: <Cloud className="w-6 h-6 text-red-600" />,
      items: [
        "AWS", "Google Cloud", "Docker",
        "Kubernetes", "CI/CD", "Terraform"
      ]
    },
    {
      category: "Seguridad & Otros",
      icon: <Lock className="w-6 h-6 text-red-600" />,
      items: [
        "OAuth 2.0", "JWT", "HTTPS",
        "WebSockets", "REST APIs"
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
                Stack Tecnológico
              </Badge>
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-red-600 to-red-800 text-transparent bg-clip-text">
                Tecnologías y Herramientas
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {technologies.map((tech, index) => (
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
                      {tech.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {tech.category}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {tech.items.map((item, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="bg-red-50 text-red-700 hover:bg-red-100 transition-colors border-none"
                      >
                        {item}
                      </Badge>
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