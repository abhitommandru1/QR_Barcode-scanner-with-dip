import React, { useState } from 'react';
import { Upload, FileImage, Loader } from 'lucide-react';

const UploadScanner = ({ onScanResult, isProcessing }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [localScanning, setLocalScanning] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
    // Clear input so same file can be selected again or doesn't bug out
    e.target.value = '';
  };

  const handleFile = async (file) => {
    setSelectedImage(URL.createObjectURL(file));
    setLocalScanning(true);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/scan/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      if (data.success) {
        onScanResult(data);
      }
    } catch (error) {
      console.error('Error uploading:', error);
    } finally {
      setLocalScanning(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div 
        className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl transition-all ${dragActive ? 'border-primary bg-primary/10' : 'border-slate-600 bg-slate-800/50 hover:bg-slate-800'} glass-panel`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          accept="image/*" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
          onChange={handleChange}
          disabled={localScanning || isProcessing}
        />
        
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-400">
          {localScanning ? (
            <Loader className="w-10 h-10 mb-3 animate-spin text-primary" />
          ) : selectedImage ? (
            <img src={selectedImage} alt="Preview" className="object-contain w-32 h-32 mb-3 rounded-lg" />
          ) : (
            <Upload className="w-10 h-10 mb-3 text-slate-500" />
          )}
          <p className="mb-2 text-sm">
            <span className="font-semibold text-white">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs">PNG, JPG or JPEG (Max. 5MB)</p>
        </div>
      </div>
    </div>
  );
};

export default UploadScanner;
