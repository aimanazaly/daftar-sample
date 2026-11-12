import React, { useState, useEffect } from 'react';
import { 
  ChemicalItem, 
  LabProfile, 
  LabScheduleItem, 
  SampleRecord, 
  TestParameter, 
  UserRole 
} from './types/lims';
import { 
  loadStoredChemicals, 
  loadStoredParameters, 
  loadStoredProfile, 
  loadStoredSchedule, 
  loadStoredSamples, 
  saveStoredChemicals, 
  saveStoredParameters, 
  saveStoredProfile, 
  saveStoredSchedule, 
  saveStoredSamples,
  resetAllDataToDefault 
} from './utils/storage';
import { Header } from './components/Header';
import { MonitoringOverview } from './components/MonitoringOverview';
import { SampleTable } from './components/SampleTable';
import { ChemicalInventoryTab } from './components/ChemicalInventoryTab';
import { LabScheduleTab } from './components/LabScheduleTab';
import { CustomParametersTab } from './components/CustomParametersTab';
import { SampleIntakeModal } from './components/SampleIntakeModal';
import { TestingDataModal } from './components/TestingDataModal';
import { BossReviewModal } from './components/BossReviewModal';
import { CertificateOfAnalysisModal } from './components/CertificateOfAnalysisModal';
import { RotateCcw } from 'lucide-react';

export default function App() {
  // State
  const [currentRole, setCurrentRole] = useState<UserRole>('staff');
  const [activeTab, setActiveTab] = useState<'samples' | 'monitoring' | 'chemicals' | 'schedule' | 'parameters'>('monitoring');

  const [samples, setSamples] = useState<SampleRecord[]>(() => loadStoredSamples());
  const [parameters, setParameters] = useState<TestParameter[]>(() => loadStoredParameters());
  const [chemicals, setChemicals] = useState<ChemicalItem[]>(() => loadStoredChemicals());
  const [schedules, setSchedules] = useState<LabScheduleItem[]>(() => loadStoredSchedule());
  const [profile, setProfile] = useState<LabProfile>(() => loadStoredProfile());

  // Modals state
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState(false);
  const [activeModalSample, setActiveModalSample] = useState<SampleRecord | null>(null);
  const [sampleModalAction, setSampleModalAction] = useState<'test' | 'review' | 'coa' | null>(null);
  const [chemicalToEdit, setChemicalToEdit] = useState<ChemicalItem | undefined>(undefined);

  // Persistence effects
  useEffect(() => {
    saveStoredSamples(samples);
  }, [samples]);

  useEffect(() => {
    saveStoredParameters(parameters);
  }, [parameters]);

  useEffect(() => {
    saveStoredChemicals(chemicals);
  }, [chemicals]);

  useEffect(() => {
    saveStoredSchedule(schedules);
  }, [schedules]);

  useEffect(() => {
    saveStoredProfile(profile);
  }, [profile]);

  // Handlers for Samples
  const handleAddSample = (newSample: SampleRecord) => {
    setSamples((prev) => [newSample, ...prev]);
    setIsIntakeModalOpen(false);
    setActiveTab('samples');
  };

  const handleUpdateSample = (updatedSample: SampleRecord) => {
    setSamples((prev) => prev.map((s) => (s.id === updatedSample.id ? updatedSample : s)));
  };

  const handleApproveAndSign = (sample: SampleRecord, bossRemarks: string, editedAiSummary: string) => {
    const updated: SampleRecord = {
      ...sample,
      status: 'Approved',
      bossRemarks,
      aiSummaryDraft: editedAiSummary,
      approvedBy: 'Dr. Farhan Ismail (Lab Manager)',
      approvalDate: new Date().toISOString().substring(0, 10),
    };
    handleUpdateSample(updated);
  };

  const handleRejectSample = (sample: SampleRecord, reason: string) => {
    const updated: SampleRecord = {
      ...sample,
      status: 'Rejected',
      rejectedReason: reason,
    };
    handleUpdateSample(updated);
  };

  // Handlers for Chemicals
  const handleUpdateChemical = (updatedChem: ChemicalItem) => {
    setChemicals((prev) => prev.map((c) => (c.id === updatedChem.id ? updatedChem : c)));
  };

  const handleAddChemical = (newChem: ChemicalItem) => {
    setChemicals((prev) => [newChem, ...prev]);
  };

  const handleDeleteChemical = (id: string) => {
    setChemicals((prev) => prev.filter((c) => c.id !== id));
  };

  // Handlers for Schedule & Clear Off
  const handleClearOffSchedule = (id: string) => {
    const clearedBy = currentRole === 'boss' ? 'Dr. Farhan Ismail (Boss)' : 'Aiman Azaly (Staff)';
    const clearedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setSchedules((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'Selesai / Clear Off',
              clearedBy,
              clearedAt,
            }
          : item
      )
    );
  };

  const handleReactivateSchedule = (id: string) => {
    setSchedules((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'Aktif',
              clearedBy: undefined,
              clearedAt: undefined,
            }
          : item
      )
    );
  };

  const handleAddSchedule = (newSchedule: LabScheduleItem) => {
    setSchedules((prev) => [newSchedule, ...prev]);
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  };

  // Handlers for Parameters
  const handleAddParameter = (newParam: TestParameter) => {
    setParameters((prev) => [...prev, newParam]);
  };

  const handleUpdateParameter = (updatedParam: TestParameter) => {
    setParameters((prev) => prev.map((p) => (p.id === updatedParam.id ? updatedParam : p)));
  };

  const handleDeleteParameter = (id: string) => {
    setParameters((prev) => prev.filter((p) => p.id !== id));
  };

  // Reset to initial demo data
  const handleResetData = () => {
    if (window.confirm('Adakah anda pasti ingin menetapkan semula semua data kepada data contoh asal?')) {
      resetAllDataToDefault();
      window.location.reload();
    }
  };

  const pendingApprovalCount = samples.filter((s) => s.status === 'Pending_Approval').length;

  return (
    <div className="min-h-screen bg-[#090d14] text-slate-100 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* Top Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        chemicals={chemicals}
        schedules={schedules}
        pendingApprovalCount={pendingApprovalCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'monitoring' && (
          <MonitoringOverview
            currentRole={currentRole}
            samples={samples}
            chemicals={chemicals}
            schedules={schedules}
            onOpenIntakeModal={() => setIsIntakeModalOpen(true)}
            onOpenChemicalModal={(chem) => {
              setChemicalToEdit(chem);
              setActiveTab('chemicals');
            }}
            onClearOffSchedule={handleClearOffSchedule}
            onSelectSample={(sample, action) => {
              setActiveModalSample(sample);
              setSampleModalAction(action);
            }}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'samples' && (
          <SampleTable
            currentRole={currentRole}
            samples={samples}
            onOpenIntakeModal={() => setIsIntakeModalOpen(true)}
            onSelectSample={(sample, action) => {
              setActiveModalSample(sample);
              setSampleModalAction(action);
            }}
          />
        )}

        {activeTab === 'chemicals' && (
          <ChemicalInventoryTab
            currentRole={currentRole}
            chemicals={chemicals}
            onUpdateChemical={handleUpdateChemical}
            onAddChemical={handleAddChemical}
            onDeleteChemical={handleDeleteChemical}
            onOpenQuickModal={(chem) => {
              setChemicalToEdit(chem);
            }}
          />
        )}

        {activeTab === 'schedule' && (
          <LabScheduleTab
            currentRole={currentRole}
            schedules={schedules}
            onAddSchedule={handleAddSchedule}
            onClearOffSchedule={handleClearOffSchedule}
            onReactivateSchedule={handleReactivateSchedule}
            onDeleteSchedule={handleDeleteSchedule}
          />
        )}

        {activeTab === 'parameters' && (
          <CustomParametersTab
            currentRole={currentRole}
            parameters={parameters}
            chemicals={chemicals}
            onAddParameter={handleAddParameter}
            onUpdateParameter={handleUpdateParameter}
            onDeleteParameter={handleDeleteParameter}
            onRoleSwitch={setCurrentRole}
          />
        )}
      </main>

      {/* Sample Intake Modal */}
      {isIntakeModalOpen && (
        <SampleIntakeModal
          currentRole={currentRole}
          parameters={parameters}
          existingSamples={samples}
          onClose={() => setIsIntakeModalOpen(false)}
          onSubmit={handleAddSample}
        />
      )}

      {/* Testing Data Modal */}
      {activeModalSample && sampleModalAction === 'test' && (
        <TestingDataModal
          currentRole={currentRole}
          sample={activeModalSample}
          parameters={parameters}
          chemicals={chemicals}
          onClose={() => {
            setActiveModalSample(null);
            setSampleModalAction(null);
          }}
          onSaveSample={handleUpdateSample}
        />
      )}

      {/* Boss Review & Approval Modal */}
      {activeModalSample && sampleModalAction === 'review' && (
        <BossReviewModal
          currentRole={currentRole}
          sample={activeModalSample}
          onClose={() => {
            setActiveModalSample(null);
            setSampleModalAction(null);
          }}
          onApproveAndSign={handleApproveAndSign}
          onRejectSample={handleRejectSample}
          onSwitchToBoss={() => setCurrentRole('boss')}
        />
      )}

      {/* Official Certificate of Analysis Modal */}
      {activeModalSample && sampleModalAction === 'coa' && (
        <CertificateOfAnalysisModal
          sample={activeModalSample}
          profile={profile}
          onClose={() => {
            setActiveModalSample(null);
            setSampleModalAction(null);
          }}
        />
      )}

      {/* Bottom Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            RubberLab LIMS © 2026. Standard Pengujian Getah Asli (NR) & Sintetik ISO/IEC 17025.
          </div>
          <div className="flex items-center gap-4">
            <span>
              Peranan Aktif:{' '}
              <strong className={currentRole === 'boss' ? 'text-amber-400' : 'text-emerald-400'}>
                {currentRole === 'boss' ? 'Dr. Farhan Ismail (Boss)' : 'Aiman Azaly (Staff)'}
              </strong>
            </span>
            <button
              onClick={handleResetData}
              className="text-slate-400 hover:text-slate-200 flex items-center gap-1 transition"
              title="Tetapkan semula data contoh"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Demo
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
