import { ArrowRight, Star, Trophy, Target, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TextRotate } from "@/components/ui/text-rotate";
import * as Tooltip from "@radix-ui/react-tooltip";
import * as AspectRatio from "@radix-ui/react-aspect-ratio";
import * as Separator from "@radix-ui/react-separator";
import { Card } from "@/components/ui/card";

export const HeroSection = () => {
  const features = [
    {
      icon: <Trophy className="text-red-600" size={32} />,
      title: "Liderazgo Efectivo",
      description: "Desarrolla habilidades para liderar equipos y proyectos",
      gradient: "from-red-500/20 to-orange-500/20"
    },
    {
      icon: <Star className="text-red-600" size={32} />,
      title: "Finanzas Personales",
      description: "Aprende a gestionar y multiplicar tus ingresos",
      gradient: "from-red-500/20 to-pink-500/20"
    },
    {
      icon: <Crown className="text-red-600" size={32} />,
      title: "Oratoria Profesional",
      description: "Domina el arte de hablar en público",
      gradient: "from-red-500/20 to-purple-500/20"
    },
    {
      icon: <Target className="text-red-600" size={32} />,
      title: "Persuasión e Influencia",
      description: "Mejora tus habilidades de comunicación y negociación",
      gradient: "from-red-500/20 to-blue-500/20"
    }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.015]" />

      {/* Super Patch Logos */}
      <div className="absolute top-10 left-10 w-40 h-40">
        <div className="relative">
          <div className="absolute inset-0 rounded-full" />
          <AspectRatio.Root ratio={1}>
            <img src="/super-patch-peace.png" alt="Super Patch Peace" className="w-full h-full object-contain opacity-20 hover:opacity-30 transition-opacity duration-300" />
          </AspectRatio.Root>
        </div>
      </div>
      <div className="absolute bottom-10 right-10 w-40 h-40">
        <div className="relative">
          <div className="absolute inset-0 rounded-full" />
          <AspectRatio.Root ratio={1}>
            <img src="/super-patch-victory.png" alt="Super Patch Victory" className="w-full h-full object-contain opacity-20 hover:opacity-30 transition-opacity duration-300" />
          </AspectRatio.Root>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <span className="inline-flex items-center rounded-full bg-red-50 px-6 py-2 text-sm font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
              Formación Exclusiva para Asociados Super Patch
            </span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative mb-8"
          >
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-100 rounded-full blur-3xl opacity-30" />
            <h1 className="text-6xl md:text-7xl font-bold text-[#1a2238] mb-4">
              Alcanza tu
            </h1>
            <div className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent flex justify-center items-center">
              <TextRotate
                texts={[
                  "Potencial ",
                  "Liderazgo ",
                  "Éxito ",
                  "Libertad ",
                  "Propósito "
                ]}
                mainClassName="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent"
                staggerDuration={0.03}
                staggerFrom="last"
                rotationInterval={3000}
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
              />
            </div>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto"
          >
            Desarrolla las habilidades clave para destacar como asociado{" "}
            <span className="relative inline-block">
              <span className="relative z-10 font-semibold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                Super Patch
              </span>
              <span className="absolute inset-x-0 bottom-0 h-3 bg-red-100 -z-10 transform -skew-x-12" />
            </span>
            <span className="block mt-2 text-gray-500">
              Tu camino hacia el éxito empieza aquí.
            </span>
          </motion.p>

          <Separator.Root className="h-px w-1/3 mx-auto bg-gradient-to-r from-transparent via-red-200 to-transparent my-12" />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {features.map((feature, index) => (
              <Tooltip.Provider key={index}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Card className="group relative overflow-hidden p-6 border-none ring-1 ring-gray-200 hover:ring-red-200 transition-all duration-300">
                        <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                        <div className="relative z-10">
                          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            {feature.icon}
                          </div>
                          <h3 className="text-lg font-semibold mb-2 text-[#1a2238]">{feature.title}</h3>
                          <p className="text-gray-600 text-sm">{feature.description}</p>
                        </div>
                      </Card>
                    </motion.div>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade select-none rounded-lg bg-white px-4 py-3 text-sm leading-none shadow-lg will-change-[transform,opacity] border border-gray-100"
                      sideOffset={5}
                    >
                      Descubre más sobre {feature.title.toLowerCase()}
                      <Tooltip.Arrow className="fill-white" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-6 rounded-full text-lg font-medium flex items-center gap-2 group shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Comienza Tu Desarrollo
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-red-600 text-red-600 hover:bg-red-50 px-8 py-6 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Conoce más
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};