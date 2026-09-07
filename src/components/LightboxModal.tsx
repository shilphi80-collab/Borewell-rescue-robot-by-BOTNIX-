import React from 'react';
import { X, Download, Maximize2 } from 'lucide-react';

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  title: string | null;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title,
}) => {
  if (!isOpen || !imageUrl) return null;

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = (title || 'borehole_robot_photo').toLowerCase().replace(/\s+/g, '_') + '.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 animate-fadeIn"
      onClick={onClose}
    >
      {/* Top Controls Bar */}
      <div 
        className="w-full max-w-6xl flex items-center justify-between py-3 px-4 bg-slate-900/80 border border-slate-800 rounded-xl mb-4 text-white z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-sm font-semibold truncate max-w-md">
          {title || 'Robot High-Resolution Photo'}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Download Image"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-300 hover:text-white transition-colors"
            title="Close Lightbox"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image */}
      <div 
        className="relative max-w-6xl max-h-[82vh] w-full flex items-center justify-center overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/50 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={title || 'Robot photo'}
          className="max-h-[80vh] max-w-full object-contain rounded-xl select-none"
        />
      </div>
    </div>
  );
};
