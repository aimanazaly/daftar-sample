import React, { useState } from 'react';
import { SampleRecord, UserRole } from '../types/lims';
import { 
  Search, 
  Download, 
  Plus, 
  ShieldCheck, 
  FileCheck2, 
  Edit3, 
  FileSpreadsheet,
  Check,
  AlertCircle
} from 'lucide-react';
import { exportSamplesToCSV } from '../utils/exportCsv';

interface SampleTableProps {
  currentRole: UserRole;
  samples: SampleRecord[];
  onOpenIntakeModal: () => void;
  onSelectSample: (sample: SampleRecord, action: 'test' | 'review' | 'coa') => void;
  onDeleteSample?: (id: string) => void;
}

export const SampleTable: React.FC<SampleTableProps> = ({
  currentRole,
  samples,
  onOpenIntakeModal,
  onSelectSample,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'NR' | 'Non-NR'>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredSamples = samples.filter((sample) => {
    const matchesSearch =
      sample.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sample.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sample.originProject.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || sample.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || sample.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Table Header & Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Daftar & Keputusan Sampel Makmal
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Pendaftaran sampel getah, perekodan data parameter, dan kelulusan rasmi Certificate of Analysis (CoA).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportSamplesToCSV(samples)}
            className="px-3 py-1.5 bg-[#121824] hover:bg-slate-800 text-slate-300 border border-slate-700/80 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Eksport CSV</span>
          </button>

          <button
            onClick={onOpenIntakeModal}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Daftar Sampel</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0f1420] border border-slate-800/90 rounded-lg p-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari ID sampel, gred, atau projek..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-900 text-xs text-white rounded-md border border-slate-700/80 focus:outline-none focus:border-emerald-500 placeholder-slate-500"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Segmented Control */}
          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-md border border-slate-800">
            <button
              onClick={() => setCategoryFilter('All')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                categoryFilter === 'All' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setCategoryFilter('NR')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                categoryFilter === 'NR' ? 'bg-emerald-950 text-emerald-300 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Getah Asli (NR)
            </button>
            <button
              onClick={() => setCategoryFilter('Non-NR')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                categoryFilter === 'Non-NR' ? 'bg-sky-950 text-sky-300 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sintetik
            </button>
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1 bg-slate-900 border border-slate-700/80 rounded-md text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="All">Semua Status</option>
              <option value="Testing">Dalam Pengujian</option>
              <option value="Pending_Approval">Menunggu Kelulusan</option>
              <option value="Approved">Diluluskan (Approved)</option>
              <option value="Rejected">Ditolak (Rejected)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Scientific Table */}
      <div className="bg-[#0f1420] border border-slate-800/90 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead className="bg-[#0b101b] text-slate-400 text-[11px] font-mono uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3 font-semibold">ID Sampel</th>
                <th className="px-4 py-3 font-semibold">Kategori & Gred</th>
                <th className="px-4 py-3 font-semibold">Projek / Pelanggan</th>
                <th className="px-4 py-3 font-semibold">Tarikh & SLA</th>
                <th className="px-4 py-3 font-semibold">Keputusan Ujian</th>
                <th className="px-4 py-3 font-semibold">Status Aliran Kerja</th>
                <th className="px-4 py-3 font-semibold text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredSamples.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                    <FileSpreadsheet className="w-6 h-6 mx-auto mb-2 opacity-40" />
                    Tiada rekod sampel getah sepadan dengan kriteria carian semasa.
                  </td>
                </tr>
              ) : (
                filteredSamples.map((sample) => {
                  const passCount = sample.tests.filter((t) => t.status === 'Pass').length;
                  const failCount = sample.tests.filter((t) => t.status === 'Fail').length;
                  const totalTests = sample.tests.length;

                  return (
                    <tr
                      key={sample.id}
                      className="hover:bg-slate-900/50 transition-colors"
                    >
                      {/* ID & Priority */}
                      <td className="px-4 py-3 font-mono">
                        <div className="font-bold text-white text-xs">{sample.id}</div>
                        {sample.priority !== 'Biasa (Normal)' && (
                          <div className="text-[10px] text-amber-400 font-medium mt-0.5">
                            {sample.priority}
                          </div>
                        )}
                      </td>

                      {/* Category & Grade */}
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-200">{sample.grade}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {sample.category === 'NR' ? 'Natural Rubber (NR)' : 'Synthetic (Non-NR)'}
                        </div>
                        {sample.tests.some((t) => t.isNonRoutineSolvent) && (
                          <div className="mt-1">
                            <span className="text-[10px] px-1.5 py-0.2 bg-amber-950/70 text-amber-300 border border-amber-800/70 rounded font-mono font-medium inline-block">
                              Pelarut Khas
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Project / Origin */}
                      <td className="px-4 py-3">
                        <div className="text-slate-200 max-w-[200px] truncate" title={sample.originProject}>
                          {sample.originProject}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Didaftar: {sample.registeredBy.split(' ')[0]}
                        </div>
                      </td>

                      {/* Dates */}
                      <td className="px-4 py-3 font-mono text-[11px]">
                        <div className="text-slate-300">Terima: {sample.receivedDate}</div>
                        <div className="text-slate-500 flex items-center gap-1.5 flex-wrap mt-0.5">
                          <span>Sasaran: {sample.targetCompletionDate}</span>
                          {sample.leadTimeDays && (
                            <span className={`text-[10px] px-1 py-0.2 rounded font-semibold ${
                              sample.leadTimeDays >= 20 
                                ? 'bg-amber-950/80 text-amber-300 border border-amber-800/80' 
                                : 'bg-slate-800 text-slate-300'
                            }`}>
                              {sample.leadTimeDays}d SLA
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Results summary */}
                      <td className="px-4 py-3">
                        <div className="font-mono tabular-nums text-slate-200 font-medium">
                          {passCount + failCount}/{totalTests} siap
                        </div>
                        <div className="text-[11px] mt-0.5">
                          {failCount > 0 ? (
                            <span className="text-rose-400 font-medium">
                              {failCount} di luar had
                            </span>
                          ) : passCount === totalTests && totalTests > 0 ? (
                            <span className="text-emerald-400 font-medium">
                              Semua Lulus
                            </span>
                          ) : (
                            <span className="text-slate-400">
                              Belum lengkap
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Workflow status */}
                      <td className="px-4 py-3">
                        {sample.status === 'Approved' ? (
                          <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5" />
                            <span>Diluluskan</span>
                          </div>
                        ) : sample.status === 'Pending_Approval' ? (
                          <div className="text-amber-300 font-semibold flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Menunggu Semakan</span>
                          </div>
                        ) : sample.status === 'Rejected' ? (
                          <div className="text-rose-400 font-semibold">
                            Ditolak (Uji Semula)
                          </div>
                        ) : (
                          <div className="text-slate-400 font-medium">
                            Pengujian Makmal
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right space-x-1.5 whitespace-nowrap">
                        {sample.status === 'Pending_Approval' && currentRole === 'boss' ? (
                          <button
                            onClick={() => onSelectSample(sample, 'review')}
                            className="px-2.5 py-1 text-xs bg-amber-600 hover:bg-amber-500 text-white rounded font-medium transition-colors inline-flex items-center gap-1"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Semak & Luluskan</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => onSelectSample(sample, 'test')}
                            className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded font-medium transition-colors inline-flex items-center gap-1"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                            <span>Input Ujian</span>
                          </button>
                        )}

                        <button
                          onClick={() => onSelectSample(sample, 'coa')}
                          className="px-2.5 py-1 text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded font-medium transition-colors inline-flex items-center gap-1"
                          title="Lihat Sijil Analisis"
                        >
                          <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>CoA</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
