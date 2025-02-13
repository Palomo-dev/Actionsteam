import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, Pause, Volume2, VolumeX, 
  Bookmark, MessageSquare, Settings,
  SkipBack, SkipForward 
} from 'lucide-react';
import { formatTime } from '@/utils/timeUtils';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface VideoPlayerControlsProps {
  playing: boolean;
  muted: boolean;
  volume: number;
  played: number;
  duration: number;
  playbackRate: number;
  qualityLevel: string;
  onPlayPause: () => void;
  onMute: () => void;
  onVolumeChange: (value: number[]) => void;
  onSeek: (value: number[]) => void;
  onPlaybackRateChange: () => void;
  onQualityChange: (quality: string) => void;
  onAddBookmark: () => void;
  onAddNote: (content: string) => void;
}

export const VideoPlayerControls = ({
  playing,
  muted,
  volume,
  played,
  duration,
  playbackRate,
  qualityLevel,
  onPlayPause,
  onMute,
  onVolumeChange,
  onSeek,
  onPlaybackRateChange,
  onQualityChange,
  onAddBookmark,
  onAddNote
}: VideoPlayerControlsProps) => {
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteContent, setNoteContent] = useState('');

  const handleNoteSubmit = () => {
    if (noteContent.trim()) {
      onAddNote(noteContent);
      setNoteContent('');
      setShowNoteInput(false);
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
      <Slider
        value={[played]}
        max={100}
        step={0.1}
        onValueChange={onSeek}
        className="mb-4"
      />
      
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onPlayPause}
            className="text-white hover:bg-white/20"
          >
            {playing ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onMute}
            className="text-white hover:bg-white/20"
          >
            {muted ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </Button>

          <div className="hidden sm:block w-24">
            <Slider
              value={[muted ? 0 : volume * 100]}
              max={100}
              step={1}
              onValueChange={(value) => onVolumeChange([value[0] / 100])}
            />
          </div>

          <span className="text-white text-sm">
            {formatTime(played * duration / 100)} / {formatTime(duration)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onAddBookmark}
            className="text-white hover:bg-white/20"
          >
            <Bookmark className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNoteInput(!showNoteInput)}
            className="text-white hover:bg-white/20"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={onPlaybackRateChange}>
                Velocidad: {playbackRate}x
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onQualityChange('auto')}>
                Calidad: {qualityLevel}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {showNoteInput && (
        <div className="absolute bottom-full left-0 right-0 p-4 bg-black/80">
          <div className="flex gap-2">
            <Input
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Escribe una nota..."
              className="flex-1"
            />
            <Button onClick={handleNoteSubmit}>
              Guardar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};