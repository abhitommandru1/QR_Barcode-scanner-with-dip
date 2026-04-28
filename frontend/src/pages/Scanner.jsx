import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Upload as UploadIcon, Beaker, LogOut } from 'lucide-react';
import WebcamScanner from '../components/WebcamScanner';
import UploadScanner from '../components/UploadScanner';
import DIPVisualizer from '../components/DIPVisualizer';

const Scanner = () => {
  const [activeTab, setActiveTab] = useState('live');
  const [scanResult, setScanResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  const getValidUrl = (string) => {
    try {
      return new URL(string).href;
    } catch (_) {
      if (/^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/.test(string)) {
        return 'https://' + string;
      }
      return null;
    }
  };

  const handleScanResult = (result) => {
    setScanResult(result);
  };

  return (
    <div className="min-h-screen px-4 py-8 mx-auto max-w-7xl relative">
      {/* Logout Button */}
      <button 
        onClick={handleLogout}
        className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white transition-colors bg-red-600 rounded-lg hover:bg-red-500"
      >
        <LogOut size={16} /> Logout
      </button>

      {/* Header */}
      <header className="mb-10 text-center">
        <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-accent/20 neon-glow">
          <Beaker className="w-10 h-10 text-accent" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-pink-500 sm:text-5xl">
          Advanced DIP Scanner
        </h1>
        <p className="mt-4 text-lg text-slate-400">
          Professional QR & Barcode detection powered by OpenCV Digital Image Processing.
        </p>
      </header>

      {/* Main Content */}
      <main className="space-y-8">
        {/* Tabs */}
        <div className="flex justify-center mb-8 space-x-2">
          {['live', 'upload'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeTab === tab 
                  ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                  : 'bg-surface text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {tab === 'live' && <QrCode className="w-4 h-4 mr-2" />}
              {tab === 'upload' && <UploadIcon className="w-4 h-4 mr-2" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Scan
            </button>
          ))}
        </div>

        {/* Scanner Area */}
        <div className="flex flex-col items-center justify-center p-6 glass-panel min-h-[400px]">
          {activeTab === 'live' && <WebcamScanner onScanResult={handleScanResult} />}
          {activeTab === 'upload' && <UploadScanner onScanResult={handleScanResult} />}
        </div>

        {/* Results Area */}
        {scanResult && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Decoded Data Banner */}
            <div className="p-6 border-l-4 border-accent bg-accent/10 rounded-r-xl">
              <h2 className="text-xl font-bold text-white mb-4">Detection Results</h2>
              {scanResult.scans && scanResult.scans.length > 0 ? (
                <div className="space-y-3">
                  {scanResult.scans.map((scan, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                      <div>
                        <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Decoded Text</span>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mt-1">
                          <p className="text-lg font-mono text-green-400 select-all break-all">{scan.data}</p>
                          {getValidUrl(scan.data) ? (
                            <a href={getValidUrl(scan.data)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-4 py-2 mt-2 sm:mt-0 text-sm font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-500 whitespace-nowrap w-fit">
                              Open Link
                            </a>
                          ) : /^\d+$/.test(scan.data) ? (
                            <a href={`https://www.google.com/search?q=${scan.data}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-4 py-2 mt-2 sm:mt-0 text-sm font-semibold text-white transition-colors bg-slate-700 rounded-lg hover:bg-slate-600 whitespace-nowrap w-fit">
                              Search Product
                            </a>
                          ) : null}
                        </div>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {scan.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-yellow-400 bg-yellow-400/10 rounded-lg">
                  No barcodes or QR codes detected in the image.
                </div>
              )}
            </div>

            {/* DIP Visualizer */}
            {scanResult.pipeline && <DIPVisualizer pipeline={scanResult.pipeline} />}
          </div>
        )}
      </main>
    </div>
  );
};

export default Scanner;
