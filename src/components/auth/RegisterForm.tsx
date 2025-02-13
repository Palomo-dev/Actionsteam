import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { trackRegistration } from "@/services/facebookEvents";

export const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const firstName = formData.get('firstName') as string;

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
          },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (signUpError) {
        console.error("Error de registro:", signUpError);
        let errorMessage = "Por favor verifica los datos e intenta de nuevo.";
        
        if (signUpError.message.includes("Email")) {
          errorMessage = "El correo electrónico no es válido o ya está registrado.";
        } else if (signUpError.message.includes("Password")) {
          errorMessage = "La contraseña debe tener al menos 6 caracteres.";
        } else if (signUpError.message.includes("Database")) {
          errorMessage = "Error al crear el perfil. Por favor, intenta de nuevo.";
        }
        
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Error al registrarse",
          description: errorMessage,
        });
      } else if (data?.user) {
        // Track registration event
        await trackRegistration({
          email,
          firstName,
          userId: data.user.id
        });

        setRegistrationSuccess(true);
        toast({
          title: "¡Registro exitoso!",
          description: "Por favor, verifica tu correo electrónico para confirmar tu cuenta.",
        });
      }
    } catch (err) {
      console.error("Error durante el registro:", err);
      setError("Ocurrió un error durante el registro. Por favor, intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  if (registrationSuccess) {
    return (
      <div className="text-center space-y-4 bg-white p-4 rounded-md shadow-md">
        <h2 className="text-2xl font-bold text-red-600">¡Revisa tu correo electrónico!</h2>
        <p className="text-gray-600">
          Hemos enviado un enlace de verificación a tu correo electrónico.
          Por favor, haz clic en el enlace que recibirás para activar tu cuenta.
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
    <form onSubmit={handleRegister} className="space-y-4 bg-white p-4 rounded-md shadow-md">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
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
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            required
            className="pl-10 pr-10 border-gray-200 focus:border-red-200 focus:ring-red-200"
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-400 hover:text-red-600 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-gray-700">Confirmar Contraseña</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            required
            className="pl-10 pr-10 border-gray-200 focus:border-red-200 focus:ring-red-200"
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3 text-gray-400 hover:text-red-600 transition-colors"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
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
            Registrando...
          </span>
        ) : (
          "Registrarse"
        )}
      </Button>
    </form>
  );
};