import { Clock, Star, Users } from "lucide-react";

interface CourseStatsProps {
  rating?: number;
  totalRatings?: number;
  studentsCount?: number;
  duration?: number;
}

export const CourseStats = ({ 
  rating, 
  totalRatings, 
  studentsCount, 
  duration 
}: CourseStatsProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between text-xs sm:text-sm text-gray-400/80 gap-2">
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        {rating !== undefined && (
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400/90" />
            <span>
              {rating.toFixed(1)} ({totalRatings})
            </span>
          </div>
        )}
        {studentsCount !== undefined && (
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{studentsCount}</span>
          </div>
        )}
      </div>
      {duration && (
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>{Math.ceil(duration / 3600)}h</span>
        </div>
      )}
    </div>
  );
};