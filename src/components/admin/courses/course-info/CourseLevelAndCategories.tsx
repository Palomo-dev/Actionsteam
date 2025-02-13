import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CourseCategorySelect } from "../CourseCategorySelect";

export const CourseLevelAndCategories = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="level"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nivel del Curso</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value || "beginner"}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el nivel" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="beginner">Principiante</SelectItem>
                <SelectItem value="intermediate">Intermedio</SelectItem>
                <SelectItem value="advanced">Avanzado</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Selecciona el nivel de dificultad del curso
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="categories"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Categorías</FormLabel>
            <FormControl>
              <CourseCategorySelect
                value={field.value || []}
                onChange={field.onChange}
              />
            </FormControl>
            <FormDescription>
              Selecciona las categorías que aplican al curso
            </FormDescription>
          </FormItem>
        )}
      />
    </div>
  );
};