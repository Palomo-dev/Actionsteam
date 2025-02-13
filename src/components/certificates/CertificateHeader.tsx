import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    marginBottom: 10,
    fontFamily: 'Open Sans',
    color: '#FFFFFF',
    textAlign: 'center',
    padding: 10,
  },
  subtitle: {
    fontSize: 24,
    marginBottom: 20,
    color: '#9b87f5',
    fontFamily: 'Open Sans',
    textAlign: 'center',
    letterSpacing: 1,
  },
  gradientBar: {
    height: 2,
    marginVertical: 15,
    backgroundColor: '#9b87f5',
    opacity: 0.5,
    borderRadius: 4,
    width: '80%',
    alignSelf: 'center',
  },
});

export const CertificateHeader = () => (
  <View style={styles.header}>
    <Text style={styles.title}>Certificado de Finalización</Text>
    <View style={styles.gradientBar} />
    <Text style={styles.subtitle}>Imagine AI Academy</Text>
  </View>
);