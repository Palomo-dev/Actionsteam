import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CourseFormData } from "@/types/courses";
import { toast } from "sonner";
import { useSessionMutations } from "./useSessionMutations";

export const useCourseMutations = (courseId: string) => {
  const { sessionMutation } = useSessionMutations(courseId);
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (data: CourseFormData) => {
      try {
        console.log("Starting course update for ID:", courseId);
        console.log("isPublished value:", data.isPublished);
        
        const updates: any = {
          title: data.title,
          description: data.description,
          launch_date: data.launchDate?.toISOString(),
          is_published: data.isPublished,
          instructor_id: data.instructorId || null,
          level: data.level || 'beginner',
          price_cop: data.price_cop || 0,
          original_price_cop: data.original_price_cop || 0,
          discount_percentage: data.discount_percentage || 0,
        };

        // Upload banner if provided
        if (data.banner instanceof File) {
          console.log("Uploading new banner");
          const bannerPath = `course-banner/${crypto.randomUUID()}-${data.banner.name}`;
          const { error: uploadError } = await supabase.storage
            .from("course_files")
            .upload(bannerPath, data.banner);

          if (uploadError) throw uploadError;
          
          const { data: { publicUrl } } = supabase.storage
            .from("course_files")
            .getPublicUrl(bannerPath);
            
          updates.banner_url = publicUrl;
        }

        // Upload induction video if provided
        if (data.inductionVideo instanceof File) {
          console.log("Uploading new induction video");
          const videoPath = `course-induction/${crypto.randomUUID()}-${data.inductionVideo.name}`;
          const { error: uploadError } = await supabase.storage
            .from("course_files")
            .upload(videoPath, data.inductionVideo);

          if (uploadError) throw uploadError;
          
          const { data: { publicUrl } } = supabase.storage
            .from("course_files")
            .getPublicUrl(videoPath);
            
          updates.induction_video_url = publicUrl;
        }

        // Update course
        console.log("Updating course with data:", updates);
        const { error: courseError } = await supabase
          .from("courses")
          .update(updates)
          .eq("id", courseId);

        if (courseError) throw courseError;

        // Update categories
        if (data.categories) {
          await supabase
            .from("course_category_relations")
            .delete()
            .eq("course_id", courseId);

          if (data.categories.length > 0) {
            const categoryRelations = data.categories.map(categoryId => ({
              course_id: courseId,
              category_id: categoryId
            }));

            const { error: categoryError } = await supabase
              .from("course_category_relations")
              .insert(categoryRelations);

            if (categoryError) throw categoryError;
          }
        }

        // Update tags
        if (data.tags) {
          await supabase
            .from("course_tag_relations")
            .delete()
            .eq("course_id", courseId);

          if (data.tags.length > 0) {
            const tagRelations = data.tags.map(tagId => ({
              course_id: courseId,
              tag_id: tagId
            }));

            const { error: tagError } = await supabase
              .from("course_tag_relations")
              .insert(tagRelations);

            if (tagError) throw tagError;
          }
        }

        // Update evaluations if they exist
        if (data.evaluations && data.evaluations.length > 0) {
          await supabase
            .from("course_evaluations")
            .delete()
            .eq("course_id", courseId);

          const evaluationsToInsert = data.evaluations.map(evaluation => ({
            course_id: courseId,
            question: evaluation.question,
            options: evaluation.options || [],
            correct_option: evaluation.correctOption ?? 0
          }));

          const { error: evalError } = await supabase
            .from("course_evaluations")
            .insert(evaluationsToInsert);

          if (evalError) throw evalError;
        }

        // Update sessions if they exist
        if (data.sessions) {
          await sessionMutation.mutateAsync(data.sessions);
        }

        // Verify the update was successful
        const { data: updatedCourse, error: verifyError } = await supabase
          .from("courses")
          .select("is_published")
          .eq("id", courseId)
          .single();

        if (verifyError) {
          console.error("Error verifying course update:", verifyError);
          throw verifyError;
        }

        console.log("Course updated successfully. New isPublished state:", updatedCourse.is_published);
        
        // Invalidate and refetch queries to update UI
        await queryClient.invalidateQueries({ queryKey: ['courses'] });
        await queryClient.invalidateQueries({ queryKey: ['course', courseId] });
        
        toast.success("Curso actualizado exitosamente");
        
        return { success: true };
      } catch (error) {
        console.error("Error in updateMutation:", error);
        toast.error("Error al actualizar el curso");
        throw error;
      }
    },
  });

  return {
    updateMutation,
  };
};