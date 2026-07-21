"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDdsForDayOfYear, TOTAL_DDS } from "@/lib/dds";
import type { Dds } from "@/data/dds.schema";
import { SECTOR_LABELS } from "@/data/dds.schema";
import { formatDateLong, getDayOfYear } from "@/lib/day";
import { MarkDoneButton } from "@/components/MarkDoneButton";
import { ZebraBar } from "@/components/ZebraBar";

type TodayState = { dds: Dds; dayOfYear: number; dateLabel: string };

export default function HomePage() {
  const [today, setToday] = useState<TodayState | null>(null);

  useEffect(() => {
    // O dia do ano depende do fuso/relógio do aparelho, então só pode ser
    // calculado no cliente — daqui vem a leitura única após montar.
    const now = new Date();
    const day = getDayOfYear(now);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- leitura única do relógio/fuso do aparelho no primeiro render do cliente, necessária para o export estático (prerenderizado em Node, sem Date local do usuário)
    setToday({
      dds: getDdsForDayOfYear(day),
      dayOfYear: Math.min(day, TOTAL_DDS),
      dateLabel: formatDateLong(now),
    });
  }, []);

  if (!today) {
    return <div className="flex flex-1 items-center justify-center px-6 py-16" />;
  }

  const { dds, dayOfYear, dateLabel } = today;

  return (
    <main className="mx-auto flex max-w-xl flex-col px-5 pt-8">
      <p className="font-mono text-sm capitalize text-text-secondary">{dateLabel}</p>
      <p className="mt-1 font-mono text-xs uppercase tracking-widest text-safety-yellow">
        DDS {String(dayOfYear).padStart(3, "0")} / {TOTAL_DDS}
      </p>

      <ZebraBar className="my-5" />

      <h1 className="font-heading text-4xl font-extrabold uppercase leading-none text-white">
        {dds.titulo}
      </h1>

      <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-xs text-text-secondary">
        <span className="rounded-[4px] border border-border px-1.5 py-0.5">{dds.tempo} min</span>
        {dds.setores.map((s) => (
          <span key={s} className="rounded-[4px] border border-border px-1.5 py-0.5">
            {SECTOR_LABELS[s]}
          </span>
        ))}
      </div>

      <Link
        href={`/dds/${dds.id}`}
        className="mt-8 flex min-h-14 w-full items-center justify-center rounded-[4px] border border-safety-yellow px-6 font-heading text-lg font-bold uppercase tracking-wide text-safety-yellow"
      >
        Ler o DDS de hoje
      </Link>

      <div className="mt-4">
        <MarkDoneButton dds={dds} />
      </div>
    </main>
  );
}
