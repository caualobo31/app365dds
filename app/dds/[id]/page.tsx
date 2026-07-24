import Link from "next/link";
import { notFound } from "next/navigation";
import { ddsList, getAdjacentDds, getDdsById } from "@/lib/dds";
import { SECTOR_LABELS } from "@/data/dds.schema";
import { DdsBlock } from "@/components/DdsBlock";
import { DdsDiscussao } from "@/components/DdsDiscussao";
import { MarkDoneButton } from "@/components/MarkDoneButton";
import { ZebraBar } from "@/components/ZebraBar";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";

export function generateStaticParams() {
  return ddsList.map((d) => ({ id: String(d.id) }));
}

export default async function DetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dds = getDdsById(Number(id));
  if (!dds) notFound();

  const { prev, next } = getAdjacentDds(dds.id);

  return (
    <main className="mx-auto max-w-xl px-5 pt-6">
      <div className="flex items-center justify-between">
        {prev ? (
          <Link
            href={`/dds/${prev.id}`}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-[4px] border border-border text-white hover:border-safety-yellow"
            aria-label={`DDS anterior: ${prev.titulo}`}
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </Link>
        ) : (
          <span className="h-11 w-11" />
        )}
        <span className="font-mono text-xs uppercase tracking-widest text-text-secondary">
          DDS {String(dds.id).padStart(3, "0")}
        </span>
        {next ? (
          <Link
            href={`/dds/${next.id}`}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-[4px] border border-border text-white hover:border-safety-yellow"
            aria-label={`Próximo DDS: ${next.titulo}`}
          >
            <ChevronRightIcon className="h-5 w-5" />
          </Link>
        ) : (
          <span className="h-11 w-11" />
        )}
      </div>

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

      <div className="divide-y divide-border">
        <DdsBlock label="Abertura" text={dds.abertura} />
        <DdsBlock label="O caso" text={dds.caso} />
        <DdsBlock label="A regra de hoje" text={dds.regra} />
        <DdsDiscussao label="Pra discutir com a turma" questions={dds.discussao} />
        <DdsBlock label="Fechamento" text={dds.fechamento} />
      </div>

      <Link
        href="/mais/guia"
        className="mt-1 inline-block text-xs text-text-secondary hover:text-safety-yellow"
      >
        Ninguém respondeu? Veja o guia de condução →
      </Link>

      <div className="pb-10 pt-4">
        <MarkDoneButton dds={dds} />
      </div>
    </main>
  );
}
