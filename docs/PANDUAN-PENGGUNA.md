# Panduan Pengguna RubberLab LIMS

Panduan ini menerangkan cara menggunakan **RubberLab LIMS** langkah demi langkah bagi kakitangan makmal dan pengurus makmal.

---

## 1. Memahami Dwi-Peranan Pengguna

Sistem ini mempunyai dua peranan berbeza yang boleh ditukar pada bila-bila masa menggunakan butang penukar peranan di bahagian atas kanan skrin (*Header*):

| Peranan | Pengguna Lalai | Tanggungjawab Utama | Kuasa Khas |
| :--- | :--- | :--- | :--- |
| **Lab Staff** | Aiman Azaly | Mendaftar sampel, menjalankan ujian makmal, merekod bacaan ujian, memantau bahan kimia, merekod cuti staf. | Boleh memasukkan bacaan ujian dan memohon ulasan AI. **Tidak boleh** menurunkan tandatangan kelulusan rasmi CoA. |
| **Boss / Lab Manager** | Dr. Farhan Ismail | Kawalan kualiti makmal, penetapan parameter dan had spesifikasi ujian, semakan ulasan AI, kelulusan rasmi. | Boleh mengubah had spesifikasi ujian, menyunting ulasan teknikal, menolak sampel, dan meluluskan serta menandatangani CoA rasmi. |

---

## 2. Langkah Demi Langkah Menggunakan Sistem

### Langkah 1: Mendaftar Sampel Baharu (*Sample Intake*)
1. Klik butang **"+ Daftar Sampel"** di bahagian atas jadual sampel.
2. Pilih klasifikasi polimer:
   - **Natural Rubber (NR)**: Untuk getah asli (cth. SMR 10, SMR 20, SMR CV60, RSS 1, Lateks).
   - **Non-NR (Sintetik)**: Untuk getah sintetik atau kompaun (cth. SBR 1502, NBR, EPDM, Neoprene).
3. Pilih gred getah dan masukkan nama projek atau pelanggan (contoh: *Projek Penyelidikan Klon Mardi*).
4. **Menetapkan Tempoh Masa Ujian (Lead Time / SLA)**:
   - **Pilihan 1 - Auto 20 Hari**: Klik butang **`Auto 20 Hari`** untuk ujian penuaan, kestabilan, atau R&D khas. Tarikh sasaran siap akan dikira secara automatik menjadi 20 hari dari tarikh terima sampel.
   - **Pilihan 2 - Butang Custom Hari**: Klik butang **`Custom Hari`** untuk menetapkan bilangan hari tersuai (contohnya 14 hari, 30 hari). Anda boleh menekan butang stepper `+` / `-` atau menaip nombor secara terus.
   - **Pilihan 3 - Preset Standard**: Pilih `2 Hari (Standard)` atau `7 Hari (1 Minggu)`.
5. Klik **"Daftar Sampel"**. Sampel baharu akan muncul dalam jadual dengan status **"Dalam Pengujian"**.

---

### Langkah 2: Memasukkan Keputusan Ujian Makmal
1. Pada senarai sampel, klik butang **"Input Ujian"** pada sampel yang ingin dikemas kini.
2. Bagi setiap parameter ujian:
   - **Ujian Angka (cth. Mooney Viscosity, Dirt Content)**: Masukkan nilai yang diukur. Sistem akan memaparkan lencana **LULUS (Hijau)** atau **GAGAL (Merah)** secara automatik berpandukan had spesifikasi yang ditetapkan.
   - **Ujian Berasaskan Pelarut Kimia**:
     - Bagi ujian yang memerlukan pelarut (seperti *Dirt Content* atau *Solvent Swelling*), pilih pelarut yang digunakan daripada senarai juntai (*dropdown*).
     - Anda boleh memilih pelarut rutin (Toluena, Aseton) atau pelarut bukan selalu pakai (Tetrahidrofuran [THF], Kloroform, Sikloheksana, MEK, n-Heksana).
     - Masukkan nombor lot botol pelarut (cth. `LOT-THF-2025-01`) bagi tujuan rekod kebolehkesanan ISO 17025.
     - Sekiranya stok pelarut dalam almari bahan kimia hampir habis, amaran ambar akan dipaparkan secara automatik.
   - **Ujian Graf / Gambar (cth. Lengkuk Reometer MDR)**: Anda boleh memuat naik fail imej graf atau menggunakan graf sampel yang telah disediakan.
3. Klik butang **"Jana Rumusan AI"** untuk mendapatkan draf analisis teknikal mengenai sampel berkenaan.
4. Klik **"Simpan Data Ujian"**. Sekiranya semua ujian telah siap, klik **"Hantar untuk Kelulusan Boss"**.

---

### Langkah 3: Semakan & Kelulusan oleh Pengurus Makmal (Boss Mode)
1. Tukar peranan kepada **Mod Boss** melalui butang penukar di bahagian atas skrin.
2. Sampel yang sedia disemak akan memaparkan status **"Menunggu Kelulusan"** dengan butang kuning **"Semak & Luluskan"**.
3. Klik butang tersebut untuk membuka konsol semakan:
   - Periksa ringkasan bilangan parameter yang lulus dan gagal.
   - Semak maklumat pelarut yang digunakan oleh staf.
   - Baca draf ulasan teknikal AI. Boss boleh menyunting atau menambah teks ulasan secara terus dalam kotak ulasan.
   - Masukkan catatan pengesahan rasmi Boss.
4. Pilih tindakan:
   - **Luluskan & Tandatangan (Approve & Sign)**: Menandatangani CoA secara digital dan mengunci rekod sampel daripada sebarang perubahan staf.
   - **Tolak Sampel (Reject)**: Masukkan sebab penolakan (contoh: *bacaan Mooney terlalu tinggi, perlukan ujian ulangan*).

---

### Langkah 4: Mencetak Sijil Analisis (CoA) & Mengeksport Data
1. Klik butang **"CoA"** pada mana-mana sampel dalam jadual.
2. Paparan Sijil Analisis standard makmal akan dibuka:
   - Mengandungi kepala surat rasmi makmal dan status akreditasi SAMM (MS ISO/IEC 17025).
   - Menyenaraikan butiran sampel, kaedah piawaian ISO, had spesifikasi, dan keputusan ujian sebenar.
   - Memaparkan nama pelarut kimia dan nombor lot bagi ujian yang berkaitan.
   - Memaparkan pengesahan tandatangan digital rasmi Dr. Farhan Ismail (jika telah diluluskan).
3. Klik butang **"Cetak / Simpan PDF"** untuk mencetak dokumen atau menyimpannya sebagai fail PDF.
4. Klik butang **"Eksport CSV"** untuk memuat turun data sampel ke dalam fail lembaran kerja Excel/CSV.

---

### Langkah 5: Mengurus Jadual Makmal & Cuti Kakitangan
1. Buka tab **"Jadual & Cuti"** pada menu navigasi utama.
2. Klik **"+ Tambah Jadual / Cuti"** untuk merekod:
   - Cuti rehat kakitangan.
   - Cuti kelepasan am.
   - Jadual penyelenggaraan atau kalibrasi mesin ujian.
3. **Fungsi "Clear Off"**:
   - Apabila kakitangan telah kembali bertugas atau kerja penyelenggaraan mesin telah selesai, klik butang **"Clear Off Cuti"**.
   - Sistem akan menandakan rekod tersebut sebagai selesai dengan mencatatkan nama individu yang melakukan *clear off* berserta tarikh dan masa.

---

### Langkah 6: Mengurus Inventori Bahan Kimia & Pelarut
1. Buka tab **"Inventori Kimia"**.
2. Gunakan penapis untuk melihat:
   - **Semua Kimia**
   - **Pelarut Rutin** (Toluena, Aseton)
   - **Pelarut Bukan Selalu Pakai** (THF, Kloroform, Sikloheksana, MEK, n-Heksana)
3. Pantau baki stok dan lokasi penyimpanan selamat (contoh: *Almari Wasap / Kabinet Flammable*).
4. Klik **"Kemaskini Stok"** sekiranya terdapat penerimaan botol kimia baharu atau penggunaan harian.

---

## 3. Maksud Status & Label Penting

| Label / Status | Maksud & Implikasi |
| :--- | :--- |
| **Dalam Pengujian (Testing)** | Sampel sedang diuji oleh staf makmal. Data bacaan masih boleh dikemas kini. |
| **Menunggu Semakan (Pending Approval)** | Ujian telah selesai direkodkan oleh staf dan kini menunggu semakan dan kelulusan rasmi daripada Boss. |
| **Diluluskan (Approved)** | Sampel telah disemak dan ditandatangani oleh Boss. Sijil Analisis (CoA) rasmi sedia dikeluarkan kepada pelanggan. |
| **Ditolak (Rejected)** | Sampel gagal menepati spesifikasi atau memerlukan ujian ulangan (*re-testing*). |
| **20d SLA** | Lencana yang menunjukkan sampel menggunakan tetapan *lead time* 20 hari (ujian khas/panjang). |
| **Pelarut Khas** | Menandakan pengujian sampel tersebut menggunakan pelarut bukan rutin (cth: Kloroform atau THF). |
| **Clear Off** | Status bagi cuti atau *downtime* mesin yang telah selesai dan tidak lagi memberi kesan kepada operasi semasa. |

---

## 4. Penyelesaian Masalah Biasa (Troubleshooting)

- **Masalah: Butang "Luluskan & Tandatangan" tidak boleh ditekan (disabled).**
  - *Sebab*: Anda sedang berada dalam mod **Lab Staff**. Hanya mod **Boss** dibenarkan meluluskan sampel.
  - *Penyelesaian*: Klik butang penukar peranan di bahagian atas kanan skrin dan tukar kepada **Mod Boss**.

- **Masalah: Rumusan AI memaparkan nota "(API Key tidak ditetapkan)".**
  - *Sebab*: Kunci API Gemini (`GEMINI_API_KEY`) belum dimasukkan dalam konfigurasi pelayan.
  - *Penyelesaian*: Sistem secara automatik menggunakan enjin diagnostik makmal tempatan sebagai ganti. Ulasan teknikal tetap dijana berpandukan data sampel dan anda masih boleh menyuntingnya secara bebas.

- **Masalah: Nilai ujian bertukar warna merah (Fail).**
  - *Sebab*: Bacaan yang dimasukkan melebihi had maksimum atau di bawah had minimum spesifikasi standard gred getah berkenaan.
  - *Penyelesaian*: Semak semula bacaan mesin. Sekiranya bacaan betul, sampel tersebut dianggap terkeluar daripada spesifikasi dan akan dimaklumkan kepada Boss semasa proses kelulusan.
