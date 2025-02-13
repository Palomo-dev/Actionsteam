import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { EnhancedVideoPlayer } from "@/components/video/EnhancedVideoPlayer";

interface CourseInductionVideoProps {
  inductionVideoUrl: string | null;
  isSubscribed?: boolean;
  isBeforeLaunchDate?: boolean;
}

export const CourseInductionVideo = ({ 
  inductionVideoUrl,
  isSubscribed,
  isBeforeLaunchDate
}: CourseInductionVideoProps) => {
  if (!inductionVideoUrl) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
        Video de Introducción
      </h2>
      <Card className="overflow-hidden bg-gradient-to-br from-gray-800/50 via-purple-900/20 to-gray-800/50 border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 shadow-xl">
        <div className="relative w-full pt-[56.25%]">
          <div className="absolute inset-0">
            <EnhancedVideoPlayer
              videoUrl={inductionVideoUrl}
              autoPlay={false}
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};