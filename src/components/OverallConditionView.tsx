import React, { useState } from 'react';
import { 
  Activity, 
  ShieldCheck, 
  Maximize2, 
  MapPin, 
  Radio, 
  Cpu, 
  Wind, 
  Thermometer, 
  Zap, 
  Sliders, 
  ChevronRight, 
  Edit2, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle,
  Anchor,
  Layers,
  Network,
  QrCode
} from 'lucide-react';
import { ProjectData, SubsystemHealth } from '../types';

interface OverallConditionViewProps {
  projectData: ProjectData;
  isEditMode: boolean;
  onEditCondition: () => void;
  onOpenUploadModal: () => void;
  onOpenQRCodeModal?: () => void;
  onSelectPhotoForLightbox: (photoUrl: string, title: string) => void;
  onNavigateToTab: (tab: any) => void;
}

export const OverallConditionView: React.FC<OverallConditionViewProps> = ({
  projectData,
  isEditMode,
  onEditCondition,
  onOpenUploadModal,
  onOpenQRCodeModal,
  onSelectPhotoForLightbox,
  onNavigateToTab,
}) => {
  const { overallCondition, team, photos, units, slots } = projectData;
  
  // Find logo and primary photos from slots or photos array
  const logoSlot = slots.find((s) => s.category === 'logo' && s.url) || photos.find((p) => p.category === 'logo');
  const robotUnitSlot = slots.find((s) => s.category === 'robot-unit' && s.url) || photos.find((p) => p.category === 'robot-unit') || photos[0];
  const groundUnitSlot = slots.find((s) => s.category === 'ground-unit' && s.url) || photos.find((p) => p.category === 'ground-unit');

  // Interactive shaft simulation depth
  const [simulatedDepth, setSimulatedDepth] = useState<number>(18);

  // Ground Unit Live Motor Interactive Test States
  const [m1State, setM1State] = useState<'STOP' | 'FWD' | 'BWD'>('FWD'); // Claw
  const [m2State, setM2State] = useState<'STOP' | 'FWD' | 'BWD'>('STOP'); // Base Support A
  const [m3State, setM3State] = useState<'STOP' | 'FWD' | 'BWD'>('STOP'); // Base Support B
  const [m4State, setM4State] = useState<'STOP' | 'FWD' | 'BWD'>('STOP'); // Auxiliary

  // Computed environmental properties based on depth
  const simTemp = (28 - (simulatedDepth * 0.18)).toFixed(1);
  const simO2 = simulatedDepth > 15 ? (20.9 - ((simulatedDepth - 15) * 0.18)).toFixed(1) : '20.9';
  const simPressure = (101.3 + (simulatedDepth * 0.12)).toFixed(1);
  const simTetherTension = (overallCondition.totalWeightKg + (simulatedDepth * 0.08)).toFixed(2);
  const rs485Latency = (1.2 + (simulatedDepth * 0.015)).toFixed(2);

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Hero Banner & Project Identity */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-12 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Text & Meta Column */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                {overallCondition.readinessStatus}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <MapPin className="w-3 h-3 text-emerald-400" />
                {team.originCountry} ➔ {team.competitionRound}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs text-slate-300 bg-slate-950 border border-slate-800 font-mono">
                {projectData.motto}
              </span>
            </div>

            {/* Title & Subtitle */}
            <div>
              <div className="flex items-center gap-3">
                {logoSlot?.url && (
                  <img
                    src={logoSlot.url}
                    alt="BOTNIX Crest"
                    onClick={() => onSelectPhotoForLightbox(logoSlot.url!, "BOTNIX Team Crest")}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 border-orange-500/40 object-cover shadow-lg cursor-pointer hover:scale-105 transition-transform flex-shrink-0"
                    title="Official Team Crest - Click to view"
                  />
                )}
                <div>
                  <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                    {projectData.name}
                  </h2>
                  <p className="text-xs sm:text-sm font-medium text-orange-400 font-mono mt-0.5">
                    Microcontroller: {overallCondition.microcontroller} • Code: {overallCondition.firmwareLanguage}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-sm text-slate-300 max-w-2xl leading-relaxed">
                {projectData.subtitle}
              </p>
            </div>

            {/* Quick Summary Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Max Depth</span>
                <span className="text-xl font-bold text-orange-400">{overallCondition.depthRatingMeters}m</span>
                <span className="text-[10px] text-slate-500 block">Shaft reach</span>
              </div>
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Long-Distance Comm</span>
                <span className="text-base font-bold text-cyan-400 block">RS-485 / Cat5e</span>
                <span className="text-[10px] text-slate-500 block">Ethernet Cable Tether</span>
              </div>
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Motors & Relays</span>
                <span className="text-base font-bold text-emerald-400 block">4 Motors / 8 Relays</span>
                <span className="text-[10px] text-slate-500 block">Dual-unit H-Bridge</span>
              </div>
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Battery Backup</span>
                <span className="text-xl font-bold text-amber-400">{overallCondition.batteryBackupMinutes} min</span>
                <span className="text-[10px] text-slate-500 block">12V 8Ah battery</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigateToTab('slots')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-orange-500/25 active:scale-95 transition-all"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload to Picture Slots</span>
              </button>
              <button
                onClick={() => onNavigateToTab('how-it-works')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-medium border border-slate-700 active:scale-95 transition-all"
              >
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>How Claws & RS-485 Work</span>
              </button>
              <button
                onClick={() => onNavigateToTab('report')}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 active:scale-95 transition-all"
              >
                <span>Technical Report</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              {onOpenQRCodeModal && (
                <button
                  id="btn-hero-qr-code"
                  onClick={onOpenQRCodeModal}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 text-xs sm:text-sm font-semibold border border-cyan-500/30 active:scale-95 transition-all shadow-sm"
                  title="Scan QR Code to directly open app on mobile"
                >
                  <QrCode className="w-4 h-4 text-cyan-400" />
                  <span>Scan QR Code</span>
                </button>
              )}
            </div>
          </div>

          {/* Primary Photo & Lightbox Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="group relative rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-950 shadow-2xl aspect-[4/3] sm:aspect-[16/11]">
              {robotUnitSlot?.url ? (
                <img
                  src={robotUnitSlot.url}
                  alt={robotUnitSlot.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div 
                  onClick={() => onNavigateToTab('slots')}
                  className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 p-6 text-center cursor-pointer hover:bg-slate-800 transition-colors"
                >
                  <UploadCloud className="w-12 h-12 mb-2 text-orange-400" />
                  <p className="text-sm font-semibold text-white">Upload Robot Unit Picture</p>
                  <p className="text-xs text-slate-500 mt-1">Click here to open picture slots</p>
                </div>
              )}

              {/* Photo Overlay Tag */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/20 to-transparent flex flex-col justify-end p-4">
                <div className="flex items-end justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-950/80 px-2 py-0.5 rounded border border-orange-500/30">
                      Robot Unit Slot Preview
                    </span>
                    <h4 className="text-sm font-semibold text-white mt-1 line-clamp-1">
                      {robotUnitSlot?.title || 'BOTNIX Borewell Robot Unit'}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    {robotUnitSlot?.url && (
                      <button
                        onClick={() => onSelectPhotoForLightbox(robotUnitSlot.url!, robotUnitSlot.title)}
                        className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 backdrop-blur-sm transition-all"
                        title="Expand Fullscreen"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onNavigateToTab('slots')}
                      className="p-2 rounded-lg bg-orange-600/90 hover:bg-orange-500 text-white shadow-md backdrop-blur-sm transition-all text-xs flex items-center gap-1 font-medium"
                      title="Manage Picture Slots"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Slots</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Slot Status */}
            <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400 px-1">
              <span>{slots.filter((s) => s.url).length} of {slots.length} picture slots filled</span>
              <button
                onClick={() => onNavigateToTab('slots')}
                className="text-orange-400 hover:text-orange-300 flex items-center gap-1 font-medium"
              >
                <span>View All Picture Slots</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* RS-485 LONG DISTANCE UMBILICAL LINK HIGHLIGHT BAR */}
      <section className="bg-gradient-to-r from-cyan-950/80 via-slate-900/90 to-cyan-950/80 border border-cyan-500/30 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center flex-shrink-0">
              <Network className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase bg-cyan-900/80 text-cyan-300 px-2 py-0.5 rounded border border-cyan-700">
                  LONG-DISTANCE COMMUNICATION ARCHITECTURE
                </span>
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  RS-485 ACTIVE
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-white mt-1">
                Industrial RS-485 Serial Protocol over 8-Core Ethernet Cable (Cat5e / Cat6)
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Overcomes deep underground distances (up to 40m–50m+) using differential balanced signaling (A/B lines) across twisted pairs, completely eliminating motor electrical noise.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0 self-start md:self-center">
            <div className="bg-slate-950 border border-cyan-800/80 px-3 py-1.5 rounded-lg text-left font-mono text-[11px]">
              <span className="text-slate-500 block text-[9px] uppercase">Tether Medium</span>
              <span className="text-cyan-300 font-bold">Cat5e Twisted Pair</span>
            </div>
            <div className="bg-slate-950 border border-cyan-800/80 px-3 py-1.5 rounded-lg text-left font-mono text-[11px]">
              <span className="text-slate-500 block text-[9px] uppercase">Bus Hardware</span>
              <span className="text-emerald-400 font-bold">MAX485 Modules</span>
            </div>
            <button
              onClick={() => onNavigateToTab('slots')}
              className="px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md active:scale-95 transition-all"
            >
              Upload Cable Pic
            </button>
          </div>
        </div>
      </section>

      {/* TWO-UNIT SYSTEM ARCHITECTURE & GROUND CONTROL DISPLAY SIMULATOR */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-[11px] font-mono font-bold mb-1">
              SYSTEM ARCHITECTURE
            </div>
            <h3 className="text-xl font-bold text-white">
              The Dual-Unit System: Robot Unit & Surface Ground Unit
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Clear physical separation between downhole rescue mechanism and surface operator console, linked via RS-485 Ethernet tether.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Unit 1: Robot Unit Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-orange-400 tracking-wider">Unit 01 (Downhole)</span>
                  <h4 className="text-base sm:text-lg font-bold text-white">
                    {units.robotUnit.title}
                  </h4>
                </div>
              </div>
              <button
                onClick={() => onNavigateToTab('slots')}
                className="text-xs text-orange-400 hover:text-orange-300 font-medium"
              >
                Slot Photo ➔
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {units.robotUnit.description}
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="bg-slate-950/70 border border-slate-800/80 p-3 rounded-xl space-y-1">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                  <span>Main Chest Grab Claw</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  {units.robotUnit.mainClaw}
                </p>
              </div>

              <div className="bg-slate-950/70 border border-slate-800/80 p-3 rounded-xl space-y-1">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Anchor className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Extra Foldable Base Leg Support</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  {units.robotUnit.foldableSupport}
                </p>
              </div>

              <div className="bg-slate-950/70 border border-cyan-900/60 p-3 rounded-xl space-y-1">
                <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Downhole RS-485 Transceiver Node</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  {units.robotUnit.communicationNode || 'MAX485 receiver receiving command packets from Ethernet cable.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-950/50 border border-slate-800 p-2 rounded-lg">
                  <span className="text-slate-500 block">Vision</span>
                  <span className="text-slate-200 font-medium">Illuminated Camera</span>
                </div>
                <div className="bg-slate-950/50 border border-slate-800 p-2 rounded-lg">
                  <span className="text-slate-500 block">Audio Link</span>
                  <span className="text-slate-200 font-medium">1-Way Voice Speaker</span>
                </div>
              </div>
            </div>
          </div>

          {/* Unit 2: Ground Unit & Real-Time Motor Display Simulator */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-cyan-400 tracking-wider">Unit 02 (Surface)</span>
                  <h4 className="text-base sm:text-lg font-bold text-white">
                    {units.groundUnit.title}
                  </h4>
                </div>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                12V 8Ah Battery
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {units.groundUnit.description}
            </p>

            {/* REAL-TIME GROUND DISPLAY (Interactive Mockup of the user's ground screen!) */}
            <div className="bg-slate-950 border-2 border-cyan-500/40 rounded-xl p-4 space-y-3 font-mono">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-cyan-300 tracking-wider">
                    GROUND UNIT LIVE DISPLAY
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-1.5 py-0.5 rounded">
                    RS-485: LINKED (Cat5e)
                  </span>
                  <span className="text-[10px] text-slate-400">MEGA C++</span>
                </div>
              </div>

              {/* Live Motor Matrix Status */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                
                {/* Motor 1: Claw */}
                <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-lg space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[10px]">MOTOR 1: MAIN CLAW</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      m1State === 'FWD' ? 'bg-emerald-500/20 text-emerald-400' :
                      m1State === 'BWD' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {m1State === 'FWD' ? 'FWD [GRIP]' : m1State === 'BWD' ? 'BWD [OPEN]' : 'STOPPED'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px]">
                    <span className="text-slate-500">Relay:</span>
                    <span className="text-cyan-400">{m1State === 'FWD' ? 'R1: ON | R2: OFF' : m1State === 'BWD' ? 'R1: OFF | R2: ON' : 'R1: OFF | R2: OFF'}</span>
                  </div>
                </div>

                {/* Motor 2: Foldable Support A */}
                <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-lg space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[10px]">MOTOR 2: BASE ARM A</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      m2State === 'FWD' ? 'bg-emerald-500/20 text-emerald-400' :
                      m2State === 'BWD' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {m2State === 'FWD' ? 'FWD [OPEN]' : m2State === 'BWD' ? 'BWD [FOLD]' : 'STOPPED'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px]">
                    <span className="text-slate-500">Relay:</span>
                    <span className="text-cyan-400">{m2State === 'FWD' ? 'R3: ON | R4: OFF' : m2State === 'BWD' ? 'R3: OFF | R4: ON' : 'R3: OFF | R4: OFF'}</span>
                  </div>
                </div>

                {/* Motor 3: Foldable Support B */}
                <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-lg space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[10px]">MOTOR 3: BASE ARM B</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      m3State === 'FWD' ? 'bg-emerald-500/20 text-emerald-400' :
                      m3State === 'BWD' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {m3State === 'FWD' ? 'FWD [OPEN]' : m3State === 'BWD' ? 'BWD [FOLD]' : 'STOPPED'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px]">
                    <span className="text-slate-500">Relay:</span>
                    <span className="text-cyan-400">{m3State === 'FWD' ? 'R5: ON | R6: OFF' : m3State === 'BWD' ? 'R5: OFF | R6: ON' : 'R3: OFF | R4: OFF'}</span>
                  </div>
                </div>

                {/* Motor 4: Auxiliary */}
                <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-lg space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[10px]">MOTOR 4: AUX DRIVE</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      m4State === 'FWD' ? 'bg-emerald-500/20 text-emerald-400' :
                      m4State === 'BWD' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {m4State === 'FWD' ? 'FWD' : m4State === 'BWD' ? 'BWD' : 'STOPPED'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px]">
                    <span className="text-slate-500">Relay:</span>
                    <span className="text-cyan-400">{m4State === 'FWD' ? 'R7: ON | R8: OFF' : m4State === 'BWD' ? 'R7: OFF | R8: ON' : 'R7: OFF | R8: OFF'}</span>
                  </div>
                </div>

              </div>

              {/* Interactive Test Controls on Ground Unit */}
              <div className="border-t border-slate-800 pt-2 flex items-center justify-between gap-2 text-[11px]">
                <span className="text-slate-400">Simulate Ground Switches:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setM1State(m1State === 'FWD' ? 'BWD' : m1State === 'BWD' ? 'STOP' : 'FWD');
                    }}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 active:scale-95"
                  >
                    Toggle M1 (Claw)
                  </button>
                  <button
                    onClick={() => {
                      const next = m2State === 'STOP' ? 'FWD' : m2State === 'FWD' ? 'BWD' : 'STOP';
                      setM2State(next);
                      setM3State(next);
                    }}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 active:scale-95"
                  >
                    Toggle M2&3 (Base)
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Subsystem Health & Readiness Matrix */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-400" />
              <span>Overall Subsystem Condition Diagnostics</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Live operational readiness matrix evaluated for the Malaysia International Round.
            </p>
          </div>
          {isEditMode && (
            <button
              onClick={onEditCondition}
              className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700"
            >
              <Edit2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Modify Subsystems</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {overallCondition.subsystems.map((sub: SubsystemHealth) => {
            const isOptimal = sub.healthPercentage >= 90;
            return (
              <div
                key={sub.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all hover:shadow-lg hover:shadow-slate-950/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-sm font-bold text-slate-100 flex-1 leading-snug">
                      {sub.name}
                    </h4>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 ${
                        sub.status === 'Operational'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : sub.status === 'Calibrated'
                          ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                          : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                    {sub.detail}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-slate-500 font-medium">Diagnostic Health</span>
                    <span className={`font-mono font-semibold ${isOptimal ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {sub.healthPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        isOptimal ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${sub.healthPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Shaft Depth & Telemetry Simulation (Judges Demonstration) */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-orange-950 text-orange-400 border border-orange-800">
                JUDGES VERTICAL SHAFT SIMULATOR
              </span>
              <h3 className="text-lg font-bold text-white">
                Borewell Descent & RS-485 Telemetry Simulation
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Simulate long-distance communication and telemetry over the Cat5e Ethernet umbilical tether as the robot descends.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl">
            <span className="text-xs text-slate-400">Simulated Depth:</span>
            <span className="text-xl font-bold font-mono text-orange-400">{simulatedDepth} m</span>
            <span className="text-[11px] text-slate-500 font-mono">({(simulatedDepth * 3.28084).toFixed(1)} ft)</span>
          </div>
        </div>

        {/* Depth Slider */}
        <div className="space-y-2 bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl">
          <div className="flex justify-between text-xs text-slate-400 font-mono">
            <span>0m (Surface Ground Unit)</span>
            <span className="text-cyan-400 font-semibold">{simulatedDepth}m Long Distance in Ground</span>
            <span>{overallCondition.depthRatingMeters}m (Max Reach)</span>
          </div>
          <input
            id="depth-slider"
            type="range"
            min="0"
            max={overallCondition.depthRatingMeters}
            value={simulatedDepth}
            onChange={(e) => setSimulatedDepth(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
        </div>

        {/* Live Simulated Telemetry Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Network className="w-3.5 h-3.5 text-cyan-400" />
              <span>RS-485 Latency</span>
            </div>
            <div className="text-lg font-bold font-mono text-emerald-400">{rs485Latency} ms</div>
            <div className="text-[10px] text-slate-500">Differential pair response</div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              <span>Oxygen Level (O₂)</span>
            </div>
            <div className={`text-lg font-bold font-mono ${Number(simO2) < 18 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {simO2} %
            </div>
            <div className="text-[10px] text-slate-500">
              {Number(simO2) < 18 ? '⚠️ Hypoxic - Oxygen Line Active' : 'Normal Atmosphere'}
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Thermometer className="w-3.5 h-3.5 text-rose-400" />
              <span>Shaft Temp</span>
            </div>
            <div className="text-lg font-bold font-mono text-white">{simTemp} °C</div>
            <div className="text-[10px] text-slate-500">Subsurface gradient</div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ethernet Tether Load</span>
            </div>
            <div className="text-lg font-bold font-mono text-white">{simTetherTension} kg</div>
            <div className="text-[10px] text-slate-500">Hand / Pulley load</div>
          </div>
        </div>
      </section>

    </div>
  );
};
