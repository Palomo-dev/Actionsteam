import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Settings, LogOut, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";

interface SidebarProfileProps {
  isCollapsed: boolean;
}

export const SidebarProfile = ({ isCollapsed }: SidebarProfileProps) => {
  const { session } = useSessionContext();
  const navigate = useNavigate();
  const userInitials = session?.user.email?.charAt(0).toUpperCase() || "U";

  const { data: profile } = useQuery({
    queryKey: ['profile', session?.user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session?.user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user.id,
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className={cn(
      "mt-auto p-4 border-t border-gray-200 space-y-4",
      isCollapsed && "p-2"
    )}>
      <Link to="/app/perfil" className={cn(
        "flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors",
        isCollapsed && "justify-center px-0"
      )}>
        <Avatar>
          <AvatarImage src={session?.user.user_metadata?.avatar_url} />
          <AvatarFallback className="bg-red-100 text-red-600">
            {userInitials}
          </AvatarFallback>
        </Avatar>
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-700 truncate">
              {session?.user.email}
            </p>
            <p className="text-xs text-gray-500 truncate">
              Ver perfil
            </p>
          </div>
        )}
      </Link>

      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to="/app/configuracion">
              <Button variant="ghost" className={cn(
                "w-full justify-start gap-2 text-gray-600 hover:text-red-700 hover:bg-red-50",
                isCollapsed && "justify-center p-2"
              )}>
                <Settings className="h-5 w-5" />
                {!isCollapsed && "Configuración"}
              </Button>
            </Link>
          </TooltipTrigger>
          {isCollapsed && (
            <TooltipContent side="right" className="bg-white text-gray-700 border border-gray-200">
              Configuración
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to="/app/suscripcion">
              <Button
                className={cn(
                  "w-full justify-start gap-2",
                  profile?.is_subscribed 
                    ? "bg-red-50 hover:bg-red-100 text-red-700"
                    : "bg-gradient-to-r from-red-600 to-red-900 text-white hover:from-red-700 hover:to-red-950",
                  isCollapsed && "justify-center p-2"
                )}
              >
                <Crown className="h-5 w-5" />
                {!isCollapsed && (profile?.is_subscribed ? "Mi Suscripción" : "Suscribirse")}
              </Button>
            </Link>
          </TooltipTrigger>
          {isCollapsed && (
            <TooltipContent side="right" className="bg-white text-gray-700 border border-gray-200">
              {profile?.is_subscribed ? "Mi Suscripción" : "Suscribirse"}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start gap-2 text-gray-600 hover:text-red-700 hover:bg-red-50",
                isCollapsed && "justify-center p-2"
              )}
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              {!isCollapsed && "Cerrar Sesión"}
            </Button>
          </TooltipTrigger>
          {isCollapsed && (
            <TooltipContent side="right" className="bg-white text-gray-700 border border-gray-200">
              Cerrar Sesión
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};