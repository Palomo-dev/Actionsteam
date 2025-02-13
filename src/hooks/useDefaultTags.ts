import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UseFormSetValue } from "react-hook-form";
import { CourseFormData } from "@/types/courses";

export const useDefaultTags = (setValue: UseFormSetValue<CourseFormData>) => {
  return useQuery({
    queryKey: ["default-tags"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course_tags")
        .select("id")
        .in("name", ["React", "JavaScript", "TypeScript"]);
      
      if (error) {
        console.error("Error fetching default tags:", error);
        return [];
      }
      return data || [];
    },
    meta: {
      onSuccess: (data: { id: string }[]) => {
        if (data?.length) {
          setValue("tags", data.map(tag => tag.id), {
            shouldDirty: true,
            shouldTouch: true
          });
        }
      }
    }
  });
};