import { cn } from "@/lib/utils";
import React from "react";

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export const ProgressBar = ({ current, total, className }: ProgressBarProps) => {
  const progress = (current / total) * 100;

  return (
    <div className={cn("w-full max-w-2xl mx-auto mb-8", className)}>
      <div className="flex justify-between text-sm text-gray-400 mb-2">
        <span>Paso {current} de {total}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};