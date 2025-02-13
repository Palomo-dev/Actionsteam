import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { AppHeader } from "../app/AppHeader";
import { AdminSidebar } from "./AdminSidebar";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const AdminLayout = () => {
  const { session, isLoading: isSessionLoading } = useSessionContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!currentSession) {
          console.log("No active session found, redirecting to login");
          navigate("/login");
          return;
        }
      } catch (error) {
        console.error("Error checking session:", error);
        toast({
          title: "Error de sesión",
          description: "Por favor, inicia sesión nuevamente",
          variant: "destructive",
        });
        navigate("/login");
      }
    };

    checkSession();
  }, [navigate, toast]);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        if (!session?.user.id) {
          console.log("No hay sesión activa, redirigiendo a login");
          navigate("/login");
          return;
        }

        console.log("Verificando rol de administrador para el usuario:", session.user.id);

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("Error al verificar rol de admin:", error);
          toast({
            title: "Error",
            description: "Error al verificar permisos de administrador",
            variant: "destructive",
          });
          navigate("/login");
          return;
        }

        console.log("Perfil obtenido:", profile);

        if (!profile || profile.role !== 'admin') {
          console.log("Usuario no es admin:", profile?.role);
          toast({
            title: "Acceso denegado",
            description: "No tienes permisos de administrador",
            variant: "destructive",
          });
          navigate("/app/inicio");
          return;
        }

        console.log("Usuario confirmado como admin");
        setIsAdmin(true);
      } catch (error) {
        console.error("Error en checkAdminAccess:", error);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    if (!isSessionLoading) {
      checkAdminAccess();
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        console.log("Sesión terminada, redirigiendo a login");
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [session, navigate, toast, isSessionLoading]);

  if (isLoading || isSessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-blue-100">
      <AppHeader onToggleSidebar={toggleSidebar} />
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        isCollapsed={isCollapsed}
        onToggleSidebar={toggleSidebar}
        onToggleCollapsed={toggleCollapsed}
      />
      
      <main className={cn(
        "flex-grow pt-16 transition-all duration-200 ease-in-out",
        isCollapsed ? "lg:pl-20" : "lg:pl-64",
        "relative z-0"
      )}>
        <div className="container mx-auto px-4 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};