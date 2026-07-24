import Link from "next/link";
import { InstallInstructions } from "@/components/InstallInstructions";
import { ChevronLeftIcon } from "@/components/icons";

export default function InstalarPage() {
  return (
    <main className="mx-auto max-w-xl px-5 pt-6 pb-10">
      <Link
        href="/mais"
        className="flex min-h-11 w-fit items-center gap-1 text-sm text-text-secondary hover:text-white"
      >
        <ChevronLeftIcon className="h-4 w-4" />
        Mais
      </Link>

      <h1 className="mt-4 font-heading text-3xl font-extrabold uppercase text-white">
        Como instalar na tela do celular
      </h1>
      <p className="mt-2 text-sm text-text-secondary">
        Isso coloca um ícone do 365 DDS no seu celular, como um app normal —
        sem precisar abrir navegador toda vez.
      </p>

      <div className="mt-6 rounded-[4px] border border-border bg-surface p-5">
        <InstallInstructions />
      </div>
    </main>
  );
}
