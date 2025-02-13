import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Video, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { VideoContainer } from "@/components/video/VideoContainer";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface SessionVideoProps {
  videoUrl: string | null | undefined;
  onVideoChange: (file: File | null) => void;
  onVideoUrlChange: (url: string | null) => void;
}

export const SessionVideo = ({
  videoUrl,
  onVideoChange,
  onVideoUrlChange,
}: SessionVideoProps) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
      onVideoChange(file);
      toast.success("Video seleccionado correctamente");
    }
  };

  const handleRemoveVideo = () => {
    setVideoFile(null);
    onVideoChange(null);
    onVideoUrlChange(null);
    toast.success("Video eliminado correctamente");
  };

  // Get the full storage URL for videos stored in Supabase
  const getStorageUrl = (path: string | null | undefined) => {
    if (!path) return "";
    if (path.startsWith('http')) return path;
    const { data } = supabase.storage.from('course_files').getPublicUrl(path);
    return data.publicUrl;
  };

  // Verificar si hay un video (ya sea archivo o URL)
  const hasVideo = videoFile || videoUrl;
  console.log("Video URL:", videoUrl); // Para debugging
  console.log("Storage URL:", getStorageUrl(videoUrl)); // Para debugging

  return (
    <div className="space-y-4">
      <Label>Video de la sesión</Label>
      <div className="space-y-4">
        <div className="relative">
          <Video className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="pl-10"
          />
        </div>

        <Card className="overflow-hidden bg-[#0f1116] border-0">
          {hasVideo ? (
            <>
              <VideoContainer className="rounded-none">
                <video 
                  controls 
                  className="w-full aspect-video bg-black"
                  src={videoFile ? URL.createObjectURL(videoFile) : getStorageUrl(videoUrl)}
                >
                  Tu navegador no soporta el elemento de video.
                </video>
              </VideoContainer>
              
              <div className="p-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleRemoveVideo}
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar Video
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
              <Upload className="h-12 w-12 mb-4" />
              <p>No hay video cargado</p>
              <p className="text-sm">Sube un video para esta sesión</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};