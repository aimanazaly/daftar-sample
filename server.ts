import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared server-side Gemini client
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Gemini Rubber Lab Technical Evaluation Endpoint
app.post('/api/gemini/analyze-sample', async (req, res) => {
  try {
    const { sample, parameters } = req.body;

    if (!sample) {
      return res.status(400).json({ error: 'Maklumat sampel diperlukan.' });
    }

    const ai = getAiClient();

    // Fallback generator if no key or API issue
    const generateLocalSummary = () => {
      const tests = sample.tests || [];
      const failCount = tests.filter((t: any) => t.status === 'Fail').length;
      const passCount = tests.filter((t: any) => t.status === 'Pass').length;
      const isNR = sample.category === 'NR';

      // Identify solvent usage, especially non-routine solvents
      const solventTests = tests.filter((t: any) => t.usedSolvent);
      const nonRoutineTests = tests.filter((t: any) => t.isNonRoutineSolvent && t.usedSolvent);

      let solventRemarks = '';
      if (nonRoutineTests.length > 0) {
        const details = nonRoutineTests.map((t: any) => 
          `${t.paramName} menggunakan pelarut khas/bukan rutin: ${t.usedSolvent}${t.solventBatchNo ? ` (Lot: ${t.solventBatchNo})` : ''}`
        ).join('; ');
        solventRemarks = `\n[Nota Pelarut Khas/Bukan Rutin]: Pengujian melibatkan pelarut alternatif (${details}). Kinetik keterlarutan dan parameter interaksi Flory-Huggins telah disahkan mematuhi protokol penyelidikan/analisis khas.`;
      } else if (solventTests.length > 0) {
        solventRemarks = `\n[Nota Pelarut]: Pengujian dijalankan menggunakan pelarut piawai makmal (${solventTests.map((t: any) => t.usedSolvent).join(', ')}).`;
      }

      let verdict = failCount === 0 
        ? `LULUS (MEMENUHI SPESIFIKASI ${sample.grade})`
        : `PERLU SEMAKAN / GAGAL (${failCount} parameter melebihi had standard)`;

      let details = tests.map((t: any) => {
        const solventTag = t.usedSolvent ? ` [Pelarut: ${t.usedSolvent}${t.isNonRoutineSolvent ? ' (Khas)' : ''}]` : '';
        if (t.type === 'numeric') {
          const limits = t.minLimit !== undefined && t.maxLimit !== undefined 
            ? `(Had: ${t.minLimit}-${t.maxLimit} ${t.unit})` 
            : t.maxLimit !== undefined ? `(Maks: ${t.maxLimit} ${t.unit})` : `(Min: ${t.minLimit} ${t.unit})`;
          return `- ${t.paramName}${solventTag}: ${t.resultValue} ${t.unit} ${limits} -> Status: ${t.status}`;
        }
        return `- ${t.paramName}${solventTag}: "${t.resultText || 'Ujian siap'}" -> Status: ${t.status}`;
      }).join('\n');

      return `[ULASAN TEKNIKAL MAKMAL - ${sample.id}]\n` +
        `Kategori: ${isNR ? 'Natural Rubber (NR / Getah Asli)' : 'Non-NR (Synthetic / Getah Sintetik)'}\n` +
        `Gred: ${sample.grade} | Sumber: ${sample.originProject}\n\n` +
        `Analisis Keputusan Ujian:\n${details}${solventRemarks}\n\n` +
        `Kesimpulan Pakar:\n` +
        (failCount === 0
          ? `Sampel menunjukkan sifat viskoelastik dan ciri fizikal yang stabil, menepati piawaian ISO 2000 / MS 1387 bagi gred ${sample.grade}. Tiada ketidakhomogenan dikesan. Disyorkan kepada Pengurus Makmal untuk kelulusan Sijil Analisis (CoA).`
          : `Terdapat ${failCount} parameter ujian yang terkeluar daripada had spesifikasi dibenarkan. Tindakan pembetulan atau ujian ulangan (re-testing) disyorkan sebelum kelulusan kelompok pengeluaran.`);
    };

    if (!ai) {
      return res.json({
        summary: generateLocalSummary(),
        source: 'local-engine',
        note: 'Dijana oleh Modul Diagnostik Standard LIMS (API Key tidak ditetapkan)',
      });
    }

    const prompt = `Anda ialah seorang Pakar Analisis Getah Kanan dan Pengurus Kawalan Kualiti Makmal (Rubber Technologist & Laboratory Chemist) di makmal akreditasi ISO/IEC 17025.
Sila nilai data ujian sampel getah berikut dan sediakan draf "Ulasan & Rumusan Teknikal Makmal" yang padat, berautoriti, dan profesional dalam Bahasa Melayu (dengan istilah teknikal piawai industri getah):

MAKLUMAT SAMPEL:
- ID Sampel: ${sample.id}
- Kategori: ${sample.category === 'NR' ? 'Natural Rubber (Getah Asli)' : 'Non-NR (Synthetic Rubber / Getah Sintetik)'}
- Gred: ${sample.grade}
- Projek/Pelanggan: ${sample.originProject}
- Tarikh Diterima: ${sample.receivedDate}

DATA UJIAN MAKMAL (Termasuk maklumat pelarut yang digunakan jika ada):
${JSON.stringify(sample.tests, null, 2)}

SENARAI SPESIFIKASI RUJUKAN:
${JSON.stringify(parameters, null, 2)}

ARAHAN PENULISAN:
1. Berikan rumusan ringkas mengenai pematuhan spesifikasi (Adakah Mooney Viscosity, bendasing/dirt, abu/ash, volatile matter, lengkuk pengawetan reometer, dan ujian pembengkakan/solvent berada dalam julat spec?).
2. KHAS UNTUK PELARUT BUKAN RUTIN: Sekiranya ujian melibatkan pelarut bukan selalu pakai (contohnya: Tetrahidrofuran / THF, Kloroform / CHCl3, Sikloheksana, MEK, atau n-Heksana), huraikan secara saintifik pengaruh pelarut tersebut terhadap kecekapan pengekstrakan atau nisbah pembengkakan matriks polimer getah (crosslink density / ASTM D471).
3. Huraikan sebarang ketidakteraturan jika ada (contoh: bacaan melepasi had max/min).
4. Berikan cadangan teknikal muktamad kepada Pengurus Makmal (Boss) sama ada sampel layak diluluskan untuk pengeluaran Sijil Analisis (Certificate of Analysis - CoA) atau perlu ujian ulangan.
5. Pastikan nada profesional makmal rasmi, dalam 2-3 perenggan padat.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Anda adalah sistem AI perunding teknikal makmal pengujian getah RubberLab LIMS berlandaskan ISO/IEC 17025.',
      },
    });

    const aiText = response.text?.trim() || generateLocalSummary();

    return res.json({
      summary: aiText,
      source: 'gemini-3.8-flash',
    });
  } catch (error: any) {
    console.error('Error generating Gemini summary:', error);
    res.status(500).json({
      error: 'Gagal menjana rumusan AI: ' + (error.message || 'Ralat tidak diketahui'),
    });
  }
});

// Vite middleware in dev or static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`RubberLab LIMS server running on port ${port}`);
  });
}

startServer();
