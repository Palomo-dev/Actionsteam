import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export const CTASection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEnrollClick = async () => {
    if (!session) {
      navigate('/checkout?courseId=startup-ai&stripePriceId=price_1QdxgVKfpF4gUTRJir43rlHL&price=200000');
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          courseId: 'startup-ai', 
          paymentType: 'one_time',
          priceId: 'price_1QdxgVKfpF4gUTRJir43rlHL'
        }
      });

      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo procesar la inscripción. Por favor, intenta de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 bg-[#0A0F1C]">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
            ¿Listo para Transformar tu Futuro?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            No esperes más para comenzar tu viaje hacia la creación de una startup exitosa con IA.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105"
              onClick={handleEnrollClick}
              disabled={isLoading}
            >
              {isLoading ? "Procesando..." : "¡Inscríbete Ahora!"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};