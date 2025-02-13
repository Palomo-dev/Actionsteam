import { CourseHeader } from "./CourseHeader";
import { CourseProgress } from "./CourseProgress";
import { CourseInductionVideo } from "./CourseInductionVideo";
import { CoursePurchaseSection } from "./CoursePurchaseSection";
import { CourseNavigation } from "./CourseNavigation";
import { CountdownTimer } from "./CountdownTimer";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { CourseType } from "@/types/courses";
import { useToast } from "@/hooks/use-toast";
import { ChatDrawer } from "@/components/chat/ChatDrawer";
import { EnhancedVideoPlayer } from "@/components/video/EnhancedVideoPlayer";

interface CourseContentProps {
  course: CourseType;
  hasAccess: boolean;
  userCourse: any;
  currentSession: any;
  currentSessionIndex: number;
  sessionsLength: number;
  handlePreviousSession: () => void;
  handleNextSession: () => void;
  handleVideoEnd: () => void;
  averageRating: number;
  isSubscribed?: boolean;
}

export const CourseContent = ({
  course,
  hasAccess,
  userCourse,
  currentSession,
  currentSessionIndex,
  sessionsLength,
  handlePreviousSession,
  handleNextSession,
  handleVideoEnd,
  averageRating,
  isSubscribed,
}: CourseContentProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isBeforeLaunchDate = course.launch_date && new Date(course.launch_date) > new Date();
  const canAccessContent = hasAccess || isSubscribed;

  const handleVideoEndWithNavigation = () => {
    if (currentSessionIndex === sessionsLength - 1) {
      navigate(`/app/cursos/${course.id}/examen`);
      toast({
        title: "¡Felicitaciones!",
        description: "Has completado todas las sesiones del curso. Es hora de tomar el examen.",
      });
    } else {
      handleVideoEnd();
      handleNextSession();
      toast({
        description: "Pasando a la siguiente sesión...",
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 lg:space-y-8 max-w-[1400px] mx-auto px-4 sm:px-6 py-8"
    >
      <CourseHeader
        course={course}
        rating={averageRating}
        totalRatings={course.course_ratings?.length}
      />

      {isBeforeLaunchDate && (
        <Card className="p-8 bg-gradient-to-br from-gray-900/90 via-purple-900/20 to-gray-900/90 border-purple-500/30 hover:border-purple-500/50 transition-all duration-300">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
              ¡Próximamente!
            </h3>
            <p className="text-gray-300/90">
              Este curso estará disponible en:
            </p>
            <CountdownTimer 
              targetDate={course.launch_date} 
              className="max-w-md mx-auto"
            />
          </div>
        </Card>
      )}

      {(!canAccessContent && !isSubscribed) ? (
        <div className="space-y-6">
          <CourseInductionVideo 
            inductionVideoUrl={course.induction_video_url} 
            isSubscribed={isSubscribed}
            isBeforeLaunchDate={isBeforeLaunchDate}
          />
          <CoursePurchaseSection 
            courseId={course.id} 
            price={course.price_cop || 0}
            stripePriceId={course.stripe_price_id || ''}
            isSubscribed={isSubscribed}
            timeUntilLaunch={course.launch_date}
          />
        </div>
      ) : (
        <>
          {isBeforeLaunchDate && (
            <CourseInductionVideo 
              inductionVideoUrl={course.induction_video_url}
              isSubscribed={isSubscribed}
              isBeforeLaunchDate={isBeforeLaunchDate}
            />
          )}
          {(!isBeforeLaunchDate && currentSession?.video_url) && (
            <div className="space-y-6">
              <Card className="overflow-hidden bg-gradient-to-br from-gray-900/90 via-purple-900/20 to-gray-900/90 border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 shadow-xl">
                <div className="relative w-full pt-[56.25%] lg:pt-[56.25%]">
                  <div className="absolute inset-0">
                    <EnhancedVideoPlayer
                      videoUrl={currentSession.video_url}
                      courseId={course.id}
                      sessionId={currentSession.id}
                      onVideoEnd={handleVideoEndWithNavigation}
                      autoPlay={currentSessionIndex > 0}
                    />
                  </div>
                </div>
              </Card>
              <CourseNavigation
                currentIndex={currentSessionIndex}
                totalSessions={sessionsLength}
                onPrevious={handlePreviousSession}
                onNext={handleNextSession}
                currentSession={currentSession}
              />
            </div>
          )}
        </>
      )}

      {(canAccessContent || isSubscribed) && userCourse && (
        <div className="sticky top-4 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <CourseProgress 
            courseId={course.id}
            progress={userCourse.progress || 0}
            showExamButton={userCourse.progress === 100}
          />
        </div>
      )}

      {(canAccessContent || isSubscribed) && (
        <ChatDrawer courseId={course.id} courseTitle={course.title} />
      )}
    </motion.div>
  );
};