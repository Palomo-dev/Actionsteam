import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface CourseProgressCardProps {
  id: string;
  title: string;
  progress: number;
  thumbnailUrl?: string;
  bannerUrl?: string;
  inductionVideoUrl?: string;
  status?: string;
}

export const CourseProgressCard = ({
  id,
  title,
  progress,
  thumbnailUrl,
  bannerUrl,
  inductionVideoUrl,
  status,
}: CourseProgressCardProps) => {
  const isCompleted = status === 'completed';

  const getImageUrl = (path?: string) => {
    if (!path) return "/placeholder.svg";
    if (path.startsWith('http')) return path;
    return supabase.storage.from('course_files').getPublicUrl(path).data.publicUrl;
  };

  return (
    <Link to={`/app/cursos/${id}`}>
      <Card className="bg-card/50 border-border/50 hover:bg-card/70 transition-colors relative">
        {isCompleted && (
          <div className="absolute -top-2 -right-2 z-10">
            <Badge className="bg-green-500/20 text-green-300">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Completado
            </Badge>
          </div>
        )}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium truncate">{title}</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {inductionVideoUrl ? (
              <video
                src={inductionVideoUrl}
                className="w-full h-32 object-cover rounded-md"
                muted
                playsInline
                poster={getImageUrl(bannerUrl || thumbnailUrl)}
              />
            ) : (
              <img
                src={getImageUrl(bannerUrl || thumbnailUrl)}
                alt={title}
                className="w-full h-32 object-cover rounded-md"
              />
            )}
            <Progress 
              value={progress} 
              className={cn(
                "h-2",
                isCompleted ? "bg-green-500/20" : ""
              )}
            />
            <p className="text-xs text-muted-foreground">
              {isCompleted ? 'Completado' : `Progreso: ${progress}%`}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};