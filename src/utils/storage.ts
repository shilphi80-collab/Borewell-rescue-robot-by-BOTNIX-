import { ProjectData, ProjectPhoto, RobotFunction, FabricationStage } from '../types';
import { INITIAL_PROJECT_DATA } from './initialData';

const DB_NAME = 'BoreholeRobotDB';
const DB_VERSION = 1;
const STORE_NAME = 'project_store';
const KEY = 'active_project';

// Open IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function mergeWithDefaults(saved: Partial<ProjectData>): ProjectData {
  if (!saved || typeof saved !== 'object') return INITIAL_PROJECT_DATA;

  // Merge slots: ensure all default slots exist, preserving any user uploads in them
  const mergedSlots = INITIAL_PROJECT_DATA.slots.map((defaultSlot) => {
    const existing = saved.slots?.find((s) => s.id === defaultSlot.id);
    return existing ? { ...defaultSlot, ...existing } : defaultSlot;
  });

  // Also include any user-created custom slots
  if (saved.slots) {
    const customSlots = saved.slots.filter(
      (s) => !INITIAL_PROJECT_DATA.slots.some((ds) => ds.id === s.id)
    );
    mergedSlots.push(...customSlots);
  }

  return {
    ...INITIAL_PROJECT_DATA,
    ...saved,
    name: saved.name || INITIAL_PROJECT_DATA.name,
    subtitle: saved.subtitle || INITIAL_PROJECT_DATA.subtitle,
    overallCondition: {
      ...INITIAL_PROJECT_DATA.overallCondition,
      ...(saved.overallCondition || {}),
    },
    units: {
      robotUnit: {
        ...INITIAL_PROJECT_DATA.units.robotUnit,
        ...(saved.units?.robotUnit || {}),
      },
      groundUnit: {
        ...INITIAL_PROJECT_DATA.units.groundUnit,
        ...(saved.units?.groundUnit || {}),
      },
    },
    slots: mergedSlots,
    photos: saved.photos && saved.photos.length > 0 ? saved.photos : INITIAL_PROJECT_DATA.photos,
    robotFunctions: saved.robotFunctions && saved.robotFunctions.length > 0 ? saved.robotFunctions : INITIAL_PROJECT_DATA.robotFunctions,
    fabricationStages: saved.fabricationStages && saved.fabricationStages.length > 0 ? saved.fabricationStages : INITIAL_PROJECT_DATA.fabricationStages,
    writtenReport: {
      ...INITIAL_PROJECT_DATA.writtenReport,
      ...(saved.writtenReport || {}),
      billOfMaterials: saved.writtenReport?.billOfMaterials && saved.writtenReport.billOfMaterials.length > 0
        ? saved.writtenReport.billOfMaterials
        : INITIAL_PROJECT_DATA.writtenReport.billOfMaterials,
    },
  };
}

// Load project data
export async function loadProjectData(): Promise<ProjectData> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(KEY);
      req.onsuccess = () => {
        if (req.result) {
          resolve(mergeWithDefaults(req.result));
        } else {
          // Fallback check localStorage
          const local = localStorage.getItem(KEY);
          if (local) {
            try {
              const parsed = JSON.parse(local);
              resolve(mergeWithDefaults(parsed));
              return;
            } catch {
              // ignore
            }
          }
          resolve(INITIAL_PROJECT_DATA);
        }
      };
      req.onerror = () => {
        resolve(INITIAL_PROJECT_DATA);
      };
    });
  } catch (err) {
    console.warn('Using localStorage fallback:', err);
    try {
      const local = localStorage.getItem(KEY);
      if (local) return mergeWithDefaults(JSON.parse(local));
    } catch {
      // ignore
    }
    return INITIAL_PROJECT_DATA;
  }
}

// Save project data
export async function saveProjectData(data: ProjectData): Promise<void> {
  data.lastUpdated = new Date().toISOString();
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(data, KEY);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB save failed, trying localStorage:', err);
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }
}

// Helper: Compress and read uploaded image file into a fast web data URL
export function readImageFileAsDataUrl(file: File, maxWidth = 1600, maxHeight = 1600, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve(e.target?.result as string);
        }
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Export Project to JSON File (User Download)
export function exportProjectToFile(data: ProjectData) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `BOTNIX-Borewell-Rescue-Project-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Import Project from JSON File
export function importProjectFromFile(file: File): Promise<ProjectData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (!parsed.name || !parsed.overallCondition) {
          throw new Error('Invalid project file format.');
        }
        resolve(mergeWithDefaults(parsed));
      } catch (err: any) {
        reject(new Error(err.message || 'Failed to parse JSON backup file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

// Reset to Default Data
export function resetProjectToDefault(): ProjectData {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
  return INITIAL_PROJECT_DATA;
}
