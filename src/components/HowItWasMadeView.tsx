import React from 'react';
import { 
  Wrench, 
  Layers, 
  Plus, 
  Edit3, 
  Trash2, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Hammer, 
  Cpu, 
  FileText,
  Maximize2
} from 'lucide-react';
import { FabricationStage } from '../types';

interface HowItWasMadeViewProps {
  stages: FabricationStage[];
  isEditMode: boolean;
  onAddStage: () => void;
  onEditStage: (stage: FabricationStage) => void;
  onDeleteStage: (stageId: string) => void;
  onUploadStagePhoto: (stageId: string) => void;
  onSelectPhotoForLightbox: (url: string, title: string) => void;
}

export const HowItWasMadeView: React.FC<HowItWasMadeViewProps> = ({
  stages,
  isEditMode,
  onAddStage,
  onEditStage,
  onDeleteStage,
  onUploadStagePhoto,
  onSelectPhotoForLightbox,
}) => {
  const sortedStages = [...stages].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-950 text-amber-400 border border-amber-800">
              FABRICATION & ENGINEERING
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              How It Was Made (Fabrication Journey)
            </h2>
          </div>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            A comprehensive breakdown of materials, CNC machining, rapid prototyping, electronics assembly, and engineering solutions implemented to realize the rescue robot.
          </p>
        </div>

        {isEditMode && (
          <button
            id="btn-add-fabrication-stage"
            onClick={onAddStage}
            className="self-start md:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Fabrication Stage</span>
          </button>
        )}
      </div>

      {/* Fabrication Stages Timeline / Cards */}
      <div className="space-y-8">
        {sortedStages.map((stage, idx) => (
          <div
            key={stage.id}
            className="bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 rounded-2xl overflow-hidden shadow-xl"
          >
            {/* Top Phase Ribbon */}
            <div className="bg-slate-950/80 px-6 py-3 border-b border-slate-800/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center border border-amber-500/30">
                  {idx + 1}
                </span>
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  {stage.phase}
                </span>
              </div>

              {isEditMode && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditStage(stage)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
                    title="Edit Stage"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteStage(stage.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-300 border border-slate-700 transition-all"
                    title="Delete Stage"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Content Body */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Details Column */}
              <div className="lg:col-span-8 space-y-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {stage.title}
                  </h3>
                  <p className="text-sm text-slate-300 mt-1 font-medium leading-relaxed">
                    {stage.summary}
                  </p>
                </div>

                {/* Materials & Tools Badges */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
                    Materials & Components Used
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {stage.materials.map((m, mIdx) => (
                      <span
                        key={mIdx}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-950/80 text-cyan-300 border border-slate-800"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                {stage.tools && stage.tools.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
                      Machinery & Tools
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {stage.tools.map((t, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-950/80 text-amber-300 border border-slate-800"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Engineering Process Text */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Fabrication Workflow & Integration</span>
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-800/60 whitespace-pre-line">
                    {stage.engineeringProcess}
                  </p>
                </div>

                {/* Challenges and Solutions */}
                {stage.challengesAndSolutions && (
                  <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-xl p-4 flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-semibold text-cyan-300 block">
                        Engineering Challenge & Overcome Solution
                      </span>
                      <p className="text-xs text-cyan-200/90 mt-1 leading-relaxed">
                        {stage.challengesAndSolutions}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Photo Column */}
              <div className="lg:col-span-4 flex flex-col justify-between">
                <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-[4/3] group shadow-lg">
                  {stage.imageUrl ? (
                    <>
                      <img
                        src={stage.imageUrl}
                        alt={stage.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <button
                        onClick={() => onSelectPhotoForLightbox(stage.imageUrl!, stage.title)}
                        className="absolute top-2 right-2 p-1.5 rounded bg-slate-950/70 text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Expand Image"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 p-4 text-center">
                      <Wrench className="w-10 h-10 mb-2 text-slate-700" />
                      <span className="text-xs text-slate-500">No stage picture attached</span>
                    </div>
                  )}

                  {isEditMode && (
                    <button
                      onClick={() => onUploadStagePhoto(stage.id)}
                      className="absolute bottom-2 right-2 flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-slate-900/90 text-amber-300 hover:bg-amber-600 hover:text-white text-xs font-medium border border-slate-700 transition-all shadow"
                    >
                      <Upload className="w-3 h-3" />
                      <span>{stage.imageUrl ? 'Change Picture' : 'Upload Picture'}</span>
                    </button>
                  )}
                </div>

                <div className="mt-3 text-xs text-slate-500 flex items-center justify-between px-1">
                  <span>Phase {idx + 1} of {stages.length}</span>
                  <span className="text-amber-400/80 font-mono">Documented</span>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
