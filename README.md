# 📘 Knowledge Base & Data Governance

## Studi Kasus: Database Sistem Informasi Rumah Sakit (SIMRS)

Repositori ini berisi contoh penerapan **Data Governance** dan **Knowledge Base Construction** menggunakan data yang diambil dari database Rumah Sakit (SIMRS).
Tujuannya memastikan setiap dokumen yang masuk ke sistem _aman, terklasifikasi, dan siap digunakan_ dalam pipeline RAG (Retrieval-Augmented Generation).

---

## 🗂 Struktur Folder

```bash
data/
├── catalog/
│ └── DATA_SOURCES.md                   # Daftar dokumen + sumber, izin, klasifikasi
├── policy/
│ └── DATA_POLICY.md                    # Kebijakan data & aturan PII/De-ID
├── logs/
│ └── LOG.md                            # Catatan proses de-ID & ingest
├── raw/                                # Dokumen mentah (ada PII, belum aman)
└── clean/                              # Dokumen bersih, sudah di-de-ID (aman untuk KB)
├── chunks/                             # Hasil chunking dari dokumen clean (JSONL / txt)
│   ├── PASIEN-2025-01__chunks.jsonl
│   ├── KUNJ-2025-000331__chunks.jsonl
│   └── RM-2025-000331__chunks.jsonl
│
└── index_history/                      # Riwayat versi index (Blue/Green), untuk audit & rollback
    └── manifest_index_v1.json
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

### **6. chunks/**

Berisi hasil pemotongan dokumen dari menu Chunking & Metadata.

Tiap file `.jsonl` berisi baris-baris chunk dengan struktur:

```json
{
  "metadata": {
    "source_id": "PASIEN-2025-01",
    "version": "1.0.0",
    "title": "Data Pasien (De-ID)",
    "section": "identitas > umum",
    "chunk_id": "PASIEN-2025-01#c007",
    "chunk_index": 7,
    "total_chunks": 22,
    "created_at": "2025-11-18",
    "license": "Internal Use Only",
    "lang": "id",
    "pii_score": 0,
    "checksum": "sha256:ab4f...9c"
  },
  "text": "Isi chunk dokumen yang sudah bersih..."
}
```

Tujuan: membuat dokumen mudah dicari oleh RAG/LLM.

---

### **7. index_history/**

Folder ini menyimpan:

- manifest versi index (v1, v2, dst)
- riwayat Blue/Green index
- timestamp switch & rollback

Contoh isi:

```json
{
  "index_version": "1.1.0",
  "created_at": "2025-11-22T14:20:00",
  "source_documents": [
    "PASIEN-2025-01_v1.txt",
    "KUNJ-2025-000331_v1.txt",
    "RM-2025-000331_v1.txt"
  ],
  "total_chunks": 47,
  "embedding_model": "MiniLM-v2",
  "notes": "Index hasil update chunking & dedup 22 Nov 2025"
}
```

Folder ini berguna untuk rollback jika index baru error.

---

## 🔄 Alur Pengolahan Dokumen

1. Input file mentah → `/raw`
2. Daftarkan ke **DATA_SOURCES.md**
3. Tentukan klasifikasi
4. Lakukan **De-ID** → pindah ke `/clean`
5. Jalankan **dedup** (exact & near-duplicate)
6. Lakukan **chunking** → hasil ke `/chunks`
7. Buat embeddings & index → disimpan di **index_history/**
8. Catat seluruh proses di **LOG.md**

---

## 📝 Catatan

- Struktur folder mengikuti standar Data Governance di sektor kesehatan.
- Semua contoh data bersifat fiktif / dummy.
- Repositori ini dibuat untuk tugas Topik 6–7 (De-ID, Dedup, Chunking, Metadata, Retensi).
