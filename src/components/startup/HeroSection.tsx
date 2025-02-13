import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Bot, Sparkles } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface HeroSectionProps {
  launchDate: string;
  price: number;
}

export const HeroSection = ({ launchDate, price }: HeroSectionProps) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(launchDate) - +new Date();
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    return timeLeft;
  };

  const timeLeft = calculateTimeLeft();

  return (
    <section className="relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-red-50/30" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.015]" />

      <div className="container relative mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center lg:text-left"
          >
            <Badge 
              variant="outline" 
              className="mb-4 px-3 py-1 border-red-200 text-red-700 bg-red-50/50"
            >
              Próximo Lanzamiento
            </Badge>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="block text-gray-900">
                Construye tu Startup
              </span>
              <span className="block bg-gradient-to-r from-red-600 to-red-800 text-transparent bg-clip-text">
                Potenciada por IA
              </span>
            </h1>
            
            <p className="mx-auto lg:mx-0 max-w-2xl text-xl text-gray-600 mb-8">
              Aprende a crear una startup rentable utilizando las últimas tecnologías de Inteligencia Artificial. 
              Desde la ideación hasta el lanzamiento, te guiamos en cada paso.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Bot className="mr-2 h-5 w-5" />
                Reserva tu Cupo
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                className="border-red-200 text-gray-700 hover:bg-red-50"
              >
                <Sparkles className="mr-2 h-5 w-5 text-red-600" />
                Ver Demo
              </Button>
            </div>

            <p className="mt-4 text-sm text-gray-600">
              Precio de lanzamiento: {formatPrice(price)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl bg-white/80 backdrop-blur-sm border border-red-100 p-8 shadow-lg"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Lanzamiento en:
              </h2>
              <p className="text-gray-600">
                Aprovecha el precio especial de prelanzamiento
              </p>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {Object.entries(timeLeft).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-gradient-to-br from-red-50 to-white p-4 rounded-xl border border-red-100"
                >
                  <div className="text-2xl font-bold text-red-700">
                    {value}
                  </div>
                  <div className="text-sm text-gray-600 capitalize">
                    {key}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Reserva con {formatPrice(price/2)} de Descuento
              </Button>
              <p className="mt-2 text-sm text-gray-600">
                * Oferta válida hasta el lanzamiento
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};