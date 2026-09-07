import React, { useState } from 'react';
import { 
  Cpu, 
  Compass, 
  Camera, 
  Wind, 
  Mic, 
  ShieldCheck, 
  Anchor, 
  Plus, 
  Edit3, 
  Trash2, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  Sliders, 
  Sparkles, 
  ArrowRight, 
  Maximize2,
  Battery,
  Radio,
  Network
} from 'lucide-react';
import { RobotFunction } from '../types';

interface HowItWorksViewProps {
  functions: RobotFunction[];
  isEditMode: boolean;
  onAddFunction: () => void;
  onEditFunction: (fn: RobotFunction) => void;
  onDeleteFunction: (fnId: string) => void;
  onUploadFunctionPhoto: (fnId: string) => void;
  onSelectPhotoForLightbox: (url: string, title: string) => void;
}

// Map string icon names to Lucide icons
export const renderFunctionIcon = (iconName: string, className = "w-5 h-5") => {
  switch (iconName.toLowerCase()) {
    case 'compass':
    case 'navigation':
      return <Compass className={className} />;
    case 'camera':
    case 'vision':
      return <Camera className={className} />;
    case 'wind':
    case 'oxygen':
      return <Wind className={className} />;
    case 'mic':
    case 'audio':
      return <Mic className={className} />;
    case 'shieldcheck':
    case 'shield':
    case 'grip':
    case 'claw':
      return <ShieldCheck className={className} />;
    case 'anchor':
    case 'base':
    case 'support':
      return <Anchor className={className} />;
    case 'radio':
    case 'network':
    case 'ethernet':
    case 'rs485':
      return <Network className={className} />;
    case 'zap':
    case 'battery':
      return <Zap className={className} />;
    default:
      return <Cpu className={className} />;
  }
};

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({
  functions,
  isEditMode,
  onAddFunction,
  onEditFunction,
  onDeleteFunction,
  onUploadFunctionPhoto,
  onSelectPhotoForLightbox,
}) => {
  const [activeSequenceStep, setActiveSequenceStep] = useState<number | null>(null);

  const sortedFunctions = [...functions].sort((a, b) => (a.order || 0) - (b.order || 0));

  const filteredFunctions = activeSequenceStep !== null
    ? sortedFunctions.filter((f) => f.stepInRescueSequence === activeSequenceStep)
    : sortedFunctions;

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header & Description */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-orange-950 text-orange-400 border border-orange-800">
              MECHATRONIC ARCHITECTURE
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              How the Borewell Robot Works
            </h2>
          </div>
          <p className="text-sm text-slate-300 mt-1 max-w-3xl">
            Detailed operational principles, 4 DC motors & 8-relay bidirectional H-bridge control, 
            chest grab claw, 2-motor foldable base support, and Ground Unit real-time display telemetry.
          </p>
        </div>

        {isEditMode && (
          <button
            id="btn-add-function"
            onClick={onAddFunction}
            className="self-start md:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Robot Function</span>
          </button>
        )}
      </div>

      {/* Interactive 6-Step Rescue Protocol Stepper */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
            <Zap className="w-4 h-4 text-orange-400" />
            <span>Deterministic 6-Step Rescue Sequence</span>
          </h3>
          {activeSequenceStep !== null && (
            <button
              onClick={() => setActiveSequenceStep(null)}
              className="text-xs text-orange-400 hover:text-orange-300 font-medium"
            >
              Show All Functions
            </button>
          )}
        </div>

        {/* Stepper bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {[
            { step: 1, label: '1. Chest Claw Grip', sub: 'Motor 1 forward' },
            { step: 2, label: '2. Foldable Base Cradle', sub: 'Motors 2 & 3 open' },
            { step: 3, label: '3. RS-485 Ethernet Link', sub: 'Long-distance tether' },
            { step: 4, label: '4. Ground Unit Display', sub: 'Live motor status' },
            { step: 5, label: '5. Camera & 1-Way Audio', sub: 'Speak to victim' },
            { step: 6, label: '6. 12V 8Ah & Oxygen', sub: '20-30 min & fresh air' },
          ].map((item) => {
            const isSelected = activeSequenceStep === item.step;
            return (
              <button
                key={item.step}
                onClick={() => setActiveSequenceStep(isSelected ? null : item.step)}
                className={`flex flex-col items-start p-2.5 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'bg-orange-500/20 border-orange-500 text-white shadow-md shadow-orange-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <span className={`text-[11px] font-bold ${isSelected ? 'text-orange-300' : 'text-slate-300'}`}>
                  {item.label}
                </span>
                <span className="text-[10px] text-slate-500 truncate w-full">
                  {item.sub}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Functions Grid */}
      <div className="space-y-6">
        {filteredFunctions.map((fn, idx) => {
          return (
            <div
              key={fn.id}
              className="bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 rounded-2xl overflow-hidden transition-all shadow-xl"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12">
                
                {/* Left Photo & Subsystem Spec Column */}
                <div className="lg:col-span-4 bg-slate-950/60 p-5 border-b lg:border-b-0 lg:border-r border-slate-800/80 flex flex-col justify-between">
                  <div>
                    {/* Function Header Tag */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center">
                          {renderFunctionIcon(fn.iconName)}
                        </div>
                        <span className="text-xs font-semibold text-orange-400">
                          {fn.subsystem}
                        </span>
                      </div>
                      {fn.stepInRescueSequence && (
                        <span className="text-[10px] font-mono font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                          Step {fn.stepInRescueSequence}
                        </span>
                      )}
                    </div>

                    {/* Image representation */}
                    <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900 aspect-video group">
                      {fn.imageUrl ? (
                        <>
                          <img
                            src={fn.imageUrl}
                            alt={fn.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <button
                            onClick={() => onSelectPhotoForLightbox(fn.imageUrl!, fn.title)}
                            className="absolute top-2 right-2 p-1.5 rounded bg-slate-950/70 text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Expand Image"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 p-4 text-center">
                          <Cpu className="w-8 h-8 mb-1" />
                          <span className="text-[11px]">No picture attached</span>
                        </div>
                      )}

                      {isEditMode && (
                        <button
                          onClick={() => onUploadFunctionPhoto(fn.id)}
                          className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded bg-slate-900/90 text-orange-300 hover:bg-orange-600 hover:text-white text-[11px] font-medium border border-slate-700 transition-all shadow"
                        >
                          <Upload className="w-3 h-3" />
                          <span>{fn.imageUrl ? 'Change' : 'Upload'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Technical Specs pills */}
                  {fn.technicalSpecs && fn.technicalSpecs.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5">
                      <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                        Technical Parameters
                      </span>
                      <div className="space-y-1">
                        {fn.technicalSpecs.map((spec, sIdx) => (
                          <div key={sIdx} className="flex items-center justify-between text-xs py-0.5">
                            <span className="text-slate-400">{spec.label}:</span>
                            <span className="text-slate-200 font-mono font-medium">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Description & Working Principle Column */}
                <div className="lg:col-span-8 p-6 flex flex-col justify-between space-y-5">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-white leading-snug">
                          {fn.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-orange-300/90 mt-1 font-medium">
                          {fn.shortDescription}
                        </p>
                      </div>

                      {isEditMode && (
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => onEditFunction(fn)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
                            title="Edit Function"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteFunction(fn.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-300 border border-slate-700 transition-all"
                            title="Delete Function"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* How It Operates Detailed Body */}
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Working Principle & Actuation Mechanics</span>
                      </span>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60 whitespace-pre-line">
                        {fn.howItWorks}
                      </p>
                    </div>

                    {/* Safety & Fail-Safe Feature */}
                    {fn.safetyFailSafe && (
                      <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-3 flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-semibold text-amber-300 block">
                            Safety Redundancy & Fail-Safe
                          </span>
                          <p className="text-xs text-amber-200/80 mt-0.5 leading-relaxed">
                            {fn.safetyFailSafe}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800/60">
                    <span>Module #{idx + 1} of {functions.length}</span>
                    <span className="font-mono text-orange-400/80">Malaysia Finals Ready</span>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
