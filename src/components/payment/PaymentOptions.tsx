import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";

interface PaymentOptionsProps {
  courseId?: string;
  courseName?: string;
  coursePrice?: number;
}

export const PaymentOptions = ({ courseId, courseName, coursePrice }: PaymentOptionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePayment = async (priceId: string, paymentType: 'one_time' | 'subscription') => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId, courseId, paymentType }
      });

      if (error) {
        console.error('Error al procesar el pago:', error);
        throw error;
      }
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No se recibió la URL de pago');
      }
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Hubo un error al procesar el pago. Por favor, intenta de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto p-4">
      {/* Opción de Curso Individual */}
      <Card className="relative overflow-hidden border-purple-500/20 hover:border-purple-500/40 transition-all">
        <CardHeader>
          <CardTitle className="text-2xl">Curso Individual</CardTitle>
          <CardDescription>
            Acceso completo al curso {courseName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-3xl font-bold">
              {coursePrice?.toLocaleString('es-CO', {
                style: 'currency',
                currency: 'COP'
              })}
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Acceso de por vida al curso</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Certificado de finalización</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Soporte técnico</span>
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-purple-600 hover:bg-purple-700"
            onClick={() => handlePayment('price_1QdMwtKfpF4gUTRJQagbJAmQ', 'one_time')}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Comprar Ahora
          </Button>
        </CardFooter>
      </Card>

      {/* Opción de Suscripción */}
      <Card className="relative overflow-hidden border-purple-500/20 hover:border-purple-500/40 transition-all">
        <div className="absolute top-0 right-0 bg-purple-600 text-white px-4 py-1 rounded-bl-lg">
          Recomendado
        </div>
        <CardHeader>
          <CardTitle className="text-2xl">Suscripción Premium</CardTitle>
          <CardDescription>
            Acceso a todos los cursos y beneficios exclusivos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-3xl font-bold">
              $200.000 <span className="text-sm font-normal">/mes</span>
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
            onClick={() => handlePayment('price_1QdMyQKfpF4gUTRJtxCDL7nc', 'subscription')}
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
