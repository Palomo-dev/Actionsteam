import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PricingHeader } from "@/components/pricing/PricingHeader";
import { PricingCard } from "@/components/pricing/PricingCard";
import { PricingFAQ } from "@/components/pricing/PricingFAQ";

const pricingPlans = [
  {
    id: 1,
    title: "Suscripción Premium",
    description: "Acceso completo a todos nuestros cursos y recursos",
    price: "200.000",
    period: "mes",
    features: [
      "Acceso ilimitado a todos los cursos",
      "Ejercicios prácticos",
      "Soporte por email prioritario",
      "Certificados de finalización",
      "Acceso a la comunidad exclusiva",
      "Mentoría grupal mensual",
      "Recursos exclusivos",
      "Acceso a workshops en vivo"
    ],
    popular: true,
    ctaText: "Comenzar Ahora",
    paymentNote: "Pago seguro con Stripe",
    stripePriceId: "price_1QdMyQKfpF4gUTRJtxCDL7nc",
    gradient: "from-red-600 to-red-800"
  },
  {
    id: 2,
    title: "Plan Anual",
    description: "Ahorra con nuestro plan anual empresarial",
    price: "Personalizado",
    features: [
      "Todo lo del Plan Premium",
      "2 meses gratis",
      "Mentoría personalizada",
      "Soporte prioritario 24/7",
      "Acceso API empresarial",
      "Dashboard analítico",
      "Capacitación para equipos"
    ],
    popular: false,
    ctaText: "Contactar Ventas",
    gradient: "from-red-600 to-red-800"
  },
  {
    id: 3,
    title: "Plan Empresarial",
    description: "Solución completa para equipos y empresas",
    price: "Personalizado",
    features: [
      "Todo lo del Plan Anual",
      "Implementación personalizada",
      "Soporte técnico dedicado",
      "Capacitación in-company",
      "Reportes personalizados",
      "SLA garantizado",
      "Integración con sistemas existentes"
    ],
    popular: false,
    ctaText: "Contactar Ventas",
    gradient: "from-red-600 to-red-800"
  },
];

const Pricing = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePlanAction = async (plan: typeof pricingPlans[0]) => {
    if (plan.stripePriceId) {
      // Si tiene stripePriceId, redirigir al checkout
      navigate(`/checkout?type=subscription&priceId=${plan.stripePriceId}&price=${plan.price}`);
    } else {
      // Para planes personalizados, mostrar un toast
      toast({
        title: "Contacto de ventas",
        description: "Un representante se pondrá en contacto contigo pronto.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <PricingHeader />

      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              isLoading={isLoading}
              onAction={() => handlePlanAction(plan)}
            />
          ))}
        </div>

        <PricingFAQ />
      </div>
    </div>
  );
};

export default Pricing;