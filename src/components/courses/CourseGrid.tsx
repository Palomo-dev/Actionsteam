import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Star } from "lucide-react";
import { CourseDescription } from "./CourseDescription";

interface CourseGridProps {
  courses: any[];
  navigate: (path: string) => void;
}

export const CourseGrid = ({ courses, navigate }: CourseGridProps) => {
  console.log("CourseGrid recibió:", courses);

  const getLevelInSpanish = (level: string) => {
    const levels = {
      'beginner': 'Principiante',
      'intermediate': 'Intermedio',
      'advanced': 'Avanzado'
    };
    return levels[level as keyof typeof levels] || level;
  };

  if (!Array.isArray(courses)) {
    console.error("courses no es un array:", courses);
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">
          Error al cargar los cursos. Por favor, intenta de nuevo.
        </p>
      </div>
    );
  }

  if (courses.length === 0) {
    console.log("No hay cursos para mostrar");
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">
          No hay cursos disponibles en este momento.
        </p>
      </div>
    );
  }

  console.log("Renderizando", courses.length, "cursos");

  return (
    <div className={`grid grid-cols-1 gap-6 ${
      courses.length === 1 ? 'md:grid-cols-1 max-w-2xl mx-auto' :
      courses.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' :
      'md:grid-cols-2 lg:grid-cols-3'
    }`}>
      {courses.map((course) => (
        <motion.div
          key={course.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
          className="h-full"
        >
          <Card className="group overflow-hidden bg-white border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 h-full">
            <div className="relative h-48 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10" />
              <img
                src={course.banner_url || course.thumbnail_url || "/placeholder.svg"}
                alt={course.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.src = '/placeholder.svg';
                }}
              />
              {course.level && (
                <div className="absolute bottom-4 left-4 z-20">
                  <Badge variant="secondary" className="bg-red-50 text-red-600">
                    {getLevelInSpanish(course.level)}
                  </Badge>
                </div>
              )}
            </div>

            <CardHeader>
              <CardTitle className="text-xl mb-2 text-gray-800 group-hover:text-red-600 transition-colors">
                {course.title}
              </CardTitle>
              <CourseDescription description={course.description} />
            </CardHeader>

            <CardContent className="space-y-4">
              {course.instructor && (
                <div className="flex items-center space-x-2">
                  <img
                    src="/lovable-uploads/85a7c6f7-dff8-46fc-96b4-f82b2cbef6d7.png"
                    alt={course.instructor.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-sm text-gray-600">
                    Instructor: {course.instructor.name}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Clock size={16} className="mr-1 text-red-600" />
                    {course.duration || 0} horas
                  </div>
                  <div className="flex items-center">
                    <Users size={16} className="mr-1 text-red-600" />
                    {course.completedStudents} estudiantes
                  </div>
                </div>
                <div className="flex items-center">
                  <Star size={16} className="mr-1 text-yellow-500" />
                  <span className="text-gray-600">
                    {course.averageRating?.toFixed(1)} ({course.totalRatings})
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button 
                className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white group-hover:scale-105 transition-all duration-300"
                onClick={() => navigate('/login')}
              >
                Ver Curso
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};