import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { QRCodeSVG } from 'qrcode.react';

const styles = StyleSheet.create({
  content: {
    margin: 30,
    padding: 40,
    borderWidth: 1,
    borderColor: '#9b87f5',
    borderRadius: 15,
    backgroundColor: '#1A1F2C',
    position: 'relative',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Open Sans',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  studentName: {
    fontSize: 32,
    marginVertical: 20,
    color: '#9b87f5',
    textAlign: 'center',
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  courseName: {
    fontSize: 26,
    marginVertical: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
    letterSpacing: 0.5,
    padding: 10,
  },
  score: {
    fontSize: 22,
    color: '#FFFFFF',
    marginVertical: 20,
    textAlign: 'center',
    fontFamily: 'Open Sans',
    backgroundColor: '#2A2F3C',
    padding: 15,
    borderRadius: 12,
    width: '60%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#9b87f5',
  },
  qrContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
  },
});

interface CertificateContentProps {
  studentName: string;
  courseName: string;
  score: number;
  certificateId: string;
}

export const CertificateContent = ({ 
  studentName, 
  courseName, 
  score,
  certificateId 
}: CertificateContentProps) => {
  // Ensure we have a valid window object and certificateId
  const verificationUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/verify-certificate/${certificateId}`
    : `/verify-certificate/${certificateId}`;
  
  console.log('Verification URL:', verificationUrl); // For debugging

  return (
    <View style={styles.content}>
      <Text style={styles.text}>Este certificado se otorga a</Text>
      <Text style={styles.studentName}>{studentName}</Text>
      <Text style={styles.text}>por completar exitosamente el curso</Text>
      <Text style={styles.courseName}>{courseName}</Text>
      <Text style={styles.score}>Calificación: {score}%</Text>
      
      <View style={styles.qrContainer}>
        <QRCodeSVG
          value={verificationUrl}
          size={100}
          level="H"
          includeMargin={true}
          imageSettings={{
            src: "/logo.png",
            x: undefined,
            y: undefined,
            height: 24,
            width: 24,
            excavate: true,
          }}
        />
      </View>
    </View>
  );
};