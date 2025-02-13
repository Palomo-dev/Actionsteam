import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Zap, CreditCard, Loader2 } from "lucide-react";

interface PricingCardProps {
  plan: {
    id: number;
    title: string;
    description: string;
    price: string;
    period?: string;
    features: string[];
    popular: boolean;
    ctaText: string;
    paymentNote?: string;
    stripePriceId?: string;
    gradient: string;
  };
  isLoading: boolean;
  onAction: () => void;
}

export const PricingCard = ({ plan, isLoading, onAction }: PricingCardProps) => {
  const handleAction = () => {
    if (plan.stripePriceId) {
      onAction();
    } else {
      // WhatsApp redirect for "Contactar Ventas"
      const whatsappNumber = "+573041315976";
      const message = `Hola, estoy interesado en el plan ${plan.title}`;
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <div className={`relative rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 ${
      plan.popular ? 'ring-2 ring-red-600' : ''
    }`}>
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center rounded-full bg-red-50 px-4 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
            Más Popular
          </span>
        </div>
      )}

      <div className="p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.title}</h3>
        <p className="text-gray-600 mb-6">{plan.description}</p>
        
        <div className="mb-6">
          <div className="flex items-baseline">
            {plan.price === "Personalizado" ? (
              <span className="text-4xl font-bold text-gray-900">Personalizado</span>
            ) : (
              <>
                <span className="text-4xl font-bold text-gray-900">
                  ${plan.price}
                </span>
                <span className="text-gray-600 ml-2">/{plan.period}</span>
              </>
            )}
          </div>
          {plan.paymentNote && (
            <p className="text-sm text-gray-500 mt-2">{plan.paymentNote}</p>
          )}
        </div>

        <Button
          onClick={handleAction}
          disabled={isLoading}
          className={`w-full py-3 px-6 rounded-lg text-white font-medium 
            bg-gradient-to-r ${plan.gradient}
            hover:from-red-700 hover:to-red-900
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
            transition-all duration-300
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {isLoading ? 'Procesando...' : plan.ctaText}
        </Button>

        <ul className="mt-8 space-y-4">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center text-gray-600">
              <svg className="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};