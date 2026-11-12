# Keperluan Produk (Product Requirements Document - PRD)

Dokumen ini memperincikan spesifikasi fungsian, peraturan perniagaan (*business rules*), dan aliran kerja sistem **RubberLab LIMS**.

Dokumen ini merujuk kepada fail spesifikasi asal yang disertakan dalam projek:  
`public/assets/aistudio/Product_Requirements_Document__PRD__-_RubberLab_LIMS_16775998.pdf` (Versi 1.0 MVP, Disahkan 2026).

---

## 1. Tujuan & Matlamat Produk

**RubberLab LIMS** dibangunkan untuk menyediakan persekitaran digital yang cekap, telus, dan patuh piawaian makmal bagi pengujian sampel getah asli (*Natural Rubber* / NR) dan sintetik (*Non-NR*).

### Objektif Utama:
1. Menghapuskan borang rekod kertas manual dan mengelakkan kehilangan data ujian.
2. Mempercepatkan proses semakan dan kelulusan rasmi oleh Pengurus Makmal (Boss).
3. Memastikan pematuhan standard industri getah seperti ISO 2000, MS 1387, ISO 289-1 (Kelikatan Mooney), ISO 249 (Kandungan Bendasing / Dirt), ISO 248 (Bahan Meruap / Volatile Matter), ISO 6502 (Reometer MDR), dan ISO 1817 / ASTM D471 (Pembengkakan Pelarut / Solvent Swelling).
4. Menyediakan kebolehkesanan penuh (*traceability*) bahan kimia, pelarut yang digunakan, dan jadual pengoperasian makmal.

---

## 2. Pengguna Sasaran & Peranan

Sistem membahagikan operasi makmal kepada dua peranan dengan matrik kebenaran berikut:

| Peranan | Penerangan Tanggungjawab | Kebenaran Sistem |
| :--- | :--- | :--- |
| **Lab Staff / Technician** | Kakitangan teknikal yang menjalankan ujian di meja makmal (*bench chemist / lab technician*). | • Mendaftar sampel baharu.<br>• Memasukkan nilai ukuran dan teks pemerhatian.<br>• Memuat naik fail graf ujian.<br>• Memilih pelarut kimia dan merekod nombor lot.<br>• Memohon draf ulasan AI.<br>• Merekod permohonan cuti staf.<br>*(Dilarang mengubah had spesifikasi atau menandatangani kelulusan CoA).* |
| **Boss / Lab Manager** | Pegawai kanan makmal atau pengurus kawalan kualiti (Dr. Farhan Ismail). | • Semua kebenaran Lab Staff.<br>• Mencipta, menyunting, dan memadam parameter ujian serta had spesifikasi (min/max).<br>• Menyunting draf ulasan teknikal Gemini AI.<br>• Meluluskan (*Approve*) atau menolak (*Reject*) sampel.<br>• Menandatangani CoA rasmi secara digital.<br>• Menentukan kategori penggunaan pelarut kimia. |

---

## 3. Skop MVP & Penambahan Fungsi

### A. Skop Asas MVP (Berasaskan PRD Asal):
- **Role Switcher**: Suis penukar mod pantas di bahagian *Header* tanpa memerlukan pendaftaran akaun yang rumit.
- **Pendaftaran Sampel**: Sokongan kategori *Natural Rubber (NR)* dan *Non-NR (Sintetik)* dengan penomboran ID automatik (contoh: `SMP-2026-NR-001`).
- **Pembina Parameter Tersuai (Custom Parameter Builder)**: Kuasa penuh kepada Boss mentakrifkan parameter baharu, jenis input (nombor, teks, graf), unit ukuran, dan julat had.
- **Perekodan Keputusan Ujian**: Perbandingan automatik nilai nombor dengan had spesifikasi (*Pass* / *Fail*).
- **Rumusan Teknikal AI**: Penjanaan draf ulasan teknikal makmal oleh model Gemini AI.
- **Aliran Kelulusan Boss**: Tindakan *Approve & Sign* atau *Reject* dengan kunci keselamatan ke atas sampel yang telah diluluskan.
- **Sijil Analisis (CoA) & Eksport CSV**: Paparan sedia cetak (PDF) dan fail data tabular CSV.

### B. Penambahan Fungsi Lanjutan (Berdasarkan Maklum Balas Pengguna):
1. **Penyesuaian Pelarut Bukan Selalu Pakai (*Non-Routine Solvents*)**:
   - Sokongan pemilihan pelarut khusus untuk penyelidikan atau ujian ekstraksi khas (cth. Tetrahidrofuran [THF], Kloroform, Sikloheksana, Metil Etil Keton [MEK], n-Heksana).
   - Penjejakan nombor lot pelarut dan amaran baki inventori rendah secara automatik.
2. **Auto Lead Time 20 Hari & Butang Custom**:
   - Pilihan pantas 1-klik untuk menetapkan tempoh siap 20 hari secara automatik bagi ujian R&D, penuaan (*aging*), atau pengekstrakan jangka panjang.
   - Butang *Custom Hari* untuk memasukkan bilangan hari tersuai secara dinamik.
3. **Pengurusan Jadual Makmal & Cuti Kakitangan dengan Fungsi "Clear Off"**:
   - Memantau cuti staf dan *downtime* mesin kalibrasi.
   - Butang **"Clear Off"** untuk membersihkan rekod apabila staf telah kembali bekerja atau mesin selesai dibaiki.

---

## 4. Keperluan Fungsian & Kriteria Penerimaan

| Kod | Modul | Keterangan Fungsian | Kriteria Penerimaan (Acceptance Criteria) |
| :--- | :--- | :--- | :--- |
| **FR-001** | Role Toggle | Suis penukar peranan pantas di bahagian *Header*. | Penukaran peranan serta-merta mengubah kebolehcapaian butang kelulusan dan borang penetapan parameter tanpa perlu memuat semula halaman (*page reload*). |
| **FR-002** | Sample Intake & Lead Time | Pendaftaran sampel baharu dengan kategori, gred, projek, dan tarikh. | ID sampel dijana secara automatik. Butang Auto 20 Hari dan Butang Custom mengira tarikh sasaran siap secara tepat. |
| **FR-003** | Parameter Config | Boss mentakrifkan nama ujian, unit, kaedah piawaian, dan had spesifikasi (min/max). | Parameter yang ditambah atau dikemas kini serta-merta dipaparkan pada borang ujian sampel berikutnya. |
| **FR-004** | Result Recording | Staf memasukkan bacaan ujian mentah, memilih pelarut kimia, dan memuat naik graf. | Sistem menandakan status 'Lulus' (hijau) atau 'Gagal' (merah) sekiranya bacaan di luar had. Pemilihan pelarut bukan rutin memaparkan lencana amaran khas. |
| **FR-005** | Gemini AI Summary | Butang "Jana Rumusan AI" memanggil model pelayan untuk menghasilkan draf ulasan. | Draf teknikal makmal dipaparkan dalam kotak teks yang boleh disunting sepenuhnya oleh Boss sebelum kelulusan. |
| **FR-006** | Approval Workflow | Boss menyemak keseluruhan keputusan ujian sebelum meluluskan atau menolak sampel. | Menekan 'Approve & Sign' mengunci sampel daripada sebarang suntingan oleh Staf dan membubuh tandatangan digital rasmi. |
| **FR-007** | CoA & CSV Export | Penjanaan Sijil Analisis standard sedia cetak dan muat turun data CSV. | Sijil mengandungi metadata makmal, keputusan ujian, pelarut yang digunakan, dan perakuan piawaian MS ISO/IEC 17025. |
| **FR-008** | Schedule & Clear Off | Perekodan cuti dan penyelenggaraan alat makmal. | Butang 'Clear Off' menukar status kepada selesai berserta catatan nama staf dan masa pelaksanaan. |

---

## 5. Model Data Utama (Sample Record Schema)

```typescript
interface SampleRecord {
  id: string; // Cth: "SMP-2026-NR-001"
  category: 'NR' | 'Non-NR';
  grade: string; // Cth: "SMR 10 (Standard Malaysian Rubber)"
  originProject: string;
  receivedDate: string; // Format: YYYY-MM-DD
  targetCompletionDate: string; // Dikira secara automatik (+20 hari atau custom)
  leadTimeDays?: number; // Cth: 20
  status: 'Testing' | 'Pending_Approval' | 'Approved' | 'Rejected';
  priority: 'Biasa (Normal)' | 'Segera (Urgent)' | 'Kritikal (Critical)';
  registeredBy: string;
  approvedBy?: string;
  approvalDate?: string;
  bossRemarks?: string;
  aiSummaryDraft?: string;
  tests: TestResultItem[];
}
```
