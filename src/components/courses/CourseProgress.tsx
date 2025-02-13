import { ExamButton } from "@/components/courses/ExamButton";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

interface CourseProgressProps {
  courseId: string;
  progress: number;
  showExamButton?: boolean;
}

export const CourseProgress = ({ courseId, progress, showExamButton }: CourseProgressProps) => {
  return (
    <Card className="bg-gradient-to-r from-gray-900/90 via-purple-900/20 to-gray-900/90 border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 shadow-xl">
      <CardContent className="p-6 md:p-8 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-base text-gray-300">Progreso del curso</span>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2"
            >
              {progress >= 100 && (
                <Trophy className="w-6 h-6 text-yellow-400 animate-pulse" />
              )}
              <span className="text-lg font-medium bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                {progress}%
              </span>
            </motion.div>
          </div>
          <Progress 
            value={progress} 
            className="h-3 bg-gray-800/50" 
          />
        </div>
        
        {showExamButton && progress >= 90 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ExamButton courseId={courseId} />
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};