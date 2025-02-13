import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@supabase/auth-helpers-react';

export const useVideoState = (videoUrl: string, courseId: string) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const { toast } = useToast();
  const user = useUser();

  useEffect(() => {
    const loadLastProgress = async () => {
      if (!user) return;
      
      try {
        const { data: studySession } = await supabase
          .from('study_sessions')
          .select('*')
          .eq('course_id', courseId)
          .eq('user_id', user.id)
          .is('end_time', null)
          .maybeSingle();

        if (studySession && videoRef.current) {
          videoRef.current.currentTime = studySession.duration_minutes * 60;
        }
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    };

    loadLastProgress();
    
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  }, [courseId, user, videoUrl]);

  const updateUserCourseProgress = async () => {
    if (!user) return;

    try {
      // 1. Obtener todas las sesiones del curso
      const { data: courseSessions } = await supabase
        .from('course_sessions')
        .select('id')
        .eq('course_id', courseId);

      if (!courseSessions) return;

      // 2. Obtener las sesiones completadas por el usuario
      const { data: completedSessions } = await supabase
        .from('study_sessions')
        .select('id')
        .eq('course_id', courseId)
        .eq('user_id', user.id)
        .not('end_time', 'is', null);

      const totalSessions = courseSessions.length;
      const completedSessionsCount = completedSessions?.length || 0;
      
      // 3. Calculamos el progreso como un porcentaje del total de sesiones
      const completedProgress = Math.min(
        Math.round((completedSessionsCount / totalSessions) * 100),
        100
      );

      console.log('Progress calculation:', {
        completedSessions: completedSessionsCount,
        totalSessions,
        completedProgress
      });

      // 4. Actualizar el progreso en user_courses
      const { error: updateError } = await supabase
        .from('user_courses')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          progress: completedProgress,
          status: completedProgress >= 100 ? 'completed' : 'in_progress',
          last_accessed: new Date().toISOString()
        });

      if (updateError) throw updateError;
    } catch (error) {
      console.error('Error updating course progress:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el progreso del curso",
        variant: "destructive"
      });
    }
  };

  const handleTimeUpdate = async () => {
    if (!videoRef.current || !user) return;

    const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(currentProgress);

    // Actualizamos cada 5 segundos para no sobrecargar la base de datos
    if (Math.floor(videoRef.current.currentTime) % 5 === 0) {
      try {
        const currentTime = Math.floor(videoRef.current.currentTime / 60);

        // 1. Buscar sesión de estudio activa
        const { data: existingSession } = await supabase
          .from('study_sessions')
          .select('*')
          .eq('course_id', courseId)
          .eq('user_id', user.id)
          .is('end_time', null)
          .maybeSingle();

        // 2. Actualizar o crear sesión de estudio
        if (existingSession) {
          const { error: updateError } = await supabase
            .from('study_sessions')
            .update({
              duration_minutes: currentTime,
              end_time: currentProgress >= 90 ? new Date().toISOString() : null
            })
            .eq('id', existingSession.id);

          if (updateError) throw updateError;
        } else {
          const { error: insertError } = await supabase
            .from('study_sessions')
            .insert({
              course_id: courseId,
              user_id: user.id,
              duration_minutes: currentTime,
              start_time: new Date().toISOString(),
              end_time: currentProgress >= 90 ? new Date().toISOString() : null
            });

          if (insertError) throw insertError;
        }

        // 3. Si el video está al 90% o más, actualizamos el progreso del curso
        if (currentProgress >= 90) {
          await updateUserCourseProgress();
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

  return {
    videoRef,
    isPlaying,
    setIsPlaying,
    progress,
    setProgress,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    duration,
    setDuration,
    playbackRate,
    setPlaybackRate,
    handleTimeUpdate,
    toast
  };
};