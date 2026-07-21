"use client";

import { useEffect, useMemo, useState } from "react";
import { ddsList } from "@/lib/dds";
import { SECTOR_LABELS, SECTORS, TEMPOS, type Sector, type Tempo } from "@/data/dds.schema";
import { isDoneEver } from "@/lib/storage";
import { DdsCard } from "@/components/DdsCard";
import { FilterChip } from "@/components/FilterChip";

export default function ListaPage() {
  const [sectorFilters, setSectorFilters] = useState<Sector[]>([]);
  const [tempoFilters, setTempoFilters] = useState<Tempo[]>([]);
  const [doneIds, setDoneIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    // lê localStorage, indisponível no prerender estático em Node — parte
    // vazia até montar no cliente, depois preenche com o que já foi feito
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDoneIds(new Set(ddsList.filter((d) => isDoneEver(d.id)).map((d) => d.id)));
  }, []);

  function toggleSector(sector: Sector) {
    setSectorFilters((prev) =>
      prev.includes(sector) ? prev.filter((s) => s !== sector) : [...prev, sector],
    );
  }

  function toggleTempo(tempo: Tempo) {
    setTempoFilters((prev) =>
      prev.includes(tempo) ? prev.filter((t) => t !== tempo) : [...prev, tempo],
    );
  }

  function clearFilters() {
    setSectorFilters([]);
    setTempoFilters([]);
  }

  const filtered = useMemo(() => {
    return ddsList.filter((d) => {
      const matchesSector =
        sectorFilters.length === 0 || d.setores.some((s) => sectorFilters.includes(s));
      const matchesTempo = tempoFilters.length === 0 || tempoFilters.includes(d.tempo);
      return matchesSector && matchesTempo;
    });
  }, [sectorFilters, tempoFilters]);

  const hasFilters = sectorFilters.length > 0 || tempoFilters.length > 0;

  return (
    <main className="mx-auto max-w-xl px-5 pt-8">
      <h1 className="font-heading text-3xl font-extrabold uppercase text-white">Lista de DDS</h1>
      <p className="mt-1 font-mono text-xs text-text-secondary">
        {ddsList.length} DDS cadastrado(s)
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {SECTORS.map((sector) => (
          <FilterChip
            key={sector}
            label={SECTOR_LABELS[sector]}
            active={sectorFilters.includes(sector)}
            onClick={() => toggleSector(sector)}
          />
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {TEMPOS.map((tempo) => (
          <FilterChip
            key={tempo}
            label={`${tempo} min`}
            active={tempoFilters.includes(tempo)}
            onClick={() => toggleTempo(tempo)}
          />
        ))}
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="min-h-11 rounded-[4px] border border-border px-3 font-mono text-sm uppercase tracking-wide text-text-secondary hover:text-white"
          >
            Limpar
          </button>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3 pb-8">
        {filtered.length === 0 && (
          <p className="py-8 text-center text-text-secondary">Nenhum DDS com esses filtros.</p>
        )}
        {filtered.map((dds) => (
          <DdsCard key={dds.id} dds={dds} done={doneIds.has(dds.id)} />
        ))}
      </div>
    </main>
  );
}
