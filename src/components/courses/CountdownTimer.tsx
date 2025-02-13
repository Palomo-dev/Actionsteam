import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  targetDate: string;
  className?: string;
}

export const CountdownTimer = ({ targetDate, className }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className={cn("grid grid-cols-4 gap-4", className)}>
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div
          key={unit}
          className="flex flex-col items-center bg-purple-900/30 rounded-xl p-4 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
        >
          <span className="text-2xl font-bold text-purple-200">
            {value.toString().padStart(2, '0')}
          </span>
          <span className="text-sm text-purple-300/70 capitalize mt-1">
            {unit}
          </span>
        </div>
      ))}
    </div>
  );
};