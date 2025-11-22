# LOG — De-ID & Ingest KB SIMRS

## 2025-11-16

[2025-11-16 10:15]  
Operator : mahasiswa-001  
Source : PASIEN_2025-REG.csv  
Source_ID : PASIEN-REG-2025-01  
Classification: PII → Internal (non-PII) setelah de-ID  
Actions :

- Nama, nomor_rm, nomor_ktp, alamat_rumah, no_tlp, email disamarkan dengan token standar.
- 500 baris diproses.  
  PII redacted : name:500, id:500, address:500, phone:500, email:500  
  Output : /data/clean/PASIEN-REG-2025-01_clean.csv  
  Policy Check : PASS (DATA_POLICY v1.0)

---

[2025-11-16 10:45]  
Operator : mahasiswa-001  
Source : KUNJUNGAN_2024.csv  
Source_ID : KUNJUNGAN-2024-AGG-01  
Classification: PII → Internal (non-PII) setelah agregasi  
Actions :

- Data kunjungan di-agregasi per poli & bulan.
- Kolom pasien_id, penjamin_id dihapus.  
  PII removed : patient_id:12000, guarantor_id:12000  
  Output : /data/clean/KUNJUNGAN-2024_AGG_clean.csv  
  Policy Check : PASS (DATA_POLICY v1.0)

---

[2025-11-16 11:10]  
Operator : mahasiswa-001  
Source : Panduan_Modul_Rekam_Medis_v1.docx  
Source_ID : SOP-REKMED-2025-01  
Classification: Internal (non-PII)  
Actions :

- Cek manual: tidak ada nama pasien, NIK, atau data pribadi.
- Hanya istilah teknis dan screenshot dengan data dummy.  
  PII redacted : 0  
  Output : /data/clean/SOP-REKMED-2025-01.txt (konversi ke teks)  
  Policy Check : PASS (DATA_POLICY v1.0)

---

[2025-11-16 11:30]  
Operator : mahasiswa-001  
Source : FORM_PENDAFTARAN_RAWAT_JALAN_scan.pdf  
Source_ID : FORM-REG-RAWATJALAN-2025-01  
Classification: PII  
Actions :

- Data tulisan tangan pasien tidak digunakan langsung.
- Form diubah menjadi template kosong (tanpa isi pasien) untuk referensi struktur.  
  PII removed : all free-text fields.  
  Output : /data/clean/FORM-REG-RAWATJALAN_template.pdf  
  Policy Check : PASS (DATA_POLICY v1.0)

---

[2025-11-16 11:50]  
Operator : mahasiswa-001  
Source : Kebijakan_Privasi_Rekam_Medis_v1.pdf  
Source_ID : POLICY-PRIVACY-2025-01  
Classification: Rahasia  
Actions :

- Tidak mengandung PII, tetapi diklasifikasi Rahasia karena sifat dokumen kebijakan internal.
- Dibatasi hanya untuk role: [IT, RekamMedik, Manajemen].  
  PII redacted : 0  
  Output : /data/clean/POLICY-PRIVACY-2025-01.txt  
  Policy Check : PASS (DATA_POLICY v1.0)

[2025-11-23] Dedup run — Operator: uhkaava
Exact duplicates removed: 1

- pasien_clean_backup.txt (same checksum as pasien_clean_v1.txt)

Near-duplicates resolved: 1 pair

- kept: panduan_modul_rekam_medis_clean_v2.txt
- superseded: panduan_modul_rekam_medis_clean_v1.txt
  Reason: newer version + added section on resep workflow

Pending manual review:

- SOP-KEUANGAN-2024_v1 vs SOP-KEUANGAN-2025_v1 (similarity ~0.82)

[2025-11-23] Planned KB refresh — Operator: uhkaava
Docs to update: DATA_OBAT-2025-11, SOP-REKMED-2025-02
Steps: de-ID → dedup → chunk → build index v2 (Blue)
Smoke test: 8 queries on pelayanan, obat, kunjungan
Rollback plan: revert to index v1 (Green) if retrieval drops

[2025-11-23] Takedown — Source_ID: PASIEN-2025-01
Reason: training dataset request contains PII
Action: removed from /clean and /chunks; index v2 rebuilt
Completed by: uhkaava | 2025-11-23 14:10 WIB
