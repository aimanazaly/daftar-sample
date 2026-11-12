import React, { useState } from 'react';
import { LabScheduleItem, UserRole } from '../types/lims';
import { 
  Calendar, 
  Check, 
  Plus, 
  Trash2, 
  RotateCcw
} from 'lucide-react';

interface LabScheduleTabProps {
  currentRole: UserRole;
  schedules: LabScheduleItem[];
  onAddSchedule: (schedule: LabScheduleItem) => void;
  onClearOffSchedule: (id: string) => void;
  onReactivateSchedule: (id: string) => void;
  onDeleteSchedule: (id: string) => void;
}

export const LabScheduleTab: React.FC<LabScheduleTabProps> = ({
  currentRole,
  schedules,
  onAddSchedule,
  onClearOffSchedule,
  onReactivateSchedule,
  onDeleteSchedule,
}) => {
  const [filter, setFilter] = useState<'All' | 'Aktif' | 'ClearOff'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'cuti_staff' | 'cuti_umum' | 'penyelenggaraan_mesin' | 'audit'>('cuti_staff');
  const [staffName, setStaffName] = useState(currentRole === 'staff' ? 'Aiman Azaly' : 'Dr. Farhan Ismail');
  const [startDate, setStartDate] = useState('2026-11-15');
  const [endDate, setEndDate] = useState('2026-11-17');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSchedule: LabScheduleItem = {
      id: `sch-${Date.now()}`,
      title,
      type,
      staffName: type === 'cuti_staff' ? staffName : undefined,
      startDate,
      endDate,
      status: 'Aktif',
      description,
    };
    onAddSchedule(newSchedule);
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
  };

  const activeSchedules = schedules.filter((s) => s.status === 'Aktif');
  const clearedSchedules = schedules.filter((s) => s.status === 'Selesai / Clear Off');

  const displayedSchedules =
    filter === 'Aktif' ? activeSchedules : filter === 'ClearOff' ? clearedSchedules : schedules;

  return (
    <div className="space-y-4">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Jadual Makmal, Downtime Mesin & Pengurusan Cuti
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Pantau cuti kakitangan dan penyelenggaraan alat. Gunakan fungsi &apos;Clear Off&apos; apabila urusan telah selesai.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Jadual / Cuti</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-[#0f1420] border border-slate-800/90 rounded-lg p-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-md border border-slate-800">
          <button
            onClick={() => setFilter('All')}
            className={`px-3 py-1 rounded text-xs transition-colors ${
              filter === 'All' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Semua ({schedules.length})
          </button>
          <button
            onClick={() => setFilter('Aktif')}
            className={`px-3 py-1 rounded text-xs transition-colors ${
              filter === 'Aktif' ? 'bg-amber-950 text-amber-300 font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Aktif Dipantau ({activeSchedules.length})
          </button>
          <button
            onClick={() => setFilter('ClearOff')}
            className={`px-3 py-1 rounded text-xs transition-colors ${
              filter === 'ClearOff' ? 'bg-slate-800 text-slate-300 font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Telah Clear Off ({clearedSchedules.length})
          </button>
        </div>

        <span className="text-[11px] text-slate-500 hidden sm:inline">
          Sebarang cuti atau rehat yang berlalu boleh di-Clear Off oleh Staf atau Boss.
        </span>
      </div>

      {/* Schedule Items List */}
      <div className="bg-[#0f1420] border border-slate-800/90 rounded-xl divide-y divide-slate-800/80 overflow-hidden shadow-sm">
        {displayedSchedules.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            Tiada rekod jadual atau cuti dijumpai bagi tapisan semasa.
          </div>
        ) : (
          displayedSchedules.map((item) => {
            const isCleared = item.status === 'Selesai / Clear Off';

            return (
              <div
                key={item.id}
                className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs transition-colors ${
                  isCleared ? 'bg-slate-900/30 opacity-70' : 'hover:bg-slate-900/50'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono uppercase text-slate-400">
                      {item.type === 'cuti_staff'
                        ? 'Cuti Staf'
                        : item.type === 'penyelenggaraan_mesin'
                        ? 'Penyelenggaraan Mesin'
                        : 'Cuti Umum'}
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="font-semibold text-white text-xs">{item.title}</span>
                    {item.staffName && (
                      <span className="text-slate-400">({item.staffName})</span>
                    )}
                  </div>

                  <p className="text-slate-400 text-xs leading-relaxed max-w-2xl">{item.description}</p>

                  <div className="text-[11px] font-mono text-slate-500 flex items-center gap-3">
                    <span>Tempoh: {item.startDate} hingga {item.endDate}</span>
                    {isCleared && item.clearedBy && (
                      <span className="text-emerald-400">
                        ✓ Clear Off oleh {item.clearedBy} ({item.clearedAt})
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!isCleared ? (
                    <button
                      onClick={() => onClearOffSchedule(item.id)}
                      className="px-3 py-1.5 text-xs bg-emerald-950 text-emerald-300 hover:bg-emerald-900/60 border border-emerald-800/60 rounded-md font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                      title="Klik untuk Clear Off cuti ini apabila staff telah masuk kerja / urusan selesai"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Clear Off Cuti</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onReactivateSchedule(item.id)}
                      className="px-2.5 py-1 text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded font-medium transition-colors flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Aktifkan Semula</span>
                    </button>
                  )}

                  <button
                    onClick={() => onDeleteSchedule(item.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors rounded hover:bg-slate-800"
                    title="Padam rekod"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f1420] border border-slate-800 rounded-xl w-full max-w-md p-5 shadow-2xl text-white">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              Daftar Rekod Cuti / Downtime Makmal
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Rekod ini akan dipaparkan dalam buku pemantauan agar kapasiti ujian makmal kekal teratur.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Jenis Perkara</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="cuti_staff">Cuti Kakitangan (Cuti Rehat / Cuti Sakit)</option>
                  <option value="cuti_umum">Cuti Umum / Hari Kelepasan Am</option>
                  <option value="penyelenggaraan_mesin">Penyelenggaraan / Kalibrasi Mesin</option>
                  <option value="audit">Audit Makmal SAMM / Pensijilan</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Tajuk / Keterangan Ringkas</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Cuti Rehat Tahunan Aiman / Kalibrasi Reometer MDR"
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {type === 'cuti_staff' && (
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Nama Kakitangan</label>
                  <input
                    type="text"
                    required
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Tarikh Mula</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Tarikh Tamat</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Huraian / Pelan Tugas</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Nyatakan sebab atau penugasan pembantu makmal gantian jika ada..."
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-white focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md font-semibold transition-colors shadow-sm"
                >
                  Daftar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
