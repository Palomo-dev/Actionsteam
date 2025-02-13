import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { CourseForm } from "@/components/admin/courses/CourseForm";
import { createCourse } from "@/services/courseService";
import type { CourseFormData, CourseSessionType, CourseEvaluationType } from "@/types/courses";

const CreateCourse = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<CourseSessionType[]>([]);
  const [evaluations, setEvaluations] = useState<CourseEvaluationType[]>([]);

  const mutation = useMutation({
    mutationFn: createCourse,
    onSuccess: (response) => {
      if (response && response.id) {
        toast.success("Curso creado exitosamente");
        // Redirect to the edit page using the course ID
        navigate(`/admin/cursos/${response.id}/editar`);
      } else {
        console.error("Invalid response from createCourse:", response);
        toast.error("Error al crear el curso: respuesta inválida");
      }
    },
    onError: (error: any) => {
      console.error("Error creating course:", error);
      toast.error(error.message || "Error al crear el curso");
      // Navigate back to courses list on error
      navigate("/admin/cursos");
    },
  });

  const addSession = () => {
    setSessions([
      ...sessions,
      { 
        title: "", 
        description: "", 
        videoFile: null, 
        documentationFile: null,
        duration_seconds: 0 
      },
    ]);
  };

  const updateSession = (index: number, field: keyof CourseSessionType, value: any) => {
    const newSessions = [...sessions];
    newSessions[index] = { ...newSessions[index], [field]: value };
    setSessions(newSessions);
  };

  const removeSession = (index: number) => {
    const newSessions = [...sessions];
    newSessions.splice(index, 1);
    setSessions(newSessions);
  };

  const addEvaluation = () => {
    setEvaluations([
      ...evaluations,
      {
        question: "",
        options: [],
        correctOption: 0,
      },
    ]);
  };

  const updateEvaluation = (index: number, field: string, value: any) => {
    const newEvaluations = [...evaluations];
    newEvaluations[index] = {
      ...newEvaluations[index],
      [field]: value,
    };
    setEvaluations(newEvaluations);
  };

  const removeEvaluation = (index: number) => {
    setEvaluations(evaluations.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Crear Nuevo Curso</h1>
        <button 
          onClick={() => navigate("/admin/cursos")}
          className="text-primary hover:underline"
        >
          Volver al listado de cursos
        </button>
      </div>
      
      <CourseForm
        sessions={sessions}
        evaluations={evaluations}
        onSubmit={mutation.mutate}
        onAddSession={addSession}
        onUpdateSession={updateSession}
        onRemoveSession={removeSession}
        onAddEvaluation={addEvaluation}
        onUpdateEvaluation={updateEvaluation}
        onRemoveEvaluation={removeEvaluation}
        isLoading={mutation.isPending}
        submitText="Crear Curso"
      />
    </div>
  );
};

export default CreateCourse;