"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { getCompanyConfig, saveCompanyConfig, type CompanyConfig } from "@/lib/storage";
import { resizeImageToDataUrl } from "@/lib/image";
import { ChevronLeftIcon } from "@/components/icons";

export default function EmpresaPage() {
  const [config, setConfig] = useState<CompanyConfig>({});
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lê localStorage, indisponível no prerender estático em Node
    setConfig(getCompanyConfig());
  }, []);

  async function handleLogoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await resizeImageToDataUrl(file);
      setConfig((prev) => ({ ...prev, logo: dataUrl }));
      setError(null);
    } catch {
      setError("Não foi possível carregar essa imagem. Tente outro arquivo.");
    }
  }

  function removeLogo() {
    setConfig((prev) => ({ ...prev, logo: undefined }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    saveCompanyConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

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
        Configuração da empresa
      </h1>
      <p className="mt-2 text-sm text-text-secondary">
        Esses dados aparecem nas folhas impressas do DDS. Ficam salvos só
        neste aparelho — não são enviados pra lugar nenhum.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-safety-yellow">
            Logo
          </span>
          <div className="mt-2 flex items-center gap-4">
            {config.logo ? (
              // eslint-disable-next-line @next/next/no-img-element -- preview de imagem base64 do usuário, não é um asset estático do build
              <img
                src={config.logo}
                alt="Logo da empresa"
                className="h-16 w-16 rounded-[4px] border border-border bg-white object-contain"
              />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[4px] border border-dashed border-border text-center font-mono text-[10px] uppercase text-text-secondary">
                Sem logo
              </div>
            )}
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="min-h-11 rounded-[4px] border border-border px-3 font-mono text-sm uppercase tracking-wide text-white hover:border-safety-yellow"
              >
                {config.logo ? "Trocar imagem" : "Enviar imagem"}
              </button>
              {config.logo && (
                <button
                  type="button"
                  onClick={removeLogo}
                  className="min-h-11 rounded-[4px] border border-border px-3 font-mono text-sm uppercase tracking-wide text-safety-red hover:border-safety-red"
                >
                  Remover
                </button>
              )}
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="hidden"
          />
          {error && <p className="mt-2 text-sm text-safety-red">{error}</p>}
        </div>

        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs uppercase tracking-widest text-safety-yellow">
            Nome da empresa
          </span>
          <input
            type="text"
            value={config.nome ?? ""}
            onChange={(e) => setConfig((prev) => ({ ...prev, nome: e.target.value }))}
            className="min-h-12 rounded-[4px] border border-border bg-surface px-3 text-white focus-visible:border-safety-yellow"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs uppercase tracking-widest text-safety-yellow">
            Unidade / setor
          </span>
          <input
            type="text"
            value={config.unidade ?? ""}
            onChange={(e) => setConfig((prev) => ({ ...prev, unidade: e.target.value }))}
            className="min-h-12 rounded-[4px] border border-border bg-surface px-3 text-white focus-visible:border-safety-yellow"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs uppercase tracking-widest text-safety-yellow">
            Nome do responsável
          </span>
          <input
            type="text"
            value={config.responsavel ?? ""}
            onChange={(e) => setConfig((prev) => ({ ...prev, responsavel: e.target.value }))}
            className="min-h-12 rounded-[4px] border border-border bg-surface px-3 text-white focus-visible:border-safety-yellow"
          />
        </label>

        <button
          type="submit"
          className="mt-2 flex min-h-14 w-full items-center justify-center rounded-[4px] bg-safety-yellow px-6 font-heading text-lg font-bold uppercase tracking-wide text-graphite"
        >
          {saved ? "Salvo ✓" : "Salvar"}
        </button>
      </form>
    </main>
  );
}
