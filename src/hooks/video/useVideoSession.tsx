import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useVideoSession = (
  videoRef: React.RefObject<HTMLVideoElement>,
  courseId: string, 
  userId: string | undefined
) => {
  useEffect(() => {
    const loadLastProgress = async () => {
      if (!userId || !videoRef.current) return;
      
      try {
        const { data: studySession } = await supabase
          .from('study_sessions')
          .select('*')
          .eq('course_id', courseId)
          .eq('user_id', userId)
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

    // Iniciar nueva sesión de estudio
    const startNewSession = async () => {
      if (!userId) return;

      try {
        await supabase
          .from('study_sessions')
          .insert({
            course_id: courseId,
            user_id: userId,
            start_time: new Date().toISOString(),
            duration_minutes: 0
          });
      } catch (error) {
        console.error('Error starting study session:', error);
      }
    };

    startNewSession();

    // Limpiar: Finalizar la sesión de estudio al desmontar
    return () => {
      if (!userId) return;
      
      supabase
        .from('study_sessions')
        .update({
          end_time: new Date().toISOString()
        })
        .eq('course_id', courseId)
        .eq('user_id', userId)
        .is('end_time', null)
        .then(({ error }) => {
          if (error) console.error('Error ending study session:', error);
        });
    };
  }, [courseId, userId, videoRef]);
};