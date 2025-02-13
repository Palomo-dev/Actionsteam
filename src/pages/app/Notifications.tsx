import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, CheckCircle2, Info, Gift, Trophy, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSessionContext } from "@supabase/auth-helpers-react";

const Notifications = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { session } = useSessionContext();

  // Query to fetch notifications
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      if (!session?.user.id) return [];
      
      console.log("Fetching notifications for user:", session.user.id);
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notifications:", error);
        throw error;
      }
      
      console.log("Fetched notifications:", data);
      return data;
    },
    enabled: !!session?.user.id,
  });

  // Mutation to mark notifications as read
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-notifications"] });
    },
    onError: (error) => {
      console.error("Error marking notification as read:", error);
      toast({
        title: "Error",
        description: "No se pudo marcar la notificación como leída",
        variant: "destructive",
      });
    },
  });

  // Subscribe to real-time notifications
  useEffect(() => {
    if (!session?.user.id) return;

    console.log("Setting up notifications subscription for user:", session.user.id);
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
        (payload) => {
          console.log("Received notification change:", payload);
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
          queryClient.invalidateQueries({ queryKey: ["unread-notifications"] });
        }
      )
      .subscribe();

    return () => {
      console.log("Cleaning up notifications subscription");
      supabase.removeChannel(channel);
    };
  }, [session?.user.id, queryClient]);

  // Mark notification as read when clicked
  const handleNotificationClick = async (notificationId: string, isRead: boolean) => {
    if (!isRead) {
      await markAsReadMutation.mutateAsync(notificationId);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "welcome":
        return <Gift className="h-5 w-5 text-purple-400" />;
      case "course_reminder":
        return <Calendar className="h-5 w-5 text-blue-400" />;
      case "subscription_reminder":
        return <Info className="h-5 w-5 text-yellow-400" />;
      case "certificate":
        return <Trophy className="h-5 w-5 text-green-400" />;
      case "exam_success":
        return <CheckCircle2 className="h-5 w-5 text-emerald-400" />;
      default:
        return <Bell className="h-5 w-5 text-purple-400" />;
    }
  };

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case "welcome":
        return "border-l-purple-500";
      case "course_reminder":
        return "border-l-blue-500";
      case "subscription_reminder":
        return "border-l-yellow-500";
      case "certificate":
        return "border-l-green-500";
      case "exam_success":
        return "border-l-emerald-500";
      default:
        return "border-l-purple-500";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
          Notificaciones
        </h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-gray-800/50 border-gray-700/50">
              <CardContent className="h-24" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
        Notificaciones
      </h1>

      <div className="space-y-4">
        {!notifications || notifications.length === 0 ? (
          <Card className="bg-gray-800/50 border-gray-700/50">
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-400">No tienes notificaciones</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`bg-gray-800/50 border-gray-700/50 cursor-pointer transition-all hover:bg-gray-800/70 ${
                !notification.read ? `border-l-4 ${getNotificationStyle(notification.type)}` : ""
              }`}
              onClick={() => handleNotificationClick(notification.id, notification.read)}
            >
              <CardHeader className="flex flex-row items-center gap-4">
                {getNotificationIcon(notification.type)}
                <div className="flex-1">
                  <CardTitle className="text-lg text-gray-100 flex items-center gap-2">
                    {notification.title}
                    {!notification.read && (
                      <Badge variant="secondary" className="bg-purple-500/20">
                        Nueva
                      </Badge>
                    )}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">{notification.message}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {format(new Date(notification.created_at), "PPp", { locale: es })}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;