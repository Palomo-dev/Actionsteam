import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { CourseInstructorSelect } from "./CourseInstructorSelect";
import { CourseTagsSelect } from "./CourseTagsSelect";
import { useDefaultInstructor } from "@/hooks/useDefaultInstructor";
import { useDefaultCategories } from "@/hooks/useDefaultCategories";
import { useDefaultTags } from "@/hooks/useDefaultTags";
import { CourseMainInfo } from "./course-info/CourseMainInfo";
import { CourseLevelAndCategories } from "./course-info/CourseLevelAndCategories";
import { CoursePriceInfo } from "./course-info/CoursePriceInfo";
import { CourseMediaInfo } from "./course-info/CourseMediaInfo";
import { CourseScheduleInfo } from "./course-info/CourseScheduleInfo";

interface CourseBasicInfoProps {
  form: any;
  totalDuration?: number;
  courseId?: string;
}

export const CourseBasicInfo = ({ form, totalDuration, courseId }: CourseBasicInfoProps) => {
  useDefaultInstructor(form.setValue);
  useDefaultCategories(form.setValue);
  useDefaultTags(form.setValue);

  return (
    <div className="space-y-6">
      <CourseMainInfo form={form} courseId={courseId} />
      <CoursePriceInfo form={form} />
      <CourseLevelAndCategories form={form} />

      <FormField
        control={form.control}
        name="instructorId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Instructor</FormLabel>
            <FormControl>
              <CourseInstructorSelect
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Etiquetas</FormLabel>
            <FormControl>
              <CourseTagsSelect
                value={field.value || []}
                onChange={field.onChange}
              />
            </FormControl>
            <FormDescription>
              Selecciona las etiquetas que mejor describan el contenido del curso
            </FormDescription>
          </FormItem>
        )}
      />

      <CourseMediaInfo form={form} courseId={courseId} />
      <CourseScheduleInfo form={form} />

      <FormField
        control={form.control}
        name="isPublished"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Publicar Curso</FormLabel>
              <FormDescription>
                Hacer visible el curso para los estudiantes
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};