import React, { useState, useRef } from 'react';
import { X, Check, Cpu, Upload, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { RobotFunction } from '../types';
import { readImageFileAsDataUrl } from '../utils/storage';

interface FunctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  functionData?: RobotFunction | null;
  onSave: (fn: RobotFunction) => void;
}

export const FunctionModal: React.FC<FunctionModalProps> = ({
  isOpen,
  onClose,
  functionData,
  onSave,
}) => {
  const [title, setTitle] = useState(functionData?.title || '');
  const [subsystem, setSubsystem] = useState(functionData?.subsystem || 'Mechanical / Navigation');
  const [iconName, setIconName] = useState(functionData?.iconName || 'Compass');
  const [shortDescription, setShortDescription] = useState(functionData?.shortDescription || '');
  const [howItWorks, setHowItWorks] = useState(functionData?.howItWorks || '');
  const [safetyFailSafe, setSafetyFailSafe] = useState(functionData?.safetyFailSafe || '');
  const [stepInRescueSequence, setStepInRescueSequence] = useState<number>(functionData?.stepInRescueSequence || 1);
  const [imageUrl, setImageUrl] = useState(functionData?.imageUrl || '');
  const [technicalSpecs, setTechnicalSpecs] = useState<{ label: string; value: string }[]>(
    functionData?.technicalSpecs && functionData.technicalSpecs.length > 0
      ? [...functionData.technicalSpecs]
      : [{ label: 'Operational Speed', value: '0.2 m/s' }]
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageUpload = async (file: File) => {
    try {
      const dataUrl = await readImageFileAsDataUrl(file);
      setImageUrl(dataUrl);
    } catch (err) {
      console.error('Image read failed:', err);
    }
  };

  const handleAddSpec = () => {
    setTechnicalSpecs([...technicalSpecs, { label: '', value: '' }]);
  };

  const handleSpecChange = (index: number, field: 'label' | 'value', text: string) => {
    const updated = [...technicalSpecs];
    updated[index][field] = text;
    setTechnicalSpecs(updated);
  };

  const handleRemoveSpec = (index: number) => {
    setTechnicalSpecs(technicalSpecs.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !howItWorks.trim()) return;

    const saved: RobotFunction = {
      id: functionData?.id || 'fn-' + Date.now(),
      order: functionData?.order || Date.now(),
      title: title.trim(),
      subsystem: subsystem.trim(),
      iconName,
      shortDescription: shortDescription.trim() || title.trim(),
      howItWorks: howItWorks.trim(),
      safetyFailSafe: safetyFailSafe.trim(),
      stepInRescueSequence: Number(stepInRescueSequence) || 1,
      imageUrl: imageUrl || undefined,
      technicalSpecs: technicalSpecs.filter((s) => s.label.trim() && s.value.trim()),
    };

    onSave(saved);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl animate-scaleUp my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {functionData ? 'Edit Robot Function' : 'Add New Robot Function'}
              </h3>
              <p className="text-xs text-slate-400">
                Specify working principle, technical parameters, and demonstration picture.
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

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Title & Subsystem */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Function Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 360° Inspection Camera Module"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Subsystem Category
              </label>
              <input
                type="text"
                placeholder="e.g. Optical / Inspection"
                value={subsystem}
                onChange={(e) => setSubsystem(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Icon & Sequence Step */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Icon Representation
              </label>
              <select
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Compass">Compass (Navigation / Centering)</option>
                <option value="Camera">Camera (Vision / Lighting)</option>
                <option value="Wind">Wind (Oxygen / Pneumatics)</option>
                <option value="Mic">Mic (Audio / Communication)</option>
                <option value="ShieldCheck">ShieldCheck (Gripper / Harness)</option>
                <option value="Anchor">Anchor (Winch / Tether / Ascent)</option>
                <option value="Cpu">Cpu (Electronics / Control)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Rescue Protocol Step #
              </label>
              <select
                value={stepInRescueSequence}
                onChange={(e) => setStepInRescueSequence(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value={1}>Step 1: Rapid Descent</option>
                <option value={2}>Step 2: Shaft Inspection</option>
                <option value={3}>Step 3: Oxygen Delivery</option>
                <option value={4}>Step 4: Voice Intercom</option>
                <option value={5}>Step 5: Conformal Grip</option>
                <option value={6}>Step 6: Controlled Ascent</option>
              </select>
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Short Summary Headline
            </label>
            <input
              type="text"
              placeholder="e.g. Real-time video inspection in pitch-black borehole conditions with zero latency."
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* How It Works Full Details */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              How It Operates (Detailed Working Principle) *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Describe step-by-step how this function mechanically, electronically, or pneumatically works inside the borehole..."
              value={howItWorks}
              onChange={(e) => setHowItWorks(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-cyan-500 leading-relaxed"
            />
          </div>

          {/* Safety Fail-Safe */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Safety Redundancy / Fail-Safe Note
            </label>
            <input
              type="text"
              placeholder="e.g. Mechanical pressure relief valve prevents over-inflation."
              value={safetyFailSafe}
              onChange={(e) => setSafetyFailSafe(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Photo Attachment */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Function Picture or Diagram
            </label>
            <div className="flex items-center gap-3">
              {imageUrl && (
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-700 bg-slate-950 flex-shrink-0">
                  <img src={imageUrl} alt="Function" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleImageUpload(e.target.files[0]);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{imageUrl ? 'Replace Picture' : 'Upload Function Picture'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Technical Specs Key-Value Pairs */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">
                Technical Specifications
              </label>
              <button
                type="button"
                onClick={handleAddSpec}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Spec</span>
              </button>
            </div>

            <div className="space-y-2">
              {technicalSpecs.map((spec, sIdx) => (
                <div key={sIdx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Label (e.g. Gripping Force)"
                    value={spec.label}
                    onChange={(e) => handleSpecChange(sIdx, 'label', e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. 18 kPa distributed)"
                    value={spec.value}
                    onChange={(e) => handleSpecChange(sIdx, 'value', e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-cyan-300 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(sIdx)}
                    className="p-1 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Function</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
