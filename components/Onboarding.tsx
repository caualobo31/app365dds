"use client";

import { useEffect, useState } from "react";
import { hasSeenOnboarding, markOnboardingSeen } from "@/lib/storage";
import { InstallInstructions } from "./InstallInstructions";
import { ZebraBar } from "./ZebraBar";

export function Onboarding() {
  const [visible, setVisible] = useState<boolean | null>(null);

  useEffect(() => {
    // Depende de localStorage, que só existe no cliente — por isso a
    // checagem roda aqui e não durante o prerender estático.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- leitura única no primeiro render do cliente
    setVisible(!hasSeenOnboarding());
  }, []);

  function dismiss() {
    markOnboardingSeen();
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-graphite">
      <ZebraBar />
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-6 py-10">
        <p className="font-mono text-xs uppercase tracking-widest text-safety-yellow">
          Bem-vindo
        </p>
        <h1 className="mt-2 font-heading text-4xl font-extrabold uppercase leading-none text-white">
          365 DDS
        </h1>
        <p className="mt-4 text-lg text-text-secondary">
          Um Diálogo Diário de Segurança por dia, pronto pra ler em voz alta.
          Funciona sem internet, direto do seu celular.
        </p>

        <div className="mt-8 rounded-[4px] border border-border bg-surface p-5">
          <h2 className="font-heading text-xl font-bold uppercase text-safety-yellow">
            Instale na tela inicial
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            Isso coloca um ícone no seu celular, como um app normal — sem
            precisar abrir navegador toda vez.
          </p>

          <div className="mt-4">
            <InstallInstructions />
          </div>
        </div>

        <button
          type="button"
          onClick={dismiss}
          className="mt-8 flex min-h-14 w-full items-center justify-center rounded-[4px] bg-safety-yellow px-6 font-heading text-lg font-bold uppercase tracking-wide text-graphite"
        >
          Entendi, continuar
        </button>
      </div>
    </div>
  );
}
