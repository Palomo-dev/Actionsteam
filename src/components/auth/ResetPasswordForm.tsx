import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const ResetPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        throw new Error(resetError.message);
      }

      setSuccess(true);
      toast({
        title: "Email enviado",
        description: "Revisa tu correo para continuar con el proceso de recuperación.",
      });

    } catch (err: any) {
      console.error("Reset password error:", err);
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo enviar el email de recuperación.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">¡Email enviado!</h2>
        <p className="text-gray-600">
          Hemos enviado las instrucciones de recuperación a tu correo electrónico.
        </p>
        <div className="space-y-2 mt-4">
          <p className="text-sm text-gray-600">
            ¿No has recibido el correo? Revisa estos pasos:
          </p>
          <ul className="text-sm text-gray-600 list-disc list-inside">
            <li>Revisa tu carpeta de spam o correo no deseado</li>
            <li>El correo vendrá de noreply@mail.app.supabase.io</li>
            <li>Espera unos minutos, el correo puede tardar en llegar</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Enviando...
          </span>
        ) : (
          "Enviar instrucciones"
        )}
      </Button>
    </form>
  );
};