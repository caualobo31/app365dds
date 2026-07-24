"use client";

import { useEffect, useState } from "react";
import { MoreVerticalIcon, ShareIcon } from "./icons";

type Platform = "ios" | "android" | "outro";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "outro";
  const ua = navigator.userAgent || "";
  if (/iPhone|iPad|iPod/.test(ua)) return "ios";
  if (/Android/.test(ua)) return "android";
  return "outro";
}

export function InstallInstructions() {
  const [platform, setPlatform] = useState<Platform>("outro");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- depende do user agent, só existe no cliente
    setPlatform(detectPlatform());
  }, []);

  if (platform === "ios") {
    return (
      <ol className="space-y-3 text-base text-white">
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
    );
  }

  if (platform === "android") {
    return (
      <ol className="space-y-3 text-base text-white">
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
    );
  }

  return (
    <p className="text-base text-white">
      Abra este endereço no celular: no Android use o menu do Chrome (⋮) →
      &quot;Adicionar à tela inicial&quot;; no iPhone use o Safari → compartilhar
      → &quot;Adicionar à Tela de Início&quot;.
    </p>
  );
}
