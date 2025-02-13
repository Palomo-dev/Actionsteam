import { useRef } from 'react';
import { useVideoProgress } from './video/useVideoProgress';
import { useVideoControls } from './video/useVideoControls';
import { useVideoSession } from './video/useVideoSession';
import { useUser } from '@supabase/auth-helpers-react';

export const useVideoState = (videoUrl: string, courseId: string) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const user = useUser();
  
  const {
    isPlaying,
    setIsPlaying,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    playbackRate,
    setPlaybackRate,
    duration,
    setDuration
  } = useVideoControls();

  const { progress, setProgress, updateProgress } = useVideoProgress(courseId, user?.id);
  
  useVideoSession(videoRef, courseId, user?.id);

  const handleTimeUpdate = async () => {
    if (!videoRef.current) return;
    await updateProgress(videoRef.current.currentTime, videoRef.current.duration);
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
    handleTimeUpdate
  };
};