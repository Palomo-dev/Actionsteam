import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useVideoTimeTracking } from './useVideoTimeTracking';

export const useVideoPlayer = (videoUrl: string | null, courseId: string, userId?: string) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const { toast } = useToast();

  const handleTimeUpdate = (currentTime: number, duration: number) => {
    if (duration > 0) {
      const newProgress = (currentTime / duration) * 100;
      setProgress(Math.min(newProgress, 100));
    }
  };

  useVideoTimeTracking(videoRef, courseId, userId, handleTimeUpdate);

  const togglePlay = () => {
    if (!videoRef.current || !videoUrl) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se puede reproducir el video en este momento",
      });
      return;
    }

    try {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error al reproducir/pausar:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al reproducir el video",
      });
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (videoRef.current) {
      const newVolume = value[0];
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
      if (newMutedState) {
        setVolume(0);
      } else {
        setVolume(1);
        videoRef.current.volume = 1;
      }
    }
  };

  const handleProgressChange = (value: number[]) => {
    if (!videoRef.current || !duration) {
      return;
    }

    try {
      const percentage = value[0];
      if (typeof percentage !== 'number' || !isFinite(percentage)) {
        console.warn('Valor de progreso inválido:', percentage);
        return;
      }

      const newTime = (percentage / 100) * duration;
      if (!isFinite(newTime)) {
        console.warn('Tiempo calculado inválido:', newTime);
        return;
      }

      // Asegurarse de que el tiempo esté dentro de los límites válidos
      const clampedTime = Math.max(0, Math.min(newTime, duration));
      videoRef.current.currentTime = clampedTime;
      setProgress(percentage);
    } catch (error) {
      console.error('Error al cambiar el progreso del video:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo cambiar la posición del video",
      });
    }
  };

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 10;
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 10;
    }
  };

  const changePlaybackRate = () => {
    if (videoRef.current) {
      const rates = [0.5, 1, 1.5, 2];
      const currentIndex = rates.indexOf(playbackRate);
      const nextIndex = (currentIndex + 1) % rates.length;
      const newRate = rates[nextIndex];
      videoRef.current.playbackRate = newRate;
      setPlaybackRate(newRate);
      toast({
        description: `Velocidad de reproducción: ${newRate}x`,
      });
    }
  };

  return {
    videoRef,
    isPlaying,
    progress,
    volume,
    isMuted,
    duration,
    setDuration,
    playbackRate,
    togglePlay,
    handleVolumeChange,
    toggleMute,
    handleProgressChange,
    skipForward,
    skipBackward,
    changePlaybackRate,
  };
};