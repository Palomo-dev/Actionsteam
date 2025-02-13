import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useExamState = (cursoId: string | undefined) => {
  const navigate = useNavigate();
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: number }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [examScore, setExamScore] = useState(0);
  const [showRating, setShowRating] = useState(false);

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    if (!showResults) {
      setSelectedAnswers(prev => ({
        ...prev,
        [questionId]: optionIndex
      }));
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setExamScore(0);
    setIsSubmitting(false);
  };

  const handleSubmit = async (evaluations: any[]) => {
    if (!evaluations || !cursoId) return;

    if (Object.keys(selectedAnswers).length !== evaluations.length) {
      toast({
        title: "Error",
        description: "Por favor responde todas las preguntas antes de enviar",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      let correctAnswers = 0;
      const totalQuestions = evaluations.length;

      evaluations.forEach(evaluation => {
        const userAnswer = selectedAnswers[evaluation.id];
        const correctAnswer = evaluation.correct_option;
        
        if (userAnswer === correctAnswer) {
          correctAnswers++;
        }
      });

      const score = Math.round((correctAnswers / totalQuestions) * 100);
      setExamScore(score);
      setShowResults(true);

      // Verificar si ya existe un certificado para este usuario y curso
      const { data: existingCert } = await supabase
        .from("certificates")
        .select("id")
        .eq("user_id", user.id)
        .eq("course_id", cursoId)
        .single();

      if (!existingCert && score >= 90) {
        try {
          // Crear certificado solo si no existe y el score es suficiente
          const { error: certError } = await supabase
            .from("certificates")
            .insert({
              course_id: cursoId,
              user_id: user.id,
              score,
            });

          if (certError) throw certError;

          // Actualizar estado del curso
          const { error: updateError } = await supabase
            .from("user_courses")
            .update({ status: "completed" })
            .eq("course_id", cursoId)
            .eq("user_id", user.id);

          if (updateError) throw updateError;

          toast({
            title: "¡Felicitaciones!",
            description: `Has aprobado el examen con ${score}%. Serás redirigido a tu certificado.`
          });

          setShowRating(true);

          setTimeout(() => {
            navigate(`/app/certificados`);
          }, 2000);
        } catch (certError: any) {
          console.error("Error al manejar el certificado:", certError);
          toast({
            title: "¡Felicitaciones!",
            description: `Has aprobado el examen con ${score}%.`
          });
        }
      } else {
        let message = "Necesitas mejorar. ";
        if (score < 60) {
          message += "Tu desempeño fue bajo.";
        } else if (score < 75) {
          message += "Tu desempeño fue regular.";
        } else if (score < 90) {
          message += "¡Estuviste cerca! Necesitas 90% o más para obtener el certificado.";
        }

        toast({
          title: `Resultado del examen: ${score}%`,
          description: message
        });
      }
    } catch (error: any) {
      console.error("Error al enviar el examen:", error);
      toast({
        title: "Error",
        description: "Error al enviar el examen. Por favor intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    selectedAnswers,
    isSubmitting,
    showResults,
    examScore,
    showRating,
    setShowRating,
    handleAnswerSelect,
    handleRetry,
    handleSubmit
  };
};