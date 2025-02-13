import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface VideoEvent {
  eventType: string;
  videoTime: number;
  videoDuration: number;
  userId: string;
  courseId?: string;
  sessionId?: string;
  metadata?: any;
}

export const useVideoEventBuffer = () => {
  const [eventBuffer, setEventBuffer] = useState<VideoEvent[]>([]);

  const trackEvent = useCallback((event: VideoEvent) => {
    console.log('Video event tracked:', event);
    setEventBuffer(prev => [...prev, event]);
  }, []);

  const processEvents = async (events: VideoEvent[]) => {
    if (events.length === 0) return true;

    try {
      const { error } = await supabase
        .from('video_events')
        .insert(
          events.map(event => ({
            user_id: event.userId,
            course_id: event.courseId,
            session_id: event.sessionId,
            event_type: event.eventType,
            video_time: event.videoTime,
            video_duration: event.videoDuration,
            metadata: event.metadata || {}
          }))
        );

      if (error) {
        // If there's an error, we'll log it but not fail completely
        console.error('Error processing video events:', error);
        toast.error("Error al procesar eventos de video");
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error processing video events:', error);
      toast.error("Error al procesar eventos de video");
      return false;
    }
  };

  useState(() => {
    const interval = setInterval(async () => {
      if (eventBuffer.length > 0) {
        const events = [...eventBuffer];
        const success = await processEvents(events);
        if (success) {
          setEventBuffer([]);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  });

  return { trackEvent };
};