import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "¿Necesito experiencia previa en programación?",
    answer: "No es necesario tener experiencia previa en programación. El curso está diseñado para que puedas empezar desde cero y avanzar gradualmente, con un enfoque práctico y apoyo personalizado en cada paso del camino. Proporcionamos recursos adicionales y mentoría para asegurar que puedas seguir el ritmo del curso independientemente de tu nivel inicial."
  },
  {
    question: "¿Cuánto tiempo necesito dedicar al curso?",
    answer: "Recomendamos dedicar entre 5-10 horas semanales para obtener el máximo beneficio. El curso está diseñado para ser flexible y adaptarse a tu horario, con contenido accesible 24/7 y la posibilidad de avanzar a tu propio ritmo. Las sesiones en vivo son grabadas para que puedas verlas cuando te sea conveniente."
  },
  {
    question: "¿Qué herramientas necesito para empezar?",
    answer: "Solo necesitas una computadora con conexión a internet. Todas las herramientas que utilizaremos son basadas en la nube o te proporcionaremos acceso a ellas. Incluimos licencias gratuitas o de prueba para todas las herramientas premium necesarias durante el curso."
  },
  {
    question: "¿Recibo alguna certificación al terminar?",
    answer: "Sí, al completar el curso recibirás un certificado digital verificable que acredita tus nuevas habilidades en desarrollo de startups con IA. Este certificado es reconocido en la industria y puede ser compartido en LinkedIn y otras plataformas profesionales. Además, tendrás un portafolio de proyectos reales para demostrar tus capacidades."
  },
  {
    question: "¿Hay soporte disponible si tengo dudas?",
    answer: "Sí, ofrecemos múltiples niveles de soporte: correo electrónico prioritario con respuesta en menos de 24 horas, una comunidad activa de estudiantes en Discord, sesiones semanales de mentoría grupal, y la posibilidad de agendar sesiones one-on-one con instructores expertos según el plan que elijas."
  },
  {
    question: "¿Cómo me ayuda este curso a crear mi startup?",
    answer: "El curso te guía paso a paso en la creación de tu startup, desde la validación de tu idea hasta el lanzamiento al mercado. Aprenderás a utilizar IA para automatizar procesos, crear MVPs rápidamente, y escalar tu negocio. Incluye casos prácticos reales, templates de documentos legales y de negocio, y acceso a una red de emprendedores y mentores."
  },
  {
    question: "¿Qué pasa si no puedo asistir a todas las sesiones en vivo?",
    answer: "Todas las sesiones son grabadas y están disponibles en nuestra plataforma 24/7. Además, proporcionamos recursos adicionales, transcripciones y resúmenes de cada sesión. También puedes participar en nuestra comunidad online para hacer preguntas y recibir feedback en cualquier momento."
  },
  {
    question: "¿Qué tipo de apoyo post-curso ofrecen?",
    answer: "Después de completar el curso, tendrás acceso de por vida a las actualizaciones del material, membresía vitalicia a nuestra comunidad de alumni, invitaciones a eventos exclusivos de networking, y descuentos en futuros cursos y herramientas. También ofrecemos sesiones trimestrales de seguimiento para apoyar tu progreso."
  }
];

export const FAQSection = () => {
  return (
    <section className="py-24 bg-[#0A0F1C]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-300 mb-6">
            <HelpCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Preguntas Frecuentes</span>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text mb-4">
            ¿Tienes Dudas?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Aquí encontrarás respuestas detalladas a las preguntas más comunes sobre nuestro programa
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-6">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-gray-800/30 border border-gray-700/30 rounded-lg overflow-hidden hover:border-purple-500/30 transition-all duration-300"
              >
                <AccordionTrigger className="px-6 py-4 text-lg text-white hover:text-purple-400 transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-300 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};