import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Video, Image } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const CourseMediaInfo = ({ form, courseId }) => {
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  useEffect(() => {
    // Initialize previews from existing URLs
    const bannerUrl = form.getValues("banner_url");
    const videoUrl = form.getValues("induction_video_url");
    
    if (bannerUrl) setBannerPreview(bannerUrl);
    if (videoUrl) setVideoPreview(videoUrl);
  }, [form]);

  const handleFileChange = async (field: any, file: File | null, type: 'banner' | 'video') => {
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}-${courseId || crypto.randomUUID()}.${fileExt}`;
      const filePath = `course-${type}s/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('course_files')
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) {
        console.error(`Error uploading ${type}:`, uploadError);
        toast.error(`Error al subir el ${type === 'banner' ? 'banner' : 'video'}`);
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('course_files')
        .getPublicUrl(filePath);

      // Update form field and preview
      if (type === 'banner') {
        form.setValue('banner_url', publicUrl);
        setBannerPreview(publicUrl);
      } else {
        form.setValue('induction_video_url', publicUrl);
        setVideoPreview(publicUrl);
      }

      field.onChange(file);
      toast.success(`${type === 'banner' ? 'Banner' : 'Video'} subido exitosamente`);
    } catch (error) {
      console.error(`Error handling ${type} upload:`, error);
      toast.error(`Error al procesar el ${type === 'banner' ? 'banner' : 'video'}`);
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
                    onChange={(e) => handleFileChange(field, e.target.files?.[0] || null, 'banner')}
                    className="pl-10"
                  />
                </div>
                {bannerPreview && (
                  <Card className="overflow-hidden">
                    <div className="relative w-full aspect-[16/4]">
                      <img
                        src={bannerPreview}
                        alt="Banner preview"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
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
                    onChange={(e) => handleFileChange(field, e.target.files?.[0] || null, 'video')}
                    className="pl-10"
                  />
                </div>
                {videoPreview && (
                  <Card className="overflow-hidden">
                    <div className="relative w-full aspect-video">
                      <video
                        src={videoPreview}
                        controls
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
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