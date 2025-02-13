import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { CourseContent } from "@/components/courses/CourseContent";
import { CourseSidebar } from "@/components/courses/CourseSidebar";
import type { CourseType } from "@/types/courses";

const CourseView = () => {
  const { cursoId } = useParams();
  const user = useUser();
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);

  const { data: userProfile } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: course, isLoading: isLoadingCourse } = useQuery({
    queryKey: ['course', cursoId],
    queryFn: async () => {
      if (!cursoId) throw new Error('No course ID provided');
      
      console.log('Fetching course with ID:', cursoId);
      
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          course_sessions (
            *
          ),
          course_evaluations (
            *
          ),
          course_ratings (
            rating,
            comment,
            user_id,
            created_at
          )
        `)
        .eq('id', cursoId)
        .single();

      if (error) {
        console.error('Error fetching course:', error);
        throw error;
      }
      
      console.log('Course data received:', data);
      return data as CourseType;
    },
    enabled: !!cursoId,
  });

  const { data: userCourse } = useQuery({
    queryKey: ['user-course', cursoId, user?.id],
    queryFn: async () => {
      if (!user || !cursoId) return null;
      
      console.log('Fetching user course data for:', { userId: user.id, courseId: cursoId });
      
      const { data, error } = await supabase
        .from('user_courses')
        .select('*')
        .eq('course_id', cursoId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user course:', error);
        throw error;
      }
      
      console.log('User course data:', data);
      return data;
    },
    enabled: !!user && !!cursoId,
  });

  const hasAccess = Boolean(userCourse);
  const isSubscribed = userProfile?.is_subscribed;

  const handlePreviousSession = () => {
    if (currentSessionIndex > 0) {
      setCurrentSessionIndex(currentSessionIndex - 1);
    }
  };

  const handleNextSession = () => {
    if (course?.course_sessions && currentSessionIndex < course.course_sessions.length - 1) {
      setCurrentSessionIndex(currentSessionIndex + 1);
    }
  };

  const handleVideoEnd = () => {
    handleNextSession();
  };

  if (isLoadingCourse) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="h-[200px] w-full animate-pulse bg-gray-800/50 rounded-lg" />
        <div className="h-[400px] w-full animate-pulse bg-gray-800/50 rounded-lg" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Curso no encontrado</p>
      </div>
    );
  }

  const currentSession = course.course_sessions?.[currentSessionIndex];
  const averageRating = course.course_ratings?.length
    ? course.course_ratings.reduce((acc, curr) => acc + curr.rating, 0) / course.course_ratings.length
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8">
        <div className="w-full">
          <CourseContent 
            course={course as CourseType}
            hasAccess={hasAccess}
            userCourse={userCourse}
            currentSession={currentSession}
            currentSessionIndex={currentSessionIndex}
            sessionsLength={course?.course_sessions?.length || 0}
            handlePreviousSession={handlePreviousSession}
            handleNextSession={handleNextSession}
            handleVideoEnd={handleVideoEnd}
            averageRating={averageRating}
            isSubscribed={isSubscribed}
          />
        </div>

        <div className="w-full">
          <CourseSidebar 
            sessions={course.course_sessions || []}
            hasAccess={hasAccess || isSubscribed}
            currentSession={currentSession}
            onPurchaseClick={() => {}}
            userCourse={userCourse}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseView;