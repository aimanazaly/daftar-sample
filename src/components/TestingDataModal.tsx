import React, { useState } from 'react';
import { ChemicalItem, SampleRecord, TestParameter, TestResultItem, UserRole } from '../types/lims';
import { 
  X, 
  Sparkles, 
  Check, 
  AlertTriangle, 
  Upload, 
  Loader2, 
  SendHorizontal,
  FlaskConical
} from 'lucide-react';
import { generateCureCurveSvg } from '../data/initialData';

interface TestingDataModalProps {
  currentRole: UserRole;
  sample: SampleRecord;
  parameters: TestParameter[];
  chemicals: ChemicalItem[];
  onClose: () => void;
  onSaveSample: (updatedSample: SampleRecord) => void;
  onRequestBossReview?: (updatedSample: SampleRecord) => void;
}

export const TestingDataModal: React.FC<TestingDataModalProps> = ({
  currentRole,
  sample,
  parameters,
  chemicals,
  onClose,
  onSaveSample,
}) => {
  const [tests, setTests] = useState<TestResultItem[]>(() => {
    const existing = [...sample.tests];
    const applicable = parameters.filter((p) => p.category === 'All' || p.category === sample.category);

    applicable.forEach((p) => {
      const found = existing.find((t) => t.paramId === p.id);
      if (!found) {
        existing.push({
          paramId: p.id,
          paramName: p.name,
          type: p.type,
          unit: p.unit,
          minLimit: p.minLimit,
          maxLimit: p.maxLimit,
          status: 'Pending',
          usedSolvent: p.defaultSolvent,
          isNonRoutineSolvent: p.solventCategory === 'bukan_selalu',
        });
      } else if (!found.usedSolvent && p.usesSolvent) {
        found.usedSolvent = p.defaultSolvent;
        found.isNonRoutineSolvent = p.solventCategory === 'bukan_selalu';
      }
    });

    return existing;
  });

  const [aiSummaryDraft, setAiSummaryDraft] = useState(sample.aiSummaryDraft || '');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const evaluateStatus = (val: number | undefined, min?: number, max?: number): 'Pass' | 'Fail' | 'Pending' => {
    if (val === undefined || isNaN(val)) return 'Pending';
    if (min !== undefined && val < min) return 'Fail';
    if (max !== undefined && val > max) return 'Fail';
    return 'Pass';
  };

  const handleNumericChange = (index: number, valueStr: string) => {
    const val = valueStr === '' ? undefined : parseFloat(valueStr);
    const updated = [...tests];
    const item = updated[index];
    const status = evaluateStatus(val, item.minLimit, item.maxLimit);

    updated[index] = {
      ...item,
      resultValue: val,
      status,
      testedBy: currentRole === 'boss' ? 'Dr. Farhan Ismail' : 'Aiman Azaly',
      testedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setTests(updated);
  };

  const handleTextChange = (index: number, text: string) => {
    const updated = [...tests];
    const item = updated[index];
    updated[index] = {
      ...item,
      resultText: text,
      status: text.trim().length > 0 ? 'Pass' : 'Pending',
      testedBy: currentRole === 'boss' ? 'Dr. Farhan Ismail' : 'Aiman Azaly',
      testedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setTests(updated);
  };

  const handleSolventSelect = (index: number, solventName: string) => {
    const updated = [...tests];
    const item = updated[index];
    const isNonRoutine =
      solventName.includes('Khas') ||
      solventName.includes('THF') ||
      solventName.includes('Kloroform') ||
      solventName.includes('Sikloheksana') ||
      solventName.includes('MEK') ||
      solventName.includes('Heksana');

    updated[index] = {
      ...item,
      usedSolvent: solventName,
      isNonRoutineSolvent: isNonRoutine,
      testedBy: currentRole === 'boss' ? 'Dr. Farhan Ismail' : 'Aiman Azaly',
      testedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setTests(updated);
  };

  const handleSolventNotesChange = (index: number, notes: string) => {
    const updated = [...tests];
    const item = updated[index];
    updated[index] = {
      ...item,
      solventNotes: notes,
    };
    setTests(updated);
  };

  const handleGraphGenerate = (index: number) => {
    const updated = [...tests];
    const item = updated[index];
    const curveSvg = generateCureCurveSvg(2.3, 6.5, 12.0, 50.4);
    updated[index] = {
      ...item,
      attachmentUrl: curveSvg,
      status: 'Pass',
      testedBy: currentRole === 'boss' ? 'Dr. Farhan Ismail' : 'Aiman Azaly',
      testedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setTests(updated);
  };

  const handleFileUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updated = [...tests];
        const item = updated[index];
        updated[index] = {
          ...item,
          attachmentUrl: reader.result as string,
          status: 'Pass',
          testedBy: currentRole === 'boss' ? 'Dr. Farhan Ismail' : 'Aiman Azaly',
          testedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        };
        setTests(updated);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateAiSummary = async () => {
    setIsGeneratingAi(true);
    setAiError(null);

    try {
      const res = await fetch('/api/gemini/analyze-sample', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sample: {
            ...sample,
            tests,
          },
          parameters,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menghubungi servis Gemini');
      }

      setAiSummaryDraft(data.summary);
    } catch (err: any) {
      console.error('Error generating AI summary:', err);
      setAiError(err.message || 'Ralat semasa menjana ulasan AI');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSave = (submitForApproval = false) => {
    const updatedSample: SampleRecord = {
      ...sample,
      tests,
      aiSummaryDraft,
      status: submitForApproval ? 'Pending_Approval' : sample.status === 'Draft' ? 'Testing' : sample.status,
    };
    onSaveSample(updatedSample);
    onClose();
  };

  const isLocked = sample.status === 'Approved';

  // Available standard and special non-routine solvents from chemical inventory
  const nonRoutineSolvents = chemicals.filter(
    (c) => c.isSolvent && c.usageFrequency === 'bukan_selalu'
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#0f1420] border border-slate-800 rounded-xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl text-white my-auto">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-[#0b101b] rounded-t-xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-white">{sample.id}</span>
              <span className="text-slate-500">·</span>
              <span className="text-xs font-semibold text-slate-200">{sample.grade}</span>
              <span className="text-slate-500">·</span>
              <span className="text-xs text-slate-400">{sample.category === 'NR' ? 'Getah Asli' : 'Sintetik'}</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Projek: <span className="text-slate-300">{sample.originProject}</span> · Tarikh Terima: {sample.receivedDate}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Locked Notice */}
          {isLocked && (
            <div className="p-3 bg-emerald-950/30 border border-emerald-800/60 rounded-lg text-emerald-300 text-xs">
              Sampel ini telah <strong>Diluluskan</strong> oleh {sample.approvedBy} pada {sample.approvalDate}. Data ujian dikunci untuk pemeliharaan integriti sijil CoA.
            </div>
          )}

          {/* Parameters Data Entry Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Perekodan Data Parameter Ujian
              </h4>
              <span className="text-slate-500 text-[11px]">
                Validasi automatik lulus/gagal berasaskan had toleransi standard
              </span>
            </div>

            <div className="space-y-3">
              {tests.map((testItem, idx) => {
                const paramMeta = parameters.find((p) => p.id === testItem.paramId);
                const isSolventTest = paramMeta?.usesSolvent || testItem.paramName.toLowerCase().includes('dirt') || testItem.paramName.toLowerCase().includes('solvent') || testItem.paramName.toLowerCase().includes('swelling');

                // Determine linked chemical status
                let linkedChem = chemicals.find((c) => c.id === paramMeta?.requiredChemicalId);
                if (testItem.usedSolvent) {
                  const matchInChem = chemicals.find((c) => testItem.usedSolvent?.toLowerCase().includes(c.name.split(' ')[0].toLowerCase()));
                  if (matchInChem) linkedChem = matchInChem;
                }

                return (
                  <div
                    key={testItem.paramId}
                    className="p-3.5 bg-slate-900/60 border border-slate-800/90 rounded-lg space-y-2.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-xs">{testItem.paramName}</span>
                          {paramMeta?.standardMethod && (
                            <span className="text-[11px] text-slate-500 font-mono">({paramMeta.standardMethod})</span>
                          )}
                        </div>
                        {testItem.type === 'numeric' && (
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                            Had Spesifikasi: {testItem.minLimit !== undefined && testItem.maxLimit !== undefined 
                              ? `${testItem.minLimit} – ${testItem.maxLimit} ${testItem.unit || ''}`
                              : testItem.maxLimit !== undefined ? `Maks. ${testItem.maxLimit} ${testItem.unit || ''}` : `Min. ${testItem.minLimit} ${testItem.unit || ''}`}
                          </div>
                        )}
                      </div>

                      {/* Status indicator */}
                      <div>
                        {testItem.status === 'Pass' ? (
                          <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                            <Check className="w-3.5 h-3.5" /> Lulus (Pass)
                          </span>
                        ) : testItem.status === 'Fail' ? (
                          <span className="text-rose-400 font-semibold flex items-center gap-1 text-[11px]">
                            <AlertTriangle className="w-3.5 h-3.5" /> Melebihi Had (Fail)
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px]">Belum Diuji</span>
                        )}
                      </div>
                    </div>

                    {/* Solvent Customization Block (For solvent-based tests) */}
                    {isSolventTest && (
                      <div className="p-2.5 bg-[#0b101b] border border-slate-800 rounded-lg space-y-2 text-xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <FlaskConical className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span className="font-medium text-slate-300">Pilihan Pelarut / Solvent:</span>
                          </div>

                          {testItem.isNonRoutineSolvent && (
                            <span className="text-[10px] font-mono font-medium text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                              ★ Pelarut Bukan Selalu Pakai (Special Solvent Protocol)
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <select
                              disabled={isLocked}
                              value={testItem.usedSolvent || paramMeta?.defaultSolvent || 'Toluene (C7H8 - Standard)'}
                              onChange={(e) => handleSolventSelect(idx, e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                            >
                              <optgroup label="Pelarut Standard Rutin (Selalu Pakai)">
                                <option value="Toluene (C7H8 - Standard)">Toluene (C7H8 - Pelarut Standard)</option>
                                <option value="Aseton Gred Analisis (AR)">Aseton Gred Analisis (AR)</option>
                              </optgroup>

                              <optgroup label="Pelarut Khas R&D (Bukan Selalu Pakai)">
                                <option value="Tetrahydrofuran (THF - Pelarut Khas)">
                                  Tetrahydrofuran (THF Anhydrous - Khas GPC & Swelling)
                                </option>
                                <option value="Kloroform (CHCl3 - Pelarut Khas)">
                                  Kloroform Gred Spektroskopi (CHCl3 - Khas Crosslink Density)
                                </option>
                                <option value="Sikloheksana (C6H12 - Pelarut Khas)">
                                  Sikloheksana (Cyclohexane - Khas Polimer Stirena)
                                </option>
                                <option value="Metil Etil Keton (MEK - Pelarut Khas)">
                                  Metil Etil Keton (MEK - Khas NBR Sintetik)
                                </option>
                                <option value="n-Heksana (C6H14 - Pelarut Khas)">
                                  n-Heksana (n-Hexane HPLC - Khas Alifatik)
                                </option>
                              </optgroup>
                            </select>
                          </div>

                          <div>
                            <input
                              type="text"
                              disabled={isLocked}
                              value={testItem.solventNotes || ''}
                              onChange={(e) => handleSolventNotesChange(idx, e.target.value)}
                              placeholder="Catatan pelarut (contoh: Lot THF-2026-B4, refluks 48j @ 60°C)"
                              className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded text-slate-200 text-xs focus:outline-none focus:border-emerald-500 placeholder-slate-500"
                            />
                          </div>
                        </div>

                        {/* Stock status indicator for the chosen solvent */}
                        {linkedChem && (
                          <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
                            <span>
                              Inventori: <strong>{linkedChem.name.split(' ')[0]}</strong> (Baki: {linkedChem.currentStock} {linkedChem.unit})
                            </span>
                            <span className={linkedChem.status === 'Habis' ? 'text-rose-400 font-bold' : linkedChem.status === 'Rendah' ? 'text-amber-400 font-semibold' : 'text-emerald-400 font-medium'}>
                              {linkedChem.status === 'Habis' ? '⚠ Habis dalam stok!' : linkedChem.status === 'Rendah' ? 'Baki rendah' : '✓ Stok mencukupi'}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Chemical Dependency Alert */}
                    {linkedChem && linkedChem.status === 'Habis' && !isSolventTest && (
                      <div className="p-2 bg-rose-950/20 border border-rose-800/40 rounded text-rose-300 text-[11px] flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span>
                          Reagen berkaitan (<strong>{linkedChem.name}</strong>) sedang <strong>HABIS</strong> dalam inventori. Sila peroleh bekalan sebelum ujian dijalankan.
                        </span>
                      </div>
                    )}

                    {/* Inputs */}
                    <div>
                      {testItem.type === 'numeric' && (
                        <div className="flex items-center gap-2.5">
                          <input
                            type="number"
                            step="any"
                            disabled={isLocked}
                            value={testItem.resultValue ?? ''}
                            onChange={(e) => handleNumericChange(idx, e.target.value)}
                            placeholder="Nilai bacaan"
                            className={`w-40 px-2.5 py-1.5 bg-slate-800/90 border rounded text-xs font-mono font-semibold text-white focus:outline-none ${
                              testItem.status === 'Fail'
                                ? 'border-rose-500 text-rose-300'
                                : testItem.status === 'Pass'
                                ? 'border-emerald-600 text-emerald-300'
                                : 'border-slate-700'
                            }`}
                          />
                          <span className="text-slate-400 font-mono">{testItem.unit || ''}</span>
                        </div>
                      )}

                      {testItem.type === 'text' && (
                        <textarea
                          rows={2}
                          disabled={isLocked}
                          value={testItem.resultText || ''}
                          onChange={(e) => handleTextChange(idx, e.target.value)}
                          placeholder="Catatan pemerhatian visual kebersihan, warna, atau bendasing..."
                          className="w-full px-2.5 py-1.5 bg-slate-800/90 border border-slate-700 rounded text-white focus:outline-none focus:border-emerald-500"
                        ></textarea>
                      )}

                      {testItem.type === 'attachment' && (
                        <div className="space-y-2">
                          {testItem.attachmentUrl ? (
                            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 max-w-md">
                              <img
                                src={testItem.attachmentUrl}
                                alt="Lengkuk Reometer"
                                className="w-full h-auto rounded max-h-40 object-contain"
                              />
                              <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1 px-1">
                                <span>Lengkuk Reometer MDR Terpapar</span>
                                {!isLocked && (
                                  <button
                                    onClick={() => handleGraphGenerate(idx)}
                                    className="text-emerald-400 hover:text-emerald-300"
                                  >
                                    Jana Semula
                                  </button>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                disabled={isLocked}
                                onClick={() => handleGraphGenerate(idx)}
                                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                                Jana Lengkuk Standard MDR
                              </button>

                              <label className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors">
                                <Upload className="w-3.5 h-3.5" />
                                Muat Naik Graf
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleFileUpload(idx, e)}
                                />
                              </label>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gemini AI Summary Section */}
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Ulasan Teknikal Makmal (Gemini AI Rubber Technologist)
                </h4>
              </div>

              {!isLocked && (
                <button
                  type="button"
                  disabled={isGeneratingAi}
                  onClick={handleGenerateAiSummary}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-medium flex items-center gap-1.5 transition-colors self-start sm:self-auto disabled:opacity-50"
                >
                  {isGeneratingAi ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                      <span>Menganalisis...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{aiSummaryDraft ? 'Jana Semula Ulasan' : 'Jana Draf Ulasan AI'}</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {aiError && (
              <div className="p-2 bg-rose-950/30 border border-rose-800/50 rounded text-rose-300 text-xs">
                {aiError}
              </div>
            )}

            <textarea
              rows={3}
              disabled={isLocked || (currentRole === 'staff' && !aiSummaryDraft)}
              value={aiSummaryDraft}
              onChange={(e) => setAiSummaryDraft(e.target.value)}
              placeholder="Tekan 'Jana Draf Ulasan AI' untuk menghasilkan ulasan teknikal ISO 17025..."
              className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-md text-slate-200 focus:outline-none focus:border-emerald-500 leading-relaxed font-sans"
            ></textarea>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-[#0b101b] flex flex-wrap items-center justify-between gap-3 rounded-b-xl">
          <div className="text-[11px] text-slate-400">
            {currentRole === 'boss' ? (
              <span className="text-amber-300 font-medium">
                Dr. Farhan (Boss): Anda boleh meluluskan sampel ini terus di konsol kelulusan.
              </span>
            ) : (
              <span>
                Aiman (Staf): Lengkapkan pengujian dan hantar untuk semakan kelulusan Boss.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors"
            >
              Tutup
            </button>

            {!isLocked && (
              <>
                <button
                  type="button"
                  onClick={() => handleSave(false)}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-md font-medium transition-colors"
                >
                  Simpan Draf
                </button>

                <button
                  type="button"
                  onClick={() => handleSave(true)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <SendHorizontal className="w-3.5 h-3.5" />
                  <span>Hantar Kelulusan Boss</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
