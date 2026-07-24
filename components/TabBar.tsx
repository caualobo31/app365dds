"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HistoryIcon, HomeIcon, ListIcon, MenuLinesIcon } from "./icons";

const TABS = [
  { href: "/", label: "Hoje", icon: HomeIcon },
  { href: "/lista", label: "Lista", icon: ListIcon },
  { href: "/historico", label: "Histórico", icon: HistoryIcon },
  { href: "/mais", label: "Mais", icon: MenuLinesIcon },
];

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)]"
      aria-label="Navegação principal"
    >
      <ul className="mx-auto flex max-w-xl">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-mono uppercase tracking-wide transition-colors ${
                  active ? "text-safety-yellow" : "text-text-secondary hover:text-white"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="h-6 w-6" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
