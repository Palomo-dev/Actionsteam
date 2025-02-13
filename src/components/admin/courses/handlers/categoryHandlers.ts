import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const handleDeleteCategory = async (categoryId: string) => {
  try {
    // First delete category relations
    const { error: relationsError } = await supabase
      .from("course_category_relations")
      .delete()
      .eq("category_id", categoryId);

    if (relationsError) {
      console.error("Error deleting category relations:", relationsError);
      toast.error("Error al eliminar las relaciones de la categoría");
      return;
    }

    const { error } = await supabase
      .from("course_categories")
      .delete()
      .eq("id", categoryId);

    if (error) throw error;
    toast.success("Categoría eliminada exitosamente");
  } catch (error) {
    console.error("Error deleting category:", error);
    toast.error("Error al eliminar la categoría");
  }
};