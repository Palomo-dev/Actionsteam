import React from 'react';
import { Slider } from '@/components/ui/slider';

interface VideoProgressProps {
  progress: number;
  onProgressChange: (value: number[]) => void;
}

export const VideoProgress = ({ progress, onProgressChange }: VideoProgressProps) => {
  return (
    <Slider
      value={[progress]}
      max={100}
      step={0.1}
      onValueChange={onProgressChange}
      className="w-full"
    />
  );
};