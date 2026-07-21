import type { HistoryEntry } from "./storage";
import { SECTOR_LABELS } from "@/data/dds.schema";

function csvEscape(value: string): string {
  if (/[",\n;]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function historyToCsv(entries: HistoryEntry[]): string {
  const header = ["data", "id", "titulo", "setor"].join(",");
  const rows = entries.map((e) =>
    [
      e.date,
      String(e.id),
      csvEscape(e.titulo),
      csvEscape(e.setores.map((s) => SECTOR_LABELS[s]).join(" / ")),
    ].join(","),
  );
  return [header, ...rows].join("\n");
}

export function downloadCsv(filename: string, content: string): void {
  // BOM no início para o Excel reconhecer acentuação em UTF-8 corretamente.
  const blob = new Blob(["﻿" + content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
