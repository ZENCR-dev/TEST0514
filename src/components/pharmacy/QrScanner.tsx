import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode'; // Ensure Html5QrcodeScanner is imported

export interface QrScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanFailure?: (error: any) => void;
  verbose?: boolean; // Optional: for debugging html5-qrcode
}

const QrScanner: React.FC<QrScannerProps> = ({ onScanSuccess, onScanFailure, verbose = false }) => {
  const qrCodeRegionId = "html5qr-code-full-region";
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // Ensure the scanner is only initialized once
    if (!scannerRef.current) {
      const html5QrcodeScanner = new Html5QrcodeScanner(
        qrCodeRegionId,
        {
          fps: 10,
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            // Make qrbox responsive, aiming for a square scanning area
            const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
            const qrboxSize = Math.floor(minEdge * 0.7);
            return {
              width: qrboxSize,
              height: qrboxSize,
            };
          },
          supportedScanTypes: [], // Pass an empty array to use all supported types
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE] // Specify QR_CODE format
        },
        verbose // Pass verbose flag to html5-qrcode library for debugging
      );

      html5QrcodeScanner.render(onScanSuccess, onScanFailure);
      scannerRef.current = html5QrcodeScanner;
    }

    // Cleanup function to clear the scanner when the component unmounts
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Failed to clear html5QrcodeScanner.", error);
        });
        scannerRef.current = null;
      }
    };
  }, [qrCodeRegionId, onScanSuccess, onScanFailure, verbose]); // Dependencies for the useEffect hook

  return (
    <div className="qr-scanner-container">
      <div id={qrCodeRegionId} style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}></div>
      {/* Optional: Add UI elements like buttons to start/stop scan, or status messages */}
    </div>
  );
};

export default QrScanner; 