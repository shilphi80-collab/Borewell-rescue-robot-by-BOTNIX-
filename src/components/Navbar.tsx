import React from 'react';
import { 
  Bot, 
  Cpu, 
  Wrench, 
  Image as ImageIcon, 
  FileText, 
  Sparkles, 
  Upload, 
  Printer, 
  Download, 
  Eye, 
  Edit3,
  Award,
  Layers,
  QrCode
} from 'lucide-react';
import { ProjectData } from '../types';
import { exportProjectToFile } from '../utils/storage';

export type NavTab = 'overview' | 'slots' | 'how-it-works' | 'how-it-was-made' | 'gallery' | 'report' | 'prompts';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isEditMode: boolean;
  setIsEditMode: (val: boolean) => void;
  onOpenUploadModal: () => void;
  onOpenQRCodeModal: () => void;
  projectData: ProjectData;
  onImportClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isEditMode,
  setIsEditMode,
  onOpenUploadModal,
  onOpenQRCodeModal,
  projectData,
  onImportClick,
}) => {
  const logoSlot = projectData.slots.find((s) => s.category === 'logo' && s.url) || projectData.photos.find((p) => p.category === 'logo');

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/90 border-b border-slate-800 text-slate-100 transition-all no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          
          {/* Brand & Team Logo */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex-shrink-0">
              {logoSlot?.url ? (
                <img
                  src={logoSlot.url}
                  alt="BOTNIX"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl border border-orange-500/40 object-cover shadow-lg"
                />
              ) : (
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white font-bold">
                  <Bot className="w-6 h-6" />
                </div>
              )}
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-white truncate">
                  {projectData.name}
                </h1>
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30 whitespace-nowrap">
                  <Award className="w-3 h-3 text-orange-400" />
                  Malaysia 2026
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate hidden sm:block">
                {projectData.team.originCountry} • {projectData.team.competitionRound}
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Mode Switch (Showcase vs Editor) */}
            <div className="flex items-center bg-slate-900 border border-slate-800 p-0.5 rounded-lg">
              <button
                id="btn-showcase-mode"
                onClick={() => setIsEditMode(false)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  !isEditMode
                    ? 'bg-orange-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Showcase Mode for Judges & Spectators"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Showcase</span>
              </button>
              <button
                id="btn-editor-mode"
                onClick={() => setIsEditMode(true)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isEditMode
                    ? 'bg-amber-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Edit content, upload photos, and update details"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Edit Mode</span>
              </button>
            </div>

            {/* Picture Slots Shortcut */}
            <button
              id="btn-nav-slots"
              onClick={() => setActiveTab('slots')}
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-orange-600/20 text-orange-300 border border-orange-500/30 hover:bg-orange-600/30 active:scale-95 transition-all"
              title="Upload pictures to designated slots"
            >
              <Layers className="w-3.5 h-3.5 text-orange-400" />
              <span>Picture Slots</span>
            </button>

            {/* QR Code Instant Scan */}
            <button
              id="btn-nav-qr-code"
              onClick={onOpenQRCodeModal}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/25 active:scale-95 transition-all shadow-sm"
              title="Scan QR Code to directly open app on smartphone"
            >
              <QrCode className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Scan QR</span>
              <span className="sm:hidden">QR</span>
            </button>

            {/* Print / Export Report */}
            <button
              id="btn-print-report"
              onClick={() => {
                setActiveTab('report');
                setTimeout(() => window.print(), 350);
              }}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 active:scale-95 transition-all"
              title="Print formatted technical report or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PDF / Print</span>
            </button>

            {/* Backup Project JSON */}
            <button
              id="btn-export-backup"
              onClick={() => exportProjectToFile(projectData)}
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 active:scale-95 transition-all"
              title="Export complete backup JSON file (including photos)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Backup</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto scrollbar-none py-2 border-t border-slate-900/80">
          {[
            { id: 'overview', label: 'Overall Condition', icon: Bot },
            { id: 'slots', label: 'Picture Slots', icon: Layers, highlight: true },
            { id: 'how-it-works', label: 'How It Works (Claws & Motors)', icon: Cpu },
            { id: 'how-it-was-made', label: 'How It Was Made', icon: Wrench },
            { id: 'gallery', label: 'Media Gallery', icon: ImageIcon },
            { id: 'report', label: 'Written Report', icon: FileText },
            { id: 'prompts', label: 'AI & Pitch Prompts', icon: Sparkles },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id as NavTab)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-800 text-orange-400 border border-orange-500/30 shadow-sm'
                    : item.highlight
                    ? 'text-orange-300/80 hover:text-orange-200 hover:bg-orange-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : item.highlight ? 'text-orange-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
