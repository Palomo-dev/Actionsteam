import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const PricingHeader = () => {
  return (
    <div className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.015]" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16">
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
              Planes Flexibles
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-red-600 to-red-800 text-transparent bg-clip-text">
              INVIERTE EN TU DESARROLLO
            </h2>
            <Separator className="w-20 mx-auto bg-gradient-to-r from-red-600 to-red-800 my-6" />
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Elige el plan que mejor se adapte a tus objetivos. Todos nuestros planes incluyen acceso a la comunidad exclusiva y mentoría personalizada.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};