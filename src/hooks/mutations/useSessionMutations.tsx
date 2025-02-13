import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CourseSessionType } from "@/types/courses";

export const useSessionMutations = (courseId: string) => {
  const updateSessions = async (sessions: CourseSessionType[]) => {
    console.log("Starting session update for course:", courseId);

    try {
      // Obtener las sesiones existentes
      const { data: existingSessions } = await supabase
        .from("course_sessions")
        .select("id")
        .eq("course_id", courseId);

      let totalDurationSeconds = 0;

      // Actualizar o crear sesiones
      for (let i = 0; i < sessions.length; i++) {
        const session = sessions[i];
        
        const sessionData: any = {
          course_id: courseId,
          title: session.title,
          description: session.description,
          order_index: i,
          duration_seconds: session.duration_seconds || 0,
        };

        // Sumar la duración al total
        totalDurationSeconds += session.duration_seconds || 0;

        // Manejar la subida del archivo de video
        if (session.videoFile instanceof File) {
          console.log("Uploading video file for session:", session.title);
          const videoPath = `${courseId}/sessions/${i}/video-${Date.now()}.${session.videoFile.name.split('.').pop()}`;
          
          const { error: uploadError } = await supabase.storage
            .from("course_files")
            .upload(videoPath, session.videoFile, { upsert: true });

          if (uploadError) {
            console.error("Error uploading video:", uploadError);
            throw uploadError;
          }

          const { data: { publicUrl: videoUrl } } = supabase.storage
            .from("course_files")
            .getPublicUrl(videoPath);

          sessionData.video_url = videoUrl;
          console.log("Video URL saved:", videoUrl); // Para debugging
        } else if (session.video_url) {
          sessionData.video_url = session.video_url;
          console.log("Keeping existing video URL:", session.video_url); // Para debugging
        }

        // Manejar la subida del archivo de documentación
        if (session.documentationFile instanceof File) {
          console.log("Uploading documentation file for session:", session.title);
          const docPath = `${courseId}/sessions/${i}/doc-${Date.now()}.${session.documentationFile.name.split('.').pop()}`;
          
          const { error: uploadError } = await supabase.storage
            .from("course_files")
            .upload(docPath, session.documentationFile, { upsert: true });

          if (uploadError) {
            console.error("Error uploading documentation:", uploadError);
            throw uploadError;
          }

          const { data: { publicUrl: docUrl } } = supabase.storage
            .from("course_files")
            .getPublicUrl(docPath);

          sessionData.documentation_url = docUrl;
          console.log("Document URL saved:", docUrl); // Para debugging
        } else if (session.documentation_url) {
          sessionData.documentation_url = session.documentation_url;
          console.log("Keeping existing document URL:", session.documentation_url); // Para debugging
        }

        // Si la sesión ya existe, actualizarla
        if (session.id) {
          const { error: updateError } = await supabase
            .from("course_sessions")
            .update(sessionData)
            .eq("id", session.id);

          if (updateError) {
            console.error("Error updating session:", updateError);
            throw updateError;
          }
        } else {
          // Si es una nueva sesión, crearla
          const { error: insertError } = await supabase
            .from("course_sessions")
            .insert(sessionData);

          if (insertError) {
            console.error("Error inserting session:", insertError);
            throw insertError;
          }
        }
      }

      // Eliminar sesiones que ya no existen
      if (existingSessions) {
        const currentSessionIds = sessions.map(s => s.id).filter(Boolean);
        const sessionsToDelete = existingSessions
          .filter(s => !currentSessionIds.includes(s.id))
          .map(s => s.id);

        if (sessionsToDelete.length > 0) {
          // Primero eliminar los comentarios asociados
          const { error: deleteCommentsError } = await supabase
            .from("session_comments")
            .delete()
            .in("session_id", sessionsToDelete);

          if (deleteCommentsError) {
            console.error("Error deleting comments:", deleteCommentsError);
            throw deleteCommentsError;
          }

          // Luego eliminar las sesiones
          const { error: deleteError } = await supabase
            .from("course_sessions")
            .delete()
            .in("id", sessionsToDelete);

          if (deleteError) {
            console.error("Error deleting sessions:", deleteError);
            throw deleteError;
          }
        }
      }

      // Actualizar la duración total del curso
      const totalDurationHours = Math.ceil(totalDurationSeconds / 3600);
      console.log("Updating course duration to:", totalDurationHours, "hours");
      
      const { error: updateError } = await supabase
        .from("courses")
        .update({ duration: totalDurationHours })
        .eq("id", courseId);

      if (updateError) {
        console.error("Error updating course duration:", updateError);
        throw updateError;
      }

      console.log("All sessions updated successfully");
    } catch (error) {
      console.error("Error in updateSessions:", error);
      throw error;
    }
  };

  const sessionMutation = useMutation({
    mutationFn: updateSessions,
  });

  return {
    sessionMutation,
  };
};