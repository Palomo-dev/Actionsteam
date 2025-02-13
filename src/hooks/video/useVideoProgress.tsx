import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/components/ui/use-toast';

export const useVideoProgress = (courseId: string, userId: string | undefined) => {
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const updateProgress = async (currentTime: number, duration: number) => {
    if (!userId) return;

    const currentProgress = (currentTime / duration) * 100;
    setProgress(currentProgress);

    // Actualizamos cada 5 segundos para no sobrecargar la base de datos
    if (Math.floor(currentTime) % 5 === 0) {
      try {
        const currentMinutes = Math.floor(currentTime / 60);

        // Buscar sesión activa
        const { data: existingSession } = await supabase
          .from('study_sessions')
          .select('*')
          .eq('course_id', courseId)
          .eq('user_id', userId)
          .is('end_time', null)
          .maybeSingle();

        if (existingSession) {
          await supabase
            .from('study_sessions')
            .update({
              duration_minutes: currentMinutes,
              end_time: currentProgress >= 90 ? new Date().toISOString() : null
            })
            .eq('id', existingSession.id);
        } else {
          await supabase
            .from('study_sessions')
            .insert({
              course_id: courseId,
              user_id: userId,
              duration_minutes: currentMinutes,
              start_time: new Date().toISOString(),
              end_time: currentProgress >= 90 ? new Date().toISOString() : null
            });
        }

      } catch (error) {
        console.error('Error saving progress:', error);
        toast({
          title: "Error",
          description: "No se pudo guardar el progreso del video",
          variant: "destructive"
        });
      }
    }
  };

  return { progress, setProgress, updateProgress };
};