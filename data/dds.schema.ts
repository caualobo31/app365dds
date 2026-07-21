// Contrato de dados do DDS. Qualquer campo novo ou renomeado precisa ser
// refletido aqui — é a única fonte da verdade para o formato do dds.json.

export const SECTORS = [
  "geral",
  "construcao",
  "industria",
  "logistica",
  "frota",
  "escritorio",
] as const;

export type Sector = (typeof SECTORS)[number];

export const SECTOR_LABELS: Record<Sector, string> = {
  geral: "Geral",
  construcao: "Construção",
  industria: "Indústria",
  logistica: "Logística e armazém",
  frota: "Frota",
  escritorio: "Escritório",
};

export const TEMPOS = [5, 10, 15] as const;

export type Tempo = (typeof TEMPOS)[number];

export interface Dds {
  id: number;
  titulo: string;
  setores: Sector[];
  tempo: Tempo;
  abertura: string;
  caso: string;
  regra: string;
  discussao: string[];
  fechamento: string;
}

const REQUIRED_STRING_FIELDS = ["titulo", "abertura", "caso", "regra", "fechamento"] as const;

const MIN_DISCUSSAO = 2;

function describe(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return `array(${value.length})`;
  return typeof value;
}

/**
 * Valida a lista de DDS crua (vinda do JSON) e retorna uma lista tipada.
 * Junta TODOS os problemas encontrados numa única mensagem de erro, em vez
 * de parar no primeiro — assim quem edita o JSON corrige tudo de uma vez.
 */
export function validateDdsList(data: unknown): Dds[] {
  const errors: string[] = [];

  if (!Array.isArray(data)) {
    throw new Error(
      `data/dds.json precisa ser um array de DDS. Recebido: ${describe(data)}.`,
    );
  }

  const seenIds = new Map<number, number>();

  data.forEach((rawItem, index) => {
    const where = `Item #${index}`;
    if (typeof rawItem !== "object" || rawItem === null || Array.isArray(rawItem)) {
      errors.push(`${where}: precisa ser um objeto, recebido ${describe(rawItem)}.`);
      return;
    }
    const item = rawItem as Record<string, unknown>;
    const label = typeof item.id === "number" ? `DDS id=${item.id} (${where})` : where;

    if (typeof item.id !== "number" || !Number.isInteger(item.id)) {
      errors.push(`${label}: campo "id" precisa ser um número inteiro. Recebido: ${describe(item.id)}.`);
    } else {
      if (item.id < 1 || item.id > 365) {
        errors.push(`${label}: campo "id" precisa estar entre 1 e 365. Recebido: ${item.id}.`);
      }
      if (seenIds.has(item.id)) {
        errors.push(`${label}: "id" ${item.id} duplicado (já usado no item #${seenIds.get(item.id)}).`);
      } else {
        seenIds.set(item.id, index);
      }
    }

    for (const field of REQUIRED_STRING_FIELDS) {
      const value = item[field];
      if (typeof value !== "string" || value.trim().length === 0) {
        errors.push(`${label}: campo "${field}" precisa ser um texto não vazio. Recebido: ${describe(value)}.`);
      }
    }

    if (!Array.isArray(item.setores) || item.setores.length === 0) {
      errors.push(`${label}: campo "setores" precisa ser um array com pelo menos um setor. Recebido: ${describe(item.setores)}.`);
    } else {
      const invalidos = item.setores.filter((s) => !SECTORS.includes(s as Sector));
      if (invalidos.length > 0) {
        errors.push(
          `${label}: "setores" contém valor(es) inválido(s): ${JSON.stringify(invalidos)}. Valores aceitos: ${SECTORS.join(", ")}.`,
        );
      }
    }

    if (!TEMPOS.includes(item.tempo as Tempo)) {
      errors.push(`${label}: campo "tempo" precisa ser 5, 10 ou 15. Recebido: ${describe(item.tempo)} (${JSON.stringify(item.tempo)}).`);
    }

    if (!Array.isArray(item.discussao) || item.discussao.length < MIN_DISCUSSAO) {
      errors.push(
        `${label}: campo "discussao" precisa ser um array com pelo menos ${MIN_DISCUSSAO} pergunta(s). Recebido: ${describe(item.discussao)}.`,
      );
    } else {
      const invalidas = item.discussao.filter(
        (q) => typeof q !== "string" || q.trim().length === 0,
      );
      if (invalidas.length > 0) {
        errors.push(`${label}: "discussao" tem ${invalidas.length} item(ns) que não são texto não vazio.`);
      }
    }
  });

  if (errors.length > 0) {
    throw new Error(
      `data/dds.json tem ${errors.length} problema(s):\n` +
        errors.map((e) => `  - ${e}`).join("\n"),
    );
  }

  return data as Dds[];
}
