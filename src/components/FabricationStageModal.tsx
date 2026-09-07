import React, { useState, useRef } from 'react';
import { X, Check, Wrench, Upload, Image as ImageIcon } from 'lucide-react';
import { FabricationStage } from '../types';
import { readImageFileAsDataUrl } from '../utils/storage';

interface FabricationStageModalProps {
  isOpen: boolean;
  onClose: () => void;
  stageData?: FabricationStage | null;
  onSave: (stage: FabricationStage) => void;
}

export const FabricationStageModal: React.FC<FabricationStageModalProps> = ({
  isOpen,
  onClose,
  stageData,
  onSave,
}) => {
  const [title, setTitle] = useState(stageData?.title || '');
  const [phase, setPhase] = useState(stageData?.phase || 'Phase 1: Mechanical Prototyping');
  const [summary, setSummary] = useState(stageData?.summary || '');
  const [materialsText, setMaterialsText] = useState(stageData?.materials ? stageData.materials.join(', ') : '');
  const [toolsText, setToolsText] = useState(stageData?.tools ? stageData.tools.join(', ') : '');
  const [engineeringProcess, setEngineeringProcess] = useState(stageData?.engineeringProcess || '');
  const [challengesAndSolutions, setChallengesAndSolutions] = useState(stageData?.challengesAndSolutions || '');
  const [imageUrl, setImageUrl] = useState(stageData?.imageUrl || '');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageUpload = async (file: File) => {
    try {
      const dataUrl = await readImageFileAsDataUrl(file);
      setImageUrl(dataUrl);
    } catch (err) {
      console.error('Failed to read image:', err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !engineeringProcess.trim()) return;

    const materials = materialsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const tools = toolsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const saved: FabricationStage = {
      id: stageData?.id || 'fab-' + Date.now(),
      order: stageData?.order || Date.now(),
      title: title.trim(),
      phase: phase.trim(),
      summary: summary.trim() || title.trim(),
      materials: materials.length > 0 ? materials : ['Aerospace Aluminum', 'Custom PCB'],
      tools: tools.length > 0 ? tools : ['CNC Milling', '3D Printer'],
      engineeringProcess: engineeringProcess.trim(),
      challengesAndSolutions: challengesAndSolutions.trim(),
      imageUrl: imageUrl || undefined,
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
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {stageData ? 'Edit Fabrication Stage' : 'Add Fabrication Stage'}
              </h3>
              <p className="text-xs text-slate-400">
                Document how you built your robot, materials, and engineering solutions.
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Stage / Assembly Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 3D Printed Soft Gripper Claws"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Phase Label
              </label>
              <input
                type="text"
                placeholder="e.g. Phase 2: Mechanical Assembly"
                value={phase}
                onChange={(e) => setPhase(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Short Summary
            </label>
            <input
              type="text"
              placeholder="e.g. Engineered soft silicone contact pads and dual servo linkage to grip securely without injury."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Materials (comma-separated)
              </label>
              <input
                type="text"
                placeholder="Aluminum 6061, Silicone Shore A20, Carbon Fiber"
                value={materialsText}
                onChange={(e) => setMaterialsText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tools & Machinery (comma-separated)
              </label>
              <input
                type="text"
                placeholder="CNC Mill, SLA 3D Printer, Vernier Calipers"
                value={toolsText}
                onChange={(e) => setToolsText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Engineering & Fabrication Process *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Describe the steps you took to make this part, design choices, wiring, code, or assembly..."
              value={engineeringProcess}
              onChange={(e) => setEngineeringProcess(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-500 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Engineering Challenges Faced & Overcome Solution
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Challenge: Wall friction was high. Solution: Added spring-loaded roller casters to keep it centered."
              value={challengesAndSolutions}
              onChange={(e) => setChallengesAndSolutions(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-500 leading-relaxed"
            />
          </div>

          {/* Picture Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Fabrication Workbench / Component Picture
            </label>
            <div className="flex items-center gap-3">
              {imageUrl && (
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-700 bg-slate-950 flex-shrink-0">
                  <img src={imageUrl} alt="Stage" className="w-full h-full object-cover" />
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
                  <span>{imageUrl ? 'Change Picture' : 'Upload Stage Picture'}</span>
                </button>
              </div>
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
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Fabrication Stage</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
