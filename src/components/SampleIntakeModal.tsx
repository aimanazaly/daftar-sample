import React, { useState, useEffect } from 'react';
import { RubberCategory, SampleRecord, TestParameter, UserRole } from '../types/lims';
import { 
  X, 
  Plus, 
  AlertCircle, 
  Building2, 
  Calendar, 
  Tag, 
  Clock, 
  SlidersHorizontal,
  Check
} from 'lucide-react';

interface SampleIntakeModalProps {
  currentRole: UserRole;
  parameters: TestParameter[];
  existingSamples: SampleRecord[];
  onClose: () => void;
  onSubmit: (sample: SampleRecord) => void;
}

// Helper to calculate target date safely without UTC timezone shift
const calculateTargetDate = (baseDateStr: string, days: number): string => {
  try {
    const parts = baseDateStr.split('-');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      d.setDate(d.getDate() + days);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    }
  } catch {
    // fallback
  }
  const d = new Date(baseDateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().substring(0, 10);
};

export const SampleIntakeModal: React.FC<SampleIntakeModalProps> = ({
  currentRole,
  parameters,
  existingSamples,
  onClose,
  onSubmit,
}) => {
  const [category, setCategory] = useState<RubberCategory>('NR');

  const generateNextId = (cat: RubberCategory) => {
    const prefix = cat === 'NR' ? 'SMP-2026-NR-' : 'SMP-2026-SYN-';
    const existing = existingSamples.filter((s) => s.id.startsWith(prefix));
    const nextNumber = existing.length + 1;
    return `${prefix}${String(nextNumber).padStart(3, '0')}`;
  };

  const [id, setId] = useState(() => generateNextId('NR'));
  const [grade, setGrade] = useState('SMR 10 (Standard Malaysian Rubber)');
  const [customGrade, setCustomGrade] = useState('');
  const [originProject, setOriginProject] = useState('');
  const [receivedDate, setReceivedDate] = useState(() => new Date().toISOString().substring(0, 10));

  // Lead Time Mode: '20_days' | '2_days' | '1_day' | '7_days' | 'custom'
  const [leadTimeMode, setLeadTimeMode] = useState<'20_days' | '2_days' | '1_day' | '7_days' | 'custom'>('20_days');
  const [customDays, setCustomDays] = useState<number>(20);
  const [targetCompletionDate, setTargetCompletionDate] = useState(() => {
    const today = new Date().toISOString().substring(0, 10);
    return calculateTargetDate(today, 20); // Default auto 20 hari as requested
  });

  const [priority, setPriority] = useState<'Biasa (Normal)' | 'Segera (Urgent)' | 'Kritikal (Critical)'>('Biasa (Normal)');

  // Determine current active days
  const activeDays = leadTimeMode === '20_days' 
    ? 20 
    : leadTimeMode === '2_days' 
    ? 2 
    : leadTimeMode === '1_day' 
    ? 1 
    : leadTimeMode === '7_days' 
    ? 7 
    : customDays;

  // Auto recalculate target date when receivedDate or activeDays changes
  const applyLeadTime = (days: number, newMode?: '20_days' | '2_days' | '1_day' | '7_days' | 'custom') => {
    if (newMode) setLeadTimeMode(newMode);
    const calculated = calculateTargetDate(receivedDate, days);
    setTargetCompletionDate(calculated);
  };

  const handleReceivedDateChange = (newDate: string) => {
    setReceivedDate(newDate);
    const calculated = calculateTargetDate(newDate, activeDays);
    setTargetCompletionDate(calculated);
  };

  const handleCategoryChange = (cat: RubberCategory) => {
    setCategory(cat);
    setId(generateNextId(cat));
    if (cat === 'NR') {
      setGrade('SMR 10 (Standard Malaysian Rubber)');
    } else {
      setGrade('SBR 1502 (Styrene Butadiene Rubber)');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalGrade = grade === 'Lain-lain' ? customGrade : grade;

    const applicableParams = parameters.filter((p) => p.category === 'All' || p.category === category);

    const initialTests = applicableParams.map((p) => ({
      paramId: p.id,
      paramName: p.name,
      type: p.type,
      unit: p.unit,
      minLimit: p.minLimit,
      maxLimit: p.maxLimit,
      status: 'Pending' as const,
      usedSolvent: p.usesSolvent ? p.defaultSolvent : undefined,
      isNonRoutineSolvent: p.usesSolvent ? (p.solventCategory === 'bukan_selalu') : undefined,
    }));

    const newSample: SampleRecord = {
      id,
      category,
      grade: finalGrade,
      originProject: originProject.trim() || 'Pusat Penyelidikan Polimer LGM',
      receivedDate,
      targetCompletionDate,
      status: 'Testing',
      priority,
      leadTimeDays: activeDays,
      registeredBy: currentRole === 'boss' ? 'Dr. Farhan Ismail (Boss)' : 'Aiman Azaly (Staff)',
      tests: initialTests,
    };

    onSubmit(newSample);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f1420] border border-slate-800 rounded-xl w-full max-w-lg p-5 shadow-2xl text-white">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              Pendaftaran Sampel Getah Baharu (Sample Intake)
            </h3>
            <p className="text-xs text-slate-400">
              Didaftar oleh: {currentRole === 'boss' ? 'Dr. Farhan Ismail (Boss)' : 'Aiman Azaly (Staff)'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs mt-3.5">
          {/* Category Toggle */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">Klasifikasi Kategori</label>
            <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => handleCategoryChange('NR')}
                className={`py-1.5 px-3 rounded text-xs font-medium transition-colors text-center ${
                  category === 'NR'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/80'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Natural Rubber (NR / Getah Asli)
              </button>

              <button
                type="button"
                onClick={() => handleCategoryChange('Non-NR')}
                className={`py-1.5 px-3 rounded text-xs font-medium transition-colors text-center ${
                  category === 'Non-NR'
                    ? 'bg-sky-950 text-sky-300 border border-sky-800/80'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Non-NR (Sintetik / Kompaun)
              </button>
            </div>
          </div>

          {/* Sample ID & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">ID Sampel (Auto)</label>
              <input
                type="text"
                required
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Keutamaan (SLA)</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Biasa (Normal)">Biasa (Standard SLA 48h)</option>
                <option value="Segera (Urgent)">Segera (Urgent SLA 24h)</option>
                <option value="Kritikal (Critical)">Kritikal (Same-day R&D)</option>
              </select>
            </div>
          </div>

          {/* Grade */}
          <div>
            <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              Sub-Gred Getah
            </label>
            {category === 'NR' ? (
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="SMR 10 (Standard Malaysian Rubber)">SMR 10 (Standard Malaysian Rubber)</option>
                <option value="SMR 20 (Standard Malaysian Rubber)">SMR 20 (Standard Malaysian Rubber)</option>
                <option value="SMR CV60 (Constant Viscosity)">SMR CV60 (Constant Viscosity)</option>
                <option value="SMR L (Light Coloured)">SMR L (Light Coloured)</option>
                <option value="RSS 1 (Ribbed Smoked Sheet)">RSS 1 (Ribbed Smoked Sheet)</option>
                <option value="RSS 3 (Ribbed Smoked Sheet)">RSS 3 (Ribbed Smoked Sheet)</option>
                <option value="Lateks Pekat 60% DRC (Centrifuged)">Lateks Pekat 60% DRC (Centrifuged)</option>
                <option value="Lain-lain">Lain-lain (Tulis Tersuai)</option>
              </select>
            ) : (
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-white focus:outline-none focus:border-sky-500"
              >
                <option value="SBR 1502 (Styrene Butadiene Rubber)">SBR 1502 (Styrene Butadiene Rubber)</option>
                <option value="SBR 1712 (Oil-Extended SBR)">SBR 1712 (Oil-Extended SBR)</option>
                <option value="NBR (Nitrile Butadiene Rubber)">NBR (Nitrile Butadiene Rubber)</option>
                <option value="EPDM Rubber (Terpolymer)">EPDM Rubber (Terpolymer)</option>
                <option value="Neoprene / CR (Chloroprene)">Neoprene / CR (Chloroprene)</option>
                <option value="Lain-lain">Lain-lain (Tulis Tersuai)</option>
              </select>
            )}

            {grade === 'Lain-lain' && (
              <input
                type="text"
                required
                value={customGrade}
                onChange={(e) => setCustomGrade(e.target.value)}
                placeholder="Masukkan nama gred getah tersuai..."
                className="w-full mt-2 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-white"
              />
            )}
          </div>

          {/* Project / Client */}
          <div>
            <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              Projek / Pelanggan
            </label>
            <input
              type="text"
              required
              value={originProject}
              onChange={(e) => setOriginProject(e.target.value)}
              placeholder="Contoh: Projek Klon Mardi / TopGlove Industri"
              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Dates & Auto Lead Time Section */}
          <div className="space-y-2.5 p-3 bg-slate-900/80 border border-slate-800 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5 text-xs">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Tempoh Masa Ujian (Auto Lead Time / SLA)
              </span>
              <span className="text-[10px] font-mono text-amber-300 bg-amber-950/70 border border-amber-800/80 px-1.5 py-0.2 rounded font-medium">
                Auto {activeDays} Hari
              </span>
            </div>

            {/* Lead Time Presets including 20 Hari and Butang Custom */}
            <div>
              <label className="block text-slate-400 text-[11px] mb-1.5">
                Pilih Preset Lead Time atau Gunakan Butang Custom:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {/* 20 Hari Preset - Highlighted */}
                <button
                  type="button"
                  onClick={() => applyLeadTime(20, '20_days')}
                  className={`py-1.5 px-2 rounded text-xs font-semibold flex items-center justify-center gap-1 transition-colors border ${
                    leadTimeMode === '20_days'
                      ? 'bg-amber-600 text-white border-amber-500 shadow-sm'
                      : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border-amber-800/60'
                  }`}
                  title="Tetapkan automatik 20 hari untuk ujian R&D, kestabilan & aging"
                >
                  <Clock className="w-3 h-3" />
                  <span>Auto 20 Hari</span>
                  {leadTimeMode === '20_days' && <Check className="w-3 h-3 ml-0.5" />}
                </button>

                {/* 2 Hari (Standard) */}
                <button
                  type="button"
                  onClick={() => applyLeadTime(2, '2_days')}
                  className={`py-1.5 px-2 rounded text-xs transition-colors border ${
                    leadTimeMode === '2_days'
                      ? 'bg-emerald-600 text-white border-emerald-500 font-semibold'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700/80'
                  }`}
                >
                  <span>2 Hari (Standard)</span>
                </button>

                {/* 7 Hari */}
                <button
                  type="button"
                  onClick={() => applyLeadTime(7, '7_days')}
                  className={`py-1.5 px-2 rounded text-xs transition-colors border ${
                    leadTimeMode === '7_days'
                      ? 'bg-emerald-600 text-white border-emerald-500 font-semibold'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700/80'
                  }`}
                >
                  <span>7 Hari (1 Minggu)</span>
                </button>

                {/* Butang Custom */}
                <button
                  type="button"
                  onClick={() => {
                    setLeadTimeMode('custom');
                    applyLeadTime(customDays, 'custom');
                  }}
                  className={`py-1.5 px-2 rounded text-xs font-semibold flex items-center justify-center gap-1 transition-colors border ${
                    leadTimeMode === 'custom'
                      ? 'bg-sky-600 text-white border-sky-500 shadow-sm'
                      : 'bg-slate-900 hover:bg-slate-800 text-sky-300 border-sky-800/70'
                  }`}
                  title="Klik untuk memasukkan bilangan hari tersuai"
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>Custom Hari</span>
                  {leadTimeMode === 'custom' && <Check className="w-3 h-3 ml-0.5" />}
                </button>
              </div>
            </div>

            {/* Custom Days Input Bar if Custom Mode selected */}
            {leadTimeMode === 'custom' && (
              <div className="p-2.5 bg-slate-950/70 border border-sky-800/60 rounded-md space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-sky-200 flex items-center gap-1">
                    <SlidersHorizontal className="w-3 h-3 text-sky-400" />
                    Tetapkan Bilangan Hari Tersuai (Custom Lead Time):
                  </span>
                  <div className="flex items-center gap-1.5">
                    {[14, 20, 30, 45].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => {
                          setCustomDays(d);
                          applyLeadTime(d, 'custom');
                        }}
                        className={`px-1.5 py-0.5 text-[10px] font-mono rounded border transition-colors ${
                          customDays === d
                            ? 'bg-sky-700 text-white border-sky-400 font-bold'
                            : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                        }`}
                      >
                        {d}d
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const next = Math.max(1, customDays - 1);
                      setCustomDays(next);
                      applyLeadTime(next, 'custom');
                    }}
                    className="w-7 h-7 bg-slate-800 hover:bg-slate-700 text-white rounded font-mono font-bold flex items-center justify-center border border-slate-700"
                  >
                    -
                  </button>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min={1}
                      max={180}
                      value={customDays}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val) && val >= 1) {
                          setCustomDays(val);
                          applyLeadTime(val, 'custom');
                        }
                      }}
                      className="w-full px-3 py-1 bg-slate-900 border border-sky-600/80 rounded text-center text-white font-mono font-bold text-sm focus:outline-none focus:border-sky-400"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const next = customDays + 1;
                      setCustomDays(next);
                      applyLeadTime(next, 'custom');
                    }}
                    className="w-7 h-7 bg-slate-800 hover:bg-slate-700 text-white rounded font-mono font-bold flex items-center justify-center border border-slate-700"
                  >
                    +
                  </button>
                  <span className="text-xs text-slate-300 font-medium">Hari</span>
                </div>
              </div>
            )}

            {/* Date Pickers */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Tarikh Diterima
                </label>
                <input
                  type="date"
                  required
                  value={receivedDate}
                  onChange={(e) => handleReceivedDateChange(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1 flex items-center justify-between">
                  <span>Sasaran Siap (Auto SLA)</span>
                  <span className="text-[10px] text-amber-300 font-mono font-semibold">+{activeDays} hari</span>
                </label>
                <input
                  type="date"
                  required
                  value={targetCompletionDate}
                  onChange={(e) => {
                    setTargetCompletionDate(e.target.value);
                  }}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-amber-600/60 rounded-md text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg flex items-start gap-2 text-slate-400 text-[11px]">
            <AlertCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              Parameter standard bagi kategori <strong>{category}</strong> akan dijana secara automatik ke dalam senarai ujian sampel ini.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md font-semibold transition-colors shadow-sm"
            >
              Daftar Sampel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
