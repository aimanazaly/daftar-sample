# Panduan Pemasangan & Penyelenggaraan (Setup & Maintenance)

Dokumen ini mengandungi arahan teknikal untuk memasang, menjalankan, menguji, dan menyambungkan sistem **RubberLab LIMS** ke GitHub.

---

## 1. Keperluan Sistem (System Requirements)

Sebelum memulakan, pastikan persekitaran komputer anda mempunyai:
- **Node.js**: Versi 18.x, 20.x, atau terkini (disyorkan Node.js 20+).
- **Pengurus Pakej (Package Manager)**: `npm` (terbina dalam Node.js) atau `pnpm` / `yarn`.
- **Git**: Dipasang untuk pengurusan versi kod.
- **Pelayar Web Moden**: Google Chrome, Mozilla Firefox, Microsoft Edge, atau Safari terkini.

---

## 2. Arahan Pemasangan Tempatan (Local Setup)

### Langkah 1: Klon atau Buka Direktori Projek
```bash
# Sekiranya mengklon dari GitHub:
git clone https://github.com/USERNAME/rubberlab-lims.git
cd rubberlab-lims
```

### Langkah 2: Pasang Ketergantungan (Install Dependencies)
Pasang semua pakej perisian yang diperlukan:
```bash
npm install
```

### Langkah 3: Tetapkan Pemboleh Ubah Persekitaran (Environment Variables)
Salin fail `.env.example` kepada `.env`:
```bash
cp .env.example .env
```

Buka fail `.env` dan tetapkan nilai jika berkaitan:
```env
# GEMINI_API_KEY: Kunci API Google AI Studio untuk menjana rumusan teknikal getah.
# (Pilihan: Sekiranya dikosongkan, sistem akan menggunakan enjin diagnostik makmal tempatan sebagai ganti).
GEMINI_API_KEY="kunci_api_gemini_anda_di_sini"

# PORT: Port pelayan tempatan (lalai: 3000)
PORT=3000

# APP_URL: Alamat URL aplikasi (digunakan untuk rujukan dalaman dan link pautan)
APP_URL="http://localhost:3000"
```

---

## 3. Menjalankan Aplikasi

### Mod Pembangunan (Development Mode)
Jalankan arahan berikut untuk memulakan pelayan pembangunan:
```bash
npm run dev
```
Pelayan Express dan Vite akan berjalan serentak. Buka pelayar web anda di:
`http://localhost:3000`

### Membina untuk Pengeluaran (Production Build)
Untuk menguji binaan statik pengeluaran:
```bash
# Mengkompilasi fail frontend ke dalam folder dist/
npm run build

# Menjalankan pelayan pengeluaran
npm start
```

### Semakan Kod & Linter
Untuk memastikan tiada sebarang ralat jenis data TypeScript atau import yang hilang:
```bash
npm run lint
```

---

## 4. Panduan Menyambungkan Projek ke GitHub

Sekiranya anda ingin menyimpan dan menyegerakkan projek ini ke akaun GitHub anda:

### Cadangan Nama & Penerangan Repository:
- **Nama Repository**: `rubberlab-lims`
- **Penerangan (Description)**: `Sistem Pengurusan Maklumat Makmal (LIMS) Pengujian Getah dengan dwi-peranan Boss & Staff, penyesuaian pelarut kimia, jadual cuti, dan ulasan Gemini AI berlandaskan ISO/IEC 17025.`
- **Keterlihatan (Visibility)**: **Private** (Disyorkan sebagai tetapan lalai).

### Arahan Git Langkah Demi Langkah:

1. **Mulakan Git Tempatan (sekiranya belum diinisialisasi)**:
   ```bash
   git init
   git branch -M main
   ```

2. **Cipta Repository Kosong di Laman GitHub**:
   - Pergi ke [GitHub New Repository](https://github.com/new).
   - Masukkan nama repository: `rubberlab-lims`.
   - Pilih **Private**.
   - **Penting**: Jangan tandakan kotak *"Initialize with README"*, *.gitignore*, atau *License* kerana fail-fail ini telah siap disediakan di dalam projek ini.
   - Klik **Create repository**.

3. **Sambungkan Repository Tempatan ke GitHub**:
   Salin pautan repository yang baru dicipta dan jalankan:
   ```bash
   git remote add origin https://github.com/NAMA_AKAUN_GITHUB_ANDA/rubberlab-lims.git
   ```

4. **Lakukan Komit Pertama & Tolak Kod ke GitHub**:
   ```bash
   git add .
   git commit -m "feat: inisialisasi RubberLab LIMS berserta dokumentasi lengkap"
   git push -u origin main
   ```

---

## 5. Struktur Direktori Projek

```text
├── docs/                           # Dokumentasi komprehensif projek
│   ├── PANDUAN-PENGGUNA.md         # Panduan penggunaan langkah demi langkah
│   ├── KEPERLUAN-PRODUK.md         # Dokumen Keperluan Produk (PRD)
│   ├── STATUS-DAN-ROADMAP.md       # Status semasa, batasan & perancangan
│   ├── DATA-DAN-PRIVASI.md         # Polisi data, simpanan & privasi AI
│   └── SETUP-DAN-PENYELENGGARAAN.md# Panduan teknikal pemasangan & GitHub
├── public/                         # Aset statik awam & salinan fail PRD PDF
├── src/
│   ├── components/                 # Komponen antaramuka React
│   │   ├── BossReviewModal.tsx     # Konsol semakan & kelulusan pengurus
│   │   ├── CertificateOfAnalysisModal.tsx # Paparan CoA rasmi sedia cetak
│   │   ├── ChemicalInventoryTab.tsx# Pengurusan bahan kimia & pelarut
│   │   ├── CustomParametersTab.tsx # Penetapan spesifikasi & had ujian
│   │   ├── Header.tsx              # Bar tajuk & penukar peranan Staf/Boss
│   │   ├── LabScheduleTab.tsx      # Jadual operasi, cuti & fungsi Clear Off
│   │   ├── MonitoringOverview.tsx  # Papan pemuka metrik ringkas
│   │   ├── SampleIntakeModal.tsx   # Pendaftaran sampel, Auto 20d & Custom
│   │   ├── SampleTable.tsx         # Jadual induk sampel makmal
│   │   └── TestingDataModal.tsx    # Borang kemasukan bacaan ujian makmal
│   ├── data/                       # Data awal permulaan (seed data)
│   ├── types/                      # Takrifan jenis data TypeScript
│   ├── utils/                      # Fungsi pembantu (eksport CSV, storan)
│   ├── App.tsx                     # Komponen induk aplikasi
│   ├── index.css                   # Gaya global Tailwind CSS v4
│   └── main.tsx                    # Titik masuk aplikasi React
├── CHANGELOG.md                    # Rekod sejarah perubahan versi
├── README.md                       # Dokumen pengenalan utama
├── package.json                    # Konfigurasi dependensi dan skrip
├── server.ts                       # Pelayan backend Express.js & Gemini API
└── tsconfig.json                   # Konfigurasi pengkompil TypeScript
```

---

## 6. Penyelesaian Masalah Teknikal Biasa

- **Ralat Port 3000 Digunakan (EADDRINUSE)**:
  - *Punca*: Terdapat proses Node.js lain yang sedang berjalan pada port 3000.
  - *Tindakan*: Tukar port dalam fail `.env` (contoh: `PORT=3001`) atau tamatkan proses terdahulu.
- **Ralat `@google/genai` semasa panggilan API**:
  - *Punca*: Kunci API tidak sah atau kuota panggilan telah habis.
  - *Tindakan*: Sistem dilindungi secara automatik oleh fungsi *local diagnostic engine* yang memastikan aplikasi tidak ranap dan tetap memaparkan draf ulasan makmal yang sesuai.
