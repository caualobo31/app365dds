"use client";

import { useEffect, useState } from "react";
import type { Dds } from "@/data/dds.schema";
import { getCompanyConfig, type CompanyConfig } from "@/lib/storage";
import { formatDateShort, getWeekdayName } from "@/lib/day";
import { PrinterIcon } from "./icons";

const LINHAS_PRESENCA = 20;

export function DdsPrintSheet({ dds }: { dds: Dds }) {
  const [company, setCompany] = useState<CompanyConfig>({});
  const [dateShort, setDateShort] = useState("");
  const [weekday, setWeekday] = useState("");

  useEffect(() => {
    const now = new Date();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lê localStorage/Date, indisponíveis no prerender estático em Node
    setCompany(getCompanyConfig());
    setDateShort(formatDateShort(now));
    setWeekday(getWeekdayName(now));
  }, []);

  const logo = company.logo ? (
    // eslint-disable-next-line @next/next/no-img-element -- imagem base64 do usuário, não é asset do build
    <img src={company.logo} alt="" />
  ) : (
    <div className="logo-slot">
      Logo da
      <br />
      empresa
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => window.print()}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[4px] border border-border px-6 font-heading text-base font-bold uppercase tracking-wide text-text-secondary hover:border-safety-yellow hover:text-white"
      >
        <PrinterIcon className="h-5 w-5" />
        Imprimir folha
      </button>

      {/* Oculta na tela — só existe pra impressão.
          Liga/desliga em globals.css, layout em print-sheet.css. */}
      <div className="print-sheet">
        {/* Folha 1 — o DDS */}
        <section className="folha">
          <header className="cab">
            <div className="cab-logo">{logo}</div>
            <div className="cab-titulo">
              <h1>Diálogo Diário de Segurança</h1>
              <p>Conversa de segurança no início do turno, todos os dias, em todas as áreas.</p>
            </div>
            <div className="cab-data">
              <span className="rot">Data</span>
              <span className="dia">{dateShort}</span>
              <span className="semana">{weekday}</span>
            </div>
          </header>

          <div className="zebra" />

          <div className="ident">
            <div>
              <span className="rot">Empresa</span>
              <span className="val">{company.nome ?? ""}</span>
            </div>
            <div>
              <span className="rot">Unidade / Setor</span>
              <span className="val">{company.unidade ?? ""}</span>
            </div>
            <div>
              <span className="rot">Responsável</span>
              <span className="val">{company.responsavel ?? ""}</span>
            </div>
          </div>

          <div className="tema">
            <h2>{dds.titulo}</h2>
          </div>

          <div className="corpo">
            <div className="bloco">
              <span className="rot">Abertura</span>
              <p>{dds.abertura}</p>
            </div>

            <div className="bloco">
              <span className="rot">O caso</span>
              <p>{dds.caso}</p>
            </div>

            <div className="bloco">
              <span className="rot">A regra de hoje</span>
              <p>{dds.regra}</p>
            </div>

            <div className="bloco">
              <span className="rot">Pra discutir com a turma</span>
              <ol>
                {dds.discussao.map((pergunta, i) => (
                  <li key={i}>{pergunta}</li>
                ))}
              </ol>
            </div>

            {dds.frase && (
              <div className="frase">
                <span className="rot">Leve isso pro turno</span>
                <p>{dds.frase}</p>
              </div>
            )}

            <div className="bloco">
              <span className="rot">Fechamento</span>
              <p>{dds.fechamento}</p>
            </div>
          </div>

          <footer className="rodape">
            <div className="assina">
              <div className="linha" />
              <span className="rot">Assinatura do responsável pelo DDS</span>
            </div>
            <div className="marca">
              Lista de presença na folha seguinte
              <br />
              Arquivar junto com esta folha
            </div>
          </footer>
        </section>

        {/* Folha 2 — lista de presença */}
        <section className="folha">
          <header className="cab">
            <div className="cab-logo">{logo}</div>
            <div className="cab-titulo">
              <h1>Lista de Presença — DDS</h1>
              <p>Registro de participação no Diálogo Diário de Segurança.</p>
            </div>
            <div className="cab-data">
              <span className="rot">Data</span>
              <span className="dia">{dateShort}</span>
              <span className="semana">{weekday}</span>
            </div>
          </header>

          <div className="zebra" />

          <div className="ident">
            <div>
              <span className="rot">Empresa</span>
              <span className="val">{company.nome ?? ""}</span>
            </div>
            <div>
              <span className="rot">Unidade / Setor</span>
              <span className="val">{company.unidade ?? ""}</span>
            </div>
            <div>
              <span className="rot">Horário</span>
              <span className="val">_____ às _____</span>
            </div>
          </div>

          <div className="presenca-topo">
            <span className="num">Tema do dia</span>
            <h2>{dds.titulo}</h2>
          </div>

          <table>
            <thead>
              <tr>
                <th className="col-n">Nº</th>
                <th>Nome completo</th>
                <th className="col-mat">Matrícula</th>
                <th className="col-ass">Assinatura</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: LINHAS_PRESENCA }).map((_, i) => (
                <tr key={i}>
                  <td className="col-n">{String(i + 1).padStart(2, "0")}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="obs">
            <span className="rot">Observações / pontos levantados pela equipe</span>
            <div className="linhas">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>

          <div className="presenca-fim">
            <div className="campo">
              <div className="linha" />
              <span className="rot">Responsável pelo DDS — nome e assinatura</span>
            </div>
            <div className="campo">
              <div className="linha" />
              <span className="rot">Visto da liderança / SSO</span>
            </div>
          </div>

          <footer className="rodape">
            <div className="assina"></div>
            <div className="marca">
              Total de participantes: ______
              <br />
              Arquivar junto com a folha do tema
            </div>
          </footer>
        </section>
      </div>
    </>
  );
}
