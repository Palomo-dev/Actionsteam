import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Clock } from "lucide-react";
import type { CourseSessionType } from "@/types/courses";
import { SessionVideo } from "./session/SessionVideo";
import { SessionDocument } from "./session/SessionDocument";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

interface CourseSessionProps {
  index: number;
  session: CourseSessionType;
  updateSession: (index: number, field: keyof CourseSessionType, value: any) => void;
  onRemove: (index: number) => void;
}

export const CourseSession = ({
  index,
  session,
  updateSession,
  onRemove,
}: CourseSessionProps) => {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Sesión {index + 1}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:text-red-600"
          onClick={() => onRemove(index)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Título</Label>
          <Input
            placeholder="Título de la sesión"
            value={session.title}
            onChange={(e) => updateSession(index, "title", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Descripción</Label>
          <RichTextEditor
            value={session.description || ''}
            onChange={(value) => updateSession(index, "description", value)}
            placeholder="Descripción de la sesión"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Duración</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                className="pl-10"
                value={formatDuration(session.duration_seconds || 0)}
                onChange={(e) => {
                  const [hours, minutes, seconds] = e.target.value.split(':').map(Number);
                  const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
                  updateSession(index, "duration_seconds", totalSeconds);
                }}
                placeholder="00:00:00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <SessionVideo
              videoUrl={session.video_url}
              onVideoChange={(file) => updateSession(index, "videoFile", file)}
              onVideoUrlChange={(url) => updateSession(index, "video_url", url)}
            />
          </div>

          <div className="space-y-2">
            <SessionDocument
              documentUrl={session.documentation_url}
              documentFile={session.documentationFile}
              onDocumentChange={(file) => updateSession(index, "documentationFile", file)}
              onDocumentUrlChange={(url) => updateSession(index, "documentation_url", url)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};