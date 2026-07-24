// Conteúdo do Guia de Condução, mostrado em /mais/guia. Editar só este
// arquivo — a tela lê a estrutura abaixo automaticamente.

export interface GuiaSecao {
  titulo?: string;
  paragrafos: string[];
}

export interface Guia {
  titulo: string;
  secoes: GuiaSecao[];
}

export const GUIA_CONDUCAO: Guia = {
  titulo: "Guia de Condução do DDS",
  secoes: [
    {
      paragrafos: [
        "Conteúdo em breve. Assim que o texto do guia for adicionado aqui, ele aparece nesta tela automaticamente — sem precisar mexer em mais nada.",
      ],
    },
  ],
};
