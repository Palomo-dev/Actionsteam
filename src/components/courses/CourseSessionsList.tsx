import { SessionContent } from "@/components/courses/SessionContent";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseSessionsListProps {
  sessions: Array<{
    id: string;
    title: string;
    description: string | null;
    video_url: string | null;
    documentation_url: string | null;
    duration_hours: number | null;
  }>;
  hasAccess: boolean;
  onPurchaseClick: () => void;
  userCourse?: any;
  currentSession?: any;
}

export const CourseSessionsList = ({ 
  sessions, 
  hasAccess, 
  onPurchaseClick,
  userCourse,
  currentSession
}: CourseSessionsListProps) => {
  const getSessionProgress = (sessionIndex: number) => {
    if (!userCourse) return false;
    const totalDuration = sessions.reduce((acc, session) => acc + (session.duration_hours || 0), 0);
    const completedDuration = (userCourse.study_time_minutes || 0) / 60;
    const sessionDuration = sessions.slice(0, sessionIndex + 1).reduce((acc, session) => acc + (session.duration_hours || 0), 0);
    return completedDuration >= sessionDuration;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-purple-400">Contenido del Curso</h2>
      <div className="space-y-4">
        {sessions?.map((session, index) => (
          <div key={session.id} className="relative">
            <SessionContent
              session={session}
              isCompleted={getSessionProgress(index)}
              isActive={currentSession?.id === session.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
};