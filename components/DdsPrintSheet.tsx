"use client";

import { useEffect, useState } from "react";
import type { Dds } from "@/data/dds.schema";
import { SECTOR_LABELS } from "@/data/dds.schema";
import { getCompanyConfig, type CompanyConfig } from "@/lib/storage";
import { formatDateLong } from "@/lib/day";
import { ZebraBar } from "./ZebraBar";
import { PrinterIcon } from "./icons";

const PRESENCA_LINHAS = 6;

function PrintBlock({ label, text }: { label: string; text: string }) {
  return (
    <section className="mt-5 break-inside-avoid">
      <h2 className="font-mono text-xs uppercase tracking-widest text-black/60">{label}</h2>
      <p className="mt-1.5 text-base leading-relaxed text-black">{text}</p>
    </section>
  );
}

export function DdsPrintSheet({ dds }: { dds: Dds }) {
  const [company, setCompany] = useState<CompanyConfig>({});
  const [dateLabel, setDateLabel] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lê localStorage/Date, indisponíveis no prerender estático em Node
    setCompany(getCompanyConfig());
    setDateLabel(formatDateLong(new Date()));
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => window.print()}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[4px] border border-border px-6 font-heading text-base font-bold uppercase tracking-wide text-text-secondary hover:border-safety-yellow hover:text-white"
      >
        <PrinterIcon className="h-5 w-5" />
        Imprimir folha
      </button>

      {/* Oculta na tela — só existe pra impressão. Ver .print-sheet em globals.css. */}
      <div className="print-sheet bg-white text-black">
        <div className="zebra-stripe h-3 w-full" aria-hidden="true" />

        <header className="flex items-start justify-between gap-6 px-10 pt-6">
          <div className="flex items-center gap-4">
            {company.logo && (
              // eslint-disable-next-line @next/next/no-img-element -- imagem base64 do usuário, não é asset do build
              <img src={company.logo} alt="" className="h-16 w-16 object-contain" />
            )}
            <div>
              {company.nome && <p className="text-lg font-bold text-black">{company.nome}</p>}
              {company.unidade && <p className="text-sm text-black/70">{company.unidade}</p>}
              {company.responsavel && (
                <p className="text-sm text-black/70">Responsável: {company.responsavel}</p>
              )}
            </div>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-mono text-sm capitalize text-black/70">{dateLabel}</p>
            <p className="mt-0.5 font-mono text-xs uppercase tracking-widest text-black/50">
              DDS {String(dds.id).padStart(3, "0")}
            </p>
          </div>
        </header>

        <main className="px-10 pt-4">
          <h1 className="font-heading text-3xl font-extrabold uppercase leading-tight text-black">
            {dds.titulo}
          </h1>
          <div className="mt-2 flex flex-wrap gap-2 font-mono text-xs uppercase text-black/70">
            <span className="rounded-[4px] border border-black/25 px-2 py-0.5">{dds.tempo} min</span>
            {dds.setores.map((s) => (
              <span key={s} className="rounded-[4px] border border-black/25 px-2 py-0.5">
                {SECTOR_LABELS[s]}
              </span>
            ))}
          </div>

          <PrintBlock label="Abertura" text={dds.abertura} />
          <PrintBlock label="O caso" text={dds.caso} />
          <PrintBlock label="A regra de hoje" text={dds.regra} />

          <section className="mt-5 break-inside-avoid">
            <h2 className="font-mono text-xs uppercase tracking-widest text-black/60">
              Pra discutir com a turma
            </h2>
            <ul className="mt-1.5 flex flex-col gap-1.5">
              {dds.discussao.map((pergunta, i) => (
                <li key={i} className="flex gap-2 text-base leading-relaxed text-black">
                  <span aria-hidden="true">—</span>
                  <span>{pergunta}</span>
                </li>
              ))}
            </ul>
          </section>

          <PrintBlock label="Fechamento" text={dds.fechamento} />

          {dds.frase && (
            <div className="mt-5 break-inside-avoid border-l-4 border-safety-yellow bg-safety-yellow/10 px-4 py-3">
              <p className="text-lg font-semibold italic text-black">&quot;{dds.frase}&quot;</p>
            </div>
          )}
        </main>

        <section className="break-inside-avoid px-10 pb-8 pt-8">
          <ZebraBar className="h-1.5" />
          <h2 className="mt-4 font-mono text-xs uppercase tracking-widest text-black/60">
            Lista de presença
          </h2>
          <div className="mt-3 flex gap-4 pl-6 font-mono text-[10px] uppercase text-black/50">
            <span className="flex-1">Nome</span>
            <span className="w-52">Assinatura</span>
          </div>
          <div className="mt-1 flex flex-col gap-4">
            {Array.from({ length: PRESENCA_LINHAS }).map((_, i) => (
              <div key={i} className="flex items-end gap-4">
                <span className="w-6 text-sm text-black/50">{i + 1}.</span>
                <span className="flex-1 border-b border-black/40">&nbsp;</span>
                <span className="w-52 border-b border-black/40">&nbsp;</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
