import { SampleRecord } from '../types/lims';

export const exportSamplesToCSV = (samples: SampleRecord[], filename = 'RubberLab_LIMS_Data.csv') => {
  const headers = [
    'Sample ID',
    'Category',
    'Grade',
    'Project / Client',
    'Received Date',
    'Target Completion',
    'Lead Time (Days)',
    'Status',
    'Priority',
    'Registered By',
    'Approved By',
    'Approval Date',
    'Test Results (JSON Summary)',
  ];

  const rows = samples.map((sample) => {
    const testsSummary = sample.tests
      .map((t) => {
        const val = t.type === 'numeric' ? `${t.resultValue} ${t.unit || ''}` : (t.resultText || 'Attachment');
        const solventInfo = t.usedSolvent 
          ? ` (Solvent: ${t.usedSolvent}${t.isNonRoutineSolvent ? ' [Non-routine]' : ''}${t.solventBatchNo ? ` Lot:${t.solventBatchNo}` : ''})` 
          : '';
        return `${t.paramName}: ${val}${solventInfo} [${t.status}]`;
      })
      .join('; ');

    return [
      `"${sample.id}"`,
      `"${sample.category}"`,
      `"${sample.grade}"`,
      `"${sample.originProject.replace(/"/g, '""')}"`,
      `"${sample.receivedDate}"`,
      `"${sample.targetCompletionDate}"`,
      `"${sample.leadTimeDays ? `${sample.leadTimeDays} Hari` : '-'}"`,
      `"${sample.status}"`,
      `"${sample.priority}"`,
      `"${sample.registeredBy}"`,
      `"${sample.approvedBy || '-'}"`,
      `"${sample.approvalDate || '-'}"`,
      `"${testsSummary.replace(/"/g, '""')}"`,
    ];
  });

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
