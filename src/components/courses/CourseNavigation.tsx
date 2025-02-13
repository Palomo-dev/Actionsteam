import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface CourseNavigationProps {
  currentIndex: number;
  totalSessions: number;
  onPrevious: () => void;
  onNext: () => void;
  currentSession: any;
}

export const CourseNavigation = ({
  currentIndex,
  totalSessions,
  onPrevious,
  onNext,
  currentSession,
}: CourseNavigationProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col space-y-4 animate-fade-in bg-gradient-to-r from-gray-800/50 via-purple-900/10 to-gray-800/50 p-4 sm:p-6 rounded-xl border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 shadow-lg"
    >
      <div className="flex flex-col space-y-2">
        <h3 className="text-lg font-semibold text-purple-400">
          {currentSession?.title}
        </h3>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={currentIndex === 0}
          className="w-full sm:w-auto flex items-center gap-2 hover:bg-purple-500/20 transition-all duration-300"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="text-sm">Anterior</span>
        </Button>

        <div className="flex-1 w-full sm:max-w-md space-y-2">
          <Progress value={(currentIndex + 1) / totalSessions * 100} className="h-2" />
          <p className="text-xs text-center text-gray-400">
            Sesión {currentIndex + 1} de {totalSessions}
          </p>
        </div>

        <Button
          variant="outline"
          onClick={onNext}
          disabled={currentIndex === totalSessions - 1}
          className="w-full sm:w-auto flex items-center gap-2 hover:bg-purple-500/20 transition-all duration-300"
        >
          <span className="text-sm">Siguiente</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </motion.div>
  );
};