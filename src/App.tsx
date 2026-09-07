import React, { useState, useEffect, useRef } from 'react';
import { 
  ProjectData, 
  ProjectPhoto, 
  RobotFunction, 
  FabricationStage, 
  WrittenReport,
  PictureSlot 
} from './types';
import { 
  loadProjectData, 
  saveProjectData, 
  importProjectFromFile, 
  resetProjectToDefault,
  exportProjectToFile
} from './utils/storage';
import { Navbar, NavTab } from './components/Navbar';
import { OverallConditionView } from './components/OverallConditionView';
import { PictureSlotsView } from './components/PictureSlotsView';
import { HowItWorksView } from './components/HowItWorksView';
import { HowItWasMadeView } from './components/HowItWasMadeView';
import { PhotosGalleryView } from './components/PhotosGalleryView';
import { WrittenReportView } from './components/WrittenReportView';
import { PromptsGuideView } from './components/PromptsGuideView';
import { PhotoUploadModal } from './components/PhotoUploadModal';
import { EditConditionModal } from './components/EditConditionModal';
import { FunctionModal } from './components/FunctionModal';
import { FabricationStageModal } from './components/FabricationStageModal';
import { LightboxModal } from './components/LightboxModal';
import { QRCodeModal } from './components/QRCodeModal';
import { 
  CheckCircle2, 
  RotateCcw, 
  Upload, 
  Edit3,
  Layers
} from 'lucide-react';

export default function App() {
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isConditionModalOpen, setIsConditionModalOpen] = useState(false);
  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false);
  const [functionModal, setFunctionModal] = useState<{ isOpen: boolean; data: RobotFunction | null }>({
    isOpen: false,
    data: null,
  });
  const [fabricationModal, setFabricationModal] = useState<{ isOpen: boolean; data: FabricationStage | null }>({
    isOpen: false,
    data: null,
  });
  const [lightbox, setLightbox] = useState<{ isOpen: boolean; url: string | null; title: string | null }>({
    isOpen: false,
    url: null,
    title: null,
  });

  // Target entity for photo upload if opened from a specific item
  const [uploadTarget, setUploadTarget] = useState<{ type: 'general' | 'function' | 'stage'; id?: string }>({
    type: 'general',
  });

  const fileInputImportRef = useRef<HTMLInputElement>(null);

  // Load project on mount
  useEffect(() => {
    loadProjectData().then((data) => {
      setProjectData(data);
    });
  }, []);

  // Save changes helper with notification
  const updateAndSave = (newData: ProjectData, message?: string) => {
    setProjectData(newData);
    saveProjectData(newData);
    if (message) {
      setToastMessage(message);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  if (!projectData) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium">Loading BOTNIX Borewell Rescue Robot...</p>
        </div>
      </div>
    );
  }

  // Handle Photo Save (Gallery modal)
  const handleSavePhoto = (photoData: Omit<ProjectPhoto, 'id' | 'dateAdded'>) => {
    const newPhoto: ProjectPhoto = {
      ...photoData,
      id: 'photo-' + Date.now(),
      dateAdded: new Date().toISOString().slice(0, 10),
    };

    let updatedPhotos = [...projectData.photos];
    if (newPhoto.isPrimary) {
      updatedPhotos = updatedPhotos.map((p) => ({ ...p, isPrimary: false }));
    }
    updatedPhotos.unshift(newPhoto);

    let updatedFunctions = [...projectData.robotFunctions];
    let updatedStages = [...projectData.fabricationStages];

    // If upload was triggered from a specific function
    if (uploadTarget.type === 'function' && uploadTarget.id) {
      updatedFunctions = updatedFunctions.map((fn) =>
        fn.id === uploadTarget.id ? { ...fn, imageUrl: newPhoto.url } : fn
      );
    }

    // If upload was triggered from a specific fabrication stage
    if (uploadTarget.type === 'stage' && uploadTarget.id) {
      updatedStages = updatedStages.map((st) =>
        st.id === uploadTarget.id ? { ...st, imageUrl: newPhoto.url } : st
      );
    }

    updateAndSave(
      {
        ...projectData,
        photos: updatedPhotos,
        robotFunctions: updatedFunctions,
        fabricationStages: updatedStages,
      },
      'Picture successfully uploaded and saved!'
    );

    setUploadTarget({ type: 'general' });
  };

  // Picture Slots Handlers
  const handleUpdateSlot = (updatedSlot: PictureSlot) => {
    const updatedSlots = projectData.slots.map((s) => (s.id === updatedSlot.id ? updatedSlot : s));
    
    // Also synchronize into photos if image is provided
    let updatedPhotos = [...projectData.photos];
    if (updatedSlot.url) {
      const existingPhotoIdx = updatedPhotos.findIndex((p) => p.id === 'slot-photo-' + updatedSlot.id);
      const slotPhotoObj: ProjectPhoto = {
        id: 'slot-photo-' + updatedSlot.id,
        url: updatedSlot.url,
        title: updatedSlot.title,
        caption: updatedSlot.caption || updatedSlot.shortDescription,
        category: (updatedSlot.category as any) || 'exhibition',
        dateAdded: new Date().toISOString().slice(0, 10),
        isPrimary: updatedSlot.category === 'robot-unit' || updatedSlot.category === 'logo',
      };

      if (existingPhotoIdx >= 0) {
        updatedPhotos[existingPhotoIdx] = slotPhotoObj;
      } else {
        updatedPhotos.unshift(slotPhotoObj);
      }
    }

    updateAndSave(
      {
        ...projectData,
        slots: updatedSlots,
        photos: updatedPhotos,
      },
      `Slot "${updatedSlot.title}" updated!`
    );
  };

  const handleAddCustomSlot = (newSlot: PictureSlot) => {
    const updatedSlots = [...projectData.slots, newSlot];
    updateAndSave({ ...projectData, slots: updatedSlots }, `New slot "${newSlot.title}" created!`);
  };

  const handleDeleteSlot = (slotId: string) => {
    const updatedSlots = projectData.slots.filter((s) => s.id !== slotId);
    updateAndSave({ ...projectData, slots: updatedSlots }, 'Custom slot removed.');
  };

  // Set primary photo
  const handleSetPrimaryPhoto = (photoId: string) => {
    const updatedPhotos = projectData.photos.map((p) => ({
      ...p,
      isPrimary: p.id === photoId,
    }));
    updateAndSave({ ...projectData, photos: updatedPhotos }, 'Primary exhibition photo updated!');
  };

  // Delete photo
  const handleDeletePhoto = (photoId: string) => {
    const updatedPhotos = projectData.photos.filter((p) => p.id !== photoId);
    updateAndSave({ ...projectData, photos: updatedPhotos }, 'Photo removed.');
  };

  // Functions CRUD
  const handleSaveFunction = (fn: RobotFunction) => {
    const exists = projectData.robotFunctions.some((f) => f.id === fn.id);
    const updated = exists
      ? projectData.robotFunctions.map((f) => (f.id === fn.id ? fn : f))
      : [...projectData.robotFunctions, fn];
    updateAndSave({ ...projectData, robotFunctions: updated }, 'Robot function saved!');
  };

  const handleDeleteFunction = (fnId: string) => {
    const updated = projectData.robotFunctions.filter((f) => f.id !== fnId);
    updateAndSave({ ...projectData, robotFunctions: updated }, 'Function removed.');
  };

  // Fabrication Stages CRUD
  const handleSaveStage = (stage: FabricationStage) => {
    const exists = projectData.fabricationStages.some((s) => s.id === stage.id);
    const updated = exists
      ? projectData.fabricationStages.map((s) => (s.id === stage.id ? stage : s))
      : [...projectData.fabricationStages, stage];
    updateAndSave({ ...projectData, fabricationStages: updated }, 'Fabrication stage saved!');
  };

  const handleDeleteStage = (stageId: string) => {
    const updated = projectData.fabricationStages.filter((s) => s.id !== stageId);
    updateAndSave({ ...projectData, fabricationStages: updated }, 'Fabrication stage removed.');
  };

  // Condition Update
  const handleSaveCondition = (updatedCondition: ProjectData['overallCondition']) => {
    updateAndSave({ ...projectData, overallCondition: updatedCondition }, 'Overall condition metrics updated!');
  };

  // Report Update
  const handleUpdateReport = (report: WrittenReport) => {
    updateAndSave({ ...projectData, writtenReport: report }, 'Technical report updated!');
  };

  // File Import
  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const imported = await importProjectFromFile(e.target.files[0]);
        updateAndSave(imported, 'Project restored from backup file!');
      } catch (err: any) {
        alert('Failed to import backup: ' + err.message);
      }
    }
  };

  // Reset to default
  const handleResetDefault = () => {
    if (window.confirm('Reset all project data back to the default BOTNIX Borewell Rescue Robot template? Any custom edits not backed up will be reset.')) {
      const def = resetProjectToDefault();
      updateAndSave(def, 'Reset to default template.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-orange-500/20 selection:text-orange-300">
      
      {/* Hidden File Input for JSON Backup Import */}
      <input
        ref={fileInputImportRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleImportFile}
      />

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        onOpenUploadModal={() => {
          setUploadTarget({ type: 'general' });
          setIsUploadModalOpen(true);
        }}
        onOpenQRCodeModal={() => setIsQRCodeModalOpen(true)}
        projectData={projectData}
        onImportClick={() => fileInputImportRef.current?.click()}
      />

      {/* Mode Indicator Banner (when in Edit Mode) */}
      {isEditMode && (
        <aside aria-label="Editor Mode Active" className="bg-gradient-to-r from-orange-600/90 to-amber-700/90 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between no-print shadow-md">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <Edit3 className="w-4 h-4 text-amber-200" />
            <span>
              <strong>Editor Mode Active:</strong> You can upload pictures to dedicated slots, modify robot functions & motors, rewrite fabrication steps, and update condition diagnostics.
            </span>
            <button
              onClick={() => setIsEditMode(false)}
              className="ml-auto text-amber-100 hover:text-white underline text-xs font-medium"
            >
              Switch to Public Showcase View
            </button>
          </div>
        </aside>
      )}

      {/* Floating Save / Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-orange-500/40 text-orange-300 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-medium animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'overview' && (
          <OverallConditionView
            projectData={projectData}
            isEditMode={isEditMode}
            onEditCondition={() => setIsConditionModalOpen(true)}
            onOpenUploadModal={() => {
              setUploadTarget({ type: 'general' });
              setIsUploadModalOpen(true);
            }}
            onOpenQRCodeModal={() => setIsQRCodeModalOpen(true)}
            onSelectPhotoForLightbox={(url, title) => setLightbox({ isOpen: true, url, title })}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'slots' && (
          <PictureSlotsView
            slots={projectData.slots}
            isEditMode={isEditMode}
            onUpdateSlot={handleUpdateSlot}
            onAddCustomSlot={handleAddCustomSlot}
            onDeleteSlot={handleDeleteSlot}
            onSelectPhotoForLightbox={(url, title) => setLightbox({ isOpen: true, url, title })}
          />
        )}

        {activeTab === 'how-it-works' && (
          <HowItWorksView
            functions={projectData.robotFunctions}
            isEditMode={isEditMode}
            onAddFunction={() => setFunctionModal({ isOpen: true, data: null })}
            onEditFunction={(fn) => setFunctionModal({ isOpen: true, data: fn })}
            onDeleteFunction={handleDeleteFunction}
            onUploadFunctionPhoto={(fnId) => {
              setUploadTarget({ type: 'function', id: fnId });
              setIsUploadModalOpen(true);
            }}
            onSelectPhotoForLightbox={(url, title) => setLightbox({ isOpen: true, url, title })}
          />
        )}

        {activeTab === 'how-it-was-made' && (
          <HowItWasMadeView
            stages={projectData.fabricationStages}
            isEditMode={isEditMode}
            onAddStage={() => setFabricationModal({ isOpen: true, data: null })}
            onEditStage={(stage) => setFabricationModal({ isOpen: true, data: stage })}
            onDeleteStage={handleDeleteStage}
            onUploadStagePhoto={(stageId) => {
              setUploadTarget({ type: 'stage', id: stageId });
              setIsUploadModalOpen(true);
            }}
            onSelectPhotoForLightbox={(url, title) => setLightbox({ isOpen: true, url, title })}
          />
        )}

        {activeTab === 'gallery' && (
          <PhotosGalleryView
            photos={projectData.photos}
            isEditMode={isEditMode}
            onOpenUploadModal={() => {
              setUploadTarget({ type: 'general' });
              setIsUploadModalOpen(true);
            }}
            onSetPrimaryPhoto={handleSetPrimaryPhoto}
            onDeletePhoto={handleDeletePhoto}
            onSelectPhotoForLightbox={(url, title) => setLightbox({ isOpen: true, url, title })}
          />
        )}

        {activeTab === 'report' && (
          <WrittenReportView
            projectData={projectData}
            isEditMode={isEditMode}
            onUpdateReport={handleUpdateReport}
          />
        )}

        {activeTab === 'prompts' && <PromptsGuideView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/90 text-slate-400 text-xs py-8 no-print mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">{projectData.name}</span>
            <span>•</span>
            <span>{projectData.team.originCountry}</span>
            <span>•</span>
            <span>{projectData.team.competitionRound}</span>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => setActiveTab('slots')}
              className="text-slate-400 hover:text-orange-400 flex items-center gap-1 transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-orange-400" />
              <span>Picture Slots</span>
            </button>
            <button
              onClick={() => fileInputImportRef.current?.click()}
              className="text-slate-400 hover:text-orange-400 flex items-center gap-1 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import Project Backup</span>
            </button>
            <button
              onClick={() => exportProjectToFile(projectData)}
              className="text-slate-400 hover:text-orange-400 flex items-center gap-1 transition-colors"
            >
              <span>Export Project JSON</span>
            </button>
            <button
              onClick={handleResetDefault}
              className="text-slate-500 hover:text-rose-400 flex items-center gap-1 transition-colors"
              title="Reset data to factory default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Template</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PhotoUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSavePhoto={handleSavePhoto}
      />

      <EditConditionModal
        isOpen={isConditionModalOpen}
        onClose={() => setIsConditionModalOpen(false)}
        condition={projectData.overallCondition}
        onSave={handleSaveCondition}
      />

      <FunctionModal
        isOpen={functionModal.isOpen}
        onClose={() => setFunctionModal({ isOpen: false, data: null })}
        functionData={functionModal.data}
        onSave={handleSaveFunction}
      />

      <FabricationStageModal
        isOpen={fabricationModal.isOpen}
        onClose={() => setFabricationModal({ isOpen: false, data: null })}
        stageData={fabricationModal.data}
        onSave={handleSaveStage}
      />

      <LightboxModal
        isOpen={lightbox.isOpen}
        onClose={() => setLightbox({ isOpen: false, url: null, title: null })}
        imageUrl={lightbox.url}
        title={lightbox.title}
      />

      <QRCodeModal
        isOpen={isQRCodeModalOpen}
        onClose={() => setIsQRCodeModalOpen(false)}
        projectData={projectData}
      />

    </div>
  );
}
