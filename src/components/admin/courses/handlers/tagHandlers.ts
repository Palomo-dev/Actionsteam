import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const handleDeleteTag = async (tagId: string) => {
  try {
    // First delete tag relations
    const { error: relationsError } = await supabase
      .from("course_tag_relations")
      .delete()
      .eq("tag_id", tagId);

    if (relationsError) {
      console.error("Error deleting tag relations:", relationsError);
      toast.error("Error al eliminar las relaciones de la etiqueta");
      return;
    }

    const { error } = await supabase
      .from("course_tags")
      .delete()
      .eq("id", tagId);

    if (error) throw error;
    toast.success("Etiqueta eliminada exitosamente");
  } catch (error) {
    console.error("Error deleting tag:", error);
    toast.error("Error al eliminar la etiqueta");
  }
};