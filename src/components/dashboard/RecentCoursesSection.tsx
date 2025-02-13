import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { CourseProgressCard } from "./CourseProgressCard";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Course {
  title: string;
  thumbnail_url: string | null;
  banner_url: string | null;
  induction_video_url: string | null;
}

interface UserCourse {
  id: string;
  course_id: string;
  progress: number;
  status: string;
  last_accessed: string;
  courses: Course;
}

export const RecentCoursesSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: recentCourses, isLoading, error } = useQuery({
    queryKey: ["recent-courses", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("No user ID");

      const { data: userCourses, error } = await supabase
        .from("user_courses")
        .select(`
          id,
          course_id,
          progress,
          status,
          last_accessed,
          courses (
            title,
            thumbnail_url,
            banner_url,
            induction_video_url
          )
        `)
        .eq('user_id', user.id)
        .not('last_accessed', 'is', null)
        .order('last_accessed', { ascending: false })
        .limit(4);

      if (error) {
        console.error("Error fetching recent courses:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los cursos recientes",
          variant: "destructive",
        });
        throw error;
      }

      return userCourses as unknown as UserCourse[];
    },
    enabled: !!user?.id,
  });

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Hubo un error al cargar los cursos recientes
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Cursos Recientes</h2>
        <Button variant="outline" asChild>
          <Link to="/app/cursos" className="gap-2">
            Ver todos los cursos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[220px] w-full animate-pulse bg-gray-800/50 rounded-lg"
            />
          ))
        ) : recentCourses?.length === 0 ? (
          <div className="col-span-2 text-center py-8">
            <p className="text-muted-foreground">
              No has iniciado ningún curso aún
            </p>
          </div>
        ) : (
          recentCourses?.map((course) => {
            // Verificar que course y course.courses existen
            if (!course || !course.courses) {
              return null;
            }
            
            return (
              <CourseProgressCard
                key={course.id}
                id={course.course_id}
                title={course.courses.title}
                progress={course.progress}
                thumbnailUrl={course.courses.thumbnail_url || undefined}
                bannerUrl={course.courses.banner_url || undefined}
                inductionVideoUrl={course.courses.induction_video_url || undefined}
                status={course.status}
              />
            );
          })
        )}
      </div>
    </div>
  );
};