import { Quote } from "lucide-react";

export const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "Los eventos transformaron mi visión del emprendimiento digital. Aprendí estrategias prácticas que pude implementar inmediatamente en mi negocio. El ROI fue inmediato y la comunidad es increíble.",
      name: "María González",
      role: "Emprendedora Digital",
      company: "MG Digital",
      achievement: "Incrementó ventas en 200%"
    },
    {
      quote: "La calidad del contenido y la experiencia práctica que obtuve superaron mis expectativas. Los mentores son expertos en su campo y el networking con otros profesionales fue invaluable.",
      name: "Carlos Rodríguez",
      role: "Consultor de Marketing",
      company: "CR Consulting",
      achievement: "Duplicó su cartera de clientes"
    },
    {
      quote: "Estos eventos no solo me dieron conocimiento teórico, sino también herramientas prácticas para escalar mi negocio. La metodología es clara y los resultados son tangibles.",
      name: "Ana Valencia",
      role: "Coach de Negocios",
      company: "AV Coaching",
      achievement: "Lanzó 3 programas exitosos"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
          TESTIMONIOS DE ÉXITO
        </h2>
        <p className="text-center text-gray-600 mb-16 max-w-3xl mx-auto">
          Descubre cómo nuestros eventos han impactado positivamente la vida profesional y los negocios de nuestros participantes. Historias reales de transformación y crecimiento.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
            >
              <Quote className="w-10 h-10 text-red-800 mb-6 opacity-50" />
              <p className="text-gray-600 mb-8 italic">"{testimonial.quote}"</p>
              <div className="border-t pt-6">
                <h4 className="font-semibold text-red-800 text-lg">{testimonial.name}</h4>
                <p className="text-gray-600">{testimonial.role}</p>
                <p className="text-gray-500">{testimonial.company}</p>
                <p className="text-green-600 mt-2 font-medium">{testimonial.achievement}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <p className="text-gray-600">
            Únete a nuestra comunidad de emprendedores y profesionales que ya han transformado sus carreras y negocios a través de nuestros eventos especializados.
          </p>
        </div>
      </div>
    </section>
  );
};
