import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Lock, User, CreditCard, ArrowLeft } from "lucide-react";

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("courseId");
  const stripePriceId = searchParams.get("stripePriceId");
  const price = searchParams.get("price");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentType, setPaymentType] = useState<'course' | 'subscription'>(stripePriceId === 'price_1QdxgVKfpF4gUTRJir43rlHL' ? 'course' : 'subscription');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const firstName = formData.get('firstName') as string;

    try {
      // 1. Registrar usuario
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
          },
        },
      });

      if (signUpError) throw signUpError;

      // 2. Crear sesión de checkout en Stripe
      const selectedPriceId = stripePriceId || 'price_1QdMyQKfpF4gUTRJtxCDL7nc';
      
      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke('create-checkout', {
        body: { 
          priceId: selectedPriceId,
          courseId: courseId,
          paymentType: 'one_time'
        }
      });

      if (checkoutError) throw checkoutError;
      
      if (checkoutData?.url) {
        window.location.href = checkoutData.url;
      }
    } catch (err) {
      console.error("Error durante el proceso:", err);
      setError("Ocurrió un error durante el proceso. Por favor, intenta de nuevo.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo completar el proceso. Por favor intenta de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-red-50/30" />
      
      <div className="w-full max-w-md relative z-10">
        <Button
          variant="ghost"
          className="mb-4 text-gray-600 hover:text-red-600 transition-colors"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>

        <Card className="p-8 bg-white border border-red-100 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Checkout</h1>
            <p className="text-gray-600">Crea tu cuenta y comienza a aprender</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-gray-700">Nombre</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Tu nombre"
                  required
                  className="pl-10 border-gray-200 focus:border-red-200 focus:ring-red-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  required
                  className="pl-10 border-gray-200 focus:border-red-200 focus:ring-red-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="pl-10 border-gray-200 focus:border-red-200 focus:ring-red-200"
                  minLength={6}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-gray-700">Tipo de Compra</Label>
              <RadioGroup 
                defaultValue={paymentType} 
                onValueChange={(value) => setPaymentType(value as 'course' | 'subscription')}
                className="flex flex-col space-y-3"
              >
                {stripePriceId === 'price_1QdxgVKfpF4gUTRJir43rlHL' && (
                  <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 cursor-pointer hover:border-red-200 hover:bg-red-50/50 transition-colors">
                    <RadioGroupItem value="course" id="course" />
                    <Label htmlFor="course" className="flex-1 cursor-pointer">
                      <div className="font-medium text-gray-900">Startup AI: Aprende a Crear tu SaaS Inteligente</div>
                      <div className="text-sm text-gray-600">
                        $300.000 COP
                      </div>
                    </Label>
                  </div>
                )}
                {!stripePriceId && (
                  <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 cursor-pointer hover:border-red-200 hover:bg-red-50/50 transition-colors">
                    <RadioGroupItem value="subscription" id="subscription" />
                    <Label htmlFor="subscription" className="flex-1 cursor-pointer">
                      <div className="font-medium text-gray-900">Suscripción Premium</div>
                      <div className="text-sm text-gray-600">$200.000 /mes</div>
                    </Label>
                  </div>
                )}
              </RadioGroup>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <CreditCard className="mr-2 h-4 w-4 animate-pulse" />
                  Procesando...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Continuar al Pago
                </span>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Checkout;