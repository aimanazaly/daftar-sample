import React, { useState } from 'react';
import { SampleRecord, UserRole } from '../types/lims';
import { 
  X, 
  ShieldCheck, 
  Check, 
  XCircle, 
  AlertTriangle
} from 'lucide-react';

interface BossReviewModalProps {
  currentRole: UserRole;
  sample: SampleRecord;
  onClose: () => void;
  onApproveAndSign: (sample: SampleRecord, bossRemarks: string, editedAiSummary: string) => void;
  onRejectSample: (sample: SampleRecord, reason: string) => void;
  onSwitchToBoss?: () => void;
}

export const BossReviewModal: React.FC<BossReviewModalProps> = ({
  currentRole,
  sample,
  onClose,
  onApproveAndSign,
  onRejectSample,
  onSwitchToBoss,
}) => {
  const [aiSummary, setAiSummary] = useState(sample.aiSummaryDraft || '');
  const [bossRemarks, setBossRemarks] = useState(
    sample.bossRemarks || 'Keputusan ujian makmal disahkan mematuhi spesifikasi piawaian standard. Sijil Analisis diluluskan untuk pengeluaran rasmi.'
  );
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  const passCount = sample.tests.filter((t) => t.status === 'Pass').length;
  const failCount = sample.tests.filter((t) => t.status === 'Fail').length;

  const handleApprove = () => {
    onApproveAndSign(sample, bossRemarks, aiSummary);
    onClose();
  };

  const handleReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectReason.trim()) return;
    onRejectSample(sample, rejectReason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#0f1420] border border-slate-800 rounded-xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl text-white my-auto">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-[#0b101b] rounded-t-xl">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-950 border border-amber-800/80 rounded-md text-amber-300">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Konsol Semakan & Kelulusan Pengurus Makmal (Boss Sign-off)
              </h3>
              <p className="text-[11px] text-slate-400">
                Sampel: <strong className="font-mono text-white">{sample.id}</strong> · {sample.grade}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Staff Warning */}
          {currentRole !== 'boss' && (
            <div className="p-3 bg-amber-950/30 border border-amber-800/60 rounded-lg flex items-center justify-between gap-3 text-amber-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Anda berada dalam mod <strong>Staf (Aiman)</strong>. Hanya Pengurus Makmal (Dr. Farhan) mempunyai kuasa menurunkan tandatangan kelulusan CoA rasmi.
                </span>
              </div>
              {onSwitchToBoss && (
                <button
                  type="button"
                  onClick={onSwitchToBoss}
                  className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded font-medium text-xs transition-colors shrink-0"
                >
                  Tukar ke Mod Boss
                </button>
              )}
            </div>
          )}

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 text-[11px] block">Keputusan Parameter:</span>
              <strong className="text-white font-mono">{passCount} Lulus / {failCount} Gagal</strong>
            </div>
            <div>
              <span className="text-slate-500 text-[11px] block">Didaftar Oleh:</span>
              <span className="text-slate-200">{sample.registeredBy}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[11px] block">Tarikh Terima:</span>
              <span className="font-mono text-slate-200">{sample.receivedDate}</span>
            </div>
          </div>

          {/* Test results review table */}
          <div className="border border-slate-800 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b101b] text-slate-400 text-[11px] font-mono uppercase border-b border-slate-800">
                <tr>
                  <th className="px-3 py-2">Parameter</th>
                  <th className="px-3 py-2">Had Spesifikasi</th>
                  <th className="px-3 py-2">Nilai Diukur</th>
                  <th className="px-3 py-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                {sample.tests.map((test) => (
                  <tr key={test.paramId}>
                    <td className="px-3 py-2 text-white font-medium">
                      <div>{test.paramName}</div>
                      {test.usedSolvent && (
                        <div className="text-[10px] text-slate-400 font-normal flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <span className="text-slate-500 font-mono">Pelarut:</span>
                          <span className={`font-mono px-1 py-0.2 rounded text-[10px] ${
                            test.isNonRoutineSolvent
                              ? 'bg-amber-950/70 text-amber-300 border border-amber-800/80 font-medium'
                              : 'bg-slate-800 text-slate-300'
                          }`}>
                            {test.usedSolvent}
                            {test.isNonRoutineSolvent && ' [Khas]'}
                          </span>
                          {test.solventBatchNo && (
                            <span className="font-mono text-[9px] text-slate-500">Lot: {test.solventBatchNo}</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2 text-slate-400 font-mono text-[11px]">
                      {test.type === 'numeric'
                        ? test.minLimit !== undefined && test.maxLimit !== undefined
                          ? `${test.minLimit} – ${test.maxLimit} ${test.unit || ''}`
                          : test.maxLimit !== undefined
                          ? `Maks. ${test.maxLimit} ${test.unit || ''}`
                          : `Min. ${test.minLimit} ${test.unit || ''}`
                        : 'Kualitatif'}
                    </td>
                    <td className="px-3 py-2 font-mono font-semibold text-white">
                      {test.type === 'numeric'
                        ? `${test.resultValue ?? '-'} ${test.unit || ''}`
                        : test.type === 'text'
                        ? test.resultText || '-'
                        : 'Lengkuk Siap'}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <span className={`font-medium ${test.status === 'Pass' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {test.status === 'Pass' ? 'Lulus' : 'Gagal'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* AI Summary Editor */}
          <div className="space-y-1 bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
              <span>Ulasan Teknikal Getah Gemini AI (Boleh disunting terus oleh Boss):</span>
              <span className="text-[11px] text-slate-500 font-normal">Akan dicetak pada CoA</span>
            </div>
            <textarea
              rows={3}
              disabled={currentRole !== 'boss'}
              value={aiSummary}
              onChange={(e) => setAiSummary(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-amber-500 leading-relaxed font-sans"
            ></textarea>
          </div>

          {/* Boss Official Remark */}
          <div className="space-y-1 bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
            <span className="text-xs font-semibold text-slate-200 block">
              Catatan Pengesahan Pengurus Makmal (Dr. Farhan Ismail):
            </span>
            <textarea
              rows={2}
              disabled={currentRole !== 'boss'}
              value={bossRemarks}
              onChange={(e) => setBossRemarks(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-amber-500 leading-relaxed font-sans"
            ></textarea>
          </div>

          {/* Rejection field */}
          {isRejecting && (
            <div className="p-3.5 bg-rose-950/20 border border-rose-800/60 rounded-lg space-y-2">
              <span className="font-semibold text-rose-300 block">
                Sebab Penolakan Sampel (Ujian Semula Diperlukan):
              </span>
              <textarea
                rows={2}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Nyatakan sebab sampel tidak diluluskan..."
                className="w-full px-3 py-1.5 bg-slate-900 border border-rose-800/70 rounded text-white"
              ></textarea>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRejecting(false)}
                  className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded text-xs"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleReject}
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded font-semibold text-xs"
                >
                  Sahkan Tolak Sampel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-[#0b101b] flex items-center justify-between gap-2 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors text-xs"
          >
            Tutup
          </button>

          <div className="flex items-center gap-2">
            {!isRejecting && (
              <button
                type="button"
                disabled={currentRole !== 'boss'}
                onClick={() => setIsRejecting(true)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-rose-950/40 text-rose-300 border border-slate-800 hover:border-rose-800/50 rounded-md font-medium transition-colors text-xs disabled:opacity-40"
              >
                Tolak Sampel
              </button>
            )}

            <button
              type="button"
              disabled={currentRole !== 'boss'}
              onClick={handleApprove}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md font-semibold flex items-center gap-1.5 transition-colors text-xs shadow-sm disabled:opacity-40"
            >
              <Check className="w-4 h-4" />
              <span>Luluskan & Tandatangan (Approve & Sign)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
