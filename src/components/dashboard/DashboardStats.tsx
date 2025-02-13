import { StatsCard } from "./StatsCard";
import { BookOpen, Clock, GraduationCap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatSeconds } from "@/utils/timeUtils";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export const DashboardStats = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("No user ID");

      // Get courses in progress
      const { data: coursesInProgress, error: coursesError } = await supabase
        .from("user_courses")
        .select(`
          *,
          course:courses(
            title,
            description
          )
        `)
        .eq("user_id", user.id)
        .gt("progress", 0)
        .lt("progress", 100)
        .not('last_accessed', 'is', null);

      if (coursesError) {
        console.error("Error fetching courses in progress:", coursesError);
        toast({
          title: "Error",
          description: "No se pudieron cargar los cursos en progreso",
          variant: "destructive",
        });
        throw coursesError;
      }

      // Get total study time from study sessions
      const { data: studySessions, error: studyError } = await supabase
        .from("study_sessions")
        .select("duration_seconds")
        .eq("user_id", user.id)
        .not("duration_seconds", "is", null);

      if (studyError) {
        console.error("Error fetching study sessions:", studyError);
        toast({
          title: "Error",
          description: "No se pudo cargar el tiempo de estudio",
          variant: "destructive",
        });
        throw studyError;
      }

      // Get certificates count
      const { data: certificates, error: certError } = await supabase
        .from("certificates")
        .select("*")
        .eq("user_id", user.id);

      if (certError) {
        console.error("Error fetching certificates:", certError);
        toast({
          title: "Error",
          description: "No se pudieron cargar los certificados",
          variant: "destructive",
        });
        throw certError;
      }

      const totalTimeStudied = studySessions?.reduce(
        (acc, session) => acc + (session.duration_seconds || 0),
        0
      ) || 0;

      return {
        coursesInProgress: coursesInProgress?.length || 0,
        totalTimeStudied,
        certificatesCount: certificates?.length || 0,
      };
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-lg bg-gray-800/50 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatsCard
        title="Cursos en Progreso"
        value={stats?.coursesInProgress || 0}
        icon={BookOpen}
      />
      <StatsCard
        title="Tiempo Total Estudiado"
        value={formatSeconds(stats?.totalTimeStudied || 0)}
        icon={Clock}
      />
      <StatsCard
        title="Certificados Obtenidos"
        value={stats?.certificatesCount || 0}
        icon={GraduationCap}
      />
    </div>
  );
};