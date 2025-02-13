import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CourseCard } from "@/components/courses/CourseCard";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

const AppCourses = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile } = useAuth();

  const { data: userProfile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: userCourses } = useQuery({
    queryKey: ['user-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_courses')
        .select('*');

      if (error) throw error;
      return data;
    },
  });

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      console.log("Fetching published courses...");
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          course_ratings (
            rating
          ),
          instructor:instructors (
            name,
            avatar_url
          )
        `)
        .eq('is_published', true) // Aseguramos que solo se traigan los cursos publicados
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching courses:", error);
        throw error;
      }

      console.log("Published courses:", data);

      return data.map(course => ({
        ...course,
        rating: course.course_ratings?.reduce((acc: number, curr: any) => acc + curr.rating, 0) / (course.course_ratings?.length || 1),
        totalRatings: course.course_ratings?.length || 0,
        isLocked: !userCourses?.some(uc => uc.course_id === course.id) && !userProfile?.is_subscribed,
        timeUntilLaunch: course.launch_date || undefined,
      }));
    },
  });

  const handleCourseClick = (courseId: string) => {
    navigate(`/app/cursos/${courseId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-purple-100/90 mb-2">
          Cursos Disponibles
        </h1>
        <p className="text-gray-400">
          Explora nuestra colección de cursos y comienza tu aprendizaje
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {courses?.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            isSubscribed={userProfile?.is_subscribed}
            onClick={() => handleCourseClick(course.id)}
          />
        ))}
      </motion.div>

      {(!courses || courses.length === 0) && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            No hay cursos disponibles en este momento.
          </p>
        </div>
      )}
    </div>
  );
};

export default AppCourses;