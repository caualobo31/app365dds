"use client";

import { useEffect, useState } from "react";
import { hasSeenOnboarding, markOnboardingSeen } from "@/lib/storage";
import { MoreVerticalIcon, ShareIcon } from "./icons";
import { ZebraBar } from "./ZebraBar";

type Platform = "ios" | "android" | "outro";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "outro";
  const ua = navigator.userAgent || "";
  if (/iPhone|iPad|iPod/.test(ua)) return "ios";
  if (/Android/.test(ua)) return "android";
  return "outro";
}

type State = { platform: Platform; visible: boolean };

export function Onboarding() {
  const [state, setState] = useState<State | null>(null);

  useEffect(() => {
    // Depende de localStorage e do user agent — só existem no cliente,
    // por isso a checagem roda aqui e não durante o prerender estático.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- leitura única no primeiro render do cliente
    setState({ platform: detectPlatform(), visible: !hasSeenOnboarding() });
  }, []);

  function dismiss() {
    markOnboardingSeen();
    setState((prev) => (prev ? { ...prev, visible: false } : prev));
  }

  if (!state || !state.visible) return null;
  const { platform } = state;

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

          {platform === "ios" ? (
            <ol className="mt-4 space-y-3 text-base text-white">
              <li className="flex items-start gap-3">
                <span className="font-mono text-safety-yellow">1.</span>
                <span className="flex items-center gap-2">
                  Toque no ícone de compartilhar <ShareIcon className="h-5 w-5 text-safety-yellow" /> na
                  barra do Safari.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-mono text-safety-yellow">2.</span>
                Escolha <strong>&quot;Adicionar à Tela de Início&quot;</strong>.
              </li>
              <li className="flex items-start gap-3">
                <span className="font-mono text-safety-yellow">3.</span>
                Toque em <strong>&quot;Adicionar&quot;</strong> no canto superior.
              </li>
            </ol>
          ) : platform === "android" ? (
            <ol className="mt-4 space-y-3 text-base text-white">
              <li className="flex items-start gap-3">
                <span className="font-mono text-safety-yellow">1.</span>
                <span className="flex items-center gap-2">
                  Toque no menu <MoreVerticalIcon className="h-5 w-5 text-safety-yellow" /> no canto
                  superior do Chrome.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-mono text-safety-yellow">2.</span>
                Escolha <strong>&quot;Adicionar à tela inicial&quot;</strong>.
              </li>
              <li className="flex items-start gap-3">
                <span className="font-mono text-safety-yellow">3.</span>
                Confirme tocando em <strong>&quot;Adicionar&quot;</strong>.
              </li>
            </ol>
          ) : (
            <p className="mt-4 text-base text-white">
              Abra este endereço no celular: no Android use o menu do Chrome
              (⋮) → &quot;Adicionar à tela inicial&quot;; no iPhone use o Safari →
              compartilhar → &quot;Adicionar à Tela de Início&quot;.
            </p>
          )}
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
