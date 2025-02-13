import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { QuestionCard } from "@/components/exam/QuestionCard";
import { useExamState } from "@/hooks/useExamState";
import { CourseRatings } from "@/components/courses/CourseRatings";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const CourseExam = () => {
  const { cursoId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    selectedAnswers,
    isSubmitting,
    showResults,
    examScore,
    handleAnswerSelect,
    handleRetry,
    handleSubmit
  } = useExamState(cursoId);

  const { data: evaluations, isLoading } = useQuery({
    queryKey: ["course-evaluations", cursoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course_evaluations")
        .select("*")
        .eq("course_id", cursoId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const handleSubmitRating = async () => {
    if (!cursoId) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data: existingRating, error: fetchError } = await supabase
        .from("course_ratings")
        .select("id")
        .eq("course_id", cursoId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existingRating) {
        const { error } = await supabase
          .from("course_ratings")
          .update({
            rating,
            comment,
          })
          .eq("id", existingRating.id);

        if (error) throw error;

        toast({
          title: "¡Gracias por actualizar tu opinión!",
          description: "Tu calificación ha sido actualizada exitosamente.",
        });
      } else {
        const { error } = await supabase
          .from("course_ratings")
          .insert({
            course_id: cursoId,
            user_id: user.id,
            rating,
            comment,
          });

        if (error) throw error;

        toast({
          title: "¡Gracias por tu opinión!",
          description: "Tu calificación ha sido registrada exitosamente.",
        });
      }

      setShowRating(false);
      navigate(`/app/certificados`);
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar tu calificación. Por favor intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handleExamSubmit = async () => {
    await handleSubmit(evaluations || []);
    if (examScore >= 90) {
      setShowRating(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!evaluations?.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-500">
          No hay preguntas disponibles para este examen.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Examen del Curso</h1>
      <div className="space-y-6">
        {evaluations.map((evaluation, index) => (
          <QuestionCard
            key={evaluation.id}
            evaluation={evaluation}
            index={index}
            selectedAnswers={selectedAnswers}
            handleAnswerSelect={handleAnswerSelect}
            showResults={showResults}
          />
        ))}
      </div>

      <div className="mt-8 flex justify-center gap-4">
        {showResults ? (
          <div className="flex flex-col items-center gap-4">
            <p className="text-xl font-semibold">
              Tu puntuación: {examScore}%
            </p>
            {examScore < 90 && (
              <Button
                size="lg"
                onClick={handleRetry}
              >
                Intentar de nuevo
              </Button>
            )}
          </div>
        ) : (
          <Button
            size="lg"
            onClick={handleExamSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enviar Examen
          </Button>
        )}
      </div>

      <CourseRatings
        showRating={showRating}
        setShowRating={setShowRating}
        rating={rating}
        setRating={setRating}
        comment={comment}
        setComment={setComment}
        onSubmitRating={handleSubmitRating}
        autoShow={examScore >= 90}
      />
    </div>
  );
};

export default CourseExam;