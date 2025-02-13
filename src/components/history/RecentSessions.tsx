import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { StudySession } from "@/types/study-history";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

type RecentSessionsProps = {
  studySessions: StudySession[];
};

export const RecentSessions = ({ studySessions }: RecentSessionsProps) => {
  const formatTime = (seconds: number | null | undefined) => {
    if (!seconds) return '0m';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg text-gray-100 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-400" />
          Cursos en Progreso
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {studySessions?.map((session) => (
            <Link
              to={`/app/curso/${session.course?.slug}`}
              key={session.id}
              className="block transition-all hover:scale-[1.02]"
            >
              <div className="flex justify-between items-center p-4 rounded-lg bg-gray-700/30 hover:bg-gray-700/40 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-purple-400 font-medium">
                      {session.course?.title || 'Curso no disponible'}
                    </h3>
                    <ArrowUpRight className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-400">
                    Última sesión: {format(new Date(session.start_time), "PPp", { locale: es })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-300">
                    {formatTime(session.duration_seconds)}
                  </p>
                  {session.course?.progress !== undefined && (
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-gray-600 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-400 rounded-full transition-all duration-300"
                          style={{ width: `${Math.round(session.course.progress)}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-400">
                        {Math.round(session.course.progress)}%
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
          {studySessions?.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-500" />
              <p className="text-lg">No hay cursos en progreso</p>
              <p className="text-sm">Comienza a estudiar un curso para ver tu progreso aquí</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};