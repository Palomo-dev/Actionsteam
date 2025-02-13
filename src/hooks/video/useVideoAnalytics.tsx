import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useVideoEventBuffer } from './useVideoEventBuffer';

export const useVideoAnalytics = (
  userId: string | undefined,
  courseId: string | undefined,
  sessionId?: string
) => {
  const { trackEvent } = useVideoEventBuffer();

  const trackVideoEvent = async (
    eventType: 'play' | 'pause' | 'seek' | 'buffer' | 'quality_change' | 'error' | 'complete',
    videoTime: number,
    videoDuration: number,
    metadata: any = {}
  ) => {
    if (!userId) {
      console.warn('No user ID provided for video analytics');
      return;
    }

    try {
      const deviceInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        screenSize: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language,
      };

      trackEvent({
        eventType,
        videoTime,
        videoDuration,
        userId,
        courseId,
        sessionId,
        metadata: {
          ...metadata,
          device_info: deviceInfo,
          timestamp: new Date().toISOString(),
        }
      });

    } catch (error: any) {
      console.error('Error tracking video event:', error);
      toast.error("Error al registrar evento del video");
    }
  };

  return { trackVideoEvent };
};