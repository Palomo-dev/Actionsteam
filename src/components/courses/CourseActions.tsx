import { Button } from "@/components/ui/button";
import { PurchaseCourseButton } from "./PurchaseCourseButton";
import { Play, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "@/utils/priceUtils";

interface CourseActionsProps {
  courseId: string;
  isSubscribed?: boolean;
  isLocked?: boolean;
  isBeforeLaunchDate?: boolean;
  stripePriceId?: string;
  price?: number;
}

export const CourseActions = ({
  courseId,
  isSubscribed,
  isLocked,
  isBeforeLaunchDate,
  stripePriceId,
  price,
}: CourseActionsProps) => {
  const navigate = useNavigate();

  if (isSubscribed && !isLocked && !isBeforeLaunchDate) {
    return (
      <Button
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/app/cursos/${courseId}`);
        }}
        className="w-full bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:from-purple-700 hover:via-purple-600 hover:to-pink-600 text-white font-medium px-6 py-2 rounded-md transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/25 animate-glow"
      >
        <Play className="w-4 h-4" />
        Empezar Ahora
      </Button>
    );
  }

  if (!isSubscribed) {
    return (
      <PurchaseCourseButton
        courseId={courseId}
        stripePriceId={stripePriceId || ''}
        price={price || 0}
        className="w-full bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:from-purple-700 hover:via-purple-600 hover:to-pink-600"
      />
    );
  }

  return null;
};