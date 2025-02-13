import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Video, Image } from "lucide-react";

export const CourseMediaInfo = ({ form }) => {
  const handleFileChange = (field: any, file: File | null) => {
    if (file) {
      field.onChange(file);
    }
  };

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="banner"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Banner del Curso</FormLabel>
            <FormControl>
              <div className="space-y-4">
                <div className="relative">
                  <Image className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleFileChange(field, e.target.files?.[0] || null)}
                    className="pl-10"
                  />
                </div>
                {(field.value || form.getValues().banner_url) && (
                  <Card className="overflow-hidden">
                    <img
                      src={field.value ? URL.createObjectURL(field.value) : form.getValues().banner_url}
                      alt="Banner preview"
                      className="w-full h-48 object-cover"
                    />
                  </Card>
                )}
              </div>
            </FormControl>
            <FormDescription>
              Imagen de banner para el curso. Recomendado: 1920x400px
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="inductionVideo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Video de Inducción</FormLabel>
            <FormControl>
              <div className="space-y-4">
                <div className="relative">
                  <Video className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="file" 
                    accept="video/*" 
                    onChange={(e) => handleFileChange(field, e.target.files?.[0] || null)}
                    className="pl-10"
                  />
                </div>
                {(field.value || form.getValues().induction_video_url) && (
                  <Card className="overflow-hidden">
                    <video
                      src={field.value ? URL.createObjectURL(field.value) : form.getValues().induction_video_url}
                      controls
                      className="w-full"
                    />
                  </Card>
                )}
              </div>
            </FormControl>
            <FormDescription>
              Video introductorio del curso
            </FormDescription>
          </FormItem>
        )}
      />
    </div>
  );
};