import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Award,
  History, 
  Home, 
  Bell, 
  MessageSquare,
  Headset,
  Mail,
  Phone
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SidebarNavProps {
  isCollapsed?: boolean;
}

const items = [
  {
    title: "Inicio",
    href: "/app/inicio",
    icon: Home,
  },
  {
    title: "Cursos",
    href: "/app/cursos",
    icon: BookOpen,
  },
  {
    title: "Chat IA",
    href: "/app/chat-IA",
    icon: MessageSquare,
  },
  {
    title: "Certificados",
    href: "/app/certificados",
    icon: Award,
  },
  {
    title: "Historial",
    href: "/app/historial",
    icon: History,
  },
  {
    title: "Notificaciones",
    href: "/app/notificaciones",
    icon: Bell,
  },
];

export const SidebarNav = ({ isCollapsed }: SidebarNavProps) => {
  const location = useLocation();

  const handleContactSupport = (type: 'email' | 'whatsapp') => {
    if (type === 'email') {
      window.location.href = 'mailto:imagine.gallego@gmail.com';
    } else {
      const message = "Hola, necesito soporte técnico";
      window.open(`https://wa.me/573041315976?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  return (
    <nav className="grid items-start gap-2">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <Link key={index} to={item.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2 text-gray-600",
                location.pathname === item.href && "bg-gradient-to-r from-red-50 to-red-100 text-red-700 hover:text-red-800 hover:bg-red-100",
                isCollapsed && "justify-center p-0"
              )}
            >
              <Icon className="h-4 w-4" />
              {!isCollapsed && item.title}
            </Button>
          </Link>
        );
      })}

      {/* Soporte button */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-2 text-gray-600 hover:text-red-700 hover:bg-red-50",
              isCollapsed && "justify-center p-0"
            )}
          >
            <Headset className="h-4 w-4" />
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
    </nav>
  );
};