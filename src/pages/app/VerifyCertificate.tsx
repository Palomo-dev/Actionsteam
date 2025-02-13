import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Award, Download, Loader2, AlertCircle, HelpCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pdf } from '@react-pdf/renderer';
import { CertificatePDF } from "@/components/certificates/CertificatePDF";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const VerifyCertificate = () => {
  const { certificateId } = useParams();
  const { toast } = useToast();

  const { data: certificate, isLoading, error } = useQuery({
    queryKey: ["verify-certificate", certificateId],
    queryFn: async () => {
      if (!certificateId) throw new Error("No se proporcionó ID del certificado");

      const { data, error } = await supabase
        .from("certificates")
        .select(`
          *,
          courses (
            title,
            description
          ),
          profiles (
            first_name
          )
        `)
        .eq("id", certificateId)
        .single();
      
      if (error) {
        console.error('Error al obtener el certificado:', error);
        throw error;
      }
      
      if (!data) {
        throw new Error('Certificado no encontrado');
      }
      
      console.log('Certificate data:', data); // For debugging
      return data;
    },
  });

  const handleDownloadPDF = async () => {
    if (!certificate) return;

    try {
      const blob = await pdf(
        <CertificatePDF
          studentName={certificate.profiles?.first_name || ""}
          courseName={certificate.courses?.title || ""}
          score={certificate.score}
          issueDate={certificate.issued_at}
          certificateId={certificate.id}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificado-${certificate.courses?.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "¡Éxito!",
        description: "El certificado se ha descargado correctamente.",
      });
    } catch (error) {
      console.error('Error downloading certificate:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo descargar el certificado. Por favor, intenta de nuevo.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          <p className="text-gray-400">Verificando certificado...</p>
        </div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-900">
        <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-red-500/30">
          <div className="relative mb-6">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-pink-600 rounded-full blur opacity-30"></div>
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto relative" />
          </div>
          
          <h1 className="text-2xl font-bold text-white text-center mb-4">
            Certificado no encontrado
          </h1>
          
          <p className="text-gray-400 text-center mb-4">
            El certificado que estás buscando no existe o ha sido eliminado.
            Por favor, verifica que la URL sea correcta o contacta con soporte si crees que esto es un error.
          </p>
          
          <div className="mt-8 flex flex-col gap-4">
            <Button
              variant="outline"
              className="w-full gap-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 border-purple-500/30"
              onClick={() => window.location.href = 'mailto:soporte@imagine.ai'}
            >
              <HelpCircle className="h-4 w-4" />
              Contactar soporte
            </Button>
            <Button
              variant="outline"
              className="w-full gap-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 border-purple-500/30"
              onClick={() => window.location.href = '/'}
            >
              <ExternalLink className="h-4 w-4" />
              Ir al inicio
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-purple-500/30">
        <div className="text-center mb-8">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-30"></div>
            <Award className="h-16 w-16 text-purple-400 mx-auto relative" />
          </div>
          
          <h1 className="text-3xl font-bold text-white mt-4 mb-2">
            Certificado Verificado
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full mb-8"></div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-700/30 backdrop-blur-sm p-6 rounded-lg border border-purple-500/20">
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Estudiante:</p>
                <p className="text-white text-xl font-medium">{certificate.profiles?.first_name}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Curso:</p>
                <p className="text-white text-xl font-medium">{certificate.courses?.title}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Calificación:</p>
                <p className="text-white text-xl font-medium">{certificate.score}%</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Fecha de emisión:</p>
                <p className="text-white text-xl font-medium">
                  {format(new Date(certificate.issued_at), "PPP", { locale: es })}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={handleDownloadPDF}
              className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Download className="h-5 w-5" />
              Descargar Certificado
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyCertificate;