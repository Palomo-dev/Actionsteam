import { useParams, useNavigate, Link } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";
import { CourseForm } from "@/components/admin/courses/CourseForm";
import { useEditCourse } from "@/hooks/useEditCourse";
import { toast } from "sonner";
import { useCourseMutations } from "@/hooks/mutations/useCourseMutations";
import { useEffect } from "react";

const EditCourse = () => {
  const { cursoId } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!cursoId || typeof cursoId !== 'string' || cursoId === '[object Object]') {
      toast.error("ID del curso no encontrado o inválido");
      navigate("/admin/cursos");
    }
  }, [cursoId, navigate]);

  if (!cursoId || typeof cursoId !== 'string' || cursoId === '[object Object]') {
    return null;
  }

  const {
    courseData,
    loading,
    sessions,
    evaluations,
    addSession,
    updateSession,
    removeSession,
    addEvaluation,
    updateEvaluation,
    removeEvaluation,
  } = useEditCourse(cursoId);

  const { updateMutation } = useCourseMutations(cursoId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <p className="text-lg text-muted-foreground">Curso no encontrado</p>
        <Link 
          to="/admin/cursos"
          className="flex items-center text-primary hover:underline gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al listado de cursos
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Editar Curso</h1>
        <Link 
          to="/admin/cursos"
          className="flex items-center text-primary hover:underline gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al listado de cursos
        </Link>
      </div>
      
      <CourseForm
        initialData={courseData}
        sessions={sessions}
        evaluations={evaluations}
        onSubmit={updateMutation.mutate}
        onAddSession={addSession}
        onUpdateSession={updateSession}
        onRemoveSession={removeSession}
        onAddEvaluation={addEvaluation}
        onUpdateEvaluation={updateEvaluation}
        onRemoveEvaluation={removeEvaluation}
        isLoading={updateMutation.isPending}
        courseId={cursoId}
      />
    </div>
  );
};

export default EditCourse;