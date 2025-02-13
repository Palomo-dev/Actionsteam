import React from 'react';
import { cn } from '@/lib/utils';

interface VideoContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const VideoContainer = React.forwardRef<HTMLDivElement, VideoContainerProps>(
  ({ children, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full aspect-video bg-black/90 rounded-lg sm:rounded-xl overflow-hidden shadow-2xl",
          "transition-all duration-300 ease-in-out touch-none",
          "hover:shadow-purple-500/20 hover:shadow-2xl",
          className
        )}
      >
        {children}
      </div>
    );
  }
);

VideoContainer.displayName = 'VideoContainer';