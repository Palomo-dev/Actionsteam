import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CourseFormData, CourseSessionType, CourseEvaluationType } from "@/types/courses";
import { toast } from "sonner";
import { useCourseMutations } from "./mutations/useCourseMutations";

export const useEditCourse = (courseId: string) => {
  const [courseData, setCourseData] = useState<CourseFormData | null>(null);
  const [sessions, setSessions] = useState<CourseSessionType[]>([]);
  const [evaluations, setEvaluations] = useState<CourseEvaluationType[]>([]);
  const [loading, setLoading] = useState(true);
  const { updateMutation } = useCourseMutations(courseId);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        console.log("Obteniendo datos del curso con ID:", courseId);
        
        const { data, error } = await supabase
          .from("courses")
          .select(`
            *,
            course_sessions (
              id,
              title,
              description,
              video_url,
              documentation_url,
              order_index,
              duration_seconds
            ),
            course_evaluations (
              id,
              question,
              options,
              correct_option
            ),
            course_tag_relations (
              tag_id,
              course_tags (
                id,
                name
              )
            ),
            course_category_relations (
              category_id,
              course_categories (
                id,
                name
              )
            )
          `)
          .eq("id", courseId)
          .maybeSingle();

        if (error) {
          console.error("Error al obtener datos del curso:", error);
          toast.error("Error al cargar el curso");
          throw error;
        }

        if (!data) {
          console.log("No se encontró el curso");
          toast.error("Curso no encontrado");
          return;
        }

        console.log("Datos del curso obtenidos:", data);
        
        // Map sessions
        const orderedSessions = [...(data.course_sessions || [])].sort(
          (a, b) => (a.order_index || 0) - (b.order_index || 0)
        );

        setSessions(orderedSessions.map(session => ({
          ...session,
          videoFile: null,
          documentationFile: null,
          video_url: session.video_url || null,
          documentation_url: session.documentation_url || null,
          duration_seconds: session.duration_seconds || 0
        })));

        // Map evaluations
        setEvaluations((data.course_evaluations || []).map(evaluation => ({
          id: evaluation.id,
          question: evaluation.question || "",
          options: Array.isArray(evaluation.options) ? evaluation.options : [],
          correctOption: evaluation.correct_option ?? 0
        })));

        // Extract tags and categories IDs
        const tagIds = (data.course_tag_relations || []).map(relation => relation.tag_id);
        const categoryIds = (data.course_category_relations || []).map(relation => relation.category_id);

        // Map course data including tags and categories
        setCourseData({
          ...data,
          banner: null,
          inductionVideo: null,
          tags: tagIds,
          categories: categoryIds,
          launchDate: data.launch_date ? new Date(data.launch_date) : new Date(),
          isPublished: data.is_published || false,
          instructorId: data.instructor_id || "",
          level: data.level || "beginner",
          price_cop: data.price_cop || 0,
          original_price_cop: data.original_price_cop || 0,
          discount_percentage: data.discount_percentage || 0,
        });

        console.log("Sesiones cargadas:", orderedSessions);
        console.log("Evaluaciones cargadas:", data.course_evaluations);
        console.log("Tags cargados:", tagIds);
        console.log("Categorías cargadas:", categoryIds);

      } catch (error) {
        console.error("Error in fetchCourseData:", error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const addEvaluation = () => {
    const newEvaluation = {
      question: "",
      options: [],
      correctOption: 0
    };
    setEvaluations([...evaluations, newEvaluation]);
  };

  const updateEvaluation = (index: number, field: string, value: any) => {
    const updatedEvaluations = [...evaluations];
    updatedEvaluations[index] = {
      ...updatedEvaluations[index],
      [field]: value
    };
    console.log("Actualizando evaluación:", updatedEvaluations[index]);
    setEvaluations(updatedEvaluations);
  };

  const removeEvaluation = (index: number) => {
    const updatedEvaluations = [...evaluations];
    updatedEvaluations.splice(index, 1);
    setEvaluations(updatedEvaluations);
  };

  const defaultSession: CourseSessionType = {
    title: "",
    description: "",
    videoFile: null,
    documentationFile: null,
    duration_seconds: 0
  };

  const addSession = () => {
    setSessions([...sessions, defaultSession]);
  };

  const updateSession = (index: number, field: keyof CourseSessionType, value: any) => {
    const updatedSessions = [...sessions];
    updatedSessions[index] = { ...updatedSessions[index], [field]: value };
    setSessions(updatedSessions);
  };

  const removeSession = (index: number) => {
    const updatedSessions = [...sessions];
    updatedSessions.splice(index, 1);
    setSessions(updatedSessions);
  };

  return {
    courseData,
    loading,
    sessions,
    evaluations,
    updateMutation,
    addSession,
    updateSession,
    removeSession,
    addEvaluation,
    updateEvaluation,
    removeEvaluation,
  };
};