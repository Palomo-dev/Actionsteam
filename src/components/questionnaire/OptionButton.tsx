import { cn } from "@/lib/utils";
import React from "react";

interface OptionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  label: string;
  selected?: boolean;
}

export const OptionButton = ({ icon, label, selected, className, ...props }: OptionButtonProps) => {
  return (
    <button
      className={cn(
        "w-full flex items-center gap-4 p-4 rounded-lg transition-all duration-300",
        "border border-gray-700 hover:border-purple-500/50 hover:bg-purple-500/10",
        selected && "border-purple-500 bg-purple-500/20",
        className
      )}
      {...props}
    >
      {icon && (
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
          {icon}
        </div>
      )}
      <span className="text-left font-medium">{label}</span>
    </button>
  );
};