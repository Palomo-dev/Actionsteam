import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { CourseStudentCount } from "../CourseStudentCount";

interface CourseMainInfoProps {
  form: any;
  courseId?: string;
}

export const CourseMainInfo = ({ form, courseId }: CourseMainInfoProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Título del Curso</FormLabel>
              <FormControl>
                <Input placeholder="Introduce el título del curso" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        {courseId && <CourseStudentCount courseId={courseId} />}
      </div>

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descripción</FormLabel>
            <FormControl>
              <RichTextEditor
                value={field.value || ''}
                onChange={field.onChange}
                placeholder="Describe el contenido y objetivos del curso"
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};