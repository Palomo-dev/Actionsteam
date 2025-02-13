import { HeroSection } from "@/components/startup/HeroSection";
import { ModulesSection } from "@/components/startup/ModulesSection";
import { FeaturesSection } from "@/components/startup/FeaturesSection";
import { TestimonialsSection } from "@/components/startup/TestimonialsSection";
import { CTASection } from "@/components/startup/CTASection";
import { FAQSection } from "@/components/startup/FAQSection";
import { InstructorSection } from "@/components/startup/InstructorSection";
import { BenefitsSection } from "@/components/startup/BenefitsSection";
import { Brain, Code, Bot, Target, Palette, ChartBar, MessageSquare, Rocket } from "lucide-react";

const modules = [
  {
    icon: <Brain className="w-8 h-8 text-red-600" />,
    title: "Ideación y Validación",
    description: "Transforma tus ideas en conceptos validados por el mercado",
    objective: "Desarrollar y validar una idea de negocio viable usando IA",
    steps: [
      "Técnicas de ideación con ChatGPT",
      "Investigación de mercado con IA",
      "Validación con clientes potenciales",
      "Análisis de competencia"
    ],
    tools: ["ChatGPT", "Typeform", "Google Forms", "N8N"],
    benefits: [
      "Validación rápida de ideas",
      "Feedback real del mercado",
      "Minimización de riesgos",
      "Identificación de oportunidades"
    ]
  },
  {
    icon: <Palette className="w-8 h-8 text-red-600" />,
    title: "Identidad de Marca",
    description: "Crea una marca memorable y profesional con IA",
    objective: "Desarrollar una identidad de marca única y atractiva",
    steps: [
      "Diseño de logo con IA",
      "Creación de paleta de colores",
      "Desarrollo de voz de marca",
      "Diseño de materiales visuales"
    ],
    tools: ["Ideogram", "Freepik", "Canva", "ChatGPT"],
    benefits: [
      "Marca profesional",
      "Identidad visual coherente",
      "Materiales de marketing listos",
      "Diferenciación en el mercado"
    ]
  },
  {
    icon: <ChartBar className="w-8 h-8 text-red-600" />,
    title: "Planeación Estratégica",
    description: "Define la ruta al éxito de tu startup",
    objective: "Crear un plan de negocio sólido y escalable",
    steps: [
      "Modelo de negocio",
      "Estrategia de monetización",
      "Plan financiero",
      "Métricas clave"
    ],
    tools: ["N8N", "Stripe", "Mercado Pago", "Webhooks"],
    benefits: [
      "Plan de negocio claro",
      "Estrategia de crecimiento",
      "Modelo financiero viable",
      "KPIs definidos"
    ]
  },
  {
    icon: <Code className="w-8 h-8 text-red-600" />,
    title: "Desarrollo del MVP",
    description: "Construye tu producto mínimo viable",
    objective: "Crear un MVP funcional y atractivo",
    steps: [
      "Diseño de interfaz",
      "Desarrollo con Lovable",
      "Integración de IA",
      "Testing y optimización"
    ],
    tools: ["Lovable", "Supabase", "N8N", "ChatGPT"],
    benefits: [
      "Producto funcional rápido",
      "Arquitectura escalable",
      "Integración de IA",
      "Base de usuarios inicial"
    ]
  },
  {
    icon: <Target className="w-8 h-8 text-red-600" />,
    title: "Presencia Digital",
    description: "Establece una fuerte presencia online",
    objective: "Crear una presencia digital efectiva",
    steps: [
      "Sitio web profesional",
      "Optimización SEO",
      "Contenido de valor",
      "Redes sociales"
    ],
    tools: ["Lovable", "N8N", "ChatGPT", "Canva"],
    benefits: [
      "Visibilidad online",
      "Autoridad en el mercado",
      "Generación de leads",
      "Comunidad engaged"
    ]
  },
  {
    icon: <MessageSquare className="w-8 h-8 text-red-600" />,
    title: "Marketing Digital",
    description: "Atrae y convierte clientes potenciales",
    objective: "Implementar estrategias efectivas de marketing digital",
    steps: [
      "Marketing de contenidos",
      "Email marketing",
      "Publicidad digital",
      "Analytics y optimización"
    ],
    tools: ["N8N", "ChatGPT", "Google Analytics", "Meta Ads"],
    benefits: [
      "Tráfico cualificado",
      "Conversiones optimizadas",
      "ROI medible",
      "Escalabilidad"
    ]
  },
  {
    icon: <Bot className="w-8 h-8 text-red-600" />,
    title: "Servicio al Cliente",
    description: "Automatiza y mejora la atención al cliente",
    objective: "Crear un sistema de soporte eficiente y escalable",
    steps: [
      "Chatbots inteligentes",
      "Automatización de soporte",
      "Gestión de tickets",
      "Análisis de satisfacción"
    ],
    tools: ["Respond.io", "N8N", "ChatGPT", "Webhooks"],
    benefits: [
      "Atención 24/7",
      "Escalabilidad del soporte",
      "Satisfacción del cliente",
      "Eficiencia operativa"
    ]
  },
  {
    icon: <Rocket className="w-8 h-8 text-red-600" />,
    title: "Lanzamiento y Escalamiento",
    description: "Lanza y escala tu startup con éxito",
    objective: "Preparar y ejecutar un lanzamiento exitoso",
    steps: [
      "Estrategia de lanzamiento",
      "Growth hacking",
      "Optimización de procesos",
      "Escalamiento del negocio"
    ],
    tools: ["N8N", "ChatGPT", "Analytics", "Webhooks"],
    benefits: [
      "Lanzamiento exitoso",
      "Crecimiento sostenible",
      "Procesos optimizados",
      "Negocio escalable"
    ]
  }
];

const StartupAILanding = () => {
  return (
    <div className="bg-white">
      <HeroSection launchDate="2025-02-05" price={300000} />
      <InstructorSection />
      <BenefitsSection />
      <FeaturesSection />
      <ModulesSection modules={modules} />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </div>
  );
};

export default StartupAILanding;