# 365 DDS

App de Diálogo Diário de Segurança (DDS). Funciona offline, sem login, sem
cadastro. Um DDS por dia, direto no celular.

Este documento explica três coisas: como rodar o projeto no computador,
como adicionar ou editar os DDS (a parte que não exige saber programar),
e como colocar o app no ar.

---

## 1. Como rodar no computador

Precisa ter o [Node.js](https://nodejs.org) instalado (versão 18 ou mais
recente). Depois, no terminal, dentro da pasta do projeto:

```bash
npm install
npm run dev
```

Abra `http://localhost:3000` no navegador. A cada alteração salva, a
página atualiza sozinha.

Para gerar a versão final (a mesma que vai pro ar):

```bash
npm run build
```

Se algum DDS estiver com um campo errado, o comando acima **para com uma
mensagem de erro** explicando exatamente o que corrigir — ele não deixa
passar um DDS quebrado sem avisar.

---

## 2. Como adicionar ou editar os DDS (sem mexer em código)

Todo o conteúdo do app mora em um único arquivo:

```
data/dds.json
```

Abra esse arquivo em qualquer editor de texto (o Bloco de Notas serve,
mas recomendo o [VS Code](https://code.visualstudio.com/), que avisa erro
de digitação na hora). É uma lista de DDS. Cada DDS é um bloco assim:

```json
{
  "id": 6,
  "titulo": "Título curto do DDS",
  "setores": ["geral"],
  "tempo": 5,
  "abertura": "Uma pergunta ou frase de abertura pra puxar a atenção da equipe.",
  "caso": "Um relato curto de algo que aconteceu, com consequência real.",
  "regra": "A regra prática que se tira do caso.",
  "discussao": [
    "Uma pergunta pra abrir a roda de conversa com a equipe.",
    "Outra pergunta, sobre outro ângulo do mesmo assunto."
  ],
  "fechamento": "Uma frase curta de encerramento, fácil de lembrar."
}
```

### Regras de cada campo

| Campo | O que é | Regra |
|---|---|---|
| `id` | Número do DDS | Inteiro de 1 a 365. **Não pode repetir.** Definir esse número é o que faz o DDS aparecer no dia certo (dia 1 do ano = DDS id 1, e assim por diante). |
| `titulo` | Título curto | Texto simples. |
| `setores` | Pra quem é esse DDS | Lista com um ou mais dos valores: `geral`, `construcao`, `industria`, `logistica`, `frota`, `escritorio`. Precisa ser exatamente um desses nomes (sem acento, minúsculo). |
| `tempo` | Duração da fala | Só aceita `5`, `10` ou `15` (minutos). |
| `abertura`, `caso`, `regra`, `fechamento` | O texto do DDS | Texto corrido, sem limite de tamanho, mas lembre que vai ser lido em pé — frases curtas funcionam melhor. |
| `discussao` | Perguntas pra abrir a roda de conversa | Lista com **pelo menos 2** perguntas (o ideal é 2 a 4). Cada uma aparece como um item separado na tela. |

### Passo a passo pra adicionar um DDS novo

1. Abra `data/dds.json`.
2. Copie um bloco `{ ... }` inteiro de um DDS existente, cole logo depois
   dele (não esqueça a vírgula `,` separando os blocos).
3. Troque o `id` para um número que ainda não foi usado.
4. Preencha os campos com o conteúdo novo.
5. Salve o arquivo.
6. Rode `npm run validate` (ou `npm run build`) pra conferir se ficou
   tudo certo. Se algo estiver errado — campo faltando, `id` repetido,
   `tempo` fora de 5/10/15, setor com nome errado — o terminal mostra
   exatamente qual DDS e qual campo tem problema.

Não precisa tocar em nenhum outro arquivo do projeto. O app lê o
`dds.json` sozinho: lista, filtros, tela do dia e histórico se ajustam
automaticamente conforme o conteúdo cresce até os 365 itens.

---

## 3. Como colocar no ar (deploy)

O projeto é feito pra hospedar na [Vercel](https://vercel.com):

1. Suba o código pra um repositório Git (GitHub, por exemplo).
2. Na Vercel, clique em "New Project" e selecione o repositório.
3. Não precisa configurar nenhuma variável de ambiente — o app não usa
   banco de dados nem login, então não tem segredo pra guardar.
4. Clique em "Deploy". Pronto.

Depois de publicado, quem acessar pelo celular verá uma tela de boas-
vindas explicando como adicionar o app à tela inicial (isso é o que faz
ele abrir como um aplicativo de verdade, sem barra de navegador).

### Sobre os ícones

Os ícones em `public/icons/` (o desenho que aparece na tela inicial do
celular) são um placeholder gerado automaticamente — um círculo listrado
de amarelo e preto, no estilo do app. Pra trocar por um ícone definitivo,
basta substituir os arquivos dentro de `public/icons/` (mantendo os
mesmos nomes e tamanhos: 192×192, 512×512, e as versões "maskable") e
`app/favicon.ico`. Se quiser gerar novos placeholders no mesmo estilo,
rode `npm run generate-icons`.

---

## Sobre a arquitetura (pra quem for mexer no código depois)

- **Sem backend, sem banco de dados, sem login.** Todo estado do usuário
  (o que já foi marcado como feito) fica em `localStorage`, no aparelho.
- **Export estático** (`next.config.ts` com `output: "export"`): o build
  gera puro HTML/CSS/JS em `out/`, sem servidor. Isso é o que permite o
  app funcionar 100% offline.
- **Service worker manual** (`public/sw.js`): depois do primeiro
  carregamento, ele baixa e guarda em cache todo o conteúdo gerado pelo
  build (a lista de arquivos é gerada automaticamente pelo script
  `scripts/generate-sw-manifest.mjs`, que roda depois do `next build`).
  Não precisa editar esse script quando o `dds.json` crescer.
- **`data/dds.schema.ts`** é o contrato de dados: define os tipos e a
  validação. É reutilizado em toda a parte do app que lida com setores e
  tempo, pra nunca haver duas listas divergentes.
