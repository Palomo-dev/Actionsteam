import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const handleDeleteCourse = async (courseId: string) => {
  try {
    console.log("Starting course deletion process for ID:", courseId);

    // First delete certificates
    const { error: certificatesError } = await supabase
      .from("certificates")
      .delete()
      .eq("course_id", courseId);

    if (certificatesError) {
      console.error("Error deleting certificates:", certificatesError);
      toast.error("Error al eliminar los certificados");
      return;
    }

    // Then delete study sessions
    const { error: studySessionsError } = await supabase
      .from("study_sessions")
      .delete()
      .eq("course_id", courseId);

    if (studySessionsError) {
      console.error("Error deleting study sessions:", studySessionsError);
      toast.error("Error al eliminar las sesiones de estudio");
      return;
    }

    // Then delete user courses
    const { error: userCoursesError } = await supabase
      .from("user_courses")
      .delete()
      .eq("course_id", courseId);

    if (userCoursesError) {
      console.error("Error deleting user courses:", userCoursesError);
      toast.error("Error al eliminar los registros de usuarios del curso");
      return;
    }

    // Delete course sessions
    const { error: sessionsError } = await supabase
      .from("course_sessions")
      .delete()
      .eq("course_id", courseId);

    if (sessionsError) {
      console.error("Error deleting course sessions:", sessionsError);
      toast.error("Error al eliminar las sesiones del curso");
      return;
    }

    // Delete course evaluations
    const { error: evaluationsError } = await supabase
      .from("course_evaluations")
      .delete()
      .eq("course_id", courseId);

    if (evaluationsError) {
      console.error("Error deleting course evaluations:", evaluationsError);
      toast.error("Error al eliminar las evaluaciones del curso");
      return;
    }

    // Delete course ratings
    const { error: ratingsError } = await supabase
      .from("course_ratings")
      .delete()
      .eq("course_id", courseId);

    if (ratingsError) {
      console.error("Error deleting course ratings:", ratingsError);
      toast.error("Error al eliminar las calificaciones del curso");
      return;
    }

    // Delete course category relations
    const { error: categoryRelationsError } = await supabase
      .from("course_category_relations")
      .delete()
      .eq("course_id", courseId);

    if (categoryRelationsError) {
      console.error("Error deleting category relations:", categoryRelationsError);
      toast.error("Error al eliminar las relaciones de categorías");
      return;
    }

    // Delete course tag relations
    const { error: tagRelationsError } = await supabase
      .from("course_tag_relations")
      .delete()
      .eq("course_id", courseId);

    if (tagRelationsError) {
      console.error("Error deleting tag relations:", tagRelationsError);
      toast.error("Error al eliminar las relaciones de etiquetas");
      return;
    }

    // Finally delete the course itself
    const { error: courseError } = await supabase
      .from("courses")
      .delete()
      .eq("id", courseId);

    if (courseError) {
      console.error("Error deleting course:", courseError);
      toast.error("Error al eliminar el curso");
      return;
    }

    toast.success("Curso eliminado exitosamente");
    console.log("Course deletion completed successfully");

  } catch (error) {
    console.error("Error in deletion process:", error);
    toast.error("Error al eliminar el curso");
  }
};