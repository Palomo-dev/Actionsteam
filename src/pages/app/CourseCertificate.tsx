import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Award } from "lucide-react";
import { Loader2 } from "lucide-react";

const CourseCertificate = () => {
  const { cursoId } = useParams();

  const { data: certificateData, isLoading } = useQuery({
    queryKey: ["certificate", cursoId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const [courseResponse, profileResponse] = await Promise.all([
        supabase.from("courses").select("*").eq("id", cursoId).single(),
        supabase.from("profiles").select("*").eq("id", user.id).single(),
      ]);

      if (courseResponse.error) throw courseResponse.error;
      if (profileResponse.error) throw profileResponse.error;

      return {
        course: courseResponse.data,
        profile: profileResponse.data,
      };
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!certificateData) return null;

  const { course, profile } = certificateData;
  const currentDate = new Date().toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white text-black p-12 rounded-lg shadow-xl border-8 border-double border-gray-200">
        <div className="text-center mb-8">
          <Award className="h-16 w-16 mx-auto text-primary mb-4" />
          <h1 className="text-4xl font-bold mb-2">Certificado de Finalización</h1>
          <div className="w-32 h-1 bg-primary mx-auto"></div>
        </div>

        <div className="text-center mb-12">
          <p className="text-xl mb-2">Se certifica que</p>
          <h2 className="text-3xl font-bold text-primary mb-2">
            {profile.first_name}
          </h2>
          <p className="text-xl">ha completado exitosamente el curso</p>
          <h3 className="text-2xl font-bold mt-4 mb-8">
            {course.title}
          </h3>
          <p className="text-lg">
            Habiendo demostrado un excelente desempeño y comprensión
            <br />de todos los conceptos y habilidades requeridas.
          </p>
        </div>

        <div className="flex justify-between items-center mt-16 pt-8 border-t border-gray-200">
          <div className="text-center flex-1">
            <div className="w-40 h-px bg-black mx-auto mb-2"></div>
            <p className="font-semibold">Juan Gallego</p>
            <p className="text-sm">Instructor</p>
          </div>
          <div className="text-center flex-1">
            <p className="text-sm mb-2">{currentDate}</p>
            <p className="text-sm">Fecha de emisión</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCertificate;