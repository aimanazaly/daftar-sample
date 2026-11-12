import React from 'react';
import { LabProfile, SampleRecord } from '../types/lims';
import { 
  X, 
  Printer, 
  Download, 
  FlaskConical, 
  QrCode, 
  FileCheck2 
} from 'lucide-react';
import { exportSamplesToCSV } from '../utils/exportCsv';

interface CertificateOfAnalysisModalProps {
  sample: SampleRecord;
  profile: LabProfile;
  onClose: () => void;
}

export const CertificateOfAnalysisModal: React.FC<CertificateOfAnalysisModalProps> = ({
  sample,
  profile,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const isApproved = sample.status === 'Approved';
  const certNo = `COA-2026-${sample.id.replace('SMP-2026-', '')}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Top Floating Action Bar (Hidden in Print) */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 print:hidden">
        <button
          onClick={handlePrint}
          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xl transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Cetak / Simpan PDF</span>
        </button>

        <button
          onClick={() => exportSamplesToCSV([sample], `${sample.id}_CoA.csv`)}
          className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-xl transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Eksport CSV</span>
        </button>

        <button
          onClick={onClose}
          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 shadow-xl transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Printable Document Card */}
      <div className="bg-white text-slate-900 rounded-xl w-full max-w-4xl p-8 sm:p-12 shadow-2xl my-auto print:p-0 print:m-0 print:shadow-none print:w-full print:max-w-none print:rounded-none">
        {/* Certificate Header */}
        <div className="border-b-2 border-slate-900 pb-5 mb-5">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-lg bg-emerald-900 flex items-center justify-center text-white shrink-0">
                <FlaskConical className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold uppercase tracking-tight text-slate-900">
                  {profile.labName}
                </h2>
                <p className="text-xs text-slate-600 font-medium">{profile.institution}</p>
                <p className="text-[11px] text-slate-500">{profile.address}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded border border-slate-200">
                    {profile.accreditation}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Skim Akreditasi Makmal Malaysia (SAMM)
                  </span>
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs space-y-1">
              <div className="inline-block p-2 border border-slate-200 rounded bg-slate-50">
                <div className="font-mono font-bold text-xs text-slate-900">{certNo}</div>
                <div className="text-[10px] text-slate-500 uppercase">No. Sijil Analisis Rasmi</div>
              </div>
              <div className="text-[11px] text-slate-500">
                Tarikh Dikeluarkan: <strong className="text-slate-800">{sample.approvalDate || '12 November 2026'}</strong>
              </div>
            </div>
          </div>

          <div className="text-center mt-5 pt-3 border-t border-slate-200">
            <h1 className="text-lg font-bold tracking-wider uppercase text-slate-900">
              SIJIL ANALISIS (CERTIFICATE OF ANALYSIS)
            </h1>
          </div>
        </div>

        {/* Pre-approval draft notice if not approved */}
        {!isApproved && (
          <div className="mb-5 p-2.5 bg-amber-50 border border-amber-200 rounded text-amber-900 text-xs flex items-center gap-2 print:hidden">
            <FileCheck2 className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Draf Pra-Kelulusan:</strong> Sampel ini belum diluluskan secara rasmi oleh Pengurus Makmal. Sijil rasmi akan mengandungi tandatangan digital lengkap setelah disahkan.
            </span>
          </div>
        )}

        {/* Sample Particulars Table */}
        <div className="mb-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 pb-1 border-b border-slate-200">
            1. Butiran Sampel Pengujian (Sample Particulars)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/80 p-3.5 rounded border border-slate-200 text-xs">
            <div>
              <span className="text-[11px] text-slate-500 block">ID Sampel Makmal:</span>
              <strong className="font-mono text-slate-900">{sample.id}</strong>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">Klasifikasi Polimer:</span>
              <span className="font-medium text-slate-800">{sample.category === 'NR' ? 'Natural Rubber (NR)' : 'Synthetic (Non-NR)'}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">Gred Getah:</span>
              <span className="font-medium text-slate-800">{sample.grade}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">Tahap Keutamaan:</span>
              <span className="text-slate-700">{sample.priority}</span>
            </div>
            <div className="col-span-2">
              <span className="text-[11px] text-slate-500 block">Projek / Pemilik Sampel:</span>
              <strong className="text-slate-800">{sample.originProject}</strong>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">Tarikh Diterima:</span>
              <span className="font-mono text-slate-700">{sample.receivedDate}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">Diuji Oleh:</span>
              <span className="text-slate-700">{sample.registeredBy}</span>
            </div>
          </div>
        </div>

        {/* Test Results Table */}
        <div className="mb-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 pb-1 border-b border-slate-200">
            2. Keputusan Ujian Makmal (Laboratory Test Results)
          </h3>
          <table className="w-full text-left text-xs border border-slate-300">
            <thead className="bg-slate-100 text-slate-700 text-[10px] font-mono uppercase border-b border-slate-300">
              <tr>
                <th className="px-3 py-2 border-r border-slate-300">Bil</th>
                <th className="px-3 py-2 border-r border-slate-300">Parameter Ujian</th>
                <th className="px-3 py-2 border-r border-slate-300">Kaedah Piawaian</th>
                <th className="px-3 py-2 border-r border-slate-300">Had Spesifikasi</th>
                <th className="px-3 py-2 border-r border-slate-300">Nilai Diperoleh</th>
                <th className="px-3 py-2 text-center">Keputusan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {sample.tests.map((test, index) => (
                <tr key={test.paramId} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                  <td className="px-3 py-2 font-mono text-slate-500 border-r border-slate-200">{index + 1}</td>
                  <td className="px-3 py-2 text-slate-800 border-r border-slate-200">
                    <div className="font-medium text-slate-900">{test.paramName}</div>
                    {test.usedSolvent && (
                      <div className="mt-0.5 text-[10px] text-slate-500 font-normal flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono text-slate-400">Pelarut:</span>
                        <span className={`px-1 py-0.2 rounded font-mono text-[10px] ${
                          test.isNonRoutineSolvent
                            ? 'bg-amber-100 text-amber-900 font-semibold border border-amber-300'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {test.usedSolvent}
                          {test.isNonRoutineSolvent && ' [Bukan Rutin]'}
                        </span>
                        {test.solventBatchNo && (
                          <span className="font-mono text-[9px] text-slate-400">Lot: {test.solventBatchNo}</span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2 text-slate-600 text-[11px] font-mono border-r border-slate-200">
                    {test.paramId === 'p-01'
                      ? 'ISO 289-1'
                      : test.paramId === 'p-04'
                      ? 'ISO 249'
                      : test.paramId === 'p-05'
                      ? 'ISO 248'
                      : test.paramId === 'p-03'
                      ? 'ISO 6502'
                      : test.paramId === 'p-09'
                      ? 'ISO 1817 / ASTM D471'
                      : 'MS 1387'}
                  </td>
                  <td className="px-3 py-2 text-slate-600 font-mono text-[11px] border-r border-slate-200">
                    {test.type === 'numeric'
                      ? test.minLimit !== undefined && test.maxLimit !== undefined
                        ? `${test.minLimit} – ${test.maxLimit} ${test.unit || ''}`
                        : test.maxLimit !== undefined
                        ? `Maks. ${test.maxLimit} ${test.unit || ''}`
                        : `Min. ${test.minLimit} ${test.unit || ''}`
                      : 'Kriteria Kualitatif'}
                  </td>
                  <td className="px-3 py-2 font-mono font-bold text-slate-900 border-r border-slate-200">
                    {test.type === 'numeric'
                      ? `${test.resultValue ?? '-'} ${test.unit || ''}`
                      : test.type === 'text'
                      ? test.resultText || '-'
                      : 'Lengkuk Disahkan'}
                  </td>
                  <td className="px-3 py-2 text-center font-bold">
                    <span className={`text-[10px] font-mono ${
                      test.status === 'Pass' ? 'text-emerald-800' : 'text-rose-800'
                    }`}>
                      {test.status === 'Pass' ? 'MEMENUHI' : 'GAGAL'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Rheometer Curve Attachment */}
        {sample.tests.some((t) => t.type === 'attachment' && t.attachmentUrl) && (
          <div className="mb-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 pb-1 border-b border-slate-200">
              3. Profil Lengkuk Pemvulkanan Reometer MDR (Rheometer Cure Curve)
            </h3>
            <div className="border border-slate-300 rounded p-2.5 bg-slate-900 max-w-lg mx-auto">
              <img
                src={sample.tests.find((t) => t.type === 'attachment')!.attachmentUrl}
                alt="Rheometer Curve"
                className="w-full h-auto rounded"
              />
            </div>
          </div>
        )}

        {/* Technical Verdict */}
        <div className="mb-5 bg-slate-50 p-3.5 rounded border border-slate-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 pb-1 border-b border-slate-200">
            4. Ulasan & Rumusan Teknikal Makmal (Technical Assessment & Verdict)
          </h3>
          <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line font-sans">
            {sample.aiSummaryDraft || 'Sampel mematuhi had spesifikasi yang ditetapkan dan layak diperakukan.'}
          </p>
          {sample.bossRemarks && (
            <div className="mt-2.5 pt-2 border-t border-slate-200 text-xs text-slate-700 italic">
              <strong>Catatan Pengurus Makmal:</strong> &ldquo;{sample.bossRemarks}&rdquo;
            </div>
          )}
        </div>

        {/* Sign-off & Seal */}
        <div className="pt-4 border-t-2 border-slate-800 grid grid-cols-2 gap-8 items-end">
          <div>
            <div className="text-[10px] text-slate-500 space-y-0.5">
              <p>• Keputusan ini hanya sah untuk sampel yang diuji seperti yang diterima di makmal.</p>
              <p>• Sijil ini tidak boleh diterbitkan semula sebahagiannya tanpa kelulusan bertulis.</p>
              <p>• Disahkan di bawah peruntukan piawaian MS ISO/IEC 17025:2017.</p>
            </div>
            <div className="mt-2.5 flex items-center gap-2">
              <QrCode className="w-8 h-8 text-slate-400" />
              <div className="text-[9px] text-slate-400 font-mono">
                VERIFIKASI DIGITAL: {certNo}
                <br />
                PENGESAHAN MAKMAL LGM
              </div>
            </div>
          </div>

          <div className="text-right space-y-1">
            <div className="inline-block text-center border-b border-slate-900 pb-1 px-8 min-w-[180px]">
              {isApproved ? (
                <div className="space-y-0.5">
                  <div className="font-serif italic font-bold text-base text-slate-900">
                    Dr. Farhan Ismail
                  </div>
                  <div className="text-[9px] font-mono text-emerald-800 font-medium">
                    [DISAHKAN SECARA DIGITAL]
                  </div>
                </div>
              ) : (
                <div className="h-8 text-slate-400 italic text-xs flex items-center justify-center">
                  (Menunggu Tandatangan)
                </div>
              )}
            </div>
            <div className="font-bold text-xs text-slate-900">{profile.labManagerName}</div>
            <div className="text-[10px] text-slate-600">{profile.labManagerTitle}</div>
            <div className="text-[10px] text-slate-500">
              Tarikh: {sample.approvalDate || '12 November 2026'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
