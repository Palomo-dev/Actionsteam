import { Star, CheckCircle2, Trophy, GraduationCap } from "lucide-react";

export const BenefitsSection = () => {
  const benefits = [
    {
      icon: <Star className="text-yellow-400" size={32} />,
      title: "Contenido Actualizado",
      description: "Mantente al día con las últimas tecnologías y tendencias en IA",
    },
    {
      icon: <CheckCircle2 className="text-green-500" size={32} />,
      title: "Aprendizaje Práctico",
      description: "Proyectos reales y ejercicios prácticos con herramientas modernas",
    },
    {
      icon: <Trophy className="text-orange-500" size={32} />,
      title: "Certificación Profesional",
      description: "Obtén certificados reconocidos en la industria",
    },
    {
      icon: <GraduationCap className="text-blue-500" size={32} />,
      title: "Mentoría Personalizada",
      description: "Acceso a mentores expertos en IA y desarrollo",
    },
  ];

  return (
    <section className="py-20 bg-[#0A0F1C] relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
          ¿Por qué elegir este curso?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-gray-800/30 p-8 rounded-xl border border-gray-700/30 hover:border-purple-500/30 hover:bg-gray-800/50 transition-all duration-300 hover:scale-105 animate-fade-in group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-16 h-16 bg-gray-700/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white text-center group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400">
                {benefit.title}
              </h3>
              <p className="text-gray-400 text-center group-hover:text-gray-300">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};