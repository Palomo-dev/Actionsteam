import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UseFormSetValue } from "react-hook-form";
import { CourseFormData } from "@/types/courses";

export const useDefaultCategories = (setValue: UseFormSetValue<CourseFormData>) => {
  return useQuery({
    queryKey: ["default-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course_categories")
        .select("id")
        .in("name", ["Desarrollo Web", "Frontend"]);
      
      if (error) {
        console.error("Error fetching default categories:", error);
        return [];
      }

      if (data && data.length > 0) {
        setValue("categories", data.map(cat => cat.id), {
          shouldDirty: true,
          shouldTouch: true
        });
      }
      
      return data || [];
    },
    meta: {
      onError: (error: any) => {
        console.error("Error in useDefaultCategories:", error);
      }
    }
  });
};