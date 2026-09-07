import React, { useRef, useState } from 'react';
import { 
  PictureSlot, 
  ProjectData 
} from '../types';
import { 
  Upload, 
  Image as ImageIcon, 
  Check, 
  Trash2, 
  Maximize2, 
  Edit2, 
  Plus, 
  Layers, 
  Info,
  ShieldCheck,
  Cpu,
  Anchor,
  Zap,
  Camera,
  Bot,
  Network
} from 'lucide-react';
import { readImageFileAsDataUrl } from '../utils/storage';

interface PictureSlotsViewProps {
  slots: PictureSlot[];
  isEditMode: boolean;
  onUpdateSlot: (updatedSlot: PictureSlot) => void;
  onAddCustomSlot: (newSlot: PictureSlot) => void;
  onDeleteSlot: (slotId: string) => void;
  onSelectPhotoForLightbox: (url: string, title: string) => void;
}

export const PictureSlotsView: React.FC<PictureSlotsViewProps> = ({
  slots,
  isEditMode,
  onUpdateSlot,
  onAddCustomSlot,
  onDeleteSlot,
  onSelectPhotoForLightbox,
}) => {
  const [activeEditingSlotId, setActiveEditingSlotId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState<string>('');
  const [editTitle, setEditTitle] = useState<string>('');
  const [editDesc, setEditDesc] = useState<string>('');
  const [isAddingNewSlot, setIsAddingNewSlot] = useState(false);
  const [newSlotTitle, setNewSlotTitle] = useState('');
  const [newSlotDesc, setNewSlotDesc] = useState('');

  // Individual file input refs
  const fileInputsRef = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleFileUpload = async (slot: PictureSlot, file: File) => {
    try {
      const dataUrl = await readImageFileAsDataUrl(file);
      const updated: PictureSlot = {
        ...slot,
        url: dataUrl,
        dateUpdated: new Date().toISOString().slice(0, 10),
      };
      onUpdateSlot(updated);
    } catch (err) {
      console.error('Error uploading slot image:', err);
    }
  };

  const handleRemoveImage = (slot: PictureSlot) => {
    const updated: PictureSlot = {
      ...slot,
      url: undefined,
      dateUpdated: new Date().toISOString().slice(0, 10),
    };
    onUpdateSlot(updated);
  };

  const handleSaveTextEdits = (slot: PictureSlot) => {
    const updated: PictureSlot = {
      ...slot,
      title: editTitle.trim() || slot.title,
      shortDescription: editDesc.trim() || slot.shortDescription,
      caption: editCaption.trim(),
      dateUpdated: new Date().toISOString().slice(0, 10),
    };
    onUpdateSlot(updated);
    setActiveEditingSlotId(null);
  };

  const handleCreateCustomSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlotTitle.trim()) return;

    const newSlot: PictureSlot = {
      id: 'slot-custom-' + Date.now(),
      title: newSlotTitle.trim(),
      shortDescription: newSlotDesc.trim() || 'Custom designated project slot.',
      category: 'custom',
      dateUpdated: new Date().toISOString().slice(0, 10),
    };

    onAddCustomSlot(newSlot);
    setNewSlotTitle('');
    setNewSlotDesc('');
    setIsAddingNewSlot(false);
  };

  const getSlotIcon = (category: string) => {
    switch (category) {
      case 'logo': return Bot;
      case 'robot-unit': return Bot;
      case 'ground-unit': return Cpu;
      case 'claw': return ShieldCheck;
      case 'base-support': return Anchor;
      case 'electronics': return Cpu;
      case 'battery': return Zap;
      case 'communication': return Network;
      default: return ImageIcon;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header & Instructions */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm relative overflow-hidden shadow-xl">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-300 text-xs font-semibold">
              <Layers className="w-3.5 h-3.5" />
              <span>Project Picture Slots Management</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Designated Picture Slots for Robot & Ground Units
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Upload your photos into these specific slots. Each slot is mapped directly into your 
              <strong> Robot Showcase</strong>, <strong>Technical Report</strong>, and <strong>Competition Presentation</strong>. 
              You can replace pictures anytime, view them full screen, or create additional custom slots.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddingNewSlot(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shadow-md active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Slot</span>
            </button>
          </div>
        </div>

        {/* Quick Guide Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80 text-xs">
          <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl">
            <span className="text-slate-400 block text-[11px]">Primary Robot Unit</span>
            <span className="font-semibold text-orange-400">In-Borewell Mechanism</span>
          </div>
          <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl">
            <span className="text-slate-400 block text-[11px]">Ground Unit Console</span>
            <span className="font-semibold text-cyan-400">Relay Status & Motor Display</span>
          </div>
          <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl">
            <span className="text-slate-400 block text-[11px]">Main Chest Claw</span>
            <span className="font-semibold text-emerald-400">1 DC Motor + 2 Relays</span>
          </div>
          <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl">
            <span className="text-slate-400 block text-[11px]">Foldable Base Support</span>
            <span className="font-semibold text-purple-400">2 DC Motors (Under Legs)</span>
          </div>
        </div>
      </div>

      {/* Add Custom Slot Modal/Form */}
      {isAddingNewSlot && (
        <form onSubmit={handleCreateCustomSlot} className="bg-slate-900 border border-orange-500/40 rounded-2xl p-6 space-y-4 shadow-xl animate-scaleUp">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-orange-400" />
              Create New Picture Slot
            </h3>
            <button
              type="button"
              onClick={() => setIsAddingNewSlot(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Slot Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Field Testing at Borewell Site"
                value={newSlotTitle}
                onChange={(e) => setNewSlotTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Short Purpose / Description
              </label>
              <input
                type="text"
                placeholder="e.g. Photo showing the robot entering 8-inch pipe casing"
                value={newSlotDesc}
                onChange={(e) => setNewSlotDesc(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddingNewSlot(false)}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shadow"
            >
              Create Slot
            </button>
          </div>
        </form>
      )}

      {/* Picture Slots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slots.map((slot, index) => {
          const Icon = getSlotIcon(slot.category);
          const hasImage = Boolean(slot.url);
          const isEditing = activeEditingSlotId === slot.id;

          return (
            <div
              key={slot.id}
              className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col justify-between"
            >
              {/* Slot Header */}
              <div className="p-5 border-b border-slate-800/80 bg-slate-950/40">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          Slot #{index + 1}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-white">
                          {slot.title}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {slot.shortDescription}
                      </p>
                    </div>
                  </div>

                  {slot.category === 'custom' && (
                    <button
                      onClick={() => onDeleteSlot(slot.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete custom slot"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Slot Image Preview or Empty State */}
              <div className="p-5 flex-1 flex flex-col justify-center">
                {hasImage ? (
                  <div className="space-y-3">
                    <div className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video flex items-center justify-center shadow-inner">
                      <img
                        src={slot.url}
                        alt={slot.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                        <button
                          onClick={() => onSelectPhotoForLightbox(slot.url!, slot.title)}
                          className="p-2 rounded-xl bg-slate-900/90 text-white hover:bg-orange-600 transition-colors shadow-lg"
                          title="View Fullscreen"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => fileInputsRef.current[slot.id]?.click()}
                          className="p-2 rounded-xl bg-slate-900/90 text-white hover:bg-orange-600 transition-colors shadow-lg"
                          title="Replace Photo"
                        >
                          <Upload className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRemoveImage(slot)}
                          className="p-2 rounded-xl bg-slate-900/90 text-rose-400 hover:bg-rose-600 hover:text-white transition-colors shadow-lg"
                          title="Remove Image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Caption / Details */}
                    {slot.caption && (
                      <p className="text-xs text-slate-300 italic bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
                        "{slot.caption}"
                      </p>
                    )}
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputsRef.current[slot.id]?.click()}
                    className="border-2 border-dashed border-slate-700 hover:border-orange-500/60 bg-slate-950/50 hover:bg-slate-950 rounded-xl p-8 text-center cursor-pointer transition-all aspect-video flex flex-col items-center justify-center gap-3 group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 group-hover:border-orange-500/40 flex items-center justify-center text-slate-400 group-hover:text-orange-400 transition-colors">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-200 group-hover:text-orange-300">
                        Upload {slot.title}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Click to browse or drag & drop (JPG, PNG, WebP)
                      </p>
                    </div>
                  </div>
                )}

                {/* Hidden file input for this slot */}
                <input
                  ref={(el) => (fileInputsRef.current[slot.id] = el)}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(slot, e.target.files[0]);
                    }
                  }}
                />
              </div>

              {/* Slot Actions & Edit Form */}
              <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 space-y-3">
                {isEditing ? (
                  <div className="space-y-3 animate-fadeIn">
                    <input
                      type="text"
                      placeholder="Slot Title"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="Short Description"
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="Photo Caption / Technical Note"
                      value={editCaption}
                      onChange={(e) => setEditCaption(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setActiveEditingSlotId(null)}
                        className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveTextEdits(slot)}
                        className="px-3 py-1 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold"
                      >
                        Save Details
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => fileInputsRef.current[slot.id]?.click()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-all"
                    >
                      <Upload className="w-3.5 h-3.5 text-orange-400" />
                      <span>{hasImage ? 'Change Picture' : 'Upload Picture'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setActiveEditingSlotId(slot.id);
                          setEditTitle(slot.title);
                          setEditDesc(slot.shortDescription);
                          setEditCaption(slot.caption || '');
                        }}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                        title="Edit slot details or caption"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {hasImage && (
                        <button
                          onClick={() => onSelectPhotoForLightbox(slot.url!, slot.title)}
                          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                          title="Fullscreen"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
