import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  BarChart, 
  Bell, 
  Settings,
  LogOut,
  ChevronLeft,
  PanelLeft,
  PanelLeftClose,
  Headset,
  Mail,
  Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const mainNavigation = [
  { name: "Panel de Control", href: "/admin/inicio", icon: LayoutDashboard },
  { name: "Cursos", href: "/admin/cursos", icon: BookOpen },
  { name: "Usuarios", href: "/admin/usuarios", icon: Users },
  { name: "Estadísticas", href: "/admin/estadisticas", icon: BarChart },
];

const bottomNavigation = [
  { name: "Notificaciones", href: "/admin/notificaciones", icon: Bell },
  { name: "Configuración", href: "/admin/configuracion", icon: Settings },
];

interface AdminSidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onToggleSidebar: () => void;
  onToggleCollapsed: () => void;
}

export const AdminSidebar = ({ 
  isOpen, 
  isCollapsed,
  onToggleSidebar,
  onToggleCollapsed
}: AdminSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cerrar la sesión",
        variant: "destructive",
      });
    }
  };

  const handleContactSupport = (type: 'email' | 'whatsapp') => {
    if (type === 'email') {
      window.location.href = 'mailto:imagine.gallego@gmail.com';
    } else {
      const message = "Hola, necesito soporte técnico";
      window.open(`https://wa.me/573041315976?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  const NavItem = ({ item }: { item: typeof mainNavigation[0] }) => {
    const isActive = location.pathname === item.href;
    
    return (
      <Link to={item.href}>
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start gap-2 text-gray-600",
            isCollapsed && "justify-center p-2",
            isActive && "bg-gradient-to-r from-red-50 to-red-100 text-red-700 hover:text-red-800 hover:bg-red-100"
          )}
          title={isCollapsed ? item.name : undefined}
        >
          <item.icon className="h-5 w-5" />
          {!isCollapsed && <span>{item.name}</span>}
        </Button>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={onToggleSidebar}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transform transition-all duration-200 ease-in-out lg:translate-x-0 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Close button for mobile */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden absolute right-2 top-2 text-gray-500 hover:text-red-600 p-2"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* Collapse toggle button (desktop only) */}
        <button
          onClick={onToggleCollapsed}
          className="hidden lg:flex absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-1.5 text-gray-500 hover:text-red-600 shadow-sm"
        >
          {isCollapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>

        {/* Logo */}
        <div className={cn(
          "p-4",
          isCollapsed && "px-2"
        )}>
          <Link to="/admin/inicio" className={cn(
            "text-xl font-bold bg-gradient-to-r from-red-600 to-red-900 text-transparent bg-clip-text",
            isCollapsed ? "text-center block" : ""
          )}>
            {isCollapsed ? "AST" : "ActionS Team"}
          </Link>
        </div>

        {/* Main navigation */}
        <nav className="flex flex-col gap-2 p-4 flex-1">
          {mainNavigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>

        {/* Bottom navigation */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          {bottomNavigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
          
          {/* Soporte button */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2 text-gray-600 hover:text-red-700 hover:bg-red-50",
                  isCollapsed && "justify-center p-2"
                )}
                title={isCollapsed ? "Soporte" : undefined}
              >
                <Headset className="h-5 w-5" />
                {!isCollapsed && "Soporte"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-4 bg-white shadow-lg border border-gray-200">
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">Contacto de Soporte</h4>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-gray-600 hover:bg-red-50 hover:text-red-700 border-gray-200"
                    onClick={() => handleContactSupport('email')}
                  >
                    <Mail className="h-4 w-4" />
                    imagine.gallego@gmail.com
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-gray-600 hover:bg-red-50 hover:text-red-700 border-gray-200"
                    onClick={() => handleContactSupport('whatsapp')}
                  >
                    <Phone className="h-4 w-4" />
                    WhatsApp
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          {/* Logout button */}
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-2 text-gray-600 hover:text-red-700 hover:bg-red-50",
              isCollapsed && "justify-center p-2"
            )}
            onClick={handleLogout}
            title={isCollapsed ? "Cerrar Sesión" : undefined}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && "Cerrar Sesión"}
          </Button>
        </div>
      </aside>
    </>
  );
};
