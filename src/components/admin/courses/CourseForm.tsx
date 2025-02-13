import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Loader2, Plus, BookOpen, Video, GraduationCap } from "lucide-react";
import { CourseBasicInfo } from "./CourseBasicInfo";
import { CourseSession } from "./CourseSession";
import { CourseEvaluation } from "./CourseEvaluation";
import { CourseFormData, CourseSessionType, CourseEvaluationType } from "@/types/courses";
import { toast } from "sonner";

interface CourseFormProps {
  initialData?: CourseFormData;
  sessions: CourseSessionType[];
  evaluations: CourseEvaluationType[];
  onSubmit: (data: CourseFormData) => void;
  onAddSession: () => void;
  onUpdateSession: (index: number, field: keyof CourseSessionType, value: any) => void;
  onRemoveSession: (index: number) => void;
  onAddEvaluation: () => void;
  onUpdateEvaluation: (index: number, field: string, value: any) => void;
  onRemoveEvaluation: (index: number) => void;
  isLoading?: boolean;
  submitText?: string;
  courseId?: string;
}

export const CourseForm = ({
  initialData,
  sessions,
  evaluations,
  onSubmit,
  onAddSession,
  onUpdateSession,
  onRemoveSession,
  onAddEvaluation,
  onUpdateEvaluation,
  onRemoveEvaluation,
  isLoading,
  submitText = "Guardar Cambios",
  courseId,
}: CourseFormProps) => {
  const form = useForm<CourseFormData>({
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      banner: null,
      inductionVideo: null,
      banner_url: initialData?.banner_url || "",
      induction_video_url: initialData?.induction_video_url || "",
      duration: initialData?.duration || 0,
      launchDate: initialData?.launchDate || new Date(),
      isPublished: Boolean(initialData?.isPublished) || false,
      instructorId: initialData?.instructorId || "",
      tags: initialData?.tags || [],
      level: initialData?.level || "beginner",
      categories: initialData?.categories || [],
      price_cop: initialData?.price_cop || 0,
      original_price_cop: initialData?.original_price_cop || 0,
      discount_percentage: initialData?.discount_percentage || 0,
    },
  });

  const totalDuration = sessions.reduce((total, session) => total + (session.duration_seconds || 0), 0);

  const handleSubmit = async (data: CourseFormData) => {
    try {
      console.log("Submitting form with data:", data);
      console.log("isPublished value:", data.isPublished);

      // Validate sessions
      if (sessions.length > 0) {
        const validSessions = sessions.map((session, index) => ({
          ...session,
          order_index: index,
          video_url: session.video_url || null,
          documentation_url: session.documentation_url || null,
          duration_seconds: session.duration_seconds || 0
        }));
        data.sessions = validSessions;
      }

      // Validate evaluations
      if (evaluations.length > 0) {
        const validEvaluations = evaluations.map(evaluation => ({
          ...evaluation,
          options: Array.isArray(evaluation.options) ? evaluation.options : [],
          correctOption: evaluation.correctOption ?? 0
        }));
        data.evaluations = validEvaluations;
      }

      // Ensure isPublished is explicitly set as a boolean
      const formData = {
        ...data,
        isPublished: Boolean(data.isPublished)
      };

      console.log("Submitting course with final data:", formData);
      await onSubmit(formData);
      
      toast.success("Curso guardado exitosamente");
    } catch (error) {
      console.error("Error al guardar el curso:", error);
      toast.error("Error al guardar el curso");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Información General del Curso
            </CardTitle>
            <CardDescription>
              Configura los detalles básicos del curso, incluyendo título, descripción, multimedia y configuración general.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <CourseBasicInfo form={form} totalDuration={totalDuration} courseId={courseId} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Sesiones del Curso
              </div>
              <Button type="button" onClick={onAddSession} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Sesión
              </Button>
            </CardTitle>
            <CardDescription>
              Agrega las sesiones del curso, incluyendo videos y documentación para cada una.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {sessions.map((session, index) => (
                <CourseSession
                  key={index}
                  index={index}
                  session={session}
                  updateSession={onUpdateSession}
                  onRemove={onRemoveSession}
                />
              ))}
              {sessions.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No hay sesiones agregadas. Haz clic en "Agregar Sesión" para comenzar.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Evaluación del Curso
              </div>
              <Button 
                type="button" 
                onClick={() => {
                  onAddEvaluation();
                  // Asegurarse de que la nueva evaluación tenga correctOption inicializado
                  const newIndex = evaluations.length;
                  onUpdateEvaluation(newIndex, "correctOption", 0);
                }} 
                variant="outline" 
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Pregunta
              </Button>
            </CardTitle>
            <CardDescription>
              Configura las preguntas y respuestas para la evaluación final del curso.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {evaluations.map((evaluation, index) => (
                <CourseEvaluation
                  key={index}
                  index={index}
                  evaluation={evaluation}
                  updateEvaluation={onUpdateEvaluation}
                  onRemove={onRemoveEvaluation}
                />
              ))}
              {evaluations.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No hay preguntas agregadas. Haz clic en "Agregar Pregunta" para comenzar.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Actualizando Curso...
            </>
          ) : (
            submitText
          )}
        </Button>
      </form>
    </Form>
  );
};