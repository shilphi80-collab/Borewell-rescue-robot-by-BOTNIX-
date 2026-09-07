import React, { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Star, AlertCircle, Check } from 'lucide-react';
import { ProjectPhoto } from '../types';
import { readImageFileAsDataUrl } from '../utils/storage';

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePhoto: (photo: Omit<ProjectPhoto, 'id' | 'dateAdded'>) => void;
}

export const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
  isOpen,
  onClose,
  onSavePhoto,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState<ProjectPhoto['category']>('chassis');
  const [isPrimary, setIsPrimary] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }
    setError(null);
    setIsProcessing(true);
    try {
      const dataUrl = await readImageFileAsDataUrl(file);
      setImagePreview(dataUrl);
      if (!title) {
        // Default title based on filename
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    } catch (err: any) {
      setError('Failed to process image: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) {
      setError('Please select or upload a picture first.');
      return;
    }
    if (!title.trim()) {
      setError('Please enter a photo title.');
      return;
    }

    onSavePhoto({
      url: imagePreview,
      title: title.trim(),
      caption: caption.trim() || 'Uploaded project picture.',
      category,
      isPrimary,
    });

    // Reset
    setImagePreview(null);
    setTitle('');
    setCaption('');
    setIsPrimary(false);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl animate-scaleUp my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Upload Robot Picture
              </h3>
              <p className="text-xs text-slate-400">
                Add photos of your borehole robot, fabrication, or testing.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="bg-rose-950/40 border border-rose-500/40 text-rose-300 px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Dropzone / Preview */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select Image
            </label>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`relative rounded-xl border-2 border-dashed p-4 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-cyan-400 bg-cyan-950/30'
                  : imagePreview
                  ? 'border-slate-700 bg-slate-950'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-950/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
              />

              {imagePreview ? (
                <div className="space-y-2">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-900 mx-auto max-h-56">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-[11px] text-cyan-400 font-medium">
                    Click or drag another image to change
                  </p>
                </div>
              ) : (
                <div className="py-6 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                    {isProcessing ? (
                      <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ImageIcon className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-200">
                      Click to browse or drag and drop
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      PNG, JPG, or WebP up to 15MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Picture Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Pneumatic Gripper Testing in Borehole"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Category & Primary Hero */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="chassis">Chassis & Frame</option>
                <option value="electronics">Electronics & PCB</option>
                <option value="gripper">Gripper & Harness</option>
                <option value="sensors">Sensors & Vision</option>
                <option value="testing">Field Testing</option>
                <option value="exhibition">Malaysia Exhibition</option>
              </select>
            </div>

            <div className="flex items-center sm:pt-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-300">
                <input
                  type="checkbox"
                  checked={isPrimary}
                  onChange={(e) => setIsPrimary(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-cyan-600 focus:ring-cyan-500 h-4 w-4"
                />
                <Star className={`w-3.5 h-3.5 ${isPrimary ? 'text-amber-400 fill-current' : 'text-slate-500'}`} />
                <span>Set as Primary Cover Photo</span>
              </label>
            </div>
          </div>

          {/* Caption */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Caption / Description
            </label>
            <textarea
              rows={3}
              placeholder="Describe what is shown in this picture, components, or test observations..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-cyan-500 leading-relaxed"
            />
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save & Upload Picture</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
