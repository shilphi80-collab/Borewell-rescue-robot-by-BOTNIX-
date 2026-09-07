import React, { useState } from 'react';
import { X, Check, Activity, ShieldCheck } from 'lucide-react';
import { ProjectData, ReadinessStatus, SubsystemStatus } from '../types';

interface EditConditionModalProps {
  isOpen: boolean;
  onClose: () => void;
  condition: ProjectData['overallCondition'];
  onSave: (updatedCondition: ProjectData['overallCondition']) => void;
}

export const EditConditionModal: React.FC<EditConditionModalProps> = ({
  isOpen,
  onClose,
  condition,
  onSave,
}) => {
  const [formData, setFormData] = useState({ ...condition });

  if (!isOpen) return null;

  const handleSubsystemChange = (index: number, field: string, value: any) => {
    const subs = [...formData.subsystems];
    subs[index] = { ...subs[index], [field]: value };
    setFormData({ ...formData, subsystems: subs });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl animate-scaleUp my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Edit Overall Condition & Specifications
              </h3>
              <p className="text-xs text-slate-400">
                Update robot depth, payload, diameter rating, and subsystem diagnostics.
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
          {/* Readiness Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Readiness Status
            </label>
            <select
              value={formData.readinessStatus}
              onChange={(e) => setFormData({ ...formData, readinessStatus: e.target.value as ReadinessStatus })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
            >
              <option value="Competition Ready - Malaysia Finals">Competition Ready - Malaysia Finals</option>
              <option value="Field Tested & Operational">Field Tested & Operational</option>
              <option value="System Calibration Phase">System Calibration Phase</option>
              <option value="Prototype v2.4 Active">Prototype v2.4 Active</option>
            </select>
          </div>

          {/* Metric Numbers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Max Depth Rating (m)
              </label>
              <input
                type="number"
                min="5"
                max="200"
                value={formData.depthRatingMeters}
                onChange={(e) => setFormData({ ...formData, depthRatingMeters: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Payload Capacity (kg)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.payloadCapacityKg}
                onChange={(e) => setFormData({ ...formData, payloadCapacityKg: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Robot Total Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.totalWeightKg}
                onChange={(e) => setFormData({ ...formData, totalWeightKg: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Diameter & Tether */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Borehole Diameter Adaptability
              </label>
              <input
                type="text"
                value={formData.boreholeDiameterRange}
                onChange={(e) => setFormData({ ...formData, boreholeDiameterRange: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tether Cable Length (m)
              </label>
              <input
                type="number"
                value={formData.umbilicalCableLengthMeters}
                onChange={(e) => setFormData({ ...formData, umbilicalCableLengthMeters: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Subsystems List */}
          <div className="pt-3 border-t border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Subsystem Diagnostic Health
            </h4>
            <div className="space-y-2.5">
              {formData.subsystems.map((sub, idx) => (
                <div key={sub.id} className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-200">{sub.name}</span>
                    <div className="flex items-center gap-2">
                      <select
                        value={sub.status}
                        onChange={(e) => handleSubsystemChange(idx, 'status', e.target.value as SubsystemStatus)}
                        className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-2 py-1"
                      >
                        <option value="Operational">Operational</option>
                        <option value="Calibrated">Calibrated</option>
                        <option value="Standby">Standby</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>

                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={sub.healthPercentage}
                          onChange={(e) => handleSubsystemChange(idx, 'healthPercentage', Number(e.target.value))}
                          className="w-16 bg-slate-900 border border-slate-700 text-xs text-cyan-400 font-mono text-center rounded-lg px-2 py-1"
                        />
                        <span className="text-xs text-slate-400">%</span>
                      </div>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={sub.detail}
                    onChange={(e) => handleSubsystemChange(idx, 'detail', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300"
                  />
                </div>
              ))}
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
              <span>Save Condition Changes</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
