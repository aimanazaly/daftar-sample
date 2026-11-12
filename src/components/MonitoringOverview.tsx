import React from 'react';
import { SampleRecord, ChemicalItem, LabScheduleItem, UserRole } from '../types/lims';
import { 
  Clock, 
  AlertTriangle, 
  Check, 
  FlaskConical, 
  Calendar, 
  ArrowRight, 
  Plus,
  ShieldCheck,
  FileCheck2,
  Edit3
} from 'lucide-react';

interface MonitoringOverviewProps {
  currentRole: UserRole;
  samples: SampleRecord[];
  chemicals: ChemicalItem[];
  schedules: LabScheduleItem[];
  onOpenIntakeModal: () => void;
  onOpenChemicalModal: (chemical?: ChemicalItem) => void;
  onClearOffSchedule: (id: string) => void;
  onSelectSample: (sample: SampleRecord, action: 'test' | 'review' | 'coa') => void;
  onNavigateTab: (tab: 'samples' | 'monitoring' | 'chemicals' | 'schedule' | 'parameters') => void;
}

export const MonitoringOverview: React.FC<MonitoringOverviewProps> = ({
  currentRole,
  samples,
  chemicals,
  schedules,
  onOpenIntakeModal,
  onOpenChemicalModal,
  onClearOffSchedule,
  onSelectSample,
  onNavigateTab,
}) => {
  const pendingApproval = samples.filter((s) => s.status === 'Pending_Approval');
  const inTesting = samples.filter((s) => s.status === 'Testing' || s.status === 'Draft');
  const approved = samples.filter((s) => s.status === 'Approved');
  const urgentSamples = samples.filter((s) => s.priority === 'Segera (Urgent)' || s.priority === 'Kritikal (Critical)');

  const outOfStockChemicals = chemicals.filter((c) => c.status === 'Habis');
  const lowStockChemicals = chemicals.filter((c) => c.status === 'Rendah');
  const activeSchedules = schedules.filter((s) => s.status === 'Aktif');

  return (
    <div className="space-y-6">
      {/* Workbench Header & Primary Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Pusat Pemantauan Operasi & Titik Masa Ujian (TAT)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Kitaran Turnaround Time (TAT), amaran bahan kimia habis, dan pengurusan cuti makmal getah.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenIntakeModal}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Daftar Sampel Baru</span>
          </button>

          <button
            onClick={() => onNavigateTab('chemicals')}
            className="px-3 py-2 bg-[#121824] hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <FlaskConical className="w-3.5 h-3.5 text-slate-400" />
            <span>Status Reagen</span>
          </button>
        </div>
      </div>

      {/* Structured Telemetry Metrics Grid (Clean 4-column metric strip without glowing cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#0f1420] border border-slate-800/90 rounded-lg p-3.5">
          <div className="text-[11px] font-medium text-slate-400">Total Sampel Berjalan</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-white">{samples.length}</span>
            <span className="text-[11px] text-slate-500 font-mono">({inTesting.length} diuji)</span>
          </div>
        </div>

        <div className="bg-[#0f1420] border border-slate-800/90 rounded-lg p-3.5">
          <div className="text-[11px] font-medium text-slate-400">Menunggu Kelulusan Boss</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-amber-300">{pendingApproval.length}</span>
            <span className="text-[11px] text-amber-400/80 font-medium">Sedia Disemak</span>
          </div>
        </div>

        <div className="bg-[#0f1420] border border-slate-800/90 rounded-lg p-3.5">
          <div className="text-[11px] font-medium text-slate-400">Bahan Kimia Habis / Rendah</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono tabular-nums ${outOfStockChemicals.length > 0 ? 'text-rose-400' : 'text-slate-200'}`}>
              {outOfStockChemicals.length}
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              ({lowStockChemicals.length} baki rendah)
            </span>
          </div>
        </div>

        <div className="bg-[#0f1420] border border-slate-800/90 rounded-lg p-3.5">
          <div className="text-[11px] font-medium text-slate-400">Jadual & Cuti Aktif</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-200">{activeSchedules.length}</span>
            <span className="text-[11px] text-slate-500">Perlu &apos;Clear Off&apos; bila siap</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Exceptions Board (Left) + Turnaround Aging Ledger (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN (5 cols): Critical Exceptions (Chemicals & Cuti Clear Off) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Chemical Stock Monitoring Section */}
          <section className="bg-[#0f1420] border border-slate-800/90 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Amaran Bahan Kimia & Reagen
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('chemicals')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
              >
                Urus Semua <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {outOfStockChemicals.length === 0 && lowStockChemicals.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">
                Semua reagen makmal mencukupi dan berada dalam paras optimum.
              </p>
            ) : (
              <div className="space-y-2">
                {outOfStockChemicals.map((chem) => (
                  <div
                    key={chem.id}
                    className="p-3 bg-rose-950/20 border border-rose-800/40 rounded-lg flex items-start justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          HABIS (0 {chem.unit})
                        </span>
                        <span className="font-semibold text-white">{chem.name}</span>
                      </div>
                      <p className="text-slate-400 text-[11px] mt-1">{chem.purpose}</p>
                      {chem.notes && (
                        <p className="text-[11px] text-rose-300/90 mt-1 italic">
                          Nota: {chem.notes}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => onOpenChemicalModal(chem)}
                      className="px-2 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded transition-colors shrink-0"
                    >
                      {currentRole === 'boss' ? 'Restock' : 'Update'}
                    </button>
                  </div>
                ))}

                {lowStockChemicals.map((chem) => (
                  <div
                    key={chem.id}
                    className="p-2.5 bg-slate-900/50 border border-slate-800 rounded-lg flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="font-medium text-slate-200">{chem.name}</span>
                      <span className="text-[11px] text-slate-400 ml-2">
                        Baki: <strong className="font-mono tabular-nums text-amber-300">{chem.currentStock} {chem.unit}</strong> (Min: {chem.minThreshold})
                      </span>
                    </div>
                    <button
                      onClick={() => onOpenChemicalModal(chem)}
                      className="text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded hover:bg-slate-800"
                    >
                      Kemas Kini
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Lab Schedule & Clear Off Section */}
          <section className="bg-[#0f1420] border border-slate-800/90 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Jadual Cuti & Makmal (Clear Off)
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('schedule')}
                className="text-xs text-slate-400 hover:text-slate-200 font-medium flex items-center gap-1"
              >
                Lihat Jadual <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {activeSchedules.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">
                Tiada rekod cuti kakitangan atau gangguan mesin aktif.
              </p>
            ) : (
              <div className="space-y-2">
                {activeSchedules.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase text-slate-400 font-medium">
                          {item.type === 'cuti_staff' ? 'Cuti Staf' : item.type === 'cuti_umum' ? 'Cuti Am' : 'Penyelenggaraan'}
                        </span>
                        <span className="text-slate-500">·</span>
                        <span className="font-semibold text-white">{item.title}</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">{item.description}</p>
                      <div className="text-[11px] font-mono text-slate-500">
                        {item.startDate} hingga {item.endDate}
                      </div>
                    </div>

                    <button
                      onClick={() => onClearOffSchedule(item.id)}
                      className="px-2.5 py-1 text-xs bg-emerald-950 text-emerald-300 hover:bg-emerald-900/60 border border-emerald-800/60 rounded font-medium flex items-center gap-1 transition-colors shrink-0"
                      title="Tandakan urusan ini sebagai selesai untuk mengosongkan status aktif"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Clear Off</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* RIGHT COLUMN (7 cols): Turnaround Time (TAT) & Sample Testing Ledger */}
        <div className="lg:col-span-7">
          <section className="bg-[#0f1420] border border-slate-800/90 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  Buku Catatan Turnaround Time (TAT Ledger)
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Pantau sasaran siap dan peringkat ujian untuk setiap kumpulan sampel getah.
                </p>
              </div>

              <button
                onClick={() => onNavigateTab('samples')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
              >
                Buka Senarai Penuh <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {samples.map((sample) => {
                const passCount = sample.tests.filter((t) => t.status === 'Pass').length;
                const failCount = sample.tests.filter((t) => t.status === 'Fail').length;
                const totalTests = sample.tests.length;

                return (
                  <div
                    key={sample.id}
                    className="p-3.5 bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 rounded-lg transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-white text-xs">{sample.id}</span>
                        <span className="text-slate-500">·</span>
                        <span className="font-medium text-slate-200">{sample.grade}</span>
                        <span className="text-slate-500">·</span>
                        <span className="text-slate-400 text-[11px]">{sample.category === 'NR' ? 'Getah Asli' : 'Sintetik'}</span>
                        {sample.priority !== 'Biasa (Normal)' && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                            {sample.priority}
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-400 flex items-center gap-2">
                        <span>Projek: <strong className="text-slate-300 font-normal">{sample.originProject}</strong></span>
                        <span className="text-slate-600">·</span>
                        <span className="font-mono text-slate-400">Sasaran: {sample.targetCompletionDate}</span>
                      </div>

                      <div className="text-[11px] text-slate-400 pt-0.5 flex items-center gap-2">
                        <span className="font-mono text-slate-300 font-medium">
                          {passCount + failCount}/{totalTests} ujian siap
                        </span>
                        {failCount > 0 ? (
                          <span className="text-rose-400 font-medium">({failCount} di luar had spesifikasi)</span>
                        ) : (
                          <span className="text-emerald-400 font-medium">(Mematuhi spesifikasi)</span>
                        )}
                      </div>
                    </div>

                    {/* Stage & Action */}
                    <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 shrink-0">
                      <div>
                        {sample.status === 'Approved' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300">
                            <Check className="w-3.5 h-3.5" /> Diluluskan (CoA Sedia)
                          </span>
                        ) : sample.status === 'Pending_Approval' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300">
                            <Clock className="w-3.5 h-3.5" /> Menunggu Kelulusan Boss
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                            Dalam Pengujian Makmal
                          </span>
                        )}
                      </div>

                      <div>
                        {sample.status === 'Pending_Approval' && currentRole === 'boss' ? (
                          <button
                            onClick={() => onSelectSample(sample, 'review')}
                            className="px-2.5 py-1 text-xs bg-amber-600 hover:bg-amber-500 text-white rounded font-semibold transition-colors flex items-center gap-1"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Semak & Luluskan
                          </button>
                        ) : sample.status === 'Approved' ? (
                          <button
                            onClick={() => onSelectSample(sample, 'coa')}
                            className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded font-medium transition-colors flex items-center gap-1"
                          >
                            <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                            Sijil CoA
                          </button>
                        ) : (
                          <button
                            onClick={() => onSelectSample(sample, 'test')}
                            className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded font-medium transition-colors flex items-center gap-1"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                            Input Ujian
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
