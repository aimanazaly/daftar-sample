# RubberLab LIMS (Sistem Pengurusan Maklumat Makmal Getah)

> **Sistem Pengurusan Maklumat Makmal (LIMS) pengujian getah asli dan sintetik dengan dwi-peranan Pengurus (Boss) & Staf, penyesuaian pelarut kimia, jadual cuti makmal, dan bantuan analisis teknikal berlandaskan piawaian ISO/IEC 17025.**

---

## A. Penerangan Ringkas

**RubberLab LIMS** ialah aplikasi web pengurusan makmal yang dibina khusus untuk makmal pengujian getah (Natural Rubber / NR dan Synthetic Rubber / Non-NR). Sistem ini menguruskan kitaran lengkap pengujian sampel getah bermula daripada pendaftaran sampel, perekodan bacaan ujian makmal, semakan kelulusan oleh pengurus makmal (Boss), sehingga pengeluaran Sijil Analisis (*Certificate of Analysis* - CoA) rasmi.

---

## B. Masalah yang Diselesaikan

Di kebanyakan makmal pengujian getah, proses kerja harian masih berdepan masalah berikut:
- **Borang & Kertas Kerja Berselerak**: Rekod ujian seperti kelikatan Mooney (*Mooney Viscosity*), kandungan bendasing (*dirt content*), dan graf reometer dicatat dalam kertas berasingan yang mudah tercicir.
- **Kelewatan Kelulusan (Approval Bottleneck)**: Staf makmal terpaksa menunggu pengurus menyemak satu persatu dokumen manual sebelum sijil boleh dikeluarkan kepada pelanggan atau kilang pemprosesan.
- **Kekeliruan Penggunaan Pelarut Kimia**: Ujian pengekstrakan atau pembengkakan getah (*solvent swelling*) kerap menggunakan pelarut khas yang jarang dipakai (seperti Tetrahidrofuran [THF], Kloroform, atau Sikloheksana) tanpa rekod lot yang jelas.
- **Penyelarasan Cuti & Kalibrasi Mesin**: Ketiadaan jadual terpusat menyebabkan sampel tertunggak apabila kakitangan bercuti atau mesin ujian sedang diselenggara.

RubberLab LIMS menyelesaikan isu ini dengan menyediakan satu platform digital yang menyelaraskan aliran kerja makmal dalam satu paparan yang kemas dan berstruktur.

---

## C. Untuk Siapa?

1. **Juruteknik & Pembantu Makmal (Lab Staff / Technician)**: Mendaftar sampel masuk, memasukkan bacaan ujian mentah, memuat naik graf reometer, dan memilih pelarut kimia yang digunakan.
2. **Pengurus Makmal / Pegawai Kualiti (Boss / Lab Manager)**: Menetapkan had spesifikasi parameter ujian, menyemak keputusan sampel, menyunting draf rumusan teknikal AI, dan meluluskan Sijil Analisis (CoA) rasmi dengan tandatangan digital.
3. **Penyelidik R&D & Jurutera Polimer**: Memantau ujian khas jangka panjang (dengan tetapan *lead time* 20 hari) dan mengeksport data saintifik ke format CSV untuk analisis mendalam.

---

## D. Apa yang Boleh Dibuat?

- **Suis Dwi-Peranan (Role Switcher)**: Tukar peranan serta-merta antara **Staf (Aiman Azaly)** dan **Boss (Dr. Farhan Ismail)** untuk menguji dan melaksanakan kuasa capaian yang berbeza.
- **Pendaftaran Sampel & Auto Lead Time**:
  - Pendaftaran gred getah piawai (SMR 10, SMR 20, SMR CV60, RSS 1, Lateks Pekat, SBR, NBR, EPDM) atau gred tersuai.
  - **Pilihan Auto Lead Time 20 Hari**: Butang satu-klik untuk menetapkan tempoh siap 20 hari secara automatik (khusus untuk ujian penuaan, kestabilan, atau R&D).
  - **Butang Custom Hari**: Membolehkan penentuan bilangan hari siap tersuai (contoh: 14 hari, 30 hari) yang dikira secara automatik dari tarikh terima.
- **Kemasukan Data Pengujian & Pengecaman Lulus/Gagal**:
  - Pengesahan automatik bacaan nombor berbanding had spesifikasi (*Pass* hijau / *Fail* merah).
  - Sokongan muat naik graf lengkuk pemvulkanan Reometer MDR (*Rheometer Cure Curve*).
- **Penyesuaian Pelarut Kimia (Bukan Selalu Pakai / Khas)**:
  - Fleksibiliti memilih pelarut bukan rutin seperti THF, Kloroform, Sikloheksana, MEK, atau n-Heksana berserta nombor lot untuk kebolehkesanan ISO 17025.
  - Amaran automatik sekiranya baki pelarut di dalam almari bahan kimia berada pada tahap rendah (*Low Stock*).
- **Bantuan Ulasan Teknikal AI**:
  - Draf ulasan teknikal makmal dijana oleh model Gemini AI (atau enjin diagnostik terbina dalam) yang menilai sifat getah dan kesan pelarut yang digunakan.
- **Pengurusan Cuti Makmal & Penyelenggaraan Mesin**:
  - Perekodan cuti rehat kakitangan dan *downtime* mesin dengan butang **"Clear Off"** apabila kakitangan telah kembali bertugas atau mesin selesai dikalibrasi.
- **Pengeluaran Sijil Analisis (CoA) & Eksport CSV**:
  - Sijil Analisis rasmi sedia cetak (PDF) dengan kepala surat makmal, jadual ujian, rujukan kaedah piawaian (ISO 289-1, ISO 249, ISO 248, ISO 1817 / ASTM D471), dan tandatangan digital rasmi.

---

## E. Contoh Cara Penggunaan

1. **Pendaftaran Sampel**: Staf membuka borang pendaftaran, memilih kategori *Natural Rubber (NR)*, gred *SMR 10*, dan menekan butang **Auto 20 Hari** untuk ujian pengekstrakan jangka panjang.
2. **Kemasukan Ujian**: Staf memasukkan nilai *Mooney Viscosity* (62.4 MU) dan *Dirt Content* (0.012% menggunakan pelarut Kloroform). Sistem secara automatik menandakan kedua-dua parameter sebagai *LULUS*.
3. **Penyediaan Ulasan AI**: Sistem menjana draf ulasan teknikal makmal yang mengesahkan sampel mematuhi piawaian ISO 2000.
4. **Semakan & Kelulusan Boss**: Boss menyemak keputusan ujian dan draf ulasan, menambah nota kelulusan, lalu menekan butang **"Luluskan & Tandatangan"**.
5. **Pengeluaran Sijil**: Sijil Analisis rasmi dijana dan boleh dimuat turun sebagai PDF atau dieksport ke dalam lembaran kerja CSV.

---

## F. Cara Mencuba

- **Aplikasi Web (Development / Demo)**: [Buka RubberLab LIMS](https://ais-dev-sphmkpbvforhxgcgrxzwei-858994087547.asia-northeast1.run.app)
- **Status Demo**: Beroperasi terus pada pelayar web tanpa memerlukan pemasangan perisian tambahan.

---

## G. Status Projek

| Bahagian | Status | Keterangan |
| :--- | :--- | :--- |
| **Antara Muka Pengguna (UI)** | Sudah dibina & diuji | Mengikut standard ISO 17025, dark theme klinikal (*Slate / Emerald / Amber*). |
| **Aliran Kerja Dwi-Peranan** | Sudah dibina & diuji | Perbezaan kuasa antara Staf dan Boss berfungsi lancar. |
| **Penyimpanan Data Semasa** | Sudah dibina & diuji | Menggunakan simpanan tempatan pelayar (*browser localStorage*). |
| **Integrasi Gemini AI** | Sudah dibina | Berjalan pada pelayan backend (`server.ts`). Menggunakan enjin diagnostik tempatan sekiranya API key tidak dikonfigurasikan. |
| **Pangkalan Data Awan Terpusat** | Masih dirancang | Belum disambungkan ke pelayan pangkalan data berpusat (PostgreSQL/Cloud SQL). |

---

## H. Panduan Lanjut

Untuk maklumat terperinci, sila rujuk dokumentasi berkaitan dalam folder `docs/`:

- [Panduan Pengguna (Langkah demi Langkah)](docs/PANDUAN-PENGGUNA.md)
- [Spesifikasi Keperluan Produk (PRD)](docs/KEPERLUAN-PRODUK.md)
- [Status Semasa & Perancangan Masa Depan (Roadmap)](docs/STATUS-DAN-ROADMAP.md)
- [Pengurusan Data & Privasi](docs/DATA-DAN-PRIVASI.md)
- [Panduan Pemasangan & Penyelenggaraan Sistem](docs/SETUP-DAN-PENYELENGGARAAN.md)
- [Rekod Perubahan (Changelog)](CHANGELOG.md)

---

## I. Ringkasan Teknologi

- **React 19**: Digunakan untuk membina antara muka pengguna yang interaktif dan pantas.
- **TypeScript**: Memastikan ketepatan struktur data dan mengurangkan ralat kod pengaturcaraan.
- **Tailwind CSS v4**: Mengurus reka bentuk visual, tipografi makmal, dan susun atur responsif.
- **Express.js & Vite**: Menjalankan pelayan aplikasi dan menyelaraskan integrasi API.
- **Google Gen AI SDK (`@google/genai`)**: Memanggil model Gemini 3.8 Flash secara selamat dari bahagian pelayan (*server-side*) untuk bantuan ulasan teknikal getah.
- **Lucide React**: Ikonografi teknikal makmal yang bersih dan seragam.

---

## J. Maklum Balas & Bantuan

Sekiranya anda menemui sebarang pepijat (*bug*) atau mempunyai cadangan penambahbaikan untuk makmal anda, sila buka isu baharu melalui tab **Issues** pada repository GitHub ini.
