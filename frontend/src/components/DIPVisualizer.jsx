import React from 'react';

const DIPVisualizer = ({ pipeline }) => {
  if (!pipeline) return null;

  const steps = [
    { key: 'original', title: '1. Original Image' },
    { key: 'grayscale', title: '2. Grayscale Conversion' },
    { key: 'equalized', title: '3. Histogram Equalization' },
    { key: 'blurred', title: '4. Gaussian Blur (Noise Removal)' },
    { key: 'threshold', title: '5. Adaptive Thresholding' },
    { key: 'edges', title: '6. Canny Edge Detection' },
    { key: 'morphology', title: '7. Morphological Closing' },
    { key: 'contours', title: '8. Contour Detection' },
    { key: 'final_annotated', title: '9. Final Decoded ROI' },
  ];

  return (
    <div className="w-full mt-8 animate-in fade-in zoom-in duration-500">
      <h2 className="mb-6 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
        Digital Image Processing Pipeline
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((step) => (
          pipeline[step.key] && (
            <div key={step.key} className="overflow-hidden transition-transform hover:scale-105 glass-panel">
              <div className="p-3 border-b border-slate-700/50 bg-slate-800/80">
                <h3 className="text-sm font-semibold text-slate-200">{step.title}</h3>
              </div>
              <div className="p-2 aspect-video bg-black/50 flex items-center justify-center">
                <img 
                  src={`data:image/jpeg;base64,${pipeline[step.key]}`} 
                  alt={step.title}
                  className="object-contain w-full h-full rounded"
                />
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default DIPVisualizer;
