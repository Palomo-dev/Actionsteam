import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CourseInstructorSelectProps {
  value?: string;
  onChange: (value: string) => void;
}

export const CourseInstructorSelect = ({ value, onChange }: CourseInstructorSelectProps) => {
  const { data: instructors, isLoading } = useQuery({
    queryKey: ["instructors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("instructors")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Cargando instructores...</div>;

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Seleccionar instructor" />
      </SelectTrigger>
      <SelectContent>
        {instructors?.map((instructor) => (
          <SelectItem key={instructor.id} value={instructor.id}>
            {instructor.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};