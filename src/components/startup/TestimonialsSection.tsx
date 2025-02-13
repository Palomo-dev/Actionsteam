import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Ana Martínez",
    role: "Fundadora de TechStartup",
    image: "https://i.pravatar.cc/150?img=1",
    text: "Este curso transformó mi idea en una startup real. La combinación de herramientas de IA y mentoría práctica me dio la confianza para lanzar mi negocio. Ahora tengo clientes pagando y un producto que crece cada día.",
    company: "TechStartup",
    results: "Lanzamiento exitoso en 3 meses"
  },
  {
    name: "Carlos Rodríguez",
    role: "CEO de AIServices",
    image: "https://i.pravatar.cc/150?img=2",
    text: "La metodología del curso es excepcional. Aprendí a usar IA para automatizar procesos y crear un MVP que mis clientes aman. El ROI del curso fue inmediato con mi primer cliente empresarial.",
    company: "AIServices",
    results: "Primer contrato empresarial"
  },
  {
    name: "Laura Gómez",
    role: "Fundadora de DigitalSolutions",
    image: "https://i.pravatar.cc/150?img=3",
    text: "Gracias a este curso, pude automatizar mi negocio y escalar sin problemas. Las herramientas y el conocimiento que adquirí me permitieron triplicar mis ingresos en 6 meses.",
    company: "DigitalSolutions",
    results: "300% crecimiento en 6 meses"
  }
];

export const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-[#0A0F1C] relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          Historias de Éxito
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, i) => (
            <Card 
              key={i} 
              className="bg-gray-800/30 border border-gray-700/30 hover:border-purple-500/30 hover:bg-gray-800/50 transition-all duration-300 hover:scale-105 group animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300 mb-6 text-lg italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-white text-lg group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400">
                      {testimonial.name}
                    </div>
                    <div className="text-purple-400">
                      {testimonial.role}
                    </div>
                    <div className="text-green-400 text-sm mt-1">
                      {testimonial.results}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};