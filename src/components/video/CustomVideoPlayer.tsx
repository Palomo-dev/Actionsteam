import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useUser } from '@supabase/auth-helpers-react';
import { VideoContainer } from './VideoContainer';
import { VideoOverlay } from './VideoOverlay';
import { VideoControlsOverlay } from './VideoControlsOverlay';
import { useVideoPlayer } from '@/hooks/video/useVideoPlayer';
import { useToast } from '@/components/ui/use-toast';

interface VideoPlayerProps {
  videoUrl: string | null;
  courseId: string;
  onVideoEnd?: () => void;
  autoPlay?: boolean;
}

export const CustomVideoPlayer = ({ videoUrl, courseId, onVideoEnd, autoPlay = false }: VideoPlayerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUser();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const {
    videoRef,
    isPlaying,
    progress,
    volume,
    isMuted,
    duration,
    setDuration,
    playbackRate,
    togglePlay,
    handleVolumeChange: onVolumeChange,
    toggleMute,
    handleProgressChange: onProgressChange,
    skipForward,
    skipBackward,
    changePlaybackRate,
  } = useVideoPlayer(videoSrc, courseId, user?.id);

  useEffect(() => {
    const loadVideo = async () => {
      if (!videoUrl) {
        setIsLoading(false);
        setError('No se proporcionó URL del video');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        let finalUrl = videoUrl;

        if (!videoUrl.startsWith('http')) {
          const { data, error } = await supabase.storage
            .from('course_files')
            .createSignedUrl(videoUrl, 3600);

          if (error) {
            console.error('Error al obtener URL firmada:', error);
            setError('Error al cargar el video');
            toast({
              variant: "destructive",
              title: "Error",
              description: "No se pudo cargar el video. Por favor, intenta de nuevo.",
            });
            return;
          }

          finalUrl = data.signedUrl;
        }

        setVideoSrc(finalUrl);
        
        if (autoPlay && hasInteracted && videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch(e => console.error('Error al reproducir:', e));
        }
      } catch (error) {
        console.error('Error al procesar URL del video:', error);
        setError('Error al cargar el video');
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ocurrió un error al cargar el video.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadVideo();
  }, [videoUrl, autoPlay, hasInteracted, toast, videoRef]);

  useEffect(() => {
    const handleUserInteraction = () => {
      setHasInteracted(true);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      if (autoPlay && hasInteracted) {
        videoRef.current.play().catch(e => console.error('Error al reproducir:', e));
      }
    }
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('Error al cambiar pantalla completa:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo activar el modo pantalla completa.",
      });
    }
  };

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900 text-gray-400">
        Cargando video...
      </div>
    );
  }

  if (error || !videoSrc) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900 text-gray-400">
        {error || 'No hay video disponible'}
      </div>
    );
  }

  const handleVolumeChangeWrapper = (values: number[]) => {
    if (values.length > 0) {
      onVolumeChange([values[0]]);
    }
  };

  const handleProgressChangeWrapper = (values: number[]) => {
    if (values.length > 0) {
      onProgressChange([values[0]]);
    }
  };

  return (
    <VideoContainer ref={containerRef} className="group">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-contain bg-black/90"
        src={videoSrc}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={onVideoEnd}
        onClick={togglePlay}
        playsInline
      />
      
      <VideoOverlay>
        <VideoControlsOverlay
          isPlaying={isPlaying}
          volume={volume}
          isMuted={isMuted}
          playbackRate={playbackRate}
          isFullscreen={isFullscreen}
          progress={progress * 100}
          onPlayPause={togglePlay}
          onMuteToggle={toggleMute}
          onVolumeChange={handleVolumeChangeWrapper}
          onProgressChange={handleProgressChangeWrapper}
          onSkipBackward={skipBackward}
          onSkipForward={skipForward}
          onPlaybackRateChange={changePlaybackRate}
          onFullscreenToggle={toggleFullscreen}
        />
      </VideoOverlay>
    </VideoContainer>
  );
};