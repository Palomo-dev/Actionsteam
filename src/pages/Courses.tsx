import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { CourseGrid } from "@/components/courses/CourseGrid";

const Courses = () => {
  const navigate = useNavigate();

  const { data: courses, isLoading, error } = useQuery({
    queryKey: ["public-courses"],
    queryFn: async () => {
      console.log("Iniciando fetching de cursos publicados...");
      try {
        // Consulta simplificada para cursos publicados
        const { data: coursesData, error: coursesError } = await supabase
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
              avatar_url
            )
          `)
          .order('created_at', { ascending: false });

        if (coursesError) {
          console.error("Error fetching courses:", coursesError);
          throw coursesError;
        }

        console.log("Cursos obtenidos:", coursesData);

        if (!coursesData) {
          console.log("No se encontraron cursos");
          return [];
        }

        // Procesar los cursos
        const processedCourses = coursesData.map(course => ({
          ...course,
          averageRating: 5, // Valor por defecto
          totalRatings: 0,
          completedStudents: 0
        }));

        console.log("Cursos procesados:", processedCourses);
        return processedCourses;
      } catch (error) {
        console.error("Error en el procesamiento de cursos:", error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5 // 5 minutos
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    console.error("Error en el componente Courses:", error);
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg">
          Error al cargar los cursos. Por favor, intenta de nuevo más tarde.
        </p>
      </div>
    );
  }

  console.log("Renderizando cursos:", courses);

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
        <CourseGrid courses={courses || []} navigate={navigate} />
      </div>
    </div>
  );
};

export default Courses;