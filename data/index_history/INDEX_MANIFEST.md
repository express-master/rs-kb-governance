# INDEX MANIFEST — Knowledge Base RS

Folder ini menyimpan riwayat versi index Knowledge Base (KB).  
Setiap versi index dibangun dari dokumen bersih di `/clean` dan chunk di `/chunks`.

---

## Index v1.0.0 — 2025-11-23

**Status:** Active (Green)

**Built from clean docs:**

- PASIEN-2025-01 (v1.0.0)
- KUNJ-2025-000331 (v1.0.0)
- RM-2025-000331 (v1.0.0)

**Chunks used:**

- PASIEN-2025-01\_\_chunks.jsonl (1 chunk)
- KUNJ-2025-000331\_\_chunks.jsonl (2 chunks)
- RM-2025-000331\_\_chunks.jsonl (3 chunks)

**Dedup summary:**

- Exact dup removed: 1
- Near-dup resolved: 1 pair (kept v2)

**Smoke test result:** PASS (8/8 queries OK)
**Notes:** First stable KB index.

---

## Index v1.1.0 — 2025-11-30

**Status:** Blue (candidate)

**Change summary:**

- Added new clean docs: DATA_OBAT-2025-11, SOP-REKMED-2025-02
- Rechunked affected documents (overlap 12%, target 800 tokens)

**Smoke test result:** PASS (9/10 queries OK)
**Notes:** Ready to switch after minor latency check.
