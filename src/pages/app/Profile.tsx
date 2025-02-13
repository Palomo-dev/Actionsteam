import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LearningStats } from "@/components/profile/LearningStats";

const Profile = () => {
  const { session, isLoading: isSessionLoading } = useSessionContext();
  const { toast } = useToast();

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      console.log("Fetching profile for user:", session.user.id);
      
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        toast({
          title: "Error",
          description: "No se pudo cargar el perfil",
          variant: "destructive",
        });
        throw profileError;
      }

      return profileData;
    },
    enabled: !!session?.user?.id,
  });

  if (isSessionLoading || isProfileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-400">Cargando perfil...</p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-400">No se ha encontrado la sesión del usuario</p>
      </div>
    );
  }

  const userInitials = session.user.email?.charAt(0).toUpperCase() || "U";

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
        Mi Perfil
      </h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gray-800/50 border-gray-700/50">
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={session.user?.user_metadata?.avatar_url} />
                <AvatarFallback className="text-lg bg-purple-500/20">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-medium text-gray-100">
                  {profile?.first_name || "Usuario"}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Mail className="h-4 w-4" />
                  <span>{profile?.email}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary" className="bg-purple-500/20">
                {profile?.role === 'admin' ? 'Administrador' : 'Estudiante'}
              </Badge>
              {profile?.is_subscribed && (
                <Badge variant="secondary" className="bg-green-500/20">
                  Suscrito
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700/50">
          <CardHeader>
            <CardTitle>Estadísticas de Aprendizaje</CardTitle>
          </CardHeader>
          <CardContent>
            <LearningStats />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;