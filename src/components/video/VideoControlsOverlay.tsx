import React from 'react';
import { Button } from '@/components/ui/button';
import { VideoProgress } from './VideoProgress';
import { VideoControls } from './VideoControls';
import { useMediaQuery } from '@/hooks/use-mobile';

interface VideoControlsOverlayProps {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  playbackRate: number;
  isFullscreen: boolean;
  progress: number;
  onPlayPause: () => void;
  onMuteToggle: () => void;
  onVolumeChange: (value: number[]) => void;
  onSkipBackward: () => void;
  onSkipForward: () => void;
  onPlaybackRateChange: () => void;
  onFullscreenToggle: () => void;
  onProgressChange: (value: number[]) => void;
  onQualityChange?: (quality: string) => void;
  onAddBookmark?: () => void;
  onAddNote?: () => void;
  NotesDialog?: () => JSX.Element;
  BookmarksDialog?: () => JSX.Element;
}

export const VideoControlsOverlay: React.FC<VideoControlsOverlayProps> = ({
  isPlaying,
  isMuted,
  volume,
  playbackRate,
  isFullscreen,
  progress,
  onPlayPause,
  onMuteToggle,
  onVolumeChange,
  onSkipBackward,
  onSkipForward,
  onPlaybackRateChange,
  onFullscreenToggle,
  onProgressChange,
  onQualityChange,
  onAddBookmark,
  onAddNote,
  NotesDialog,
  BookmarksDialog,
}) => {
  const isMobile = useMediaQuery("(max-width: 640px)");

  return (
    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 touch-none">
      <div className="flex items-center justify-between p-2 sm:p-4">
        <VideoControls
          isPlaying={isPlaying}
          isMuted={isMuted}
          volume={volume}
          playbackRate={playbackRate}
          isFullscreen={isFullscreen}
          onPlayPause={onPlayPause}
          onMuteToggle={onMuteToggle}
          onVolumeChange={onVolumeChange}
          onSkipBackward={onSkipBackward}
          onSkipForward={onSkipForward}
          onPlaybackRateChange={onPlaybackRateChange}
          onFullscreenToggle={onFullscreenToggle}
        />
        {!isMobile && (
          <div className="flex gap-2">
            {NotesDialog && <NotesDialog />}
            {BookmarksDialog && <BookmarksDialog />}
          </div>
        )}
      </div>
      <VideoProgress progress={progress} onProgressChange={onProgressChange} />
    </div>
  );
};