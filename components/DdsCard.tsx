import Link from "next/link";
import type { Dds } from "@/data/dds.schema";
import { SECTOR_LABELS } from "@/data/dds.schema";
import { CheckIcon } from "./icons";

export function DdsCard({ dds, done }: { dds: Dds; done: boolean }) {
  return (
    <Link
      href={`/dds/${dds.id}`}
      className="block rounded-[4px] border border-border bg-surface transition-colors hover:border-safety-yellow focus-visible:border-safety-yellow"
    >
      <div className="zebra-stripe h-1.5 rounded-t-[4px]" aria-hidden="true" />
      <div className="flex items-start gap-3 p-4">
        <span className="shrink-0 font-mono text-sm text-text-secondary">
          {String(dds.id).padStart(3, "0")}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-xl font-bold uppercase leading-tight text-white">
            {dds.titulo}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-2 font-mono text-xs text-text-secondary">
            <span className="rounded-[4px] border border-border px-1.5 py-0.5">{dds.tempo} min</span>
            {dds.setores.map((s) => (
              <span key={s} className="rounded-[4px] border border-border px-1.5 py-0.5">
                {SECTOR_LABELS[s]}
              </span>
            ))}
          </div>
        </div>
        {done && (
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-safety-green"
            title="Já feito"
            aria-label="Já feito"
          >
            <CheckIcon className="h-4 w-4 text-white" />
          </span>
        )}
      </div>
    </Link>
  );
}
