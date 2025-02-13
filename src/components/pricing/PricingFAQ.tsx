import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

const faqs = [
  {
    question: "¿Qué incluye la suscripción Premium?",
    answer: "La suscripción Premium incluye acceso ilimitado a todos nuestros cursos, ejercicios prácticos, soporte prioritario, certificados de finalización, acceso a la comunidad exclusiva y mentoría grupal mensual."
  },
  {
    question: "¿Puedo cancelar mi suscripción en cualquier momento?",
    answer: "Sí, puedes cancelar tu suscripción en cualquier momento. No hay compromisos a largo plazo y no se aplican penalizaciones por cancelación."
  },
  {
    question: "¿Cómo funciona la mentoría personalizada?",
    answer: "La mentoría personalizada incluye sesiones uno a uno con expertos en el área que te interesa. Te ayudarán a establecer objetivos, resolver dudas y acelerar tu desarrollo profesional."
  },
  {
    question: "¿Ofrecen descuentos para equipos?",
    answer: "Sí, ofrecemos descuentos especiales para equipos y empresas. Contáctanos para obtener una cotización personalizada basada en el tamaño de tu equipo."
  }
];

export const PricingFAQ = () => {
  return (
    <section className="py-20">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-600 to-red-800 text-transparent bg-clip-text">
            Preguntas Frecuentes
          </h2>
          <Separator className="w-20 mx-auto bg-gradient-to-r from-red-600 to-red-800 my-6" />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="mb-4">
                <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                {faq.question}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {faq.answer}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};