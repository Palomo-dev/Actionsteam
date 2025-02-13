import { Document, Page, StyleSheet, Font, View } from '@react-pdf/renderer';
import { CertificateHeader } from './CertificateHeader';
import { CertificateContent } from './CertificateContent';
import { CertificateFooter } from './CertificateFooter';
import html2canvas from 'html2canvas';
import { toast } from "@/components/ui/use-toast";

// Registrar fuentes personalizadas
Font.register({
  family: 'Open Sans',
  src: 'https://fonts.gstatic.com/s/opensans/v34/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4gaVQUwaEQbjB_mQ.woff'
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#0A0F1C',
    padding: 40,
  },
  decorativeBorder: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    borderWidth: 2,
    borderColor: '#9b87f5',
    borderStyle: 'solid',
    borderRadius: 10,
  },
  decorativeCorner: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderColor: '#9b87f5',
    borderStyle: 'solid',
  },
  topLeft: {
    top: 30,
    left: 30,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 15,
  },
  topRight: {
    top: 30,
    right: 30,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 15,
  },
  bottomLeft: {
    bottom: 30,
    left: 30,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 15,
  },
  bottomRight: {
    bottom: 30,
    right: 30,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 15,
  },
});

interface CertificatePDFProps {
  studentName: string;
  courseName: string;
  score: number;
  issueDate: string;
  certificateId: string;
}

export const CertificatePDF = ({ 
  studentName, 
  courseName, 
  score, 
  issueDate,
  certificateId 
}: CertificatePDFProps) => {
  const handleShare = async () => {
    try {
      const certificateElement = document.getElementById('certificate-container');
      if (!certificateElement) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo encontrar el certificado para compartir.",
        });
        return;
      }

      const canvas = await html2canvas(certificateElement);
      const imageUrl = canvas.toDataURL('image/png');

      // Intentar compartir usando Web Share API
      if (navigator.share && navigator.canShare) {
        try {
          const blob = await (await fetch(imageUrl)).blob();
          const file = new File([blob], 'certificate.png', { type: 'image/png' });
          const shareData = {
            title: `Mi certificado de ${courseName}`,
            text: `¡He completado el curso de ${courseName} con una calificación de ${score}%!`,
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
        } catch (shareError) {
          console.log('Error al compartir:', shareError);
          // Si falla el compartir, continuamos con la descarga
        }
      }

      // Si Web Share API no está disponible o falla, descargamos la imagen
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `certificado-${courseName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "¡Éxito!",
        description: "Tu certificado se ha descargado correctamente.",
      });
    } catch (error) {
      console.error('Error al procesar el certificado:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo procesar el certificado. Por favor, intenta de nuevo.",
      });
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <div id="certificate-container">
          <View style={styles.decorativeBorder} />
          <View style={[styles.decorativeCorner, styles.topLeft]} />
          <View style={[styles.decorativeCorner, styles.topRight]} />
          <View style={[styles.decorativeCorner, styles.bottomLeft]} />
          <View style={[styles.decorativeCorner, styles.bottomRight]} />
          
          <CertificateHeader />
          <CertificateContent 
            studentName={studentName}
            courseName={courseName}
            score={score}
            certificateId={certificateId}
          />
          <CertificateFooter issueDate={issueDate} />
        </div>
      </Page>
    </Document>
  );
};