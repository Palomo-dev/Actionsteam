import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const handleDeleteInstructor = async (instructorId: string) => {
  try {
    // First check if instructor has any courses
    const { data: courses, error: checkError } = await supabase
      .from("courses")
      .select("id")
      .eq("instructor_id", instructorId);

    if (checkError) {
      console.error("Error checking instructor courses:", checkError);
      toast.error("Error al verificar los cursos del instructor");
      return;
    }

    if (courses && courses.length > 0) {
      toast.error("No se puede eliminar el instructor porque tiene cursos asociados");
      return;
    }

    const { error } = await supabase
      .from("instructors")
      .delete()
      .eq("id", instructorId);

    if (error) throw error;
    toast.success("Instructor eliminado exitosamente");
  } catch (error) {
    console.error("Error deleting instructor:", error);
    toast.error("Error al eliminar el instructor");
  }
};