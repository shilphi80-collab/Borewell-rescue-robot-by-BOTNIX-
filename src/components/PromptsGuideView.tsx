import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  BookOpen, 
  Award, 
  MessageSquare, 
  HelpCircle, 
  Terminal,
  FileCheck
} from 'lucide-react';
import { COMPETITION_PROMPTS, PromptTemplate } from '../utils/prompts';

export const PromptsGuideView: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredPrompts = activeCategory === 'all'
    ? COMPETITION_PROMPTS
    : COMPETITION_PROMPTS.filter((p) => p.category === activeCategory);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-purple-950 text-purple-400 border border-purple-800">
            AI PROMPTS & COMPETITION GUIDE
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Curated Prompts for Report, Pitch & Malaysia Defense
          </h2>
        </div>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          You asked for an app or prompt to describe how you made it, how it works, and prepare your written report. Use these ready-to-copy prompts with Gemini to refine your documentation and prepare for judges!
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        {[
          { id: 'all', label: 'All Prompts' },
          { id: 'report', label: 'Written Technical Report' },
          { id: 'pitch', label: '3-Minute Jury Pitch' },
          { id: 'functions', label: 'Subsystem Specs' },
          { id: 'poster', label: 'Booth Poster Layout' },
        ].map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Prompts Cards */}
      <div className="grid grid-cols-1 gap-6">
        {filteredPrompts.map((p) => (
          <div
            key={p.id}
            className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 shadow-xl space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-purple-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                  Target: {p.targetAudience}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {p.title}
                </h3>
              </div>

              <button
                onClick={() => handleCopy(p.id, p.promptText)}
                className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-500/20 active:scale-95 transition-all"
              >
                {copiedId === p.id ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === p.id ? 'Copied Prompt!' : 'Copy Prompt'}</span>
              </button>
            </div>

            {/* Prompt Code/Text Box */}
            <div className="relative rounded-xl bg-slate-950 p-4 border border-slate-800 font-mono text-xs sm:text-sm text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
              {p.promptText}
            </div>

            {/* Pro Tip */}
            <div className="flex items-start gap-2 text-xs text-slate-400 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
              <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-200">Pro Tip: </strong> {p.tips}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Judge Q&A Cheat Sheet */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          <span>Top Anticipated Questions from Judges at Malaysia International Round</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl space-y-1">
            <h4 className="font-semibold text-cyan-300">Q1: How do you guarantee the gripper won't injure a trapped child?</h4>
            <p className="text-slate-400 leading-relaxed">
              <strong>Answer:</strong> Explain the non-invasive pneumatic silicone cushion (Shore A 20 hardness). Unlike rigid metal claws, it distributes lifting force over 300+ cm² at a safe 12–18 kPa pressure, regulated by a mechanical relief valve.
            </p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl space-y-1">
            <h4 className="font-semibold text-cyan-300">Q2: Why use a tethered umbilical cable instead of wireless Wi-Fi?</h4>
            <p className="text-slate-400 leading-relaxed">
              <strong>Answer:</strong> Radio frequencies suffer extreme soil attenuation beyond 3-5 meters underground. The 50m composite umbilical delivers uninterrupted 24V power, RS-485 differential telemetry, HD video, and fresh oxygen simultaneously.
            </p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl space-y-1">
            <h4 className="font-semibold text-cyan-300">Q3: What if the borehole diameter narrows or has mud shelves?</h4>
            <p className="text-slate-400 leading-relaxed">
              <strong>Answer:</strong> The robot has 4 spring-damped scissor arms with polyurethane wheels that dynamically flex between 150mm and 350mm, keeping the robot centered while rolling smoothly over jagged rock contours.
            </p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl space-y-1">
            <h4 className="font-semibold text-cyan-300">Q4: What happens if surface power fails during ascent?</h4>
            <p className="text-slate-400 leading-relaxed">
              <strong>Answer:</strong> The robot automatically fails over to an onboard 14.8V 4S LiPo battery, while the surface winch features a mechanical ratchet lock to prevent back-slip, plus a manual rescue crank handle.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
