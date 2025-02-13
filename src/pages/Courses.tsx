import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { CourseGrid } from "@/components/courses/CourseGrid";

const Courses = () => {
  const navigate = useNavigate();

  const { data: courses } = useQuery({
    queryKey: ["public-courses"],
    queryFn: async () => {
      const { data: coursesData } = await supabase
        .from("courses")
        .select(`
          id,
          title,
          description,
          banner_url,
          thumbnail_url,
          induction_video_url,
          level,
          price_cop,
          original_price_cop,
          discount_percentage,
          duration,
          instructor:instructors (
            id,
            name,
            avatar_url,
            bio
          ),
          is_published
        `)
        .eq("is_published", true);

      return coursesData || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.015]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <span className="inline-flex items-center rounded-full bg-red-50 px-6 py-2 text-sm font-medium text-red-700 ring-1 ring-inset ring-red-600/10 mb-6">
              Formación Exclusiva para Asociados Super Patch
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-600 to-red-800 text-transparent bg-clip-text">
              Programa de Desarrollo Profesional
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
              Mejora tus habilidades en liderazgo, finanzas personales, oratoria y persuasión. 
              Diseñado específicamente para potenciar tu éxito como asociado Super Patch.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                Contenido actualizado regularmente
              </span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                Acceso inmediato
              </span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                Mentorías personalizadas
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="container mx-auto px-4 pb-20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Cursos Disponibles</h1>
          <CourseGrid courses={courses || []} navigate={navigate} />
        </div>
      </div>
    </div>
  );
};

export default Courses;