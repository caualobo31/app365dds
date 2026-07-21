"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { clearHistory, getHistory, type HistoryEntry } from "@/lib/storage";
import { downloadCsv, historyToCsv } from "@/lib/csv";
import { toIsoDate } from "@/lib/day";
import { SECTOR_LABELS } from "@/data/dds.schema";
import { DownloadIcon, TrashIcon } from "@/components/icons";
import { ZebraBar } from "@/components/ZebraBar";

export default function HistoricoPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [confirmingClear, setConfirmingClear] = useState(false);

  function refresh() {
    setEntries(getHistory());
  }

  useEffect(() => {
    // lê localStorage, indisponível no prerender estático em Node —
    // por isso o histórico começa vazio e é preenchido só no cliente.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntries(getHistory());
  }, []);

  const monthCount = useMemo(() => {
    const prefix = toIsoDate().slice(0, 7);
    return entries.filter((e) => e.date.startsWith(prefix)).length;
  }, [entries]);

  function handleExport() {
    const csv = historyToCsv(entries);
    const today = new Date().toISOString().slice(0, 10);
    downloadCsv(`365dds-historico-${today}.csv`, csv);
  }

  function handleClear() {
    clearHistory();
    refresh();
    setConfirmingClear(false);
  }

  return (
    <main className="mx-auto max-w-xl px-5 pt-8">
      <h1 className="font-heading text-3xl font-extrabold uppercase text-white">Histórico</h1>

      <p className="mt-1 font-mono text-sm text-text-secondary">
        Você fez {monthCount} DDS este mês
      </p>

      <ZebraBar className="my-5" />

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleExport}
          disabled={entries.length === 0}
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-[4px] bg-safety-yellow px-4 font-heading text-base font-bold uppercase tracking-wide text-graphite disabled:opacity-40"
        >
          <DownloadIcon className="h-5 w-5" />
          Exportar CSV
        </button>

        {!confirmingClear ? (
          <button
            type="button"
            onClick={() => setConfirmingClear(true)}
            disabled={entries.length === 0}
            className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-[4px] border border-safety-red px-4 font-heading text-base font-bold uppercase tracking-wide text-safety-red disabled:opacity-40"
          >
            <TrashIcon className="h-5 w-5" />
            Limpar histórico
          </button>
        ) : (
          <div className="flex flex-1 gap-2">
            <button
              type="button"
              onClick={handleClear}
              className="flex min-h-12 flex-1 items-center justify-center rounded-[4px] bg-safety-red px-4 font-heading text-sm font-bold uppercase tracking-wide text-white"
            >
              Confirmar
            </button>
            <button
              type="button"
              onClick={() => setConfirmingClear(false)}
              className="flex min-h-12 flex-1 items-center justify-center rounded-[4px] border border-border px-4 font-heading text-sm font-bold uppercase tracking-wide text-text-secondary"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col divide-y divide-border pb-8">
        {entries.length === 0 && (
          <p className="py-8 text-center text-text-secondary">
            Nenhum DDS marcado como feito ainda.
          </p>
        )}
        {entries.map((entry, i) => (
          <Link
            key={`${entry.id}-${entry.date}-${i}`}
            href={`/dds/${entry.id}`}
            className="flex items-center justify-between gap-3 py-3 hover:text-safety-yellow"
          >
            <div className="min-w-0">
              <p className="truncate font-heading text-lg font-bold uppercase text-white">
                {entry.titulo}
              </p>
              <p className="font-mono text-xs text-text-secondary">
                {entry.setores.map((s) => SECTOR_LABELS[s]).join(" / ")}
              </p>
            </div>
            <span className="shrink-0 font-mono text-sm text-text-secondary">{entry.date}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
