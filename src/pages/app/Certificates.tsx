import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Download, Award, Loader2, Share2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { pdf } from '@react-pdf/renderer';
import { CertificatePDF } from "@/components/certificates/CertificatePDF";
import { CertificateQR } from "@/components/certificates/CertificateQR";
import html2canvas from 'html2canvas';

const Certificates = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Sesión expirada",
          description: "Por favor, inicia sesión nuevamente",
          variant: "destructive",
        });
        navigate("/login");
      }
    };

    checkSession();
  }, [navigate, toast]);

  const { data: certificates, isLoading } = useQuery({
    queryKey: ["certificates"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

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
        .eq("user_id", user.id);

      if (error) throw error;
      return data;
    },
  });

  const handleDownloadPDF = async (certificate: any) => {
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
        description: "Tu certificado se ha descargado correctamente.",
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

  const handleShare = async (certificate: any) => {
    try {
      const certificateElement = document.getElementById(`certificate-${certificate.id}`);
      if (!certificateElement) {
        throw new Error("No se encontró el elemento del certificado");
      }

      const canvas = await html2canvas(certificateElement as HTMLElement);
      const imageUrl = canvas.toDataURL('image/png');

      if (navigator.share && navigator.canShare) {
        const blob = await (await fetch(imageUrl)).blob();
        const file = new File([blob], 'certificate.png', { type: 'image/png' });
        const shareData = {
          title: `Mi certificado de ${certificate.courses?.title}`,
          text: `¡He completado el curso de ${certificate.courses?.title} con una calificación de ${certificate.score}%!`,
          files: [file]
        };

        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          toast({
            title: "¡Éxito!",
            description: "Tu certificado ha sido compartido.",
          });
          return;
        }
      }

      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `certificado-${certificate.courses?.title}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "¡Éxito!",
        description: "Tu certificado se ha descargado correctamente.",
      });
    } catch (error) {
      console.error('Error sharing certificate:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo compartir el certificado. Se ha descargado en su lugar.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text mb-8 md:mb-12">
        Mis Certificados
      </h1>

      <div className="grid gap-6 md:gap-8">
        {certificates?.map((certificate) => (
          <div
            key={certificate.id}
            id={`certificate-${certificate.id}`}
            className="relative group transform transition-all duration-300 hover:scale-[1.01]"
          >
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-purple-500/30 rounded-xl p-6 md:p-8 lg:p-12 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
              <div className="flex flex-col items-center space-y-6 md:space-y-8">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-30 group-hover:opacity-40 transition-opacity duration-300"></div>
                  <Award className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-purple-400 relative" />
                </div>
                
                <div className="text-center space-y-4 md:space-y-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    Certificado de Excelencia
                  </h2>
                  
                  <div className="space-y-2">
                    <p className="text-gray-400 text-base md:text-lg">
                      Se certifica que
                    </p>
                    <p className="text-xl md:text-2xl font-semibold text-white">
                      {certificate.profiles?.first_name}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-gray-400 text-base md:text-lg">
                      ha completado exitosamente el curso
                    </p>
                    <p className="text-xl md:text-2xl font-semibold text-white">
                      {certificate.courses?.title}
                    </p>
                  </div>
                  
                  <div className="bg-purple-500/10 rounded-lg p-4 md:p-6 space-y-2 backdrop-blur-sm">
                    <p className="text-gray-400">
                      Calificación obtenida
                    </p>
                    <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                      {certificate.score}%
                    </p>
                  </div>
                  
                  <p className="text-gray-500 text-sm md:text-base">
                    Emitido el {format(new Date(certificate.issued_at), "PPP", { locale: es })}
                  </p>

                  <div className="mt-4 flex justify-center">
                    <CertificateQR 
                      certificateId={certificate.id}
                      className="bg-white/5 p-3 md:p-4 rounded-xl backdrop-blur-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 md:mt-8 flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto gap-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 border-purple-500/30 hover:border-purple-500/50 text-white"
                  onClick={() => handleDownloadPDF(certificate)}
                >
                  <Download className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="hidden sm:inline">Descargar</span> PDF
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto gap-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 border-purple-500/30 hover:border-purple-500/50 text-white"
                  onClick={() => handleShare(certificate)}
                >
                  <Share2 className="h-4 w-4 md:h-5 md:w-5" />
                  Compartir
                </Button>
              </div>
            </div>
          </div>
        ))}

        {(!certificates || certificates.length === 0) && (
          <div className="col-span-full text-center py-12 md:py-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-purple-500/30">
            <Award className="w-12 h-12 md:w-16 md:h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-base md:text-lg px-4">
              No tienes certificados aún. ¡Completa un curso para obtener tu primer certificado!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Certificates;
