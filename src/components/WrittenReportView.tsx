import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Copy, 
  Check, 
  Edit3, 
  Download, 
  Award, 
  DollarSign, 
  Plus, 
  Trash2,
  BookOpen,
  Layers
} from 'lucide-react';
import { ProjectData, WrittenReport, BillOfMaterialItem } from '../types';

interface WrittenReportViewProps {
  projectData: ProjectData;
  isEditMode: boolean;
  onUpdateReport: (report: WrittenReport) => void;
}

export const WrittenReportView: React.FC<WrittenReportViewProps> = ({
  projectData,
  isEditMode,
  onUpdateReport,
}) => {
  const { writtenReport, team, name, subtitle, overallCondition } = projectData;
  const [copied, setCopied] = useState(false);
  const [editingSection, setEditingSection] = useState<keyof WrittenReport | 'bom' | null>(null);
  const [tempText, setTempText] = useState('');

  // Total BOM cost
  const totalBomCost = writtenReport.billOfMaterials.reduce(
    (sum, item) => sum + (item.costEstimateUSD || 0) * (item.quantity || 1),
    0
  );

  const handleCopyFullReport = () => {
    const text = `
TECHNICAL REPORT: ${name.toUpperCase()}
${subtitle}
International Competition Round: ${team.competitionRound} (${team.countryTarget})
Team: ${team.name} | Institution: ${team.institution}

1. ABSTRACT
${writtenReport.abstract}

2. INTRODUCTION & PROBLEM STATEMENT
${writtenReport.problemStatement}

3. DESIGN METHODOLOGY & SYSTEM CONSTRAINTS
${writtenReport.designMethodology}

4. MECHANICAL ARCHITECTURE & CONFORMAL GRIPPER
${writtenReport.mechanicalDesign}

5. ELECTRICAL, EMBEDDED TELEMETRY & UMBILICAL BUS
${writtenReport.electricalAndSensory}

6. WORKING PRINCIPLE & EXTRACTION PROTOCOL
${writtenReport.workingPrinciple}

7. SAFETY ANALYSIS & REDUNDANT FAIL-SAFES
${writtenReport.safetyAndFailSafes}

8. FIELD TESTING & EXPERIMENTAL VALIDATION
${writtenReport.fieldTestResults}

9. CONCLUSION & INTERNATIONAL IMPACT (MALAYSIA)
${writtenReport.conclusionAndMalaysiaGoals}

BILL OF MATERIALS:
${writtenReport.billOfMaterials.map(b => `- ${b.item} (${b.specification}) x${b.quantity} [${b.purpose}] - $${b.costEstimateUSD || 0}`).join('\n')}
Total Estimated Cost: $${totalBomCost} USD
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const startEditSection = (section: keyof WrittenReport) => {
    setEditingSection(section);
    setTempText((writtenReport[section] as string) || '');
  };

  const saveSectionEdit = () => {
    if (!editingSection || editingSection === 'bom') return;
    const updated = {
      ...writtenReport,
      [editingSection]: tempText,
    };
    onUpdateReport(updated);
    setEditingSection(null);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-blue-950 text-blue-400 border border-blue-800">
              OFFICIAL WRITTEN SPECIFICATION
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Technical Research Report
            </h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Standard IEEE & International Robotics Championship format. Ready for submission, jury evaluation, and printing.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            id="btn-copy-report-text"
            onClick={handleCopyFullReport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-medium border border-slate-700 active:scale-95 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Report Text'}</span>
          </button>

          <button
            id="btn-print-action"
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Formatted Report Document Canvas */}
      <article className="bg-slate-900/90 print:bg-white text-slate-100 print:text-slate-900 border border-slate-800 print:border-none rounded-2xl print:rounded-none p-6 sm:p-12 shadow-2xl space-y-10 max-w-5xl mx-auto">
        
        {/* Document Header / Cover Meta */}
        <header className="border-b border-slate-800 print:border-slate-300 pb-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 print:bg-amber-100 text-amber-400 print:text-amber-800 border border-amber-500/30 print:border-amber-300">
            <Award className="w-4 h-4" />
            <span>{team.competitionEvent} — {team.competitionRound}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight print:text-black">
            {name}
          </h1>
          <p className="text-sm sm:text-lg text-slate-300 print:text-slate-600 max-w-3xl mx-auto italic font-medium">
            {subtitle}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-slate-400 print:text-slate-700">
            <div>
              <span className="font-semibold text-slate-200 print:text-black">Team: </span>
              <span>{team.name}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-200 print:text-black">Affiliation: </span>
              <span>{team.institution}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-200 print:text-black">Location: </span>
              <span>{team.countryTarget}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-200 print:text-black">Year: </span>
              <span>{team.year}</span>
            </div>
          </div>
        </header>

        {/* Section Helper Generator */}
        {[
          { key: 'abstract', title: '1. Abstract', content: writtenReport.abstract },
          { key: 'problemStatement', title: '2. Introduction & Problem Statement', content: writtenReport.problemStatement },
          { key: 'designMethodology', title: '3. System Constraints & Design Methodology', content: writtenReport.designMethodology },
          { key: 'mechanicalDesign', title: '4. Mechanical Design & Conformal Soft-Grip Harness', content: writtenReport.mechanicalDesign },
          { key: 'electricalAndSensory', title: '5. Electrical, Embedded Telemetry & Hybrid Umbilical Bus', content: writtenReport.electricalAndSensory },
          { key: 'workingPrinciple', title: '6. Working Principle & 6-Step Rescue Protocol', content: writtenReport.workingPrinciple },
          { key: 'safetyAndFailSafes', title: '7. Safety Protocols & Redundant Fail-Safes', content: writtenReport.safetyAndFailSafes },
          { key: 'fieldTestResults', title: '8. Field Testing & Experimental Validation', content: writtenReport.fieldTestResults },
          { key: 'conclusionAndMalaysiaGoals', title: '9. Conclusion & Competition Objectives (Malaysia Round)', content: writtenReport.conclusionAndMalaysiaGoals },
        ].map((sec) => (
          <section key={sec.key} className="space-y-3 print-break-inside-avoid relative group">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-white print:text-black tracking-tight flex items-center gap-2">
                <span>{sec.title}</span>
              </h2>

              {isEditMode && (
                <button
                  onClick={() => startEditSection(sec.key as keyof WrittenReport)}
                  className="no-print opacity-0 group-hover:opacity-100 flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700 transition-opacity"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit Section</span>
                </button>
              )}
            </div>

            <p className="text-sm sm:text-base text-slate-300 print:text-slate-800 leading-relaxed text-justify whitespace-pre-line font-normal">
              {sec.content}
            </p>
          </section>
        ))}

        {/* Bill of Materials Table */}
        <section className="space-y-4 print-break-inside-avoid pt-4 border-t border-slate-800 print:border-slate-300">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-white print:text-black tracking-tight">
              10. Bill of Materials (BOM) & Cost Analysis
            </h2>
            <span className="text-xs sm:text-sm font-mono font-bold text-cyan-400 print:text-cyan-800">
              Total Budget: ${totalBomCost} USD
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 print:border-slate-300">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950/80 print:bg-slate-100 text-slate-400 print:text-slate-700 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800 print:border-slate-300">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Component / Subsystem</th>
                  <th className="p-3">Specification</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3">Purpose</th>
                  <th className="p-3 text-right">Est. Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 print:divide-slate-200">
                {writtenReport.billOfMaterials.map((item, bIdx) => (
                  <tr key={item.id || bIdx} className="hover:bg-slate-950/40 print:hover:bg-transparent">
                    <td className="p-3 text-slate-500 font-mono text-xs">{bIdx + 1}</td>
                    <td className="p-3 font-semibold text-slate-100 print:text-black">{item.item}</td>
                    <td className="p-3 text-slate-400 print:text-slate-600 font-mono text-xs">{item.specification}</td>
                    <td className="p-3 text-center text-slate-300 print:text-black font-medium">{item.quantity}</td>
                    <td className="p-3 text-slate-300 print:text-slate-600 text-xs">{item.purpose}</td>
                    <td className="p-3 text-right text-cyan-300 print:text-black font-mono font-medium">
                      ${item.costEstimateUSD || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </article>

      {/* Inline Section Editor Modal */}
      {editingSection && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl animate-scaleUp">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-amber-400" />
              <span>Edit Report Section: {String(editingSection)}</span>
            </h3>

            <textarea
              rows={12}
              value={tempText}
              onChange={(e) => setTempText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 font-sans leading-relaxed"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingSection(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={saveSectionEdit}
                className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md"
              >
                Save Section Content
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
