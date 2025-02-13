import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";

type SubscriptionPlanProps = {
  plan: {
    name: string;
    description: string;
    price_cop: number;
    stripe_price_id: string;
  };
  isLoading: boolean;
  onSubscribe: () => Promise<void>;
};

export const SubscriptionPlan = ({ plan, isLoading, onSubscribe }: SubscriptionPlanProps) => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
        Plan de Suscripción
      </h1>

      <Card className="relative overflow-hidden border-purple-500/20 hover:border-purple-500/40 transition-all">
        <div className="absolute top-0 right-0 bg-purple-600 text-white px-4 py-1 rounded-bl-lg">
          Premium
        </div>
        <CardHeader>
          <CardTitle className="text-2xl">{plan.name}</CardTitle>
          <CardDescription>{plan.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-3xl font-bold">
              {plan.price_cop?.toLocaleString('es-CO', {
                style: 'currency',
                currency: 'COP'
              })} <span className="text-sm font-normal">/mes</span>
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Acceso a todos los cursos</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Contenido exclusivo</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Mentorías grupales</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Soporte prioritario</span>
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            onClick={onSubscribe}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Suscribirse Ahora
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};