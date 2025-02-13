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
  const progressUpdateThreshold = 5; // Actualizar cada 5 segundos

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
          videoRef.current.currentTime = studySession.duration_seconds || 0;
        }
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    };

    loadLastProgress();
    
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }

    // Iniciar nueva sesión de estudio
    const startNewSession = async () => {
      if (!user) return;

      try {
        await supabase
          .from('study_sessions')
          .insert({
            course_id: courseId,
            user_id: user.id,
            start_time: new Date().toISOString(),
            duration_seconds: 0
          });
      } catch (error) {
        console.error('Error starting study session:', error);
      }
    };

    startNewSession();

    return () => {
      if (!user) return;
      
      const endSession = async () => {
        try {
          await supabase
            .from('study_sessions')
            .update({
              end_time: new Date().toISOString()
            })
            .eq('course_id', courseId)
            .eq('user_id', user.id)
            .is('end_time', null);
        } catch (error) {
          console.error('Error ending study session:', error);
        }
      };

      endSession();
    };
  }, [courseId, user]);

  const handleTimeUpdate = async () => {
    if (!videoRef.current || !user) return;

    const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(currentProgress);

    // Solo actualizamos cada X segundos para no sobrecargar la base de datos
    if (Math.floor(videoRef.current.currentTime) % progressUpdateThreshold === 0) {
      try {
        const currentTime = Math.floor(videoRef.current.currentTime);
        console.log('Updating progress:', { currentTime, currentProgress });

        const { data: existingSession } = await supabase
          .from('study_sessions')
          .select('*')
          .eq('course_id', courseId)
          .eq('user_id', user.id)
          .is('end_time', null)
          .maybeSingle();

        if (existingSession) {
          await supabase
            .from('study_sessions')
            .update({
              duration_seconds: currentTime,
              end_time: currentProgress >= 90 ? new Date().toISOString() : null
            })
            .eq('id', existingSession.id);

          // Actualizar el tiempo de estudio en user_courses
          const { data: userCourse } = await supabase
            .from('user_courses')
            .select('study_time_seconds')
            .eq('course_id', courseId)
            .eq('user_id', user.id)
            .single();

          if (userCourse) {
            await supabase
              .from('user_courses')
              .update({
                study_time_seconds: (userCourse.study_time_seconds || 0) + progressUpdateThreshold,
                last_accessed: new Date().toISOString()
              })
              .eq('course_id', courseId)
              .eq('user_id', user.id);
          }

          if (currentProgress >= 90) {
            toast({
              title: "¡Progreso guardado!",
              description: "Has completado esta sesión del curso.",
            });
          }
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