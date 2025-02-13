import { Bell, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const AppHeader = ({ onToggleSidebar }: { onToggleSidebar: () => void }) => {
  const { session } = useSessionContext();
  const userInitials = session?.user.email?.charAt(0).toUpperCase() || "U";
  const [showNotification, setShowNotification] = useState(false);

  const { data: unreadCount, refetch } = useQuery({
    queryKey: ["unread-notifications", session?.user.id],
    queryFn: async () => {
      if (!session?.user.id) return 0;
      
      const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", session.user.id)
        .eq("read", false);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!session?.user.id,
  });

  // Efecto para mostrar/ocultar la notificación
  useEffect(() => {
    if (unreadCount && unreadCount > 0) {
      setShowNotification(true);
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000); // La notificación desaparecerá después de 5 segundos

      return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  // Subscribe to real-time notifications
  useEffect(() => {
    if (!session?.user.id) return;

    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${session.user.id}`
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user.id, refetch]);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b border-gray-200 bg-white/80 backdrop-blur-md z-50">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="lg:hidden text-gray-700 hover:text-red-600 hover:bg-red-50">
            <Menu className="h-5 w-5" />
          </Button>
          <Link to="/app/inicio" className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-900 text-transparent bg-clip-text hover:scale-105 transition-transform">
            ActionS Team
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          <Link to="/app/notificaciones" className="relative">
            <Button variant="ghost" size="icon" className="relative text-gray-700 hover:text-red-600 hover:bg-red-50">
              <Bell className="h-5 w-5" />
              <AnimatePresence>
                {unreadCount > 0 && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-1 -right-1 h-5 w-5 bg-red-600 rounded-full flex items-center justify-center text-xs text-white"
                  >
                    {unreadCount}
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
            <AnimatePresence>
              {showNotification && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  className="absolute top-full right-0 mt-2 p-3 bg-gradient-to-r from-red-600 to-red-900 text-white rounded-lg shadow-lg whitespace-nowrap"
                  style={{
                    boxShadow: '0 4px 20px rgba(220, 38, 38, 0.3)'
                  }}
                >
                  {unreadCount === 1 ? (
                    'Tienes 1 notificación nueva'
                  ) : (
                    `Tienes ${unreadCount} notificaciones nuevas`
                  )}
                  <div className="absolute -top-1 right-4 w-2 h-2 bg-red-600 rotate-45" />
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
          <Link to="/app/perfil">
            <Avatar>
              <AvatarImage src={session?.user.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-red-100 text-red-600">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
};