import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface Module {
  icon: JSX.Element;
  title: string;
  description: string;
  objective: string;
  steps: string[];
  tools: string[];
  benefits: string[];
}

interface ModulesSectionProps {
  modules: Module[];
}

export const ModulesSection = ({ modules }: ModulesSectionProps) => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-transparent to-red-50/30" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.015]" />
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <Badge 
            variant="outline" 
            className="mb-4 px-3 py-1 border-red-200 text-red-700 bg-red-50/50"
          >
            Programa Completo
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-red-600 to-red-800 text-transparent bg-clip-text">
            Módulos del Programa
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Un programa estructurado que te guía desde la idea hasta el lanzamiento de tu startup
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module, index) => (
            <motion.div
              key={module.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full group hover:shadow-lg transition-all duration-300 border-red-100">
                <div className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {module.icon}
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    {module.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4">
                    {module.description}
                  </p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">
                        Objetivo:
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {module.objective}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">
                        Pasos:
                      </h4>
                      <ul className="space-y-2">
                        {module.steps.map((step, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 mt-0.5 text-red-600 flex-shrink-0" />
                            <span className="text-gray-600">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">
                        Herramientas:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {module.tools.map((tool) => (
                          <Badge
                            key={tool}
                            variant="outline"
                            className="border-red-200 text-red-700 bg-red-50/50"
                          >
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">
                        Beneficios:
                      </h4>
                      <ul className="space-y-2">
                        {module.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 mt-0.5 text-red-600 flex-shrink-0" />
                            <span className="text-gray-600">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};