import { User, Calendar, Mail, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const InstructorSection = () => {
  return (
    <section className="py-20 bg-[#0A0F1C] relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
            Conoce a tu Instructor
          </h2>
          
          <div className="relative w-40 h-40 mx-auto mb-8 group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <img
              src="/lovable-uploads/d151c78f-1431-4ffd-aa14-44cc1509a0cd.png"
              alt="Juan Camilo Gallego"
              className="relative rounded-full object-cover w-full h-full ring-4 ring-purple-500/50 transition-all duration-300 group-hover:scale-105 z-10"
            />
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-4">
            Juan Camilo Gallego
          </h3>
          
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Emprendedor y desarrollador con más de 5 años de experiencia en la creación de startups tecnológicas. 
            Especialista en desarrollo de software, integración de IA y automatización de procesos.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gray-800/30 border-gray-700/30 hover:border-purple-500/30 transition-all duration-300 hover:scale-105 group">
              <CardContent className="p-4 flex items-center gap-3">
                <User className="text-purple-400" />
                <span className="text-gray-300">Fundador de múltiples startups</span>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/30 border-gray-700/30 hover:border-purple-500/30 transition-all duration-300 hover:scale-105 group">
              <CardContent className="p-4 flex items-center gap-3">
                <Calendar className="text-blue-400" />
                <span className="text-gray-300">+5 años de experiencia</span>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/30 border-gray-700/30 hover:border-purple-500/30 transition-all duration-300 hover:scale-105 group">
              <CardContent className="p-4 flex items-center gap-3">
                <Mail className="text-pink-400" />
                <span className="text-gray-300">Soporte personalizado</span>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/30 border-gray-700/30 hover:border-purple-500/30 transition-all duration-300 hover:scale-105 group">
              <CardContent className="p-4 flex items-center gap-3">
                <MapPin className="text-indigo-400" />
                <span className="text-gray-300">Medellín, Colombia</span>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};