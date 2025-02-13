import { useEffect, useState } from "react";

interface CountdownTimerProps {
  launchDate: string;
}

export const CountdownTimer = ({ launchDate }: CountdownTimerProps) => {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const calculateTimeLeft = () => {
    const difference = new Date(launchDate).getTime() - new Date().getTime();
    
    if (difference > 0) {
      setCountdown({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    }
  };

  useEffect(() => {
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [launchDate]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in">
      {Object.entries(countdown).map(([unit, value]) => (
        <div key={unit} className="group hover:scale-105 transition-transform duration-300 p-4 rounded-xl bg-gray-800/30 border border-gray-700/30 hover:border-purple-500/30 hover:bg-gray-800/50">
          <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text mb-2 group-hover:from-purple-400 group-hover:to-pink-400 transition-all">
            {value}
          </div>
          <div className="text-gray-400 group-hover:text-gray-300 transition-colors capitalize">
            {unit}
          </div>
        </div>
      ))}
    </div>
  );
};