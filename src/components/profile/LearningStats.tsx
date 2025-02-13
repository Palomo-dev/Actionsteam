import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatSeconds } from "@/utils/timeUtils";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Trophy, Clock } from "lucide-react";

export const LearningStats = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["profile-stats", user?.id],
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
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 rounded-lg bg-gray-800/50 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <div className="flex items-center p-4 space-x-4 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-all">
        <BookOpen className="h-8 w-8 text-purple-400 flex-shrink-0" />
        <div>
          <p className="text-sm text-gray-400">Cursos en Progreso</p>
          <p className="text-xl lg:text-2xl font-bold text-gray-100">
            {stats?.coursesInProgress || 0}
          </p>
        </div>
      </div>
      
      <div className="flex items-center p-4 space-x-4 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-all">
        <Trophy className="h-8 w-8 text-yellow-400 flex-shrink-0" />
        <div>
          <p className="text-sm text-gray-400">Certificados Obtenidos</p>
          <p className="text-xl lg:text-2xl font-bold text-gray-100">
            {stats?.certificatesCount || 0}
          </p>
        </div>
      </div>
      
      <div className="flex items-center p-4 space-x-4 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-all">
        <Clock className="h-8 w-8 text-green-400 flex-shrink-0" />
        <div>
          <p className="text-sm text-gray-400">Tiempo Total de Estudio</p>
          <p className="text-xl lg:text-2xl font-bold text-gray-100">
            {formatSeconds(stats?.totalTimeStudied || 0)}
          </p>
        </div>
      </div>
    </div>
  );
};