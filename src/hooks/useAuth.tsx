import { useUser } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useAuth = () => {
  const user = useUser();
  const { toast } = useToast();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      console.log("Fetching profile for user:", user.id);
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo cargar el perfil del usuario",
        });
        throw error;
      }

      // If no profile exists, create one
      if (!data) {
        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert([
            {
              id: user.id,
              email: user.email,
              first_name: user.user_metadata?.first_name || "",
              role: "client",
              is_subscribed: false,
            },
          ])
          .select()
          .maybeSingle();

        if (createError) {
          console.error("Error creating profile:", createError);
          toast({
            variant: "destructive",
            title: "Error",
            description: "No se pudo crear el perfil del usuario",
          });
          throw createError;
        }

        return newProfile;
      }

      return data;
    },
    enabled: !!user,
    retry: 1,
  });

  const { data: siteSettings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*");

      if (error) throw error;

      // Convert array of settings to an object
      return data.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {});
    },
  });

  return { user, profile, siteSettings };
};