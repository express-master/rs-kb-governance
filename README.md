# 📘 Knowledge Base & Data Governance

## Studi Kasus: Database Sistem Informasi Rumah Sakit (SIMRS)

Repositori ini berisi contoh penerapan **Data Governance** dan **Knowledge Base Construction** menggunakan data dari database Rumah Sakit.  
Fokus utamanya adalah memastikan setiap dokumen yang digunakan **aman**, **terklasifikasi dengan benar**, dan **siap dipakai** dalam sistem pencarian/RAG (Retrieval-Augmented Generation).

---

## 🗂 Struktur Folder

```bash
data/
├── catalog/
│ └── DATA_SOURCES.md       # Daftar dokumen + sumber, izin, klasifikasi
├── policy/
│ └── DATA_POLICY.md        # Kebijakan data & aturan PII/De-ID
├── logs/
│ └── LOG.md                # Catatan proses de-ID & ingest
├── raw/                    # Dokumen mentah (ada PII, belum aman)
└── clean/                  # Dokumen bersih, sudah di-de-ID (aman untuk KB)
```

**Penjelasan singkat:**

- **raw/** → tempat file mentah seperti data pasien asli, kunjungan asli, scan formulir.  
  File-file di sini **tidak boleh** masuk KB karena masih mengandung PII.

- **clean/** → file yang sudah melalui proses **penyamaran identitas (De-ID)**.  
  Hanya folder ini yang boleh dipakai untuk indexing/KB.

---

## 🎯 Tujuan Repositori

Repositori ini dibuat untuk menampilkan contoh nyata bagaimana:

1. Menentukan **sumber dokumen** serta izin pemakaiannya.
2. Mengklasifikasikan dokumen menjadi **Public, Internal, PII, atau Rahasia**.
3. Melakukan **De-Identification (De-ID)** pada data sensitif.
4. Mencatat seluruh proses secara transparan melalui **LOG.md**.
5. Menyusun dokumentasi data yang mudah diaudit dan dipelihara.

---

## 📑 Isi Tiap File Penting

### **1. DATA_SOURCES.md**

Berisi daftar seluruh dokumen yang digunakan, lengkap dengan:

- asal dokumen
- pemilik (PIC)
- lisensi
- izin akses
- klasifikasi data
- catatan de-ID

Ini membantu memastikan bahwa semua konten yang masuk KB memiliki jejak yang jelas.

---

### **2. DATA_POLICY.md**

Dokumen kebijakan yang menjelaskan:

- apa itu PII
- bagaimana proses De-ID dilakukan
- aturan akses dokumen
- aturan retensi data
- alur takedown (hapus data dalam 72 jam kalau diminta)

Pendeknya, ini “buku aturan” agar semua dokumen aman digunakan.

---

### **3. LOG.md**

Berisi catatan setiap kali ada:

- proses de-ID
- dokumen yang dibersihkan
- siapa operatornya
- berapa banyak PII yang disamarkan
- hasil output clean file

LOG ini diperlukan untuk kebutuhan **audit** dan **transparansi**.

---

### **4. raw/**

Folder berisi contoh dokumen asli, misalnya:

- data pasien asli (nama, NIK, alamat, dll)
- kunjungan pasien
- scan formulir pendaftaran

Folder ini hanya untuk keperluan dokumentasi — **tidak digunakan oleh KB.**

---

### **5. clean/**

Berisi versi aman dari dokumen raw:

- nama → `[NAME REDACTED]`
- nomor telepon → `[PHONE REDACTED]`
- alamat → `[ADDRESS REDACTED]`
- nomor rekam medis → `[ID REDACTED]`

Dokumen di sini **boleh dipakai** untuk indexing / RAG.

---

## ✔ Alur Singkat Pengolahan Dokumen

1. **Ambil dokumen mentah** → letakkan di `/raw`.
2. **Daftar** dokumen tersebut di `DATA_SOURCES.md`.
3. **Klasifikasikan** jenis datanya (Public/Internal/PII/Rahasia).
4. Jika ada PII → lakukan **De-ID**.
5. Simpan versi bersihnya ke folder `/clean`.
6. Catat seluruh proses ke `LOG.md`.
7. Hanya file dari `clean/` yang dipakai untuk KB.

---

## 📌 Catatan

- Repositori ini bersifat contoh akademik, sehingga beberapa file diisi dengan placeholder.
- Struktur dan alur ditulis menyerupai standar Data Governance di institusi kesehatan.
- Cocok untuk tugas kuliah, presentasi, atau implementasi awal SIMRS.

---
