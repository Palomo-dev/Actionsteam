import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 60,
    left: 40,
    right: 40,
    textAlign: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderColor: '#9b87f5',
  },
  signature: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderColor: '#9b87f5',
    width: 200,
    alignSelf: 'center',
    textAlign: 'center',
  },
  signatureText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontFamily: 'Open Sans',
    marginBottom: 3,
  },
  date: {
    fontSize: 14,
    color: '#9b87f5',
    marginTop: 15,
    fontFamily: 'Open Sans',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});

interface CertificateFooterProps {
  issueDate: string;
}

export const CertificateFooter = ({ issueDate }: CertificateFooterProps) => (
  <View style={styles.footer}>
    <View style={styles.signature}>
      <Text style={styles.signatureText}>Juan Gallego</Text>
      <Text style={styles.signatureText}>Director Académico</Text>
      <Text style={styles.signatureText}>Imagine AI Academy</Text>
    </View>
    <Text style={styles.date}>
      Emitido el {format(new Date(issueDate), "PPP", { locale: es })}
    </Text>
  </View>
);