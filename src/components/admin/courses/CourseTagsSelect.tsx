import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CourseTagsSelectProps {
  value?: string[];
  onChange: (value: string[]) => void;
}

interface Tag {
  id: string;
  name: string;
}

export const CourseTagsSelect = ({ value = [], onChange }: CourseTagsSelectProps) => {
  const { data: tags = [] } = useQuery({
    queryKey: ["course-tags"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course_tags")
        .select("*")
        .order("name");
      
      if (error) {
        console.error("Error fetching tags:", error);
        return [];
      }
      
      return data as Tag[] || [];
    },
  });

  const handleSelect = (tagId: string) => {
    const newValue = value.includes(tagId)
      ? value.filter(id => id !== tagId)
      : [...value, tagId];
    onChange(newValue);
  };

  const availableTags = tags.filter(tag => !value.includes(tag.id));

  return (
    <div className="space-y-2">
      <Select
        onValueChange={handleSelect}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Seleccionar etiqueta" />
        </SelectTrigger>
        <SelectContent>
          {availableTags.map((tag) => (
            <SelectItem key={tag.id} value={tag.id}>
              {tag.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex flex-wrap gap-2">
        {tags
          .filter(tag => value.includes(tag.id))
          .map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => handleSelect(tag.id)}
            >
              {tag.name} ×
            </Badge>
          ))}
      </div>
    </div>
  );
};