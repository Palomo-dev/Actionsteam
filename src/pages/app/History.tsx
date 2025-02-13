import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@supabase/auth-helpers-react";
import { StudySession } from "@/types/study-history";
import { StudyHeatmap } from "@/components/history/StudyHeatmap";
import { RecentSessions } from "@/components/history/RecentSessions";
import { useToast } from "@/hooks/use-toast";

const History = () => {
  const user = useUser();
  const { toast } = useToast();

  const { data: studySessions } = useQuery({
    queryKey: ["study-sessions"],
    queryFn: async () => {
      if (!user) return [];
      
      try {
        const { data: sessions, error: sessionsError } = await supabase
          .from("study_sessions")
          .select(`
            *,
            user_courses!inner (
              courses (
                title,
                slug
              )
            )
          `)
          .eq('user_id', user.id)
          .order('start_time', { ascending: false });

        if (sessionsError) throw sessionsError;

        return sessions.map((session: any) => ({
          ...session,
          course: session.user_courses.courses
        })) as StudySession[];

      } catch (error: any) {
        console.error("Error fetching study sessions:", error);
        toast({
          title: "Error",
          description: "No se pudo cargar el historial de estudio",
          variant: "destructive"
        });
        return [];
      }
    },
    enabled: !!user,
  });

  const processDataForHeatmap = () => {
    if (!studySessions) return [];
    
    const heatmapData = studySessions.map(session => ({
      hour: new Date(session.start_time).getHours(),
      day: new Date(session.start_time).getDay(),
      value: session.duration_seconds || 0,
    }));

    // Aggregate values for the same hour and day
    const aggregatedData = heatmapData.reduce((acc, curr) => {
      const key = `${curr.day}-${curr.hour}`;
      if (!acc[key]) {
        acc[key] = { ...curr };
      } else {
        acc[key].value += curr.value;
      }
      return acc;
    }, {} as Record<string, { hour: number; day: number; value: number }>);

    return Object.values(aggregatedData);
  };

  const heatmapData = processDataForHeatmap();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
        Historial de Estudio
      </h1>
      <StudyHeatmap heatmapData={heatmapData} />
      <RecentSessions studySessions={studySessions || []} />
    </div>
  );
};

export default History;