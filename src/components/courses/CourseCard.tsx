import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";
import { CountdownTimer } from "./CountdownTimer";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CourseStats } from "./CourseStats";
import { CourseActions } from "./CourseActions";

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description?: string;
    thumbnail_url?: string;
    banner_url?: string;
    rating?: number;
    totalRatings?: number;
    studentsCount?: number;
    duration?: number;
    isLocked?: boolean;
    timeUntilLaunch?: string;
    price_cop?: number;
    stripe_price_id?: string;
  };
  isCompleted?: boolean;
  isSubscribed?: boolean;
  onClick: () => void;
}

export const CourseCard = ({ course, isCompleted, isSubscribed, onClick }: CourseCardProps) => {
  const isBeforeLaunchDate = course.timeUntilLaunch && new Date(course.timeUntilLaunch) > new Date();

  // Function to safely remove HTML tags and decode entities
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card 
        className={cn(
          "relative overflow-hidden cursor-pointer h-full",
          "bg-gradient-to-br from-gray-900/90 via-purple-900/20 to-gray-900/90",
          "border-purple-500/30 hover:border-purple-500/50 transition-all duration-300",
          isCompleted && "border-green-500/50"
        )}
        onClick={onClick}
      >
        <div className="relative aspect-video">
          {(course.banner_url || course.thumbnail_url) ? (
            <div className="w-full h-full">
              <img
                src={course.banner_url || course.thumbnail_url}
                alt={course.title}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.src = '/placeholder.svg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-900/20 to-gray-900/90 flex items-center justify-center">
              <span className="text-gray-400">Sin imagen</span>
            </div>
          )}
          
          {/* Solo mostrar el overlay de bloqueo si el curso está bloqueado, el usuario no está suscrito Y no es antes de la fecha de lanzamiento */}
          {course.isLocked && !isSubscribed && !isBeforeLaunchDate && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center flex-col gap-4 p-4">
              <Lock className="w-8 h-8 text-purple-400/80 animate-pulse" />
              <p className="text-purple-200/90 text-center px-4 text-sm sm:text-base">
                Curso bloqueado
              </p>
            </div>
          )}

          {/* Mostrar el contador solo si es antes de la fecha de lanzamiento, independientemente de la suscripción */}
          {isBeforeLaunchDate && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center flex-col gap-4 p-4">
              <Lock className="w-8 h-8 text-purple-400/80 animate-pulse" />
              <p className="text-purple-200/90 text-center px-4 text-sm sm:text-base">
                Disponible en:
              </p>
              <CountdownTimer 
                targetDate={course.timeUntilLaunch} 
                className="scale-90 sm:scale-100" 
              />
            </div>
          )}
          
          {isCompleted && (
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                Completado
              </Badge>
            </div>
          )}
          
          {isSubscribed && !isCompleted && !isBeforeLaunchDate && (
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                Disponible
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4 sm:p-6 space-y-4">
          <h3 className="font-semibold text-base sm:text-lg text-purple-100/90 line-clamp-2">
            {course.title}
          </h3>
          <div 
            className="text-xs sm:text-sm text-gray-400/90 line-clamp-2 prose prose-invert max-w-none prose-sm"
            dangerouslySetInnerHTML={{ __html: course.description || '' }}
          />

          <CourseStats
            rating={course.rating}
            totalRatings={course.totalRatings}
            studentsCount={course.studentsCount}
            duration={course.duration}
          />

          <CourseActions
            courseId={course.id}
            isSubscribed={isSubscribed}
            isLocked={!isSubscribed && course.isLocked}
            isBeforeLaunchDate={isBeforeLaunchDate}
            stripePriceId={course.stripe_price_id}
            price={course.price_cop}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};