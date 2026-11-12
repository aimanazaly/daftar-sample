# Rekod Perubahan (Changelog)

Semua perubahan ketara pada sistem **RubberLab LIMS** didokumenkan dalam fail ini mengikut urutan kronologi.

Format dokumen ini berasaskan prinsip [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.2.0] - 2026-11-12

### Ditambah (Added)
- **Fungsi Auto Lead Time 20 Hari**: Butang satu-klik pada borang pendaftaran sampel yang mengira dan menetapkan tarikh sasaran siap secara automatik kepada 20 hari dari tarikh terima (khusus untuk ujian penuaan, kestabilan, atau R&D getah).
- **Butang Custom Hari**: Kawalan interaktif yang membolehkan pengguna menetapkan bilangan hari tersuai secara dinamik berserta butang pintas (14d, 20d, 30d, 45d) dan kawalan stepper `[ - ] [ + ]`.
- **Penyegerakan Tarikh Pintar**: Tarikh sasaran siap dikira semula secara automatik sekiranya pengguna menukar tarikh terima sampel.
- **Lencana SLA pada Jadual Sampel**: Paparan status tempoh siap (contohnya `20d SLA`) pada baris jadual sampel makmal.
- **Lajur Lead Time dalam Eksport CSV**: Fail muat turun CSV kini merekodkan maklumat tempoh masa pengujian secara terperinci.
- **Dokumentasi Komprehensif Projek**:
  - `README.md`: Pengenalan ringkas dan mesra pengguna umum.
  - `docs/PANDUAN-PENGGUNA.md`: Panduan operasi langkah demi langkah.
  - `docs/KEPERLUAN-PRODUK.md`: Spesifikasi keperluan produk (PRD) berpandukan dokumen asal.
  - `docs/STATUS-DAN-ROADMAP.md`: Status fungsian sebenar, batasan teknikal, dan perancangan masa depan.
  - `docs/DATA-DAN-PRIVASI.md`: Polisi pengendalian data, keselamatan peranan, dan privasi AI.
  - `docs/SETUP-DAN-PENYELENGGARAAN.md`: Panduan pemasangan tempatan dan arahan penyambungan ke GitHub.

---

## [1.1.0] - 2026-11-11

### Ditambah (Added)
- **Penyesuaian Pelarut Kimia Bukan Selalu Pakai (*Non-Routine Solvents*)**:
  - Sokongan pemilihan pelarut khas R&D seperti Tetrahidrofuran (THF), Kloroform (CHCl₃), Sikloheksana, Metil Etil Keton (MEK), dan n-Heksana.
  - Parameter baharu: *Solvent Swelling & Crosslink Density* mengikut piawaian ISO 1817 / ASTM D471.
  - Perekodan nombor lot pelarut (*Solvent Batch No*) untuk pematuhan kebolehkesanan ISO 17025.
  - Semakan baki stok inventori pelarut dengan amaran stok rendah secara langsung semasa pengisian ujian.
- **Pengurusan Jadual Makmal & Cuti dengan Fungsi "Clear Off"**:
  - Modul perekodan cuti staf, cuti umum, dan kalibrasi mesin makmal.
  - Butang **Clear Off** yang merekodkan pengesahan penamatan cuti berserta nama staf dan masa.
- **Penilaian Pelarut oleh Gemini AI**:
  - Prompt pelayan Gemini AI diperkaya untuk menganalisis sifat termodinamik pengekstrakan pelarut dan ketumpatan sambung-silang (*crosslink density*) polimer getah.
- **Kemas Kini Sijil Analisis (CoA)**:
  - Paparan nama pelarut kimia, lencana `[Bukan Rutin]`, dan kaedah piawaian ISO 1817 pada dokumen CoA rasmi.

### Diubah (Changed)
- **Reka Bentuk Visual Makmal**:
  - Menggantikan susun atur generik kepada reka bentuk instrumen makmal klinikal ISO/IEC 17025 (palet gelap Slate, Zamrud untuk getah asli, Amber untuk amaran, dan angka berjadual *tabular-nums*).

---

## [1.0.0] - 2026-11-10 (MVP Asal)

### Ditambah (Added)
- Inisialisasi seni bina teras RubberLab LIMS (React 19, TypeScript, Tailwind CSS v4, Express.js).
- Suis dwi-peranan pantas (*Role Switcher*): Lab Staff (Aiman Azaly) vs Boss (Dr. Farhan Ismail).
- Modul pendaftaran sampel getah asli (NR) dan getah sintetik (Non-NR) dengan penjanaan ID unik.
- Pembina parameter tersuai (*Custom Parameter Builder*) oleh pengurus makmal.
- Kemasukan bacaan ujian makmal dengan pengesahan julat had spesifikasi secara automatik (*Pass* / *Fail*).
- Sokongan muat naik lengkuk pemvulkanan Reometer MDR (*Rheometer Cure Curve*).
- Penjanaan draf ulasan teknikal makmal berbantukan model Gemini AI dengan sandaran diagnostik tempatan.
- Konsol semakan dan tandatangan digital kelulusan Sijil Analisis (CoA) oleh Boss.
- Templat Sijil Analisis standard makmal sedia cetak (PDF) dan eksport lembaran kerja CSV.
- Pengekalan data menggunakan simpanan tempatan pelayar (*browser localStorage*).
