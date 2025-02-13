import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/utils/priceUtils";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { trackPurchase } from "@/services/facebookEvents";

interface PurchaseCourseButtonProps {
  courseId: string;
  stripePriceId: string;
  price: number;
  className?: string;
  courseName?: string;
}

export const PurchaseCourseButton = ({ 
  courseId, 
  stripePriceId, 
  price,
  className,
  courseName 
}: PurchaseCourseButtonProps) => {
  const { toast } = useToast();

  const handlePurchaseClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session?.user) {
        throw new Error('Usuario no autenticado');
      }
      
      const baseUrl = window.location.origin;
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          courseId, 
          paymentType: 'one_time',
          priceId: stripePriceId,
          successUrl: `${baseUrl}/app/payment-success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${baseUrl}/app/payment-cancel`
        },
        headers: {
          Authorization: `Bearer ${session.data.session?.access_token}`
        }
      });

      if (error) throw error;

      if (data?.url) {
        // Track purchase event
        await trackPurchase(
          {
            email: session.data.session.user.email,
            userId: session.data.session.user.id,
          },
          {
            value: price,
            courseId,
            courseName
          }
        );

        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "No se pudo procesar la compra. Por favor intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }} 
      whileTap={{ scale: 0.98 }}
      className="w-full"
    >
      <Button
        className={cn(
          "w-full max-w-[500px] mx-auto",
          "px-3 sm:px-6 py-2 sm:py-3",
          "text-sm sm:text-base",
          "bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500",
          "hover:from-purple-700 hover:via-purple-600 hover:to-pink-600",
          "text-white font-semibold shadow-lg hover:shadow-purple-500/25",
          "flex items-center justify-center gap-1 sm:gap-2",
          "rounded-lg transition-all duration-300 animate-glow",
          "min-w-0",
          className
        )}
        onClick={handlePurchaseClick}
      >
        <Crown className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
        <span className="truncate whitespace-nowrap">
          Comprar Curso por {formatPrice(price)}
        </span>
      </Button>
    </motion.div>
  );
};