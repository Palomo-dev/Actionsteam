import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

interface CourseStudentCountProps {
  courseId: string;
}

export const CourseStudentCount = ({ courseId }: CourseStudentCountProps) => {
  const { data: completedCount, refetch } = useQuery({
    queryKey: ["course-completed-students", courseId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("user_courses")
        .select("*", { count: 'exact', head: true })
        .eq("course_id", courseId)
        .eq("status", "completed");
      
      if (error) throw error;
      return count || 0;
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_courses',
          filter: `course_id=eq.${courseId}`
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [courseId, refetch]);

  return (
    <Badge variant="secondary" className="flex items-center gap-1">
      <Users className="h-4 w-4" />
      {completedCount} completados
    </Badge>
  );
};