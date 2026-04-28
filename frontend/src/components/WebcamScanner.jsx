import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCw } from 'lucide-react';

const WebcamScanner = ({ onScanResult, isProcessing }) => {
  const webcamRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);

  const captureAndScan = useCallback(async () => {
    if (!webcamRef.current) return;
    
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    setIsScanning(true);
    try {
      const formData = new FormData();
      formData.append('base64_image', imageSrc);

      const response = await fetch('https://dip-backend-docker.onrender.com/scan/live', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      if (data.success) {
        onScanResult(data);
      }
    } catch (error) {
      console.error('Error scanning:', error);
    } finally {
      setIsScanning(false);
    }
  }, [webcamRef, onScanResult]);

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto space-y-4">
      <div className="relative w-full overflow-hidden border-2 rounded-xl border-slate-700/50 aspect-video glass-panel">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="object-cover w-full h-full"
          videoConstraints={{ 
            facingMode: "environment",
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }}
        />
        {/* Scanning Overlay Animation */}
        <div className="absolute top-0 left-0 w-full h-1 bg-accent/80 animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_10px_#8b5cf6]" />
      </div>
      
      <button 
        onClick={captureAndScan}
        disabled={isScanning || isProcessing}
        className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all rounded-lg bg-primary hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed neon-glow"
      >
        {isScanning ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
        {isScanning ? 'Processing Frame...' : 'Capture & Scan'}
      </button>

      <style jsx>{`
        @keyframes scan {
          0%, 100% { top: 0; }
          50% { top: 100%; }
        }
      `}</style>
    </div>
  );
};

export default WebcamScanner;
