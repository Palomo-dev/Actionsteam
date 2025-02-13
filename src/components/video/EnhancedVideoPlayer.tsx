import React, { useRef, useState, useCallback } from 'react';
import ReactPlayer from 'react-player';
import { VideoPlayerControls } from './VideoPlayerControls';
import { useVideoAnalytics } from '@/hooks/video/useVideoAnalytics';
import { useUser } from '@supabase/auth-helpers-react';
import { VideoContainer } from './VideoContainer';
import screenfull from 'screenfull';
import { VideoControlsOverlay } from './VideoControlsOverlay';
import { useVideoActions } from './VideoActions';
import { VideoEventType } from '@/types/video';
import { toast } from 'sonner';

interface EnhancedVideoPlayerProps {
  videoUrl: string;
  courseId?: string;
  sessionId?: string;
  onVideoEnd?: () => void;
  autoPlay?: boolean;
}

export const EnhancedVideoPlayer = ({
  videoUrl,
  courseId,
  sessionId,
  onVideoEnd,
  autoPlay = false
}: EnhancedVideoPlayerProps) => {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<ReactPlayer>(null);

  const user = useUser();
  const { trackVideoEvent } = useVideoAnalytics(user?.id, courseId, sessionId);

  const handleProgress = useCallback(({ played }: { played: number }) => {
    setPlayed(played);
    trackVideoEvent('seek', playerRef.current?.getCurrentTime() || 0, duration);
  }, [duration, trackVideoEvent]);

  const handlePlayPause = useCallback(() => {
    setPlaying(!playing);
    trackVideoEvent(
      playing ? 'pause' : 'play',
      playerRef.current?.getCurrentTime() || 0,
      duration
    );
  }, [playing, duration, trackVideoEvent]);

  const handleVolumeChange = useCallback((values: number[]) => {
    if (values.length > 0) {
      const newVolume = values[0];
      setVolume(newVolume);
      setMuted(newVolume === 0);
    }
  }, []);

  const handleSeek = useCallback((values: number[]) => {
    if (!playerRef.current || !duration || values.length === 0) return;
    
    const percentage = values[0];
    const newTime = (percentage / 100) * duration;
    playerRef.current.seekTo(newTime);
    setPlayed(percentage / 100);
    
    trackVideoEvent('seek', newTime, duration);
  }, [duration, trackVideoEvent]);

  const handlePlaybackRateChange = useCallback(() => {
    const rates = [0.5, 1, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    const newRate = rates[nextIndex];
    setPlaybackRate(newRate);
    
    trackVideoEvent('quality_change', playerRef.current?.getCurrentTime() || 0, duration, {
      new_rate: newRate
    });
  }, [playbackRate, duration, trackVideoEvent]);

  const handleFullscreenToggle = useCallback(() => {
    if (!containerRef.current || !screenfull.isEnabled) return;
    
    try {
      if (!screenfull.isFullscreen) {
        screenfull.request(containerRef.current);
        setIsFullscreen(true);
      } else {
        screenfull.exit();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
      toast.error('No se pudo cambiar a pantalla completa');
    }
  }, []);

  const { NotesDialog, BookmarksDialog, handleAddBookmark, handleAddNote, handleQualityChange } = useVideoActions({
    user,
    courseId,
    sessionId,
    getCurrentTime: () => playerRef.current?.getCurrentTime() || 0,
    duration,
    trackVideoEvent
  });

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <VideoContainer ref={containerRef} className="group">
      <div className="relative w-full h-full">
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          width="100%"
          height="100%"
          playing={playing}
          volume={volume}
          muted={muted}
          playbackRate={playbackRate}
          onProgress={handleProgress}
          onDuration={setDuration}
          onEnded={onVideoEnd}
          className="absolute top-0 left-0"
          style={{ backgroundColor: '#000' }}
        />

        <VideoControlsOverlay
          isPlaying={playing}
          volume={volume}
          isMuted={muted}
          playbackRate={playbackRate}
          isFullscreen={isFullscreen}
          progress={played * 100}
          onPlayPause={handlePlayPause}
          onMuteToggle={() => setMuted(!muted)}
          onVolumeChange={handleVolumeChange}
          onProgressChange={handleSeek}
          onSkipBackward={() => playerRef.current?.seekTo(Math.max(0, (playerRef.current?.getCurrentTime() || 0) - 10))}
          onSkipForward={() => playerRef.current?.seekTo(Math.min(duration, (playerRef.current?.getCurrentTime() || 0) + 10))}
          onPlaybackRateChange={handlePlaybackRateChange}
          onFullscreenToggle={handleFullscreenToggle}
          onQualityChange={handleQualityChange}
          onAddBookmark={handleAddBookmark}
          onAddNote={handleAddNote}
          NotesDialog={NotesDialog}
          BookmarksDialog={BookmarksDialog}
        />
      </div>
    </VideoContainer>
  );
};