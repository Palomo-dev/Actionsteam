import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, BookOpen, Star, Users, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface CourseHeaderProps {
  course: {
    title: string;
    description: string;
    banner_url?: string;
    thumbnail_url?: string;
    duration?: number;
    launch_date?: string;
    students?: number;
  };
  rating?: number;
  totalRatings?: number;
}

export const CourseHeader = ({ course, rating, totalRatings }: CourseHeaderProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const stripHtml = (html: string) => {
    if (!html) return '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-xl overflow-hidden bg-gradient-to-br from-gray-900/90 via-purple-900/20 to-gray-900/90 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 shadow-xl"
    >
      {course.banner_url && (
        <div className="absolute inset-0">
          <img 
            src={course.banner_url} 
            alt={course.title}
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/90 to-background"></div>
        </div>
      )}
      
      <div className="relative p-8 md:p-12 space-y-8">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 hover:bg-purple-500/20 transition-all duration-300"
          onClick={() => navigate('/app/cursos')}
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Cursos
        </Button>

        <div className="space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 text-transparent bg-clip-text leading-tight"
          >
            {course.title}
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-wrap gap-3"
          >
            {course.duration && (
              <Badge variant="secondary" className="flex items-center gap-1.5 bg-purple-500/20 hover:bg-purple-500/30 transition-colors py-1.5 px-3">
                <Clock className="w-3.5 h-3.5" />
                {course.duration} horas
              </Badge>
            )}
            {course.launch_date && (
              <Badge variant="secondary" className="flex items-center gap-1.5 bg-purple-500/20 hover:bg-purple-500/30 transition-colors py-1.5 px-3">
                <Calendar className="w-3.5 h-3.5" />
                Lanzamiento: {format(new Date(course.launch_date), "PP", { locale: es })}
              </Badge>
            )}
            {course.students && (
              <Badge variant="secondary" className="flex items-center gap-1.5 bg-purple-500/20 hover:bg-purple-500/30 transition-colors py-1.5 px-3">
                <Users className="w-3.5 h-3.5" />
                {course.students} estudiantes
              </Badge>
            )}
            {rating !== undefined && (
              <Badge variant="secondary" className="flex items-center gap-1.5 bg-purple-500/20 hover:bg-purple-500/30 transition-colors py-1.5 px-3">
                <Star className="w-3.5 h-3.5 text-yellow-400" />
                {rating.toFixed(1)} ({totalRatings} opiniones)
              </Badge>
            )}
          </motion.div>

          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="space-y-4"
            >
              <div className="text-gray-300 leading-relaxed">
                {!isOpen ? (
                  <p className="line-clamp-3 text-gray-300/90">
                    {stripHtml(course.description)}
                  </p>
                ) : (
                  <CollapsibleContent>
                    <p className="text-gray-300/90 whitespace-pre-line">
                      {stripHtml(course.description)}
                    </p>
                  </CollapsibleContent>
                )}
              </div>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="flex items-center gap-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/20"
                >
                  {isOpen ? (
                    <>Ver menos <ChevronUp className="h-4 w-4" /></>
                  ) : (
                    <>Ver más <ChevronDown className="h-4 w-4" /></>
                  )}
                </Button>
              </CollapsibleTrigger>
            </motion.div>
          </Collapsible>
        </div>
      </div>
    </motion.div>
  );
};