import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import * as Separator from "@radix-ui/react-separator";

export const CTASection = () => {
  return (
    <section className="relative py-16 overflow-hidden bg-gradient-to-br from-red-600 via-red-700 to-red-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
      
      {/* Gradient Decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-white/10 via-white/20 to-white/10" />
        <div className="absolute -top-20 left-1/4 w-64 h-64 bg-gradient-to-br from-white/20 to-red-500/30 rounded-full mix-blend-soft-light filter blur-3xl opacity-70 animate-float" />
        <div className="absolute -bottom-20 right-1/4 w-64 h-64 bg-gradient-to-br from-white/20 to-red-500/30 rounded-full mix-blend-soft-light filter blur-3xl opacity-70 animate-float-slow" />
      </div>

      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-900/50 via-transparent to-red-900/50" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="relative inline-block mb-8">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-white relative z-10"
            >
              ¿Listo para Transformar tu Carrera?
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-white/10 rounded-full filter blur-3xl opacity-30 z-[-1]" />
            </motion.h2>
            <Separator.Root className="h-1 w-16 mx-auto bg-gradient-to-r from-white/40 to-white/60 rounded-full my-6" />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <Link to="/landing-page/startup-ai">
              <Button
                size="lg"
                className="bg-white hover:bg-gray-100 text-red-600 hover:text-red-700 px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group relative overflow-hidden border-2 border-white/20"
              >
                <span className="relative z-10 flex items-center gap-2 font-semibold">
                  Comienza Ahora
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="text-white hover:text-white/90 hover:bg-white/10 px-6 py-2 group border border-white/30 hover:border-white/50 rounded-full transition-all duration-300"
            >
              <Sparkles className="mr-2 h-4 w-4 opacity-70 group-hover:opacity-100" />
              Ver Programa
            </Button>
          </motion.div>

          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="block mt-6 text-white/60 text-sm"
          >
            Únete a +1000 asociados que ya están transformando sus vidas
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
};