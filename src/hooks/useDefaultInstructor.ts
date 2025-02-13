import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UseFormSetValue } from "react-hook-form";
import { CourseFormData } from "@/types/courses";

export const useDefaultInstructor = (setValue: UseFormSetValue<CourseFormData>) => {
  return useQuery({
    queryKey: ["default-instructor"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("instructors")
        .select("id")
        .eq("name", "Juan Camilo Gallego")
        .single();
      
      if (error) throw error;
      return data;
    },
    meta: {
      onSuccess: (data: { id: string }) => {
        if (data?.id) {
          setValue("instructorId", data.id);
        }
      }
    }
  });
};