import Link from "next/link";
import { BookIcon, BuildingIcon, ChevronRightIcon, SmartphoneIcon } from "@/components/icons";

const ITEMS = [
  {
    href: "/mais/empresa",
    label: "Configuração da empresa",
    icon: BuildingIcon,
  },
  {
    href: "/mais/guia",
    label: "Guia de condução",
    icon: BookIcon,
  },
  {
    href: "/mais/instalar",
    label: "Como instalar na tela do celular",
    icon: SmartphoneIcon,
  },
] as const;

export default function MaisPage() {
  return (
    <main className="mx-auto max-w-xl px-5 pt-8 pb-8">
      <h1 className="font-heading text-3xl font-extrabold uppercase text-white">Mais</h1>

      <div className="mt-6 flex flex-col divide-y divide-border overflow-hidden rounded-[4px] border border-border bg-surface">
        {ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex min-h-16 items-center gap-3 px-4 hover:text-safety-yellow"
          >
            <Icon className="h-6 w-6 shrink-0 text-safety-yellow" />
            <span className="flex-1 font-heading text-lg font-bold uppercase text-white">
              {label}
            </span>
            <ChevronRightIcon className="h-5 w-5 shrink-0 text-text-secondary" />
          </Link>
        ))}
      </div>
    </main>
  );
}
