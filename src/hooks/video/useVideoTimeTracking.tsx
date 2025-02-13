import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@supabase/auth-helpers-react';

export const useVideoTimeTracking = (
  videoRef: React.RefObject<HTMLVideoElement>,
  courseId: string,
  userId?: string,
  onTimeUpdate?: (currentTime: number, duration: number) => void
) => {
  const { toast } = useToast();
  const user = useUser();

  useEffect(() => {
    if (!videoRef.current || !user) return;

    const handleTimeUpdate = async () => {
      if (!videoRef.current || !user) return;

      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;

      if (onTimeUpdate) {
        onTimeUpdate(currentTime, duration);
      }

      // Solo actualizamos cada 5 segundos para no sobrecargar la base de datos
      if (Math.floor(currentTime) % 5 === 0) {
        try {
          // Primero, verificar si existe un registro en user_courses
          const { data: existingUserCourse, error: userCourseError } = await supabase
            .from('user_courses')
            .select('id')
            .eq('user_id', user.id)
            .eq('course_id', courseId)
            .maybeSingle();

          if (userCourseError) throw userCourseError;

          // Si no existe, crear el registro en user_courses
          if (!existingUserCourse) {
            const { error: insertError } = await supabase
              .from('user_courses')
              .insert({
                user_id: user.id,
                course_id: courseId,
                status: 'in_progress',
                progress: 0,
                study_time_seconds: 0
              })
              .select()
              .single();

            if (insertError) {
              // Si hay un error de duplicado, ignorarlo ya que probablemente otro proceso lo creó
              if (insertError.code !== '23505') {
                throw insertError;
              }
            }
          }

          const currentSeconds = Math.floor(currentTime);
          const progress = (currentTime / duration) * 100;

          // Buscar sesión de estudio activa
          const { data: existingSession, error: sessionError } = await supabase
            .from('study_sessions')
            .select('*')
            .eq('course_id', courseId)
            .eq('user_id', user.id)
            .is('end_time', null)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (sessionError) throw sessionError;

          if (existingSession) {
            // Actualizar sesión existente
            const { error: updateError } = await supabase
              .from('study_sessions')
              .update({
                duration_seconds: currentSeconds,
                end_time: progress >= 90 ? new Date().toISOString() : null
              })
              .eq('id', existingSession.id);

            if (updateError) throw updateError;

            // Actualizar user_courses
            const { error: progressError } = await supabase
              .from('user_courses')
              .update({
                study_time_seconds: currentSeconds,
                last_accessed: new Date().toISOString()
              })
              .eq('course_id', courseId)
              .eq('user_id', user.id);

            if (progressError) throw progressError;
          } else {
            // Crear nueva sesión
            const { error: insertError } = await supabase
              .from('study_sessions')
              .insert({
                course_id: courseId,
                user_id: user.id,
                duration_seconds: currentSeconds,
                start_time: new Date().toISOString(),
                end_time: progress >= 90 ? new Date().toISOString() : null
              });

            if (insertError) throw insertError;
          }

        } catch (error: any) {
          console.error('Error al actualizar el progreso:', error);
          toast({
            title: "Error",
            description: "No se pudo actualizar el progreso del video",
            variant: "destructive"
          });
        }
      }
    };

    const video = videoRef.current;
    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [videoRef, courseId, user, onTimeUpdate, toast]);
};