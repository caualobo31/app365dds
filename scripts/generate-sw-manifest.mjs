// Roda depois do `next build` (npm run postbuild). Varre a pasta `out/`
// gerada pelo export estático e escreve out/precache-manifest.json com
// a lista de todos os arquivos — o service worker usa essa lista pra
// baixar o app inteiro (shell + conteúdo dos DDS) na instalação.
// Como a lista é gerada automaticamente a partir do que o build produziu,
// crescer o dds.json até 365 itens não exige tocar neste script.

import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const outDir = fileURLToPath(new URL("../out/", import.meta.url));
const SKIP = new Set(["precache-manifest.json"]);

function walk(dir, base = "") {
  let files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const rel = base ? `${base}/${entry}` : entry;
    if (statSync(full).isDirectory()) {
      files = files.concat(walk(full, rel));
    } else if (!SKIP.has(rel)) {
      files.push(rel);
    }
  }
  return files;
}

const files = walk(outDir).sort();
const urls = files.map((f) => "/" + f);
const version = createHash("sha1")
  .update(files.join(",") + Date.now())
  .digest("hex")
  .slice(0, 10);

writeFileSync(
  join(outDir, "precache-manifest.json"),
  JSON.stringify({ version, urls }),
);

console.log(`✓ precache-manifest.json gerado — ${urls.length} arquivos, versão ${version}`);
