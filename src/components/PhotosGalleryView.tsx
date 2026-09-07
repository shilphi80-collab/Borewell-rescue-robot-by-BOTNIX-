import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Upload, 
  Star, 
  Trash2, 
  Maximize2, 
  Filter, 
  Plus, 
  Check, 
  Calendar,
  Tag
} from 'lucide-react';
import { ProjectPhoto } from '../types';

interface PhotosGalleryViewProps {
  photos: ProjectPhoto[];
  isEditMode: boolean;
  onOpenUploadModal: () => void;
  onSetPrimaryPhoto: (photoId: string) => void;
  onDeletePhoto: (photoId: string) => void;
  onSelectPhotoForLightbox: (url: string, title: string) => void;
}

export const PhotosGalleryView: React.FC<PhotosGalleryViewProps> = ({
  photos,
  isEditMode,
  onOpenUploadModal,
  onSetPrimaryPhoto,
  onDeletePhoto,
  onSelectPhotoForLightbox,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Media' },
    { id: 'chassis', label: 'Chassis & Frame' },
    { id: 'electronics', label: 'Electronics & PCB' },
    { id: 'gripper', label: 'Gripper & Harness' },
    { id: 'sensors', label: 'Sensors & Vision' },
    { id: 'testing', label: 'Field Testing' },
    { id: 'exhibition', label: 'Malaysia Exhibition' },
  ];

  const filteredPhotos = activeCategory === 'all'
    ? photos
    : photos.filter((p) => p.category === activeCategory);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header & Upload Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
              MEDIA GALLERY
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Project Pictures & Documentation
            </h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Visual archive of prototype development, circuit integration, testing tower trials, and competition exhibits.
          </p>
        </div>

        <button
          id="btn-upload-new-picture"
          onClick={onOpenUploadModal}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
        >
          <Upload className="w-4 h-4" />
          <span>Upload New Picture</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        <Filter className="w-4 h-4 text-slate-500 flex-shrink-0 mr-1" />
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            className="group bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between transition-all"
          >
            {/* Image Container */}
            <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Badges / Primary indicator */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                {photo.isPrimary && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-slate-950 shadow-md">
                    <Star className="w-3 h-3 fill-current" />
                    Primary Hero
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-slate-900/80 text-cyan-300 border border-slate-700 backdrop-blur-sm">
                  <Tag className="w-2.5 h-2.5" />
                  {photo.category}
                </span>
              </div>

              {/* Action Overlay */}
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  onClick={() => onSelectPhotoForLightbox(photo.url, photo.title)}
                  className="p-3 rounded-full bg-slate-900/90 hover:bg-cyan-600 text-white shadow-xl transition-all scale-95 hover:scale-105"
                  title="View Fullscreen"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Description Card */}
            <div className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-bold text-white line-clamp-1">
                  {photo.title}
                </h3>
                <span className="text-[11px] text-slate-500 flex items-center gap-1 flex-shrink-0">
                  <Calendar className="w-3 h-3" />
                  {photo.dateAdded}
                </span>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {photo.caption}
              </p>

              {/* Controls */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                {!photo.isPrimary ? (
                  <button
                    onClick={() => onSetPrimaryPhoto(photo.id)}
                    className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1 font-medium transition-colors"
                  >
                    <Star className="w-3.5 h-3.5" />
                    <span>Set as Primary</span>
                  </button>
                ) : (
                  <span className="text-xs text-amber-400/90 font-medium flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Main Cover Photo</span>
                  </span>
                )}

                {isEditMode && (
                  <button
                    onClick={() => onDeletePhoto(photo.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    title="Delete Photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

          </div>
        ))}
      </div>

      {filteredPhotos.length === 0 && (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
          <ImageIcon className="w-12 h-12 mx-auto text-slate-600 mb-2" />
          <h3 className="text-base font-semibold text-slate-300">No Pictures In This Category</h3>
          <p className="text-xs text-slate-500 mt-1">Upload a photo to populate this section!</p>
          <button
            onClick={onOpenUploadModal}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo Now</span>
          </button>
        </div>
      )}
    </div>
  );
};
