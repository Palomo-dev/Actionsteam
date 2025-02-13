import { QRCodeSVG } from 'qrcode.react';

interface CertificateQRProps {
  certificateId: string;
  className?: string;
}

export const CertificateQR = ({ certificateId, className }: CertificateQRProps) => {
  // Ensure we have a valid certificateId
  if (!certificateId) {
    console.error('Certificate ID is required for QR generation');
    return null;
  }

  // Ensure we're using window.location.origin for the full URL
  const verificationUrl = `${window.location.origin}/verify-certificate/${certificateId}`;
  console.log('Generated verification URL:', verificationUrl); // For debugging
  
  return (
    <div className={className}>
      <QRCodeSVG
        value={verificationUrl}
        size={100}
        level="H"
        includeMargin={true}
        className="bg-white p-2 rounded-lg"
      />
    </div>
  );
};