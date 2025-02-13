import { useSession } from "@supabase/auth-helpers-react";
import { Card } from "@/components/ui/card";
import { PurchaseCourseButton } from "./PurchaseCourseButton";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface CoursePurchaseSectionProps {
  courseId: string;
  price: number;
  stripePriceId: string;
  isSubscribed?: boolean;
  timeUntilLaunch?: string;
}

export const CoursePurchaseSection = ({ 
  courseId, 
  price, 
  stripePriceId,
  isSubscribed,
  timeUntilLaunch 
}: CoursePurchaseSectionProps) => {
  const { toast } = useToast();
  const session = useSession();

  if (!session) {
    toast({
      title: "Inicio de sesión requerido",
      description: "Por favor, inicia sesión para acceder al curso.",
      variant: "destructive",
    });
    return null;
  }

  if (isSubscribed) {
    return null;
  }

  const isBeforeLaunchDate = timeUntilLaunch && new Date(timeUntilLaunch) > new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="p-8 bg-gradient-to-br from-gray-800/50 via-purple-900/20 to-gray-800/50 border-purple-500/20">
        <div className="text-center space-y-6">
          <h3 className="text-2xl font-bold text-white">
            ¡Desbloquea todo el contenido del curso!
          </h3>
          <p className="text-gray-300">
            Obtén acceso completo a todas las sesiones y materiales del curso.
          </p>
          <div className="flex justify-center pt-4">
            <PurchaseCourseButton 
              courseId={courseId} 
              stripePriceId={stripePriceId}
              price={price}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:from-purple-700 hover:via-purple-600 hover:to-pink-600"
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};