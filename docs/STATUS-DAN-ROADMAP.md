# Status Projek & Pelan Perancangan (Status & Roadmap)

Dokumen ini merekodkan status sebenar sistem **RubberLab LIMS** pada masa ini berdasarkan kod yang telah dibina, semakan ujian yang telah dijalankan, batasan semasa, dan perancangan masa hadapan.

---

## 1. Status Komponen Semasa

### A. Sudah Dibina (Built)
- [x] **Dwi-Peranan Pengguna**: Suis penukar antara mod Lab Staff (Aiman Azaly) dan Boss (Dr. Farhan Ismail) di bahagian *Header*.
- [x] **Pendaftaran Sampel Baharu**:
  - Penomboran ID berasingan bagi getah asli (`SMP-2026-NR-xxx`) dan sintetik (`SMP-2026-SYN-xxx`).
  - Pemilihan gred standard (SMR 10, SMR 20, SMR CV60, RSS 1, Lateks 60% DRC, SBR, NBR, EPDM) atau gred tersuai.
  - **Auto Lead Time 20 Hari**: Butang satu-klik untuk menetapkan tempoh siap 20 hari secara automatik.
  - **Butang Custom Hari**: Pengira automatik tarikh siap berdasarkan bilangan hari yang ditaip oleh pengguna.
- [x] **Perekodan Keputusan Ujian**:
  - Ujian numerik dengan semakan had spesifikasi automatik (*Pass* hijau / *Fail* merah).
  - Pemilihan pelarut kimia rutin (Toluena, Aseton) dan pelarut bukan selalu pakai (THF, Kloroform, Sikloheksana, MEK, n-Heksana).
  - Perekodan nombor lot pelarut dan amaran baki inventori rendah secara langsung.
  - Pemuat naik graf lengkuk pemvulkanan Reometer MDR.
- [x] **Integrasi Gemini AI Server-Side**:
  - Endpoint `/api/gemini/analyze-sample` yang menilai keputusan ujian dan sifat pelarut kimia.
  - Modul sandaran diagnostik tempatan (*local diagnostic engine*) sekiranya API key tidak dipasang.
- [x] **Konsol Semakan & Kelulusan Boss**:
  - Ruang suntingan draf ulasan AI dan catatan rasmi pengurus makmal.
  - Tindakan meluluskan (*Approve & Sign*) dan menolak sampel (*Reject*) dengan sebab penolakan.
- [x] **Sijil Analisis (CoA) & Eksport Data**:
  - Paparan formal Sijil Analisis standard sedia cetak (PDF) dengan perakuan MS ISO/IEC 17025.
  - Eksport data lengkap ke format CSV termasuk maklumat pelarut dan lead time.
- [x] **Pengurusan Jadual Makmal & Cuti**:
  - Perekodan cuti kakitangan dan penyelenggaraan mesin dengan fungsi **"Clear Off"**.
- [x] **Pengurusan Inventori Bahan Kimia**:
  - Penapis pelarut rutin dan bukan rutin serta pemantauan tahap stok (*Tersedia*, *Rendah*, *Habis*).

---

### B. Telah Diuji (Tested)
- [x] **Ujian Kompilasi TypeScript (`compile_applet`)**: Kod berjaya dikompilasi tanpa ralat sintaks atau jenis data (`Build succeeded`).
- [x] **Ujian Linter Kod (`lint_applet` / `tsc --noEmit`)**: Kod melepasi semakan statik TypeScript tanpa sebarang ralat import atau pemboleh ubah tidak sah.
- [x] **Ujian Penukaran Peranan**: Disahkan bahawa staf tidak boleh meluluskan sampel atau mengubah had spesifikasi, manakala Boss mempunyai akses penuh.
- [x] **Ujian Pengiraan Lead Time**: Disahkan bahawa pemilihan preset 20 hari atau butang custom mengira tarikh siap secara tepat berdasarkan tarikh terima sampel tanpa herotan zon masa (*timezone offset*).

---

### C. Belum Disahkan (Unverified / Pending User Environment Confirmation)
- [ ] **Kunci API Gemini Sebenar (`GEMINI_API_KEY`)**:
  - Berfungsi melalui mod sandaran diagnostik (*local diagnostic engine*) dalam persekitaran pembangunan semasa.
  - Respons masa nyata model Gemini 3.8 Flash sebenar bergantung kepada penyediaan kunci API sah oleh pengguna dalam panel Secrets AI Studio atau fail `.env`.
- [ ] **Kualiti Cetakan PDF pada Pelbagai Pelayar**:
  - Menggunakan dialog cetak bawaan pelayar web (`window.print()`) dengan gaya CSS khusus cetakan (`@media print`).
  - Hasil paparan cetakan fizikal atau simpanan PDF bergantung kepada tetapan margin pelayar pengguna (disyorkan tetapan *Margins: Default* dan aktifkan *Background graphics*).
- [ ] **Penyimpanan Terpusat Merentas Peranti**:
  - Pada masa ini, data disimpan dalam `localStorage` pelayar peranti setempat. Data belum disegerakkan ke pangkalan data awan terpusat sekiranya pengguna membuka sistem dari komputer berasingan.

---

## 2. Isu Diketahui & Had Semasa (Known Constraints)

1. **Storan Data Tempatan (Local Storage Scope)**:
   - Data sampel, inventori, dan jadual makmal disimpan di dalam simpanan pelayar pengguna. Sekiranya pengguna membersihkan *cache/cookies* pelayar, data akan kembali kepada data sampel asal (*initial seed data*).
2. **Ketiadaan Pengesahan Log Masuk Berasaskan Kata Laluan (Password Authentication)**:
   - Bagi tujuan ujian pantas aliran kerja (MVP), sistem menggunakan penukar mod (*Role Switcher*) tanpa meminta kata laluan staf atau Boss.
3. **Pemuatan Fail Graf**:
   - Imej graf reometer disimpan sebagai format *Data URL / base64* di dalam storan tempatan, yang sesuai untuk prototaip tetapi mempunyai had saiz fail.

---

## 3. Pelan Perancangan Seterusnya (Roadmap)

Perancangan ini disusun mengikut keutamaan teknikal bagi menaik taraf sistem ke tahap pengeluaran penuh (*production grade*):

### Fasa 1: Pengukuhan Pangkalan Data & Keselamatan
- Menyambungkan sistem ke pangkalan data berpusat (PostgreSQL / Cloud SQL atau Firebase Firestore) agar data disegerakkan merentas semua komputer di makmal.
- Membina sistem log masuk selamat menggunakan e-mel rasmi agensi (cth: domain `@lgm.gov.my`) dan pengesahan pelbagai faktor (*Multi-Factor Authentication* - MFA).

### Fasa 2: Integrasi Alatan Makmal Secara Terus (Instrument Interfacing)
- Membina modul integrasi untuk membaca data mentah terus daripada instrumen pengujian getah melalui sambungan siri (*RS232 / USB / IoT*), seperti:
  - *Mooney Viscometer* (bacaan ML 1+4 automatik).
  - *Moving Die Rheometer (MDR)* (pemindahan lengkuk pemvulkanan secara terus).
  - *Tensile Tester* (kekuatan regangan & pemanjangan takat putus).

### Fasa 3: Portal Luaran Pelanggan (Client Portal)
- Menyediakan portal layan diri (*self-service portal*) yang membolehkan pelanggan komersial menyemak status sampel mereka dan memuat turun Sijil Analisis (CoA) rasmi menggunakan nombor rujukan sampel atau kod QR.

### Fasa 4: Analisis Ramalan & Pengesanan Anomali AI
- Melatih modul AI untuk mengesan anomali kelompok (*batch anomaly detection*) berdasarkan corak data historikal getah bagi membantu Boss mengenal pasti sebarang pencemaran atau ketidakhomogenan getah lebih awal.
