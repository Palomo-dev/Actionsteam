import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CourseCategorySelectProps {
  value?: string[];
  onChange: (value: string[]) => void;
}

interface Category {
  id: string;
  name: string;
}

export const CourseCategorySelect = ({ value = [], onChange }: CourseCategorySelectProps) => {
  const { data: categories = [] } = useQuery({
    queryKey: ["course-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course_categories")
        .select("*")
        .order("name");
      
      if (error) {
        console.error("Error fetching categories:", error);
        return [];
      }
      
      return data as Category[] || [];
    },
  });

  const handleSelect = (categoryId: string) => {
    const newValue = value.includes(categoryId)
      ? value.filter(id => id !== categoryId)
      : [...value, categoryId];
    onChange(newValue);
  };

  const availableCategories = categories.filter(category => !value.includes(category.id));

  return (
    <div className="space-y-2">
      <Select
        onValueChange={handleSelect}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Seleccionar categoría" />
        </SelectTrigger>
        <SelectContent>
          {availableCategories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex flex-wrap gap-2">
        {categories
          .filter(category => value.includes(category.id))
          .map((category) => (
            <Badge
              key={category.id}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => handleSelect(category.id)}
            >
              {category.name} ×
            </Badge>
          ))}
      </div>
    </div>
  );
};