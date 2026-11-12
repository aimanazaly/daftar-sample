# Pengurusan Data & Privasi (Data & Privacy)

Dokumen ini menerangkan jenis data yang dikendalikan oleh **RubberLab LIMS**, lokasi penyimpanan data, aliran data ke perkhidmatan luaran, dan kawalan keselamatan sedia ada.

---

## 1. Jenis Data yang Dikendalikan

Sistem ini hanya mengendalikan data operasi dan teknikal makmal pengujian getah, merangkumi:

1. **Maklumat Sampel Pengujian**:
   - ID Sampel (contoh: `SMP-2026-NR-001`).
   - Kategori polimer (*Natural Rubber* atau *Synthetic Rubber*).
   - Gred getah (contoh: *SMR 10*, *SBR 1502*).
   - Nama projek atau pelanggan (contoh: *Projek Penyelidikan Klon Mardi*).
   - Tarikh diterima dan tarikh sasaran siap (*Lead Time*).
2. **Data Keputusan Ujian Makmal**:
   - Nilai ukuran berangka (contoh: bacaan kelikatan Mooney, peratusan bendasing, abu, dan bahan meruap).
   - Teks pemerhatian visual dan fail graf reometer.
   - Nama pelarut kimia yang digunakan dan nombor lot botol kimia (*Solvent Lot Number*).
3. **Data Personel & Jadual Makmal**:
   - Nama pendaftar sampel dan pengesah laporan (nama kakitangan makmal: Aiman Azaly dan Dr. Farhan Ismail).
   - Rekod tarikh cuti kakitangan dan catatan penyelenggaraan mesin.
4. **Data Inventori Bahan Kimia**:
   - Nama bahan kimia, formula kimia, baki kuantiti, unit ukuran, dan lokasi penyimpanan dalam makmal.

> **Nota**: Sistem ini **tidak mengumpulkan** maklumat kewangan, nombor kad kredit, kata laluan sulit, atau data peribadi sensitif orang awam.

---

## 2. Di Mana Data Disimpan?

Bagi pelaksanaan semasa (versi prototaip / MVP):

- **Storan Utama (Client-side LocalStorage)**:
  - Semua rekod sampel, inventori bahan kimia, jadual makmal, dan profil makmal disimpan di dalam simpanan tempatan pelayar web pengguna (*browser localStorage*) di bawah kekunci `rubberlab_lims_samples_v2`, `rubberlab_lims_chemicals_v2`, `rubberlab_lims_schedule_v2`, dan `rubberlab_lims_params_v2`.
  - Data kekal wujud selagi pengguna tidak membersihkan sejarah (*history/cache*) pelayar web pada komputer tersebut.
- **Memori Pelayan (Server-side In-Memory)**:
  - Pelayan backend Express.js (`server.ts`) hanya memproses data sampel secara sementara semasa panggilan analisis AI dibuat dan tidak mengekalkan data dalam sebarang fail pangkalan data luaran.

---

## 3. Komunikasi dengan Perkhidmatan Luaran & AI

- **Panggilan Gemini AI (`@google/genai`)**:
  - Apabila staf menekan butang **"Jana Rumusan AI"**, data teknikal sampel (ID sampel, gred, nilai parameter, dan pelarut yang digunakan) dihantar ke pelayan backend (`/api/gemini/analyze-sample`).
  - Sekiranya kunci `GEMINI_API_KEY` dikonfigurasikan, data tersebut dihantar ke Google Gen AI API untuk menjana draf ulasan saintifik.
  - Sekiranya kunci API tidak dikonfigurasikan, tiada sebarang data dihantar keluar dari komputer; sistem sebaliknya menggunakan enjin peraturan tempatan (*local diagnostic fallback*) untuk menghasilkan ulasan.
- **Tiada Penjejak Pihak Ketiga (No Third-Party Trackers)**:
  - Sistem tidak menggunakan skrip analitik, penjejak iklan (*advertising pixels*), atau telemetri luaran.

---

## 4. Kawalan Akses & Keselamatan

- **Kawalan Capaian Berasaskan Peranan (Role-Based Access)**:
  - Antara muka menyekat staf daripada menandatangani kelulusan rasmi atau menukar had spesifikasi standard makmal.
  - Hanya mod Boss dibenarkan menurunkan tandatangan digital kelulusan.
- **Batasan Keselamatan Semasa**:
  - Kerana sistem ini beroperasi dalam mod prototaip pantas, pertukaran peranan (Staf vs Boss) dilakukan melalui penukar mod tanpa pengesahan kata laluan individu.
  - Untuk persekitaran pengeluaran penuh pada masa hadapan, lapisan pengesahan e-mel rasmi dan kawalan sesi (*session token*) disyorkan sebelum sistem diakses melalui rangkaian awam.

---

## 5. Cara Memadam atau Menetapkan Semula Data

Sekiranya anda ingin membersihkan data ujian:

1. **Memadam Rekod Individu**:
   - Rekod jadual makmal boleh dipadam menggunakan ikon tong sampah pada baris jadual.
   - Sampel yang ditolak (*Rejected*) boleh disemak semula atau digantikan dengan sampel baharu.
2. **Menetapkan Semula Keseluruhan Sistem ke Data Asal**:
   - Buka alat pembangun pelayar (*Developer Tools*) -> tab **Application** -> **Local Storage** -> klik **Clear All**.
   - Muat semula (*refresh*) halaman web, dan sistem akan memuatkan semula set data sampel awal (*seed data*).

---

## 6. Pematuhan Undang-Undang & Penafian

Aplikasi ini dibina sebagai prototaip fungsian bagi tujuan demonstrasi dan penyelidikan makmal. Sistem ini **belum menjalani audit pematuhan formal** di bawah Akta Perlindungan Data Peribadi 2010 (PDPA) atau peraturan perlindungan data serantau lain. Pengguna bertanggungjawab memastikan sebarang data getah yang dimasukkan mematuhi polisi kerahsiaan organisasi masing-masing.
