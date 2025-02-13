import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Bell } from "lucide-react";
import { Button } from "./ui/button";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { session } = useSessionContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      // Primero limpiamos el localStorage
      localStorage.clear();
      
      // Luego intentamos cerrar sesión en Supabase
      await supabase.auth.signOut();
      
      // Mostramos el mensaje de éxito
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente",
      });
      
      // Finalmente navegamos al login
      navigate("/login");
    } catch (error) {
      console.error("Error durante el cierre de sesión:", error);
      toast({
        variant: "destructive",
        title: "Error al cerrar sesión",
        description: "Por favor intenta de nuevo",
      });
      // En caso de error, aseguramos que el usuario sea redirigido al login
      navigate("/login");
    }
  };

  const publicLinks = [
    { to: "/", label: "Inicio" },
    { to: "/cursos", label: "Cursos" },
    { to: "/precios", label: "Precios" },
    { to: "/instructor/juan-gallego", label: "Instructor" },
  ];

  const privateLinks = [
    { to: "/app/inicio", label: "Dashboard" },
    { to: "/app/perfil", label: "Mi Perfil" },
    { to: "/app/historial", label: "Historial" },
  ];

  const links = session ? privateLinks : publicLinks;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white backdrop-blur-md z-50 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-800 text-transparent bg-clip-text hover:scale-105 transition-transform">
            ActionS Team
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-600 hover:text-red-600 transition-colors hover:scale-105 transform"
              >
                {link.label}
              </Link>
            ))}
            {session ? (
              <>
                <Link to="/app/notificaciones">
                  <Button variant="ghost" size="icon" className="text-gray-600 hover:text-red-600">
                    <Bell className="h-5 w-5" />
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="border-red-200 hover:bg-red-50 hover:text-red-600 text-gray-600"
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button 
                    variant="outline" 
                    className="border-red-200 hover:bg-red-50 hover:text-red-600 text-gray-600"
                  >
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/landing-page/startup-ai">
                  <Button className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-md hover:shadow-lg transition-all">
                    Empezar Ahora
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Navigation Toggle */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden py-4 bg-white/95 backdrop-blur-md border-t border-gray-100">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block py-2 text-gray-600 hover:text-red-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {session ? (
              <div className="flex flex-col space-y-2 mt-4">
                <Link to="/app/notificaciones" onClick={() => setIsOpen(false)}>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-gray-600 hover:text-red-600"
                  >
                    <Bell className="h-5 w-5 mr-2" />
                    Notificaciones
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full border-red-200 hover:bg-red-50 hover:text-red-600 text-gray-600"
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                >
                  Cerrar Sesión
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 mt-4">
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button 
                    variant="outline" 
                    className="w-full border-red-200 hover:bg-red-50 hover:text-red-600 text-gray-600"
                  >
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/landing-page/startup-ai" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-md hover:shadow-lg transition-all">
                    Empezar Ahora
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
