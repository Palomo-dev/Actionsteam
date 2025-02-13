import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { SubscriptionDetails } from "@/components/subscription/SubscriptionDetails";
import { SubscriptionPlan } from "@/components/subscription/SubscriptionPlan";

const Subscription = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const { data: subscription, isLoading: isSubscriptionLoading } = useQuery({
    queryKey: ["user_subscription"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data, error } = await supabase
        .from("subscriptions")
        .select(`
          *,
          subscription_plans!fk_subscription_plan (
            name,
            description,
            price_cop,
            stripe_price_id
          )
        `)
        .eq("user_id", session.user.id)
        .eq("status", "active")
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        console.error('Error fetching subscription:', error);
        throw error;
      }
      return data;
    },
  });

  const { data: plan, isLoading: isPlanLoading } = useQuery({
    queryKey: ["subscription_plan"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .maybeSingle();

      if (error) {
        console.error('Error fetching plan:', error);
        throw error;
      }
      return data;
    },
    enabled: !subscription,
  });

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId: plan.stripe_price_id, paymentType: 'subscription' }
      });

      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error al procesar la suscripción:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Hubo un error al procesar la suscripción. Por favor, intenta de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscriptionLoading || isPlanLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (subscription) {
    return <SubscriptionDetails subscription={subscription} />;
  }

  if (plan) {
    return (
      <SubscriptionPlan
        plan={plan}
        isLoading={isLoading}
        onSubscribe={handleSubscribe}
      />
    );
  }

  return null;
};

export default Subscription;