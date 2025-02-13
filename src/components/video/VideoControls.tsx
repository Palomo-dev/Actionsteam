import React from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useMediaQuery } from '@/hooks/use-mobile';

export interface VideoControlsProps {
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  isFullscreen: boolean;
  onPlayPause: () => void;
  onSkipBackward: () => void;
  onSkipForward: () => void;
  onVolumeChange: (value: number[]) => void;
  onMuteToggle: () => void;
  onPlaybackRateChange: () => void;
  onFullscreenToggle: () => void;
}

export const VideoControls = ({
  isPlaying,
  volume,
  isMuted,
  playbackRate,
  isFullscreen,
  onPlayPause,
  onSkipBackward,
  onSkipForward,
  onVolumeChange,
  onMuteToggle,
  onPlaybackRateChange,
  onFullscreenToggle,
}: VideoControlsProps) => {
  const isMobile = useMediaQuery("(max-width: 640px)");

  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center justify-between gap-2 w-full px-2 sm:px-4">
        <div className="flex items-center gap-1 sm:gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size={isMobile ? "sm" : "icon"}
                onClick={onPlayPause}
                className="text-white hover:text-primary h-8 w-8 sm:h-10 sm:w-10"
              >
                {isPlaying ? 
                  <Pause className="h-4 w-4 sm:h-5 sm:w-5" /> : 
                  <Play className="h-4 w-4 sm:h-5 sm:w-5" />
                }
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isPlaying ? 'Pausar' : 'Reproducir'}</p>
            </TooltipContent>
          </Tooltip>
          
          {!isMobile && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onSkipBackward}
                    className="text-white hover:text-primary h-8 w-8 sm:h-10 sm:w-10"
                  >
                    <SkipBack className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Retroceder 10s</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onSkipForward}
                    className="text-white hover:text-primary h-8 w-8 sm:h-10 sm:w-10"
                  >
                    <SkipForward className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Adelantar 10s</p>
                </TooltipContent>
              </Tooltip>
            </>
          )}

          <div className="hidden sm:flex items-center space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onMuteToggle}
                  className="text-white hover:text-primary h-8 w-8 sm:h-10 sm:w-10"
                >
                  {isMuted ? 
                    <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" /> : 
                    <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  }
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isMuted ? 'Activar sonido' : 'Silenciar'}</p>
              </TooltipContent>
            </Tooltip>
            <Slider
              value={[isMuted ? 0 : volume * 100]}
              max={100}
              step={1}
              onValueChange={(value) => onVolumeChange([value[0] / 100])}
              className="w-20 sm:w-24"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {!isMobile && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onPlaybackRateChange}
                  className="text-white hover:text-primary text-xs sm:text-sm px-2 h-8"
                >
                  {playbackRate}x
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Cambiar velocidad</p>
              </TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size={isMobile ? "sm" : "icon"}
                onClick={onFullscreenToggle}
                className="text-white hover:text-primary h-8 w-8 sm:h-10 sm:w-10"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Maximize2 className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};