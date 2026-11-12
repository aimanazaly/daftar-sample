import React from 'react';
import { UserRole, ChemicalItem, LabScheduleItem } from '../types/lims';
import { 
  FlaskConical, 
  ShieldCheck, 
  UserCheck, 
  Activity, 
  FileSpreadsheet, 
  Sliders, 
  Calendar,
  AlertCircle
} from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: 'samples' | 'monitoring' | 'chemicals' | 'schedule' | 'parameters';
  onTabChange: (tab: 'samples' | 'monitoring' | 'chemicals' | 'schedule' | 'parameters') => void;
  chemicals: ChemicalItem[];
  schedules: LabScheduleItem[];
  pendingApprovalCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange,
  chemicals,
  schedules,
  pendingApprovalCount,
}) => {
  const outOfStockChemicals = chemicals.filter((c) => c.status === 'Habis');
  const activeCuti = schedules.filter((s) => s.status === 'Aktif');

  return (
    <header className="bg-[#0b101b] border-b border-slate-800 text-slate-100 sticky top-0 z-40">
      {/* Main Single-Row Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 gap-4">
          {/* Brand Zone */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
              <FlaskConical className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-sm tracking-tight text-white">
                RubberLab <span className="text-emerald-400 font-semibold">LIMS</span>
              </span>
              <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400 tracking-wide">
                ISO/IEC 17025
              </span>
            </div>
          </div>

          {/* Central Workspace Tabs */}
          <nav className="hidden md:flex items-center gap-1 overflow-x-auto py-1 scrollbar-none" aria-label="Navigasi Utama">
            <button
              onClick={() => onTabChange('monitoring')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'monitoring'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pemantauan & TAT</span>
              {(outOfStockChemicals.length > 0 || pendingApprovalCount > 0) && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              )}
            </button>

            <button
              onClick={() => onTabChange('samples')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'samples'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
              <span>Daftar Sampel</span>
              {pendingApprovalCount > 0 && (
                <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-medium">
                  {pendingApprovalCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onTabChange('chemicals')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'chemicals'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5 text-slate-400" />
              <span>Reagen & Kimia</span>
              {outOfStockChemicals.length > 0 && (
                <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-medium">
                  {outOfStockChemicals.length} Habis
                </span>
              )}
            </button>

            <button
              onClick={() => onTabChange('schedule')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'schedule'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Jadual & Cuti</span>
              {activeCuti.length > 0 && (
                <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                  {activeCuti.length}
                </span>
              )}
            </button>

            <button
              onClick={() => onTabChange('parameters')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'parameters'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              <span>Parameter Standard</span>
            </button>
          </nav>

          {/* Right Zone: Identity Switcher & Role Capsule */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Clean Segmented Role Switcher */}
            <div className="bg-[#121824] p-0.5 rounded-lg border border-slate-800 flex items-center">
              <button
                type="button"
                onClick={() => onRoleChange('staff')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  currentRole === 'staff'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/70 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Mod Staf: Input ujian, kemas kini stok bahan habis, mohon cuti"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Aiman <span className="opacity-75 hidden sm:inline">(Staf)</span></span>
              </button>

              <button
                type="button"
                onClick={() => onRoleChange('boss')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  currentRole === 'boss'
                    ? 'bg-amber-950 text-amber-200 border border-amber-800/70 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Mod Boss: Akses penuh kelulusan CoA, ubah parameter, restock, clear off cuti"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Dr. Farhan <span className="opacity-75 hidden sm:inline">(Boss)</span></span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Sub-Navigation */}
        <div className="flex md:hidden items-center gap-1 overflow-x-auto py-2 border-t border-slate-800/80 scrollbar-none text-xs">
          <button
            onClick={() => onTabChange('monitoring')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'monitoring' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'
            }`}
          >
            Pemantauan & TAT
          </button>
          <button
            onClick={() => onTabChange('samples')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'samples' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'
            }`}
          >
            Sampel {pendingApprovalCount > 0 && `(${pendingApprovalCount})`}
          </button>
          <button
            onClick={() => onTabChange('chemicals')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'chemicals' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'
            }`}
          >
            Reagen {outOfStockChemicals.length > 0 && `(${outOfStockChemicals.length} Habis)`}
          </button>
          <button
            onClick={() => onTabChange('schedule')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'schedule' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'
            }`}
          >
            Jadual & Cuti
          </button>
          <button
            onClick={() => onTabChange('parameters')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'parameters' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'
            }`}
          >
            Parameter
          </button>
        </div>
      </div>

      {/* Subdued Context Strip (Informs role capabilities quietly without screaming) */}
      <div className="bg-[#0e1320] border-t border-slate-800/50 px-4 sm:px-6 py-1 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Pengguna Semasa:</span>
            <span className="text-slate-200 font-medium">
              {currentRole === 'boss' ? 'Dr. Farhan Ismail — Pengurus Makmal' : 'Aiman Azaly — Juruteknik Makmal Kanan'}
            </span>
            <span className="hidden sm:inline text-slate-600">·</span>
            <span className="hidden sm:inline text-slate-400">
              {currentRole === 'boss'
                ? 'Hak Akses Penuh: Kelulusan CoA, Parameter Builder, Restock, Clear Off Cuti'
                : 'Hak Akses: Input Data Ujian, Kemaskini Stok Habis, Mohon Cuti (Kelulusan CoA disekat)'}
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[10px]">
            {outOfStockChemicals.length > 0 && (
              <span className="text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {outOfStockChemicals.length} Reagen Habis
              </span>
            )}
            <span className="text-slate-500 hidden md:inline">Lembaga Getah Malaysia (LGM)</span>
          </div>
        </div>
      </div>
    </header>
  );
};
