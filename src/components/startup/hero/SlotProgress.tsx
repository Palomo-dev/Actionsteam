import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Gauge, Users, Clock } from "lucide-react";
import { motion } from "framer-motion";

export const SlotProgress = () => {
  const [progress, setProgress] = useState(0);

  const { data: slotData } = useQuery({
    queryKey: ['course-slots'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_slots')
        .select('*')
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (slotData) {
      const { total_slots, occupied_slots, start_date, end_date } = slotData;
      
      // Calculate base progress from occupied slots
      const baseProgress = (occupied_slots / total_slots) * 100;
      
      // Calculate additional progress based on time passed
      const now = new Date();
      const start = new Date(start_date);
      const end = new Date(end_date);
      const totalDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
      const daysPassed = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
      const timeProgress = Math.min(daysPassed / totalDays, 1);
      
      // Calculate total progress considering slots and time
      const remainingSlots = total_slots - occupied_slots;
      const additionalProgress = (remainingSlots / total_slots) * timeProgress * 100;
      
      setProgress(Math.min(baseProgress + additionalProgress, 100));
    }
  }, [slotData]);

  if (!slotData) return null;

  const availableSlots = Math.max(0, slotData.total_slots - Math.ceil(slotData.total_slots * (progress / 100)));
  const daysLeft = Math.ceil((new Date(slotData.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="w-full max-w-md mx-auto space-y-6 animate-fade-in bg-gray-800/30 p-6 rounded-xl border border-gray-700/30">
      <div className="flex items-center justify-between mb-4">
        <motion.div 
          className="flex items-center space-x-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Gauge className="w-5 h-5 text-purple-400" />
          <span className="text-gray-300">Progreso de inscripciones</span>
        </motion.div>
        <motion.div 
          className="text-purple-400 font-semibold"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {Math.round(progress)}%
        </motion.div>
      </div>

      <Progress 
        value={progress} 
        className="h-2.5 bg-gray-700/50"
      >
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
          style={{ width: `${progress}%` }}
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </Progress>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <motion.div 
          className="flex items-center space-x-2 bg-gray-700/20 p-3 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Users className="w-5 h-5 text-purple-400" />
          <div>
            <div className="text-sm text-gray-400">Cupos disponibles</div>
            <div className="text-lg font-semibold text-purple-300">{availableSlots}</div>
          </div>
        </motion.div>

        <motion.div 
          className="flex items-center space-x-2 bg-gray-700/20 p-3 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Clock className="w-5 h-5 text-purple-400" />
          <div>
            <div className="text-sm text-gray-400">Días restantes</div>
            <div className="text-lg font-semibold text-purple-300">{daysLeft}</div>
          </div>
        </motion.div>
      </div>

      <motion.p 
        className="text-sm text-center text-purple-300/80 mt-4 font-medium"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        ¡No pierdas la oportunidad! Solo quedan {availableSlots} cupos disponibles
      </motion.p>
    </div>
  );
};