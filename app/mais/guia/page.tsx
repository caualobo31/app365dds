import Link from "next/link";
import { GUIA_CONDUCAO } from "@/data/guia";
import { ZebraBar } from "@/components/ZebraBar";
import { ChevronLeftIcon } from "@/components/icons";

export default function GuiaPage() {
  return (
    <main className="mx-auto max-w-xl px-5 pt-6 pb-10">
      <Link
        href="/mais"
        className="flex min-h-11 w-fit items-center gap-1 text-sm text-text-secondary hover:text-white"
      >
        <ChevronLeftIcon className="h-4 w-4" />
        Mais
      </Link>

      <h1 className="mt-4 font-heading text-4xl font-extrabold uppercase leading-none text-white">
        {GUIA_CONDUCAO.titulo}
      </h1>

      <ZebraBar className="my-5" />

      <div className="divide-y divide-border">
        {GUIA_CONDUCAO.secoes.map((secao, i) => (
          <section key={i} className="py-6">
            {secao.titulo && (
              <h2 className="font-mono text-sm uppercase tracking-widest text-safety-yellow">
                {secao.titulo}
              </h2>
            )}
            {secao.paragrafos.map((paragrafo, j) => (
              <p key={j} className="mt-3 text-2xl leading-relaxed text-white">
                {paragrafo}
              </p>
            ))}
          </section>
        ))}
      </div>
    </main>
  );
}
