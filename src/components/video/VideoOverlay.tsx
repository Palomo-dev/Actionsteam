import React from 'react';
import { cn } from '@/lib/utils';

interface VideoOverlayProps {
  children: React.ReactNode;
  className?: string;
}

export const VideoOverlay = ({ children, className }: VideoOverlayProps) => {
  return (
    <div className={cn(
      "absolute inset-0 flex items-center justify-center",
      "bg-gradient-to-t from-black/80 via-transparent to-transparent",
      className
    )}>
      {children}
    </div>
  );
};