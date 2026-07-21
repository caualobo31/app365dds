import ddsRaw from "@/data/dds.json";
import { validateDdsList, type Dds } from "@/data/dds.schema";

// Validado uma vez, no carregamento do módulo. Durante `next build` isso
// roda ao gerar as páginas estáticas — um dds.json malformado derruba o
// build aqui também, além do script prebuild dedicado.
export const ddsList: Dds[] = validateDdsList(ddsRaw).sort((a, b) => a.id - b.id);

export const TOTAL_DDS = 365;

export function getDdsById(id: number): Dds | undefined {
  return ddsList.find((d) => d.id === id);
}

/**
 * Escolhe o DDS "de hoje" a partir do dia do ano (1–365).
 * Enquanto o conteúdo ainda não cobre os 365 dias (fase de teste), cai
 * num rodízio determinístico entre os itens existentes — assim a tela
 * HOJE sempre mostra algo, e o comportamento fica correto sozinho assim
 * que o dds.json for completado até o id 365, sem tocar em código.
 */
export function getDdsForDayOfYear(dayOfYear: number): Dds {
  if (ddsList.length === 0) {
    throw new Error("data/dds.json está vazio — adicione ao menos um DDS.");
  }
  const capped = Math.min(dayOfYear, TOTAL_DDS);
  const exact = getDdsById(capped);
  if (exact) return exact;
  return ddsList[(capped - 1) % ddsList.length];
}

export function getAdjacentDds(id: number): { prev: Dds | null; next: Dds | null } {
  const index = ddsList.findIndex((d) => d.id === id);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? ddsList[index - 1] : null,
    next: index < ddsList.length - 1 ? ddsList[index + 1] : null,
  };
}
