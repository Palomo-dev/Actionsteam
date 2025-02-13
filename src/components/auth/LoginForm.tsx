import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      console.log("Attempting login with email:", email);
      
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error("Login error:", signInError);
        if (signInError.message.includes("Email not confirmed")) {
          const { error: resendError } = await supabase.auth.resend({
            type: 'signup',
            email,
          });
          
          if (resendError) {
            throw new Error("Error al reenviar el email de confirmación: " + resendError.message);
          }
          
          throw new Error("Por favor verifica tu correo electrónico. Hemos reenviado el email de confirmación.");
        }
        if (signInError.message === "Invalid login credentials") {
          throw new Error("Email o contraseña incorrectos. Por favor verifica tus credenciales.");
        }
        throw new Error(signInError.message);
      }

      if (!authData.user) {
        throw new Error("No se encontró información del usuario");
      }

      // Obtener el perfil del usuario usando getSession para asegurar que tenemos la sesión actualizada
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        throw new Error("Error al obtener la sesión");
      }

      if (!session) {
        throw new Error("No se pudo establecer la sesión");
      }

      // Intentar obtener el perfil existente
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, role')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        // Si el error es que no se encuentra el perfil, lo creamos
        if (profileError.code === 'PGRST116') {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([
              { 
                id: session.user.id,
                email: session.user.email,
                role: 'client'
              }
            ])
            .select()
            .single();

          if (createError) {
            console.error("Error creating profile:", createError);
            throw new Error("Error al crear el perfil del usuario");
          }

          toast({
            title: "¡Bienvenido!",
            description: "Tu cuenta ha sido creada exitosamente.",
          });

          navigate('/app/inicio');
          return;
        } else {
          console.error("Error fetching profile:", profileError);
          throw new Error("Error al obtener el perfil del usuario");
        }
      }

      console.log("Login successful, profile:", profileData);

      toast({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión correctamente.",
      });

      if (profileData.role === 'admin') {
        navigate('/admin/inicio');
      } else {
        navigate('/app/inicio');
      }

    } catch (err: any) {
      console.error("Login error:", err);
      const errorMessage = err.message || "Error al iniciar sesión";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error de inicio de sesión",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
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
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="password" className="text-gray-700">Contraseña</Label>
          <Link 
            to="/forgot-password" 
            className="text-sm text-gray-500 hover:text-red-600 transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            required
            className="pl-10 pr-10 border-gray-200 focus:border-red-200 focus:ring-red-200"
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
            Iniciando sesión...
          </span>
        ) : (
          "Iniciar Sesión"
        )}
      </Button>
    </form>
  );
};