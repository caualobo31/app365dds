"use client";

import { useEffect, useState } from "react";
import type { Dds } from "@/data/dds.schema";
import { isDoneOn, markDone } from "@/lib/storage";
import { CheckIcon } from "./icons";

export function MarkDoneButton({ dds }: { dds: Dds }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lê localStorage, indisponível no prerender estático em Node
    setDone(isDoneOn(dds.id));
  }, [dds.id]);

  function handleClick() {
    markDone(dds);
    setDone(true);
  }

  if (done) {
    return (
      <button
        type="button"
        disabled
        className="flex min-h-14 w-full items-center justify-center gap-2 rounded-[4px] bg-safety-green px-6 font-heading text-lg font-bold uppercase tracking-wide text-white"
      >
        <CheckIcon className="h-5 w-5" />
        Feito hoje
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex min-h-14 w-full items-center justify-center gap-2 rounded-[4px] bg-safety-yellow px-6 font-heading text-lg font-bold uppercase tracking-wide text-graphite transition-colors hover:brightness-95"
    >
      Marcar como feito
    </button>
  );
}
