# MoviesLib — direções visuais

## Direção vigente — Pulso (desvio decidido pelo proprietário em 29/10/2026)

O proprietário substituiu **Caderno**, editorial e com serifas, por um visual moderno e jovem de streaming. A direção agora se chama **Pulso**: carvão/cinzas, vermelho principal **#C62828** e pôster protagonista, com tema escuro padrão. As telas de produção ainda conservam a aparência anterior; a amostra nova está em `/design`, somente no servidor de desenvolvimento. As três propostas da Fase 1 abaixo permanecem como registro histórico, não como especificação ativa.

### Paleta e uso

O PXN Games foi referência de clima, sem cópia de cores exatas, marca, texto ou composição. O vermelho de interface tem uma única família funcional: botão normal #C62828, hover #AD2222, pressionado #8F1D1D; para texto/ícones pequenos, #FF8585 no escuro e #A71F1F no claro; fundos suaves #3A1D20 e #FCE8E8. **Texto branco sobre #C62828** nos botões. Nunca usar #C62828 para texto pequeno no escuro. Pôsteres não recebem filtro; os exemplos usam SVGs locais próprios.

| Token                   | Escuro  | Claro   |
| ----------------------- | ------- | ------- |
| canvas                  | #121315 | #F3F4F6 |
| surface                 | #1E2024 | #FFFFFF |
| ink                     | #F5F5F6 | #1A1C20 |
| muted                   | #B7BBC2 | #4E535B |
| line / foco não textual | #777E87 | #737B86 |
| accent / botão          | #C62828 | #C62828 |
| accent-hover            | #AD2222 | #AD2222 |
| accent-pressed          | #8F1D1D | #8F1D1D |
| accent-text / ícones    | #FF8585 | #A71F1F |
| accent-soft             | #3A1D20 | #FCE8E8 |
| on-accent               | #FFFFFF | #FFFFFF |
| skeleton                | #33363C | #E0E2E6 |

Contrastes recalculados pela fórmula WCAG sRGB indicada na seção histórica de contraste. A tabela cobre cada par de **texto/fundo usado na amostra**, inclusive estados do botão; o menor valor de texto comum é 6,24:1, acima de AA 4,5:1. Bordas/controles são não textuais e passam 3:1.

| Uso (texto/fundo)            |  Escuro |   Claro |
| ---------------------------- | ------: | ------: |
| ink / canvas                 | 17,06:1 | 15,50:1 |
| ink / surface                | 14,97:1 | 17,06:1 |
| muted / canvas               |  9,65:1 |  7,04:1 |
| muted / surface              |  8,47:1 |  7,74:1 |
| accent-text / canvas         |  7,92:1 |  6,67:1 |
| accent-text / surface        |  6,95:1 |  7,35:1 |
| accent-text / accent-soft    |  6,50:1 |  6,24:1 |
| branco / botão #C62828       |  5,62:1 |  5,62:1 |
| branco / hover #AD2222       |  6,93:1 |  6,93:1 |
| branco / pressionado #8F1D1D |  8,89:1 |  8,89:1 |
| line / canvas (controle)     |  4,53:1 |  3,89:1 |
| line / surface (controle)    |  3,98:1 |  4,28:1 |

### Tipografia, escala e amostra

As três opções usam WOFF2 locais de `@fontsource-variable` versão 5.3.0, `font-display: swap` e fallback do sistema, sem CDN. Licenças confirmadas como **SIL OFL 1.1** nas páginas oficiais [Plus Jakarta Sans](https://fontsource.org/fonts/plus-jakarta-sans/about), [Bricolage Grotesque](https://fontsource.org/fonts/bricolage-grotesque/about) e [Figtree](https://fontsource.org/fonts/figtree/about). A importação fica na rota de desenvolvimento; fontes antigas permanecem até a escolha.

| Opção | Títulos                        | Corpo / números   | Leitura                       |
| ----- | ------------------------------ | ----------------- | ----------------------------- |
| A     | Plus Jakarta Sans              | Plus Jakarta Sans | Coesa e neutra                |
| B     | Bricolage Grotesque            | Figtree           | Expressiva sem pesar no corpo |
| C     | Figtree 800, tracking -0,035em | Figtree           | Rápida, compacta e uniforme   |

| Papel   | 360 px | 1440 px | Peso |
| ------- | -----: | ------: | ---: |
| display |  44 px |   72 px |  800 |
| título  |  32 px |   48 px |  800 |
| seção   |  24 px |   32 px |  700 |
| card    |  18 px |   20 px |  700 |
| corpo   |  16 px |   16 px |  400 |
| legenda |  13 px |   13 px |  400 |
| número  |  28 px |   36 px |  800 |
| ranking |  56 px |   84 px |  800 |

Em `/design`, os radios A/B/C alteram simultaneamente quatro amostras: 360 e 1440 px, em claro e escuro. Elas mostram títulos, corpo, números, cabeçalho, pôsteres fictícios, card com ranking, skeleton 2:3, EmptyState e ErrorState. O pôster usa raio de 3 px, sem moldura nem sombra pesada. No hover/foco, sobe discretamente durante 160 ms; `prefers-reduced-motion` remove a transição e o deslocamento. A nota é um pequeno anel com equivalente textual para leitor de tela. Ilustrações SVG de tira de filme, ingresso e poltrona vazia são próprias; textos curtos em pt-BR. Conteúdo de filme real continua vindo da API.

**Recomendo C — Figtree**: uma família WOFF2 simplifica o carregamento futuro, mantém boa leitura em 360 px e permite títulos com ritmo sem depender de serifas. A escolha final da tipografia aguarda o proprietário abrir `/design`. A opção B tem mais caráter nos títulos, mas exige duas famílias; A é clara, porém menos marcante.

### Tokens Tailwind 4

O arquivo `src/app/styles/theme.css` define os tokens no `@theme static`; a amostra isola suas cores e fontes por `[data-design-preview]`, preservando as telas existentes. Exemplo do tema implementado:

```css
@theme static {
  --color-preview-canvas: #121315;
  --color-preview-surface: #1e2024;
  --color-preview-accent: #c62828;
  --color-preview-accent-text: #ff8585;
  --font-preview-figtree: 'Figtree Variable', 'Segoe UI', sans-serif;
  --radius-preview-poster: 3px;
  --duration-preview: 160ms;
}
[data-design-preview][data-design-theme='light'] {
  --color-preview-canvas: #f3f4f6;
  --color-preview-surface: #ffffff;
  --color-preview-accent-text: #a71f1f;
}
```

## Arquivo histórico — estudos da Fase 1

Fase 1 · 28/10/2026. A comparação abaixo retrata as alternativas antes da escolha de Caderno e do desvio posterior para Pulso. Cores, contrastes e recomendações a seguir não regem o visual vigente. O [STATUS.md](STATUS.md) é a fonte da verdade das decisões.

Abra [o índice dos previews](design-previews/index.html) diretamente no navegador, inclusive sem rede. Cada direção mostra cabeçalho, home, linha de pôsteres/cards e topo do detalhe; os radios no início alternam claro/escuro sem JavaScript. Links são apenas âncoras de demonstração. Filmes e dados são fictícios; SVGs geométricos são originais e locais, sem imagens TMDB. Créditos, licenças e fallback tipográfico em [LICENSES.md](design-previews/LICENSES.md).

## Critérios comuns

- Preservar as telas do catálogo, busca, filme, pessoa/filmografia, em cartaz/em breve e 404 do escopo. Os estudos não adicionam rotas ou uma camada editorial que exija CMS: destaques são composições visuais sobre dados existentes. Copy dos filmes será texto vindo da API; não gerar resenhas ou citações como se fossem oficiais.
- Tema claro/escuro e trailer youtube-nocookie aprovados. Botão de trailer sem autoplay; carregar o embed apenas por ação explícita. Os previews não contêm embed. Minha lista futura guarda somente IDs. pt-BR/en, atalhos de teclado e comparação permanecem futuros; acesso básico pelo teclado é obrigatório agora.
- **Tailwind CSS 4.3.3**, conforme versão já registrada: plugin @tailwindcss/vite, @import "tailwindcss" e tokens no @theme. Sem DaisyUI ou biblioteca de componentes visuais. Não há Tailwind via CDN nos estudos: CSS local reproduz os tokens sem compilação.
- Uma única família cromática de destaque por direção; claros/escuros da mesma família são ajustes de contraste entre temas. Pôsteres reais poderão conter suas próprias cores, sem tingimento, filtros ou texto de interface sobreposto. Sem fundo em gradiente, vidro, brilhos, emoji, sombras repetidas ou cards com grandes arredondamentos.
- Sem esconder informação no hover. Títulos e notas ficam fora das imagens, com links focáveis e alvos de pelo menos 44px para controles. Manter ordem de leitura do DOM, sem reorganização que confunda teclado. Dados ausentes têm placeholder com título preservado, nunca exclusão do filme.
- Ritmo de espaço em múltiplos de 4px. Escalas, contêineres, raios, sombras e movimento vêm de tokens; reutilizar utilitários nomeados, sem valores arbitrários dispersos em componentes. Breakpoints propostos: 48rem e 64rem, conferidos em 360/768/1024/1440px. Reflow em duas colunas de pôsteres no celular; carrossel futuro com controles nomeados e alternativa de navegação, sem rotação automática.

## Contraste verificado

Método: cálculo sRGB de luminância relativa e razão (LmaisClara + 0,05)/(LmaisEscura + 0,05), conforme [WCAG 2.2, contraste mínimo](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). Canais linearizados com limiar 0,04045, pesos 0,2126/0,7152/0,0722. Aprovação avaliada com os números não arredondados; tabela arredondada para duas casas. Textos comuns, inclusive secundários e links: mínimo **4,5:1**. Bordas que identificam controles e foco: mínimo **3:1** contra a área adjacente. Títulos também passam 4,5:1, sem depender da exceção para letras grandes.

“Mínimo” abaixo é o menor contraste contra os dois fundos de uso: canvas e surface. Texto de botão usa on-accent sobre accent. Indicador de foco usa accent sobre canvas/surface, com afastamento de 4px para não encostar no preenchimento do botão.

| Direção / tema   | Texto mínimo | Secundário mínimo | Destaque/link/foco mínimo | Texto do botão | Borda de controle mínima |
| ---------------- | -----------: | ----------------: | ------------------------: | -------------: | -----------------------: |
| Caderno / escuro |        13,78 |              7,93 |                      7,84 |           8,75 |                     4,46 |
| Caderno / claro  |        13,98 |              5,63 |                      6,26 |           7,11 |                     4,03 |
| Sala 02 / escuro |        15,10 |              8,44 |                     10,82 |          12,37 |                     4,54 |
| Sala 02 / claro  |        16,15 |              6,22 |                      5,92 |           6,61 |                     3,78 |
| Atlas / escuro   |        13,17 |              8,12 |                      8,92 |          10,27 |                     4,61 |
| Atlas / claro    |        13,58 |              5,70 |                      6,10 |           6,79 |                     3,47 |

Todos os pares especificados passam seus limiares. Essa verificação das paletas **não é certificação de acessibilidade do aplicativo**: overlays futuros, dados reais, embeds, estados de foco, zoom e componentes novos precisam de nova conferência. Os SVGs são ilustração; títulos e metadados relevantes se repetem fora deles, em cores verificadas. Não reduzir opacidade de texto, bordas de controle ou elementos focáveis sem recalcular o par resultante.

## 01 — Caderno

**Conceito.** Um caderno de cinema em que cada pôster ganha o espaço de uma capa e cada título parece merecer uma segunda leitura. A composição usa margens, fios e serifas para criar interesse sem fingir que o catálogo publica críticas próprias.

[Abrir preview Caderno](design-previews/caderno.html).

**Clima:** íntimo, editorial, calor de papel e tinta. A ênfase está na leitura do filme e na relação entre título, pôster e sinopse.

### Paleta

Uma cor de destaque: **vermelho de tinta**, com ajuste de luminosidade entre os temas do estudo original.

| Token     | Escuro  | Claro   |
| --------- | ------- | ------- |
| canvas    | #191715 | #F6F0E5 |
| surface   | #24211E | #FFFBF3 |
| ink       | #F5EDE0 | #28211C |
| muted     | #C0B5A5 | #695D52 |
| accent    | #FF9B85 | #9E3326 |
| on-accent | #191715 | #FFFFFF |
| line      | #938575 | #827365 |

Contraste AA: linha Caderno na tabela de verificação; bordas decorativas podem usar line, sem fazer dele cor de texto pequeno.

### Tipografia e escala

**Source Serif 4 + Source Sans 3**, gratuitas, SIL OFL 1.1, Adobe. Títulos 500/600 em serif; corpo 400 e labels 600/700 em sans. Preview usa Georgia/Times New Roman e Segoe UI/Arial quando as fontes não estão instaladas. Fontes finais, se essa direção for escolhida, serão WOFF2 locais com licença completa e font-display:swap; não há download nesta fase.

| Papel           | Desktop | Mobile | Entrelinha |
| --------------- | ------- | ------ | ---------- |
| Display         | 88px    | 52px   | 1,05       |
| Título de filme | 48px    | 36px   | 1,1        |
| Seção           | 32px    | 28px   | 1,2        |
| Card / abertura | 20px    | 20px   | 1,25 / 1,6 |
| Corpo           | 16px    | 16px   | 1,6        |
| Metadados       | 13px    | 13px   | 1,6        |

### Grid, pôster e telas

Contêiner máximo 1216px, 12 colunas, intervalo principal de 32px. Home com texto em 7 colunas, uma coluna de respiro e pôster em 4; depois grade de quatro pôsteres com intervalo de 28px. No celular, texto vem antes do pôster, que fica deslocado à direita sem mudar a ordem de leitura; a linha de filmes vira grade de duas colunas. Em tablet, preservar 4 cards apenas quando seus títulos couberem; a definição final pode reduzir para 2 sem esconder filmes.

Pôster 2:3, sem moldura, raio zero e sem sombra. A imagem abre o card, título e nota ficam abaixo. Hover/foco desloca o pôster 4px para cima sem ampliar a área; não revela conteúdo exclusivo.

**Home:** abertura lateral “Quando a sala fica em silêncio.”, filme em foco identificado e seção “Para a sua próxima noite”. Essa copy de exemplo é fictícia; a produção pode usar apenas nome/tagline disponível, sem inventar curadoria humana. **Filme:** colunas 3/6/3 para pôster, título/sinopse/dados e informação complementar. No tablet vira 1/2; no celular, uma coluna. Trailer e “Quero ver” ficam próximos da sinopse, com continuação para elenco, equipe, galeria e recomendações. Estado vazio: “Esse filme ainda está sem sinopse. O elenco pode dar a primeira pista.” Erro: “A sessão não carregou. Tente de novo.”, com botão de repetição na aplicação.

**Movimento:** pôster translateY(-4px), 180ms, curva (.2,.7,.2,1); cores de links sem transição longa, sem animação de entrada ou parallax. Com prefers-reduced-motion:reduce, desativar transição e deslocamento; foco continua visível. Vídeo nunca começa sozinho.

**Ponto fraco:** grandes títulos e respiros reduzem a quantidade de filmes visíveis; títulos longos podem alterar bastante a altura. Limitar o display à abertura, usar quebra natural e preservar a densidade dos catálogos.

### Exemplo de tema Tailwind 4

```css
@import 'tailwindcss';
@theme static {
  --color-canvas: #191715;
  --color-surface: #24211e;
  --color-ink: #f5ede0;
  --color-muted: #c0b5a5;
  --color-accent: #ff9b85;
  --color-on-accent: #191715;
  --color-line: #938575;
  --font-display: 'Source Serif 4', Georgia, 'Times New Roman', serif;
  --font-body: 'Source Sans 3', 'Segoe UI', Arial, sans-serif;
  --text-display: 5.5rem;
  --text-title: 3rem;
  --text-section: 2rem;
  --text-card: 1.25rem;
  --text-body: 1rem;
  --text-caption: 0.8125rem;
  --spacing: 0.25rem;
  --container-page: 76rem;
  --radius-poster: 0;
  --radius-control: 2px;
  --shadow-poster: none;
  --duration-fast: 180ms;
  --ease-settle: cubic-bezier(0.2, 0.7, 0.2, 1);
}
[data-theme='light'] {
  --color-canvas: #f6f0e5;
  --color-surface: #fffbf3;
  --color-ink: #28211c;
  --color-muted: #695d52;
  --color-accent: #9e3326;
  --color-on-accent: #ffffff;
  --color-line: #827365;
}
```

## 02 — Sala 02

**Conceito.** Uma programação de cinema impressa em grande formato, com títulos condensados e pôsteres organizados como sessões de uma noite. O ritmo é direto: olhar a sequência, escolher um filme e abrir a ficha.

[Abrir preview Sala 02](design-previews/sala.html).

**Clima:** urbano, gráfico, enfático; o tipo e as linhas substituem ornamentos. Não é uma interface de streaming com banner fotográfico e botões sobre a imagem.

### Paleta

Uma cor de destaque: **amarelo de programação**, que vira ocre no claro para garantir leitura. Fundos e textos são neutros com leve calor.

| Token     | Escuro  | Claro   |
| --------- | ------- | ------- |
| canvas    | #101112 | #F3F3EA |
| surface   | #1D1F21 | #FFFFFF |
| ink       | #F5F5EE | #151715 |
| muted     | #B9BAB1 | #575B52 |
| accent    | #F2CE56 | #725A00 |
| on-accent | #101112 | #FFFFFF |
| line      | #85877E | #797D70 |

Contraste AA: linha Sala 02 na tabela. O amarelo escuro não é reutilizado como texto sobre fundo claro; o ocre é a variante semântica desse tema.

### Tipografia e escala

**Barlow Condensed + Barlow**, gratuitas, SIL OFL 1.1, The Barlow Project Authors. Título condensado 600/700, corpo regular 400, navegação 600. Fallback: Impact/Arial Narrow e Arial. Impact é fonte do sistema, não arquivo gratuito redistribuído; a substituição será Barlow Condensed local com licença quando implementada. Como Impact é mais pesada, o preview exagera levemente o peso em relação ao par proposto.

| Papel           | Desktop / tablet | Mobile | Entrelinha |
| --------------- | ---------------- | ------ | ---------- |
| Display         | 128px / 96px     | 64px   | 1,05       |
| Título de filme | 80px / 64px      | 48px   | 1,1        |
| Seção           | 40px             | 28px   | 1,2        |
| Card            | 24px             | 24px   | 1,25       |
| Corpo           | 16px             | 16px   | 1,6        |
| Metadados       | 13px             | 13px   | 1,6        |

### Grid, pôster e telas

Contêiner 1216px. Abertura de 5/2 com título à esquerda e contador de itens à direita; faixa de programação de ponta a ponta, quatro cards em módulos iguais e intervalos estreitos de 12px. No celular, abertura e contador empilham e pôsteres ficam em duas colunas. A composição é frontal, sem o pôster grande isolado ou a coluna editorial da direção 01.

Pôster 2:3, cantos retos, sem sombra, número de ordem fora da imagem; metadados em linha abaixo do título. Número serve à composição da amostra, não é ranking nem posição fixa da API. Títulos de card em maiúsculas apenas nesta direção; corpo e nomes de pessoas em caixa normal.

**Home:** “A noite pede cinema.” seguido imediatamente pela sequência “Na tela, agora”. Na aplicação, em cartaz/em breve, populares e tendências entram como seções do catálogo existente; “programação” é linguagem visual, sem inventar horários de sessões. **Filme:** pôster em 2 colunas de peso e ficha em 5, título grande, linha de dados com borda tracejada e botões retos. Sem backdrop como fundo. Sem sinopse: “Ainda sem sinopse. A ficha já está aberta.” Erro: “A programação não veio. Tentar novamente.”

**Movimento:** pôster sobe 4px em 120ms; não há zoom, rotação ou sequência automática. Elementos estáticos conservam o peso tipográfico, sem “letreiro piscando”. Redução de movimento remove translate/transição, mantendo contorno de foco e underline.

**Ponto fraco:** títulos longos em maiúsculas podem dominar a tela, e a combinação preto/amarelo pode lembrar catálogos existentes. Usar a gramática de programação e a tipografia como identidade, sem importar o layout antigo. Mais trabalho para truncamento visual sem perder o nome acessível.

### Exemplo de tema Tailwind 4

```css
@import 'tailwindcss';
@theme static {
  --color-canvas: #101112;
  --color-surface: #1d1f21;
  --color-ink: #f5f5ee;
  --color-muted: #b9bab1;
  --color-accent: #f2ce56;
  --color-on-accent: #101112;
  --color-line: #85877e;
  --font-display: 'Barlow Condensed', Impact, 'Arial Narrow', sans-serif;
  --font-body: Barlow, Arial, sans-serif;
  --text-display: 8rem;
  --text-title: 5rem;
  --text-section: 2.5rem;
  --text-card: 1.5rem;
  --text-body: 1rem;
  --text-caption: 0.8125rem;
  --spacing: 0.25rem;
  --container-page: 76rem;
  --radius-poster: 0;
  --radius-control: 0;
  --shadow-poster: none;
  --duration-fast: 120ms;
  --ease-settle: cubic-bezier(0.2, 0.7, 0.2, 1);
}
[data-theme='light'] {
  --color-canvas: #f3f3ea;
  --color-surface: #ffffff;
  --color-ink: #151715;
  --color-muted: #575b52;
  --color-accent: #725a00;
  --color-on-accent: #ffffff;
  --color-line: #797d70;
}
```

## 03 — Atlas

**Conceito.** Um acervo de cinema feito para seguir relações: um título leva a uma pessoa, uma pessoa leva a outro filme. O visual combina um índice lateral, imagens legíveis e pequenos dados de consulta, sem transformar o catálogo num painel administrativo.

[Abrir preview Atlas](design-previews/atlas.html).

**Clima:** calmo, preciso, de biblioteca contemporânea. O catálogo começa pelo índice e pela ficha, em vez da narrativa editorial ou do impacto do cartaz.

### Paleta

Uma cor de destaque: **verde de catálogo**, menta no escuro e verde-folha no claro. Os demais tokens são neutros minerais dessaturados da mesma temperatura.

| Token     | Escuro  | Claro   |
| --------- | ------- | ------- |
| canvas    | #111C1B | #F0F4EE |
| surface   | #1A2926 | #FFFFFF |
| ink       | #EBF1E9 | #162A24 |
| muted     | #B1C2B8 | #4C6558 |
| accent    | #8ED6AF | #236743 |
| on-accent | #111C1B | #FFFFFF |
| line      | #7A9486 | #6D8877 |

Contraste AA: linha Atlas na tabela; a borda no claro é a combinação mais próxima do limite de 3:1, mas passa sem opacidade reduzida.

### Tipografia e escala

**IBM Plex Sans + IBM Plex Mono**, gratuitas, SIL OFL 1.1, IBM Corp. Sans 400/600 para títulos e leitura; Mono 400/500 somente para IDs, labels e metadados curtos. Fallback: Segoe UI/Arial e Consolas/Courier New. Evitar sinopses e parágrafos longos em mono. WOFF2 local e avisos OFL na implementação da direção escolhida; nenhum binário nesta fase.

| Papel             | Desktop | Mobile | Entrelinha |
| ----------------- | ------- | ------ | ---------- |
| Display           | 56px    | 40px   | 1,05       |
| Título de filme   | 40px    | 32px   | 1,1        |
| Seção             | 28px    | 28px   | 1,2        |
| Card              | 20px    | 20px   | 1,25       |
| Corpo             | 16px    | 16px   | 1,6        |
| Dados/labels mono | 13px    | 13px   | 1,6        |

### Grid, pôster e telas

Contêiner 1216px com trilho lateral de 192px, vão de 40px e área principal. Na área principal, três pôsteres por linha e uma indicação seguinte em linha compacta, criando alternância entre imagem e índice. Não é necessário fixar a lateral no scroll; ela ocupa fluxo normal. No tablet, trilho reduz para 144px e ficha empilha. No celular, índice vira navegação horizontal com quebra, pôsteres ficam em duas colunas e a linha compacta vira card normal.

Pôster 2:3, raio de 4px, sem sombra. Dados ficam abaixo e usam algarismos tabulares; ficha é uma grade de termos/valores com bordas, sem badges decorativas. Nenhum card exige hover para ler. Os filtros do preview são texto ilustrativo, não controles falsamente operáveis.

**Home:** “Siga uma pista.”, índice e “Filmes em perspectiva”, com filtros visuais em faixa. Pessoas/filmografias podem reaproveitar a mesma gramática de fichas, sem criar uma nova tela além das existentes. **Filme:** coluna de pôster e ficha com título, quatro dados principais e sinopse; “Quero ver” primário e trailer secundário, ambos aprovados. Estado vazio: “Nenhum filme por esse caminho. Remova um filtro e tente outra combinação.” Erro: “Não foi possível abrir a ficha. Tentar novamente.”

**Movimento:** pôster sobe 4px em 150ms; realce de linhas e foco sem deslocar a grade. Nenhuma animação de contagem ou carregamento em loop. Redução de movimento elimina o deslocamento e as transições, sem remover foco.

**Ponto fraco:** pode parecer utilitário e conter menos emoção cinematográfica; dados excessivos competem com os pôsteres. Manter só quatro fatos prioritários no topo e reservar a mono a pequenas informações, sem grades infinitas de badges.

### Exemplo de tema Tailwind 4

```css
@import 'tailwindcss';
@theme static {
  --color-canvas: #111c1b;
  --color-surface: #1a2926;
  --color-ink: #ebf1e9;
  --color-muted: #b1c2b8;
  --color-accent: #8ed6af;
  --color-on-accent: #111c1b;
  --color-line: #7a9486;
  --font-display: 'IBM Plex Sans', 'Segoe UI', Arial, sans-serif;
  --font-body: 'IBM Plex Sans', 'Segoe UI', Arial, sans-serif;
  --font-data: 'IBM Plex Mono', Consolas, 'Courier New', monospace;
  --text-display: 3.5rem;
  --text-title: 2.5rem;
  --text-section: 1.75rem;
  --text-card: 1.25rem;
  --text-body: 1rem;
  --text-caption: 0.8125rem;
  --spacing: 0.25rem;
  --container-page: 76rem;
  --radius-poster: 4px;
  --radius-control: 4px;
  --shadow-poster: none;
  --duration-fast: 150ms;
  --ease-settle: cubic-bezier(0.2, 0.7, 0.2, 1);
}
[data-theme='light'] {
  --color-canvas: #f0f4ee;
  --color-surface: #ffffff;
  --color-ink: #162a24;
  --color-muted: #4c6558;
  --color-accent: #236743;
  --color-on-accent: #ffffff;
  --color-line: #6d8877;
}
```

## Aplicação dos tokens

Os trechos são exemplos do tema da direção escolhida, não três sistemas a instalar juntos. @theme static mantém as variáveis disponíveis, inclusive para a mudança de tema; a sobrescrita de [data-theme="light"] deve vir depois do import/tema. A implementação futura pode usar a variante dark para diferenças de estrutura, mas as cores de papel/superfície/texto devem continuar semânticas. [Referência oficial de variáveis de tema](https://tailwindcss.com/docs/theme).

Exemplos de classes nomeadas: bg-canvas, text-ink, text-muted, text-accent, font-display, text-title, max-w-page, rounded-poster, shadow-poster, gap-6, transition-transform, duration-(--duration-fast), ease-settle. Para mobile, registrar tokens de tamanho próprios ou usar a escala nomeada com variantes responsivas; não espalhar text-[52px] e outros números de design pelos componentes. A escala de 4px gera os espaçamentos comuns; novos tamanhos recorrentes entram no tema. Estados reduzidos de movimento usam motion-reduce:transition-none e motion-reduce:transform-none.

Antes das páginas: implementar tokens dos dois temas, tipografia, link, botão primário/secundário, campo, card de filme/pessoa, placeholder de pôster, skeleton estático ou com movimento desativável, mensagem vazia, erro com nova tentativa e foco. Não incluir essa implementação na Fase 1. Pontos futuros de atenção: contraste do embed, textos longos, imagens ausentes, zoom de 200% e tradução eventual, sem antecipar extras marcados como futuro.

## Quadro comparativo

Estimativas relativas para a implementação completa após escolha; desempenho e acessibilidade abaixo são avaliações de projeto, não pontuações medidas do aplicativo.

| Critério                  | Caderno                                                  | Sala 02                                                   | Atlas                                                       |
| ------------------------- | -------------------------------------------------------- | --------------------------------------------------------- | ----------------------------------------------------------- |
| Personalidade             | Publicação de cinema, calor e leitura                    | Programação gráfica, impacto e ritmo                      | Biblioteca, exploração e precisão                           |
| Grid                      | 12 colunas, abertura assimétrica, ficha 3/6/3            | Abertura 5/2, sequência de pôsteres, ficha 2/5            | Trilho lateral, 3 cards e linha compacta, ficha tabular     |
| Esforço                   | Médio: reflow da assimetria e hierarquia                 | Médio: títulos condensados e quebras longas               | Médio/alto: índice, densidade e alternância de cards        |
| Risco de parecer genérico | Baixo se preservar tipografia e proporção                | Médio: preto/amarelo exige composição própria             | Médio: pode parecer um dashboard se houver excesso de dados |
| Desempenho                | Bom potencial; duas fontes, pôster de abertura maior     | Bom potencial; imagens regulares e pouco efeito           | Bom potencial; mais informação e foco no custo do DOM       |
| Acessibilidade            | Leitura confortável; cuidar de ordem e respiro no mobile | Contraste forte; limitar caixa alta e largura dos títulos | Hierarquia previsível; limitar mono, densidade e navegação  |
| Ponto de atenção          | Conteúdo visível por dobra                               | Saturação tipográfica                                     | Frieza e excesso de metadados                               |

## Recomendação

**Recomendação histórica: 01 — Caderno.** A direção dava personalidade ao portfólio por composição e tipografia, sem depender de efeitos, uma imagem específica ou funcionalidades novas. Essa recomendação foi substituída pela decisão Pulso acima.

O custo adicional é o ajuste responsivo da abertura e do detalhe; pode ser controlado com uma grade pequena e reflow previsível. A linha de filmes mantém títulos e notas sempre visíveis, e os dois temas apresentam boa folga de contraste. A recomendação é uma proposta: **aguardar escolha do usuário entre Caderno, Sala 02 e Atlas**, sem iniciar a fundação ou escrever código do aplicativo.

## Validação e limites

Paletas calculadas nos dois temas, sem dados/API externos. Previews locais sem JavaScript ou fontes baixadas; não demonstram busca, favoritos, trailer funcional ou dados reais. A verificação de navegador e os resultados efetivamente obtidos nesta fase são registrados no STATUS.md. Lighthouse do aplicativo continua não medido; não usar a leveza dos estudos estáticos para inferir pontuação da aplicação.
