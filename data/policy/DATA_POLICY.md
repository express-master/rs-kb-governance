# DATA_POLICY — Knowledge Base SIMRS Rumah Sakit

Version: v1.0 — 2025-11-16

## 1. Tujuan & Ruang Lingkup

Dokumen ini mengatur tata kelola data (Data Governance) untuk pembangunan Knowledge Base (KB) di lingkungan Sistem Informasi Manajemen Rumah Sakit (SIMRS).  
Tujuan utama:

- Melindungi kerahasiaan data pasien dan tenaga medis.
- Memastikan kepatuhan terhadap kebijakan internal dan regulasi yang berlaku.
- Menjamin bahwa setiap dokumen yang masuk ke KB memiliki sumber, izin, dan klasifikasi yang jelas.
- Menjaga KB agar dapat diaudit (traceable) dan mudah dikelola.

Ruang lingkup: seluruh dokumen yang digunakan untuk keperluan **pencarian pengetahuan (RAG)**, dokumentasi internal, dan analitik non-klinikal yang berasal dari unit IT, Rekam Medik, Pelayanan, Keuangan, dan unit terkait lainnya.

---

## 2. Klasifikasi Data

Setiap sumber data wajib diberi salah satu label berikut:

1. **Public**

   - Konten yang aman dibagikan ke publik.
   - Contoh: FAQ layanan di website RS, brosur resmi, press release.

2. **Internal (non-PII)**

   - Hanya untuk konsumsi internal, tetapi tidak mengandung data identitas individu.
   - Contoh: ERD database, SOP instalasi, laporan statistik agregat (tanpa nama / NIK).

3. **PII (Personally Identifiable Information)**

   - Mengandung identitas pribadi:
     - Nama lengkap, NIK, nomor rekam medis, alamat, tanggal lahir.
     - Nomor telepon/WhatsApp, email.
     - Data keluarga, penanggung jawab, pengantar.
   - Contoh: tabel `pasien`, `penanggung_jawab`, `pengantar`, data mentah `kunjungan`, `pembayaran` yang masih berisi identitas.

4. **Rahasia**
   - Dokumen internal yang sensitif/konfidensial, walaupun tidak selalu mengandung PII.
   - Contoh: kebijakan privasi rekam medis internal, laporan audit, notulen rapat pimpinan.

**Aturan praktis:**

- Ragu antara _Internal_ vs _Rahasia_ → pilih **Rahasia** (konservatif).
- Dokumen campuran (ada PII + informasi lain) → label sebagai **PII**, lakukan de-ID sebelum masuk KB.

---

## 3. Definisi PII & De-Identification (De-ID)

**PII** di konteks database RS meliputi (tidak terbatas pada):

- `pasien`: nama_lengkap, nomor_rm, nomor_ktp, tanggal_lahir, alamat, no_tlp, email.
- `penanggung_jawab`, `pengantar`: nama_lengkap, hubungan_dengan_pasien, alamat, no_tlp, email.
- `tenaga_medis`: nama_lengkap, no_ktp, email, no_tlp, tanda_tangan (digital).
- Data lainnya yang dapat mengidentifikasi individu secara langsung ataupun tidak langsung.

**PII tidak boleh digunakan untuk:**

- Fine-tuning model ML/LLM.
- Dataset publik atau dibagikan ke pihak luar tanpa perjanjian khusus.

**De-ID minimal yang wajib diterapkan sebelum dokumen masuk KB:**

- Email → `[EMAIL REDACTED]`
- Nomor telepon / WhatsApp → `[PHONE REDACTED]`
- NIK / nomor rekam medis → `[ID REDACTED]`
- Alamat rumah/kantor → `[ADDRESS REDACTED]`
- Nama pasien / keluarga → `[NAME REDACTED]`
- Tanda tangan / scan KTP / foto wajah → dihapus dari dokumen sebelum masuk folder `/clean`.

Versi bersih (sudah de-ID) disimpan di `/data/clean`. Versi mentah tetap ada di `/data/raw` tapi **tidak** di-index oleh KB.

---

## 4. Sumber & Lisensi

Setiap dokumen yang akan digunakan dalam KB wajib dicatat di `data/catalog/DATA_SOURCES.md` dengan informasi:

- Title
- Owner (PIC)
- Source Type (Internal / External)
- Label (Public / Internal / PII / Rahasia)
- License (mis. All rights internal use / CC-BY 4.0)
- URL/Path
- Access Approved By
- Access Date
- Version
- Notes (mis. "Perlu de-ID", "Attribution required").

**Boleh digunakan:**

- Dokumen internal yang telah diizinkan oleh pemilik/PIC.
- Dokumen dari situs resmi pemerintah / mitra dengan lisensi yang jelas.
- Konten public domain atau berlisensi CC-BY/CC-BY-SA (dengan atribusi).

**Perlu izin tertulis:**

- Buku/jurnal berbayar (PDF, e-book).
- Diktat pihak ketiga.
- Dokumen eksternal tanpa lisensi eksplisit.

---

## 5. Alur Kerja Pengolahan Dokumen ke KB

1. **Pilih sumber**

   - Identifikasi dokumen yang relevan (misal: SOP, ERD tanpa data, laporan agregat).

2. **Daftar di DATA_SOURCES**

   - Isi baris baru di `DATA_SOURCES.md` dengan informasi lengkap termasuk label dan lisensi.

3. **Klasifikasi & cek PII**

   - Tentukan label (Public / Internal / PII / Rahasia).
   - Jika mengandung PII, lanjut ke proses de-ID.

4. **De-ID (jika perlu)**

   - Tandai dan samarkan PII dengan token standar.
   - Simpan versi bersih ke folder `/data/clean`.
   - Catat proses di `data/logs/LOG.md`.

5. **Simpan metadata teknis**

   - Untuk dokumen teks yang akan jadi sumber RAG, bisa ditambahkan header metadata (Source_ID, Classification, License, Access_Roles, Retention, dll.) di file bersih.

6. **Index / Ingest ke KB**
   - Hanya dokumen dari folder `/clean` yang diizinkan di-chunk dan di-index.

---

## 6. Akses & Peran

Contoh peran dan hak akses ke KB:

- **Unit IT / SIMRS**
  - Akses penuh ke konfigurasi KB, struktur index, dan folder `/clean`.
- **Instalasi Rekam Medik**
  - Akses ke dokumen internal terkait rekam medis dan laporan statistik yang sudah de-ID.
- **Tenaga Medis (Dokter/Perawat)**
  - Akses baca ke panduan klinis, SOP, dan referensi non-PII.
- **Manajemen RS**
  - Akses ke laporan agregat dan kebijakan.

Setiap dokumen bersih dapat memiliki `Access_Roles` (misal: `[IT, RekamMedik, Manajemen]`) sebagai bagian dari metadata.

---

## 7. Retensi & Versi

- Retensi default: **12 bulan** untuk dokumen operasional di KB, kecuali diatur lain oleh kebijakan RS.
- Simpan maksimal **3 versi terakhir** dari dokumen yang sama; versi lebih lama dipindahkan ke arsip.
- Perubahan isi dokumen atau kebijakan harus menaikkan nomor versi (mis. v1.0.0 → v1.1.0).

---

## 8. Takedown & Pengaduan Privasi

- Permintaan penghapusan atau koreksi data dapat diajukan melalui email khusus, misalnya: `privacy@rscontoh.ac.id`.
- SLA: permintaan yang valid diproses maksimal **72 jam**.
- Jika dikabulkan:
  - Dokumen terkait dihapus dari `/clean` dan dari index KB.
  - Catat tindakan ini di `LOG.md`.

---

## 9. Audit & Change Log

- Setiap proses de-ID dan ingest dicatat di `data/logs/LOG.md`.
- Audit berkala dapat melihat:
  - Sumber dokumen,
  - Kapan de-ID dilakukan,
  - Siapa operatornya,
  - Berapa PII yang disamarkan.

**Change Log Policy:**

- v1.0 (2025-11-16) — Kebijakan awal untuk tugas KB SIMRS berbasis database rumah sakit.
