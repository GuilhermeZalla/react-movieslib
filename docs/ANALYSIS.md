# Análise inicial do MoviesLib

Data: 28/10/2026. Etapa 0: análise estática, histórico local e consultas somente de leitura; documentação é a única alteração nesta fase. Não houve instalação, chamadas autenticadas ao TMDB ou escrita no Git.

Este documento separa os **achados do legado** das **decisões vigentes aprovadas**. Os achados preservam o diagnóstico original; as orientações de implementação foram sincronizadas com o [STATUS.md](STATUS.md), fonte da verdade. Aprovação do plano não significa implementação nem autorização para iniciar a próxima fase sem novo OK.

## Achados do legado

As seções até “Decisões vigentes” descrevem fatos, histórico e riscos identificados na Etapa 0. As correções planejadas seguem as decisões atuais; nenhum código da aplicação foi corrigido nesta fase.

## Resumo técnico

SPA JavaScript/JSX com React 18.2.0 e Create React App/react-scripts 5.0.1. TMDB v3 é consumido por fetch diretamente nos componentes; imagens em image.tmdb.org/t/p/w500. Requisições repetem API key na query e token Bearer no cabeçalho, ambos literais. Código-fonte, bundle e requisições expõem esses valores. Sem ambiente configurável, proxy ou backend.

Estado em useState, efeitos useEffect e referências useRef. Sem hooks próprios, cache compartilhado, cancelamento, schemas de resposta, Error Boundary ou armazenamento persistente. Layout e buscas dos menus desktop/mobile se repetem por página. Respostas são guardadas ora como objeto, ora como array com um objeto, usando vários estados por página da API.

Estilos: src/index.css global e src/style/style.css global importado por App. Sass separado por componente continua gerando seletores globais (.main, .container etc.), sujeitos a colisões. Sem comando de compilação Sass ou dependência Sass direta; o app depende do CSS gerado versionado. Há source map CSS, Google Fonts remoto, reset externo e scripts React 17 por CDN no HTML, além do React 18 do build. Os scripts CDN usam text/jsx, que não é JavaScript executável normal no navegador; são sobras a remover, não prova de duas versões executando.

Versões declaradas, resolvidas no lockfile, atuais no registro e vulnerabilidades: [DEPENDENCIES.md](DEPENDENCIES.md). Não há dependências instaladas neste checkout.

## Telas e componentes

| Caminho                                   | Implementação atual                                          |
| ----------------------------------------- | ------------------------------------------------------------ |
| /                                         | Tendências do dia, populares, em cartaz e faixa de backdrops |
| /movie-details/:id                        | Filme e até 20 pessoas do elenco; append_to_response=credits |
| /catalog/:category/:page                  | Categoria, busca dentro da tela e páginas fixas 1–5          |
| /upcoming_&_just_released/:category/:page | Mesmo catálogo; menu usa upcoming                            |
| /top_rated/:category/:page                | Mesmo catálogo; menu usa top_rated                           |
| /genres/:id/:genre                        | Gênero filtrado no cliente sobre recorte de resultados       |
| /cast                                     | Pessoas populares e busca; até seis páginas antecipadas      |
| /cast/:id                                 | Biografia e filmografia, com person/:id e movie_credits      |

src/screens contém seis wrappers simples. Compartilhados: Header, Aside, AsideMobile, Footer (paginação), FilmCard, BannerImg, Cast e dois componentes Genres de funções diferentes. Não há 404/rota curinga, Minha lista ou Sobre/Créditos. Equipe técnica, recomendações e galeria do filme não são renderizadas. A faixa da home não equivale a uma galeria do filme.

Pessoa/filmografia e em cartaz/em breve já existem; modernizá-los preserva o escopo. A ausência de 404/equipe/recomendações/galeria é divergência entre pedido e legado, a cobrir na implementação solicitada.

## Funcionamento: evidências e limites

Navegação, listagens, cards, detalhe/elenco e pessoa/filmografia existem no código. Não foi confirmado que o app compila neste ambiente ou que a API responde com as credenciais antigas. Sem smoke test, medição de rede, teste visual ou Lighthouse.

Os defeitos de lógica abaixo são verificáveis no código. Impactos de layout são riscos a validar em navegador. O único teste procura “learn react”, ausente no aplicativo. Sem scripts dedicados de lint/tipos, testes úteis ou CI.

## Histórico e credenciais

**Achado original:** API key v3 e token Bearer TMDB literais no código e no histórico, com estrutura de credenciais reais e validade não testada. **Atualização informada pelo proprietário:** ambos foram revogados e substitutos gerados; a ação não foi verificada no painel pelo agente. Remoção dos literais antigos do código ainda pendente; criar .env não invalida valores publicados. Reescrita de histórico: **não realizada, por decisão do proprietário**, e não planejada para execução pelo agente. Nenhum valor real é reproduzido aqui.

Cobertura: main, origin/main e origin/master disponíveis localmente; 8 commits alcançáveis e 70 blobs únicos, inclusive arquivos históricos/removidos. Foram inspecionados nomes sensíveis (.env, secret, credential, .pem, .key), API keys TMDB, atribuições de token, formatos GitHub/AWS, senhas/client secrets literais e chaves privadas. Não foi detectado .env versionado ou outra família de credencial pelos padrões. Isso não garante ausência de formatos não reconhecidos. Sem fetch: branches remotas ausentes localmente, forks, reflogs e objetos inalcançáveis não estão cobertos.

Uma API key e um Bearer distintos na árvore atual. **Cada um dos oito arquivos abaixo contém credenciais em cada um dos seis commits listados a seguir**:

| Arquivo                                             | Achado           |
| --------------------------------------------------- | ---------------- |
| src/components/common/aside/aside.jsx               | Bearer literal   |
| src/components/common/asideMobile/asideMobile.jsx   | Bearer literal   |
| src/components/home/castCatalog/castCatalog.jsx     | API key e Bearer |
| src/components/home/castDetails/castDetails.jsx     | API key e Bearer |
| src/components/home/genresCatalog/genresCatalog.jsx | API key e Bearer |
| src/components/home/home.jsx                        | API key e Bearer |
| src/components/home/moviesCatalog/moviesCatalog.jsx | API key e Bearer |
| src/components/movie-details/movie-details.jsx      | API key e Bearer |

Commits com achados (snapshots, não necessariamente introduções independentes):

```text
598b4a4d83acd10b536510d675a0fa21fa913a08
afa4c5cd361a5ae808277d3e1d8d9cc4d9191344
c3f7ccce55ce9f28295310028541e16ec176b3ad
8573d22d2f30aced89f29100d4167a92249eee6c
e062a5df310596c459baef5d2a5d9ae424b3f331
d4036a7db4a6c33bdd5ca5c57044182e635485ef
```

Sem correspondência dos padrões em b22c9dd4a2a5d95ba40554f8fd09e714027a7698 e 5bcd37720c3d67641402bb728401a51a698ec8fc. Não é necessário reproduzir valores nem trechos de JWT para localizar os achados.

## Problemas e correções propostas

| Prioridade | Evidência e efeito                                                          | Correção planejada                                                                                                                            |
| ---------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Crítica    | Credenciais literais nos oito arquivos acima                                | Revogação informada como concluída pelo proprietário; retirar literais na fundação e configurar ambiente de servidor/proxy aprovado na Vercel |
| Alta       | MoviesCatalog: efeito depende de movies e atualiza movies com novo array    | Query por category/page validados, sem ciclo de atualização                                                                                   |
| Alta       | CastDetails: efeito depende de cast/credits e atualiza ambos                | Query por id, cancelamento e cache                                                                                                            |
| Alta       | MovieDetails e GenresCatalog: efeito [] ignora mudança de id                | Incluir identificadores na chave de consulta e testar navegação entre IDs                                                                     |
| Alta       | Sem response.ok, erros só no console                                        | Distinguir rede, HTTP, 404, 429 e resposta inválida; recuperação e erro amigável                                                              |
| Alta       | Busca MoviesCatalog pede página 3 três vezes                                | Paginação única por parâmetros; usar total_pages e eliminar duplicatas                                                                        |
| Alta       | Gêneros: só quatro páginas populares e uma top_rated filtradas localmente   | discover/movie com with_genres, filtros e ordenação validados                                                                                 |
| Média      | Busca substitui espaços por + e interpola texto                             | Normalizar, limitar tamanho, URLSearchParams, debounce e AbortSignal                                                                          |
| Média      | Cinco/seis páginas buscadas antecipadamente; busca fora da URL              | Página por vez; query/filtros/sort na URL; testar voltar/avançar                                                                              |
| Média      | Resposta antiga pode sobrescrever busca nova                                | Cancelar e identificar consulta por parâmetros normalizados                                                                                   |
| Média      | results/cast assumidos, optional chaining parcial                           | Schemas Zod na fronteira e modelos normalizados                                                                                               |
| Média      | Sem imagem, pessoa/filme some; detalhe gera URL null/undefined              | Fallback visual preservando conteúdo, proporção fixa e tratamento de erro da imagem                                                           |
| Média      | Footer fixa 1–5 e sempre aponta para /catalog                               | Limites da resposta e preservação de filtros/contexto                                                                                         |
| Média      | Imagens sempre w500, sem lazy/srcset/sizes/dimensões                        | Tamanhos suportados no TMDB, aspect-ratio e lazy fora da área inicial                                                                         |
| Média      | Home usa grid-auto-rows:0px, mantendo itens no DOM                          | Limitar itens explicitamente sem esconder linhas por altura zero                                                                              |
| Média      | Link do card visibility:hidden até hover                                    | Card navegável, título/foco visíveis e acesso por toque/teclado                                                                               |
| Média      | Links role=button sem suporte de teclado; inputs/ícones sem label           | button real, labels, nomes acessíveis, aria-expanded e foco previsível                                                                        |
| Média      | Menus mudam estilos por refs; controles transparentes permanecem no fluxo   | Estado React, CSS, hidden/inert quando necessário e foco gerenciado                                                                           |
| Média      | outline:none, sem reduced-motion; títulos em pseudo-elementos               | focus-visible, prefers-reduced-motion e headings semânticos                                                                                   |
| Média      | Colunas mínimas 180px com imagens 190px; detalhe com gap 150px; hover scale | Grid fluido, min-width:0, limites de imagem e testes nas quatro larguras                                                                      |
| Média      | Pessoa: todo gênero diferente de 2 vira feminino                            | Tratar enum completo e não informado com textos pt-BR                                                                                         |
| Média      | UI inglesa, metadados CRA, manifest com logos inexistentes                  | Copy pt-BR e metadados/manifesto coerentes                                                                                                    |
| Média      | .env genérico não ignorado e sem exemplo                                    | .gitignore, .env.example sem valores reais e explicação de VITE_ público                                                                      |
| Média      | Sem Boundary, atribuição ou headers/deploy versionados                      | Boundary, Créditos e headers testados na hospedagem escolhida                                                                                 |
| Média      | Teste template, scripts faltantes, dois lockfiles, CRA legado               | Vite/TS, lint/format, testes comportamentais, CI e Dependabot                                                                                 |
| Baixa      | Wrappers, fetch duplicado e key por índice                                  | app/pages/features/shared simples, componentes coesos e IDs estáveis                                                                          |
| Baixa      | README com marcadores de conflito                                           | Corrigido apenas na documentação desta fase                                                                                                   |

Não foi encontrado dangerouslySetInnerHTML. Não há login ou analytics próprio identificado; TMDB e CDNs ainda são terceiros na comunicação de rede. “Sem coleta de dados pessoais” deve significar sem coleta adicional pelo aplicativo, sem prometer ausência de tratamento pelos provedores. Novos links externos em outra aba precisam de rel="noopener noreferrer" e URL validada.

Contraste AA e ausência de overflow exigem medição. Carrosséis devem oferecer toque, teclado, controles nomeados, foco visível e movimento reduzido.

## API: obrigações confirmadas e pendências

Fontes oficiais consultadas em 28/10/2026:

- [FAQ TMDB](https://developer.themoviedb.org/docs/faq): uso não comercial gratuito condicionado à atribuição; projetos com finalidade primária de receita requerem licença comercial. Exige logo aprovado e aviso em destaque em Sobre/Créditos. A marca TMDB deve ser menos proeminente que a do aplicativo, sem sugerir endosso. Preservar proporção/orientação e usar cores permitidas.
- Aviso exigido: “This product uses the TMDB API but is not endorsed or certified by TMDB.”
- [Rate limiting](https://developer.themoviedb.org/docs/rate-limiting): limite antigo de 40 chamadas/10s desativado. Limite superior aproximado de 40/s é mutável; respeitar 429, sem tratá-lo como cota garantida. Planejar retry limitado, com Retry-After quando disponível.
- [Imagens](https://developer.themoviedb.org/docs/image-basics): base e tamanhos vêm da configuração da API; respeitar tamanhos suportados.
- [Watch providers](https://developer.themoviedb.org/reference/movie-watch-providers): disponibilidade por país vem de JustWatch e exige atribuição específica a JustWatch. Não oferece deep links completos; pode-se usar o link TMDB fornecido.
- [Termos integrais](https://www.themoviedb.org/api-terms-of-use) e [logos](https://www.themoviedb.org/about/logos-attribution): conteúdo integral bloqueado por robots/HTTP 403, inclusive tentativa direta. **Prazo máximo de cache não confirmado; não adotar “seis meses” como fato.** Retenção, redistribuição e demais cláusulas precisam de leitura antes do deploy.

Planejar seção Sobre/Créditos acessível pelo rodapé, logo/aviso e CREDITS.md com licenças de recursos. Rodapé sozinho não substitui a seção exigida. A política provisória aprovada é memória no TanStack Query e borda curta no proxy; Minha lista persiste somente IDs. Não persistir respostas ou metadados TMDB em localStorage nem ativar persistência do cache de consultas. **Pendência: o proprietário conferirá os termos.** Essa política não constitui confirmação contratual.

## Decisões vigentes

As decisões abaixo já foram aprovadas e substituem as recomendações preliminares divergentes. Consulte o [STATUS.md](STATUS.md#decisões-aprovadas-e-justificativas) como fonte da verdade.

1. **SPA React + TypeScript + Vite + React Router**, sem framework adicional/SSR. React 19.3.1 consta como latest no [registro npm](https://registry.npmjs.org/react/latest); confirmar novamente na fundação. [CRA foi descontinuado para novos projetos](https://react.dev/blog/2025/02/14/sunsetting-create-react-app), sem justificar mudança do catálogo para outra arquitetura.
2. **TanStack Query** para cache, deduplicação, ciclo de consulta e paginação, com AbortSignal no fetch. A [documentação oficial](https://tanstack.com/query/latest/docs/framework/react/overview) descreve essas responsabilidades de estado remoto. Evita reconstruir um cache próprio; não substitui URL ou estado local.
3. **Tailwind CSS 4.3.3**, versão estável registrada na consulta de 28/10/2026, com integração oficial via @tailwindcss/vite e @import "tailwindcss". Tokens de cores, tipografia, espaçamento, raios, sombras e movimento em **@theme**, evitando valores arbitrários soltos nos componentes. **DaisyUI e bibliotecas de componentes visuais não utilizados**. Direções visuais implementáveis com esses tokens; reconfirmar versão estável na Fase 2 antes de instalar. Referências: [Vite](https://tailwindcss.com/docs/installation/using-vite) e [tema](https://tailwindcss.com/docs/theme).
4. **Zod** para validar API/URL/localStorage e modelos normalizados; respeitar campos opcionais válidos. Estrutura app/pages/features/shared simples, sem arquitetura excessiva.
5. **Paginação explícita acessível**, URL para filtros/busca, Minha lista com schema/versão contendo somente IDs, tolerância a JSON inválido, storage negado e cota excedida. Cache TanStack Query apenas em memória e borda curta no proxy; nenhum metadado TMDB em localStorage. Termos ainda pendentes de conferência pelo proprietário. Sem Redux.
6. ESLint + Prettier, tsc, Vitest + Testing Library, Playwright buscar → abrir filme → voltar; Actions com lint/tipos/testes/build e Dependabot. Testar loops, mudança de ID, paginação, respostas fora de ordem, 429, dados ausentes e storage corrompido.
7. **Sem login/cadastro e sem coleta de dados pessoais pelo aplicativo**: não adicionar analytics ou rastreamento; documentar comunicação com provedores terceiros. Manter a licença MIT existente.
8. **Fase 2: priorizar vulnerabilidades críticas e altas**, reauditar e documentar o que restar, preservando os achados originais do inventário como fotografia da consulta.

### Proxy serverless na Vercel: aprovado

O proxy foi aprovado para manter o segredo somente no ambiente do servidor. Não colocar credenciais TMDB em variáveis VITE_, que são públicas no bundle.

Implementação planejada: função mínima em **/api na Vercel**, sem banco/backend de domínio. Apenas GET e caminhos TMDB permitidos; URL construída internamente; validação de id/category/page/language/filtros/busca; segredo no servidor; timeout e tamanho de resposta limitados; erros sanitizados e logs sem credenciais. Cache de borda curto por parâmetros, com TTL explícito e limite de requisições efetivo entre instâncias. Contador em memória não garante esse limite; CORS não impede abuso do endpoint público. Não aceitar URL arbitrária nem persistir respostas TMDB para o controle de volume.

Ganho: segredo fora do cliente, cache de borda curto e controle de consumo. Custo: configuração, quotas, observabilidade e proteção contra abuso. Não há aprovação de acesso direto com credencial pública como alternativa de deploy. Na implementação do proxy, documentar no README os nomes reais das variáveis de servidor, configuração nos ambientes Vercel e execução local com vercel dev ou equivalente, com arquivo ignorado e .env.example sem valores reais. Essas instruções operacionais dependem da implementação e não são apresentadas como já funcionais.

### Funcionalidades: entrega aprovada e futuro

Esforço relativo incluindo implementação/testes, preservando a avaliação de ganho e risco da análise inicial. Busca/filtros, Minha lista, estados e acessibilidade permanecem no plano principal. A coluna de situação abaixo reflete as decisões vigentes.

| Ideia                              | Situação                                          | Esforço               | Ganho                             | Risco / cuidado                                                                                |
| ---------------------------------- | ------------------------------------------------- | --------------------- | --------------------------------- | ---------------------------------------------------------------------------------------------- |
| Trailer youtube-nocookie ao clicar | Aprovado para a entrega                           | Médio                 | Avaliar filme sem sair            | CSP e terceiros; modo de privacidade não significa ausência total de dados                     |
| Em cartaz / em breve               | Preservar                                         | Baixo–médio           | Contexto de lançamentos           | Já existem; corrigir região/datas e apresentação                                               |
| Filmes parecidos / recomendações   | Escopo principal                                  | Médio                 | Descoberta                        | Usar recomendações TMDB simples com fallback                                                   |
| Comparação de filmes               | **Futuro**                                        | Alto                  | Comparar opções                   | Fora da entrega inicial; amplia escopo de UI e testes                                          |
| Claro/escuro                       | Aprovado para a entrega                           | Médio                 | Preferência de leitura            | Verificar contraste dos dois temas                                                             |
| pt-BR/en por idioma API            | **Futuro**                                        | Médio                 | Alcance e prática i18n            | Traduzir UI/datas também e prever fallback; UI inicial em pt-BR                                |
| Atalho para busca                  | **Futuro**                                        | Baixo                 | Agilidade no teclado              | Evitar captura durante digitação; acessibilidade básica de teclado permanece obrigatória agora |
| Pessoa com filmografia             | Preservar                                         | Médio para modernizar | Navegar do elenco a outros filmes | Já existe; corrigir loop, sem nova página obrigatória                                          |
| Onde assistir                      | Fora da entrega inicial, sem aprovação específica | Médio                 | Disponibilidade no Brasil         | Atribuição JustWatch, dados mutáveis, sem deep links completos                                 |

A entrega aprovada inclui tema claro/escuro e trailer, além da preservação das telas e funcionalidades do plano principal. pt-BR/en, atalhos de teclado e comparação são aprovados como **futuro**. Não confundir recomendações de filmes do escopo principal com comparação futura.

## Verificações e sequência

Executados: histórico e consultas npm. Runtime, lint, tipos, testes, build e Lighthouse **não validados**. Não há node_modules; scripts de lint/tipos inexistentes. Não se afirma que todos os riscos auditados sejam exploráveis no bundle estático.

Antes de substituir a UI, capturar baseline controlado do legado, registrando cenário, modo produção, navegador/dispositivo e mediana de três medições comparáveis. Distinguir API real de fixtures e não medir uma página quebrada como baseline. Aferir 360/768/1024/1440 px, teclado e contraste; depois testar CSP real com API/imagens/embeds aprovados. Cabeçalhos previstos: CSP restrita, X-Content-Type-Options, Referrer-Policy e Permissions-Policy. Hospedagem aprovada: Vercel, ainda sem configuração implementada.

Etapa 0 aprovada; aguardar novo OK para a Fase 1. Essa fase ficará restrita a docs/DESIGN.md e docs/design-previews/ com HTML estático de amostra: 2–3 direções realmente distintas, paleta, par tipográfico, grid, pôsteres, movimento, home/detalhe e recomendação justificada, implementáveis com Tailwind e tokens em @theme. Depois parar para escolha visual. Fundação e demais implementações só nas fases autorizadas. Nenhuma publicação ou operação de escrita Git automática.
