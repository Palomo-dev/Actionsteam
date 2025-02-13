import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

type SubscriptionDetailsProps = {
  subscription: {
    status: string;
    current_period_start: string;
    current_period_end: string;
    subscription_plans: {
      name: string;
      description: string;
      price_cop: number;
    };
  };
};

export const SubscriptionDetails = ({ subscription }: SubscriptionDetailsProps) => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-400 text-transparent bg-clip-text">
        Mi Suscripción
      </h1>

      <Card className="border-green-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{subscription.subscription_plans.name}</CardTitle>
              <CardDescription>{subscription.subscription_plans.description}</CardDescription>
            </div>
            <Badge variant="secondary" className="bg-green-500/20 text-green-300">
              {subscription.status === 'active' ? 'Activa' : 'Pendiente'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-400">Detalles de la suscripción</h3>
            <div className="grid gap-2">
              <div className="flex justify-between items-center py-2 border-b border-gray-800">
                <span className="text-gray-300">Fecha de inicio</span>
                <span className="text-gray-400">
                  {format(new Date(subscription.current_period_start), "d 'de' MMMM, yyyy", { locale: es })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-800">
                <span className="text-gray-300">Próxima renovación</span>
                <span className="text-gray-400">
                  {format(new Date(subscription.current_period_end), "d 'de' MMMM, yyyy", { locale: es })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-800">
                <span className="text-gray-300">Monto mensual</span>
                <span className="text-gray-400">
                  {subscription.subscription_plans.price_cop.toLocaleString('es-CO', {
                    style: 'currency',
                    currency: 'COP'
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-400">Beneficios incluidos</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-300">
                <Check className="h-5 w-5 text-green-500" />
                <span>Acceso a todos los cursos</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Check className="h-5 w-5 text-green-500" />
                <span>Contenido exclusivo</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Check className="h-5 w-5 text-green-500" />
                <span>Mentorías grupales</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Check className="h-5 w-5 text-green-500" />
                <span>Soporte prioritario</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};