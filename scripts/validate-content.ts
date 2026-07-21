// Roda antes do build (npm run prebuild) e derruba o processo com uma
// mensagem clara se data/dds.json estiver malformado. Também pode ser
// chamado manualmente: npm run validate

import ddsRaw from "../data/dds.json";
import { validateDdsList } from "../data/dds.schema";

try {
  const list = validateDdsList(ddsRaw);
  console.log(`✓ data/dds.json válido — ${list.length} DDS carregado(s).`);
} catch (err) {
  console.error("\n✗ data/dds.json inválido. O build foi interrompido.\n");
  console.error(err instanceof Error ? err.message : String(err));
  console.error("");
  process.exit(1);
}
