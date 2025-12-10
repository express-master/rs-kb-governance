// scripts/build_vectors.mjs
import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === Konfigurasi dasar ===
const CHUNKS_DIR = path.join(__dirname, "..", "data", "chunks");
const OUT_PATH = path.join(__dirname, "..", "data", "index", "vectors.json");
const OLLAMA_URL = "http://127.0.0.1:11434/api/embeddings";
// Ganti kalau kamu pakai model embed lain:
const EMBED_MODEL = "mxbai-embed-large";

async function embedText(text) {
  const body = {
    model: EMBED_MODEL,
    prompt: text,
  };

  const resp = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const errTxt = await resp.text();
    throw new Error(`Ollama /api/embeddings error ${resp.status}: ${errTxt}`);
  }

  const json = await resp.json();
  if (!json.embedding) {
    throw new Error("Response dari embeddings tidak punya field 'embedding'");
  }
  return json.embedding; // array number
}

async function processChunkFile(filePath, vectors) {
  console.log(`>> Proses file chunks: ${path.basename(filePath)}`);

  const rl = readline.createInterface({
    input: fs.createReadStream(filePath),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    let obj;
    try {
      obj = JSON.parse(trimmed);
    } catch (e) {
      console.warn("  ! Gagal parse JSONL, skip satu baris:", e.message);
      continue;
    }

    const meta = obj.metadata || {};
    const text = obj.text || "";
    if (!text) continue;

    // Panggil embedding
    const embedding = await embedText(text);

    vectors.push({
      id: meta.chunk_id || `${meta.source_id || "UNKNOWN"}#${vectors.length}`,
      source_id: meta.source_id || null,
      section: meta.section || null,
      title: meta.title || null,
      text,
      embedding,
    });

    console.log(
      `  + chunk ${meta.chunk_id || vectors.length} → embedding length ${
        embedding.length
      }`
    );
  }
}

async function main() {
  const files = fs
    .readdirSync(CHUNKS_DIR)
    .filter((f) => f.endsWith(".jsonl") || f.endsWith(".json"));

  if (!files.length) {
    console.error("Tidak ada file *.jsonl di", CHUNKS_DIR);
    process.exit(1);
  }

  const vectors = [];

  for (const f of files) {
    const full = path.join(CHUNKS_DIR, f);
    await processChunkFile(full, vectors);
  }

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });

  const payload = {
    model: EMBED_MODEL,
    created_at: new Date().toISOString(),
    vector_count: vectors.length,
    vectors,
  };

  fs.writeFileSync(OUT_PATH, JSON.stringify(payload, null, 2), "utf8");
  console.log(`\n✅ Saved ${vectors.length} vectors → ${OUT_PATH}`);
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
