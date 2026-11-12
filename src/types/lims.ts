export type UserRole = 'staff' | 'boss';

export type RubberCategory = 'NR' | 'Non-NR';

export type SampleStatus = 'Draft' | 'Testing' | 'Pending_Approval' | 'Approved' | 'Rejected';

export type ParameterInputType = 'numeric' | 'text' | 'attachment';

export interface TestParameter {
  id: string;
  name: string;
  category: 'NR' | 'Non-NR' | 'All';
  type: ParameterInputType;
  unit?: string;
  minLimit?: number;
  maxLimit?: number;
  standardMethod?: string;
  description?: string;
  requiredChemicalId?: string; // Links to chemical dependency
  usesSolvent?: boolean; // Indicates if this test uses a chemical solvent
  solventCategory?: 'none' | 'rutin' | 'bukan_selalu' | 'fleksibel'; // Classification of solvent
  defaultSolvent?: string; // e.g. 'Toluene (C7H8)'
  supportedSolvents?: string[]; // List of routine and non-routine solvents available
}

export interface TestResultItem {
  paramId: string;
  paramName: string;
  type: ParameterInputType;
  unit?: string;
  minLimit?: number;
  maxLimit?: number;
  resultValue?: number;
  resultText?: string;
  attachmentUrl?: string;
  status: 'Pass' | 'Fail' | 'Pending';
  testedBy?: string;
  testedAt?: string;
  usedSolvent?: string; // The specific solvent used for this run
  isNonRoutineSolvent?: boolean; // Flag indicating if a non-routine/special solvent was used
  solventBatchNo?: string; // Solvent lot or batch number
  solventNotes?: string; // Special solvent extraction conditions (e.g. 24h soaking at 40°C)
}

export interface SampleRecord {
  id: string;
  category: RubberCategory;
  grade: string;
  originProject: string;
  receivedDate: string;
  targetCompletionDate: string;
  status: SampleStatus;
  tests: TestResultItem[];
  aiSummaryDraft?: string;
  bossRemarks?: string;
  approvedBy?: string;
  approvalDate?: string;
  rejectedReason?: string;
  registeredBy: string;
  priority: 'Biasa (Normal)' | 'Segera (Urgent)' | 'Kritikal (Critical)';
  leadTimeDays?: number; // Configured auto lead time in days (e.g. 20 days for R&D/aging)
}

export interface ChemicalItem {
  id: string;
  name: string;
  chemicalFormula: string;
  purpose: string;
  currentStock: number;
  unit: string;
  minThreshold: number;
  status: 'Tersedia' | 'Rendah' | 'Habis';
  lastUpdatedBy: string;
  lastUpdatedAt: string;
  notes?: string;
  isSolvent?: boolean; // Is this a solvent chemical
  usageFrequency?: 'rutin' | 'bukan_selalu'; // 'rutin' = Selalu pakai, 'bukan_selalu' = Bukan selalu pakai / Khas R&D
  storageLocation?: string; // e.g. "Almari Wasap / Kabinet Flammable"
}

export interface LabScheduleItem {
  id: string;
  title: string;
  type: 'cuti_staff' | 'cuti_umum' | 'penyelenggaraan_mesin' | 'audit';
  staffName?: string;
  startDate: string;
  endDate: string;
  status: 'Aktif' | 'Selesai / Clear Off';
  description: string;
  clearedBy?: string;
  clearedAt?: string;
}

export interface LabProfile {
  labName: string;
  institution: string;
  accreditation: string;
  address: string;
  labManagerName: string;
  labManagerTitle: string;
  staffName: string;
  staffTitle: string;
}
