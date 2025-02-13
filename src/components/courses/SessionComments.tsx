import { useState, useEffect } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

interface SessionCommentsProps {
  sessionId: string;
}

export const SessionComments = ({ sessionId }: SessionCommentsProps) => {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const { session } = useSessionContext();
  const { toast } = useToast();

  useEffect(() => {
    loadComments();
    subscribeToComments();
  }, [sessionId]);

  const loadComments = async () => {
    const { data, error } = await supabase
      .from("session_comments")
      .select(`
        *,
        profiles!fk_session_comments_user (
          first_name,
          email,
          instructor_image
        )
      `)
      .eq("session_id", sessionId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading comments:", error);
      return;
    }

    setComments(data || []);
  };

  const subscribeToComments = () => {
    const channel = supabase
      .channel("session-comments")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "session_comments",
          filter: `session_id=eq.${sessionId}`,
        },
        () => {
          loadComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleSubmitComment = async () => {
    if (!session?.user || !newComment.trim()) return;

    const { error } = await supabase.from("session_comments").insert({
      session_id: sessionId,
      user_id: session.user.id,
      comment: newComment.trim(),
    });

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo publicar el comentario",
        variant: "destructive",
      });
      return;
    }

    setNewComment("");
    toast({
      title: "Comentario publicado",
      description: "Tu comentario ha sido publicado exitosamente",
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4">
      {session?.user && (
        <div className="space-y-2 sm:space-y-3">
          <Textarea
            placeholder="Escribe tu comentario..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px] bg-gray-800/30"
          />
          <Button 
            onClick={handleSubmitComment}
            disabled={!newComment.trim()}
            className="w-full sm:w-auto"
          >
            Publicar comentario
          </Button>
        </div>
      )}

      <div className="space-y-3 sm:space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-gray-800/30 border border-gray-700/50"
          >
            <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
              <AvatarImage src={comment.profiles?.instructor_image} />
              <AvatarFallback>
                {comment.profiles?.first_name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                <p className="font-medium text-sm sm:text-base text-gray-200">
                  {comment.profiles?.first_name || "Usuario"}
                </p>
                <span className="text-xs sm:text-sm text-gray-400">
                  {format(new Date(comment.created_at), "PPp", {
                    locale: es,
                  })}
                </span>
              </div>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-300 break-words">
                {comment.comment}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};