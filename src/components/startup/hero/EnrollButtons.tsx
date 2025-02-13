import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const EnrollButtons = () => {
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();
  const { toast } = useToast();
  const navigate = useNavigate();

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
    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12 animate-fade-in">
      <Button
        size="lg"
        className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 group shadow-lg shadow-purple-500/20"
        onClick={handleEnrollClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Procesando...
          </span>
        ) : (
          <>
            ¡Reserva tu Cupo! <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="text-lg px-8 py-6 bg-purple-500/10 border-2 hover:bg-purple-500/20 transition-all duration-300 hover:scale-105 border-purple-500/20 hover:border-purple-500/40 shadow-lg shadow-purple-500/10"
        onClick={handleEnrollClick}
        disabled={isLoading}
      >
        <Play className="mr-2 group-hover:text-purple-400" /> Inscríbete Ahora
      </Button>
    </div>
  );
};