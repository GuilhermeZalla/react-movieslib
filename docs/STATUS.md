# Status do MoviesLib

Atualizado em 29/10/2026. HEAD inicial `c9d1e8c`, árvore limpa antes destes dois blocos. Os blocos antigos abaixo são registros históricos, inclusive referências a fetch legado, CDN de imagens e à configuração anterior do WAF; a abertura e o README descrevem o estado vigente. Git somente leitura. **Mensagens de commit em inglês, conforme decisão mais recente do proprietário.**

## Bloco 2 — direção Pulso e amostra de tipografia

- **Desvio decidido pelo proprietário:** Caderno editorial, com serifas, deixa de ser a direção vigente. A direção agora se chama **Pulso**: visual moderno e jovem de streaming, carvão/cinzas, pôster protagonista, tema escuro padrão e vermelho principal #C62828. O PXN Games segue apenas como referência de clima; sem copiar cores exatas, marca, textos ou layout. DESIGN.md contém a escala vermelha e os contrastes AA dos dois temas. As seções antigas abaixo sobre Caderno e paletas anteriores são histórico, não decisão atual.
- `/design` (somente desenvolvimento) usa a **tipografia B** (Bricolage Grotesque nos títulos + Figtree no corpo), WOFF2 local via Fontsource Variable 5.3.0, `font-display: swap`, SIL OFL 1.1 e fallback do sistema. As opções A e C foram removidas; o seletor de fonte foi removido. Quatro amostras exibem claro/escuro em 360/1440 px, tipografia, cards, ranking, skeleton e estados. SVGs próprios e dados fictícios. Fontes antigas (Source Serif 4, Source Sans 3) permanecem instaladas — saem com o Sass no fim da Fase 5, pois `src/app/styles/theme.css` ainda as referencia.
- Tokens novos e aparência dos componentes novos ficam isolados na amostra `/design`; páginas existentes continuam com os tokens legados e não recebem redesenho neste bloco. Testes de componentes cobrem a marcação acessível e a seleção tipográfica.
- Correção de isolamento CSS: o CSS legado (`src/style/style.css` e `public/meyer-reset.css`) estava fora de camada e vencia os utilitários do Tailwind 4 (unlayered beats layered). Declarada a ordem `@layer theme, legacy, base, components, utilities;` em `src/index.css`; o CSS legado foi importado dentro de `@layer legacy`. Removidos o import global de `style.css` em `App.tsx` e o `<link>` do meyer-reset em `index.html`. Conteúdo do CSS legado inalterado; telas existentes preservadas.

## Bloco 1 — correções menores antes da mudança visual

- ESLint mantém `no-restricted-globals` para `fetch` e `XMLHttpRequest`, `no-restricted-imports` para axios e bloqueia também `window.fetch`, `globalThis.fetch` e `self.fetch` via `no-restricted-properties`. O cliente centralizado é a única exceção de produção para fetch; testes que usam mocks têm exceção comentada. Prova: arquivo temporário `src/lintProof.ts` com `window.fetch` recebeu erro `no-restricted-properties` (exit 1) e foi removido; o arquivo não entra no commit.
- Proxy de imagens: MIME aceitos agora JPEG/PNG/WebP, alinhados às extensões `.jpg`/`.jpeg`/`.png`/`.webp`; AVIF deixou de ser solicitado ou aceito. A rota continua limitada a `w500`, sem ampliar a superfície do proxy.
- Demonstração com tráfego alto pode exceder **300 imagens/min por instância**, quota anônima compartilhada entre todos os visitantes, e mostrar imagens quebradas (HTTP 429). Antes de publicar, medir tráfego/custos e verificar os termos TMDB; após essa checagem, o proprietário reavaliará manter o proxy de imagens ou carregar diretamente de `image.tmdb.org`, com CSP restrita exclusivamente a esse host para imagens. Nenhuma mudança de arquitetura de imagens foi autorizada agora.

## Fase 3 — conclusão da integração de dados e imagens (grupo atual)

- **Fase 3 concluída no código:** CastCatalog e GenresCatalog passaram às consultas centralizadas, validadas por Zod no cliente e com AbortSignal do TanStack Query. Catálogo de pessoas usa seis páginas; gênero usa cinco páginas populares e o mesmo recorte por ID do legado. Busca de pessoas aceita até 200 caracteres, normaliza NFC/espaços, espera 300 ms após envio e cancela requisições antigas. ID e nome do gênero são validados antes de habilitar consultas; ID inválido abre 404. Páginas/categorias dos demais catálogos e IDs de detalhes já tinham validação. Resultados vazios usam EmptyState sem botão de retry; falhas reais usam ErrorState com retry. Estrutura visual, URLs e estilos das telas foram preservados.
- Varredura de todo `src` de produção, exceto `src/api` e `src/test`: **zero `fetch`, `XMLHttpRequest`, `axios` ou URLs do TMDB**. Antes havia 12 chamadas diretas no catálogo/busca de pessoas, 5 no filtro por gênero e URLs do CDN de imagens nos cards/banners/detalhes. O ESLint agora bloqueia `fetch`/`XMLHttpRequest` globais e imports de axios em `src`; somente `src/api/tmdb/client.ts` pode usar fetch, e testes têm exceção comentada para seus mocks. Nenhuma dependência foi instalada.
- Pôsteres, fotos e banners agora recebem URLs da mesma origem geradas pelo cliente. O proxy aceita somente `image/w500/:arquivo` com nome/extensão enumerados, origem fixa do CDN TMDB, GET, sem token enviado ao host de imagens, sem SVG, redirect ou caminho arbitrário. Bytes até 5 MB, MIME permitido, timeout de 8 s, no-store no navegador, 60 s na borda apenas para 200, erro genérico em JSON. A ponte Node preserva binários. O reset Meyer 2.0 foi hospedado localmente em `public/meyer-reset.css` (domínio público), removendo a dependência de cdnjs em tempo de execução; CSP permite imagens e conexões somente da mesma origem. A referência remota do Sass legado não participa do build atual e fica para a retirada do CSS legado na Fase 4.
- Plano B do proxy: contadores anônimos separados, **60 JSON e 300 imagens por minuto por instância**, ambos compartilhados por todos os visitantes. Plano A WAF no painel **continua não ativado/não verificado**; a instrução do README agora limita 60/min apenas às rotas de dados, excluindo `/api/tmdb/image/`. Configuração efetiva, CDN e custos dependem de verificação na Vercel. Cache de borda permanece em 60 s até o proprietário conferir os termos TMDB; nada persiste respostas TMDB em localStorage.
- Testes: **216 antes, 246 após** (19 arquivos), com fluxos de sucesso, vazio, erro/retry, troca de termo, cancelamento e contagem após re-render, além de política/bytes/erros/limite das imagens. Prova de reversão: em cópia temporária de `queries.ts`, retirar o repasse do signal de `movieSearchQuery` fez o teste de cancelamento falhar (`expected false to be true`); cópia e teste temporários foram removidos, código real intacto. Nenhuma chamada real ao TMDB foi feita. `npm run check`: lint sem erros/avisos, tipos estritos, 246 testes, build e Prettier; resultado final confirmado no encerramento do grupo.
- Pendências que não bloqueiam a conclusão da integração de código: ativar/testar WAF, conferir termos/cache TMDB, testar dados reais e comportamento da CDN após configurar segredo apenas no servidor, revisar limite anônimo compartilhado antes da publicação. Visual e acessibilidade continuam nas fases próprias.
- Revisão estática desta entrega: `dist/` sem nome da variável privada, marcador do adaptador ou host TMDB; padrões de token Bearer/API key/JWT e caminhos absolutos de usuário sem correspondências nos arquivos alterados. `git diff --check` sem erros. São verificações de padrões, não prova de que uma credencial nunca existiu no histórico.

## Pendências de pré-publicação — vigentes

- [ ] **Ativar e testar a regra WAF no painel da Vercel.** Não há confirmação de ativação; conferir bloqueio/429 e observabilidade no projeto publicado.
- [ ] **Revisar a limitação do contador em memória antes de publicar:** a quota é compartilhada por todos os visitantes da mesma instância. README deve explicitar essa divisão, cold starts e ausência de coordenação entre instâncias; é melhor esforço, por instância, não limite por visitante. A documentação já explica a limitação; a mitigação/publicação continua pendente.
- [ ] **Conferir os termos do TMDB para imagens:** confirmar expressamente se o proxy de imagens e o cache de borda de 60 s com stale-while-revalidate de 15 s são permitidos, além das regras de atribuição e redistribuição. Não ampliar o cache nem tratar a política provisória como autorização contratual até essa revisão.
- [ ] **Medir o consumo do proxy de imagens na Vercel antes de publicar:** cada imagem servida pela função pode consumir recursos da plataforma, e o tráfego simultâneo também disputa a quota anônima de 300 imagens/min por instância. Verificar no painel limites, métricas, custo e comportamento do cache de borda em tráfego real; o WAF de 60/min para dados deve excluir `/api/tmdb/image/` e ainda não foi ativado/testado.

## Revisão do grupo 3 após a retomada

- O grupo 3 foi commitado em `7d73363` antes desta retomada. Cliente, consultas, QueryClient, debounce e testes de contrato das fixtures estavam presentes. A árvore avançou também para integração parcial das telas e componentes base. Esta revisão acrescenta apenas cobertura das consultas e corrige a documentação; não altera as telas.
- Contrato das fixtures: os 16 casos existentes validam as respostas fictícias dos componentes pelos schemas. Não foi preciso alterar fixture nem schema. O cliente chama apenas caminhos relativos do proxy, valida respostas Zod, repassa AbortSignal e tem timeout próprio. `TmdbError` distingue rede, formato inválido, vazio, 404, 429/Retry-After, pedido inválido, timeout e indisponibilidade.
- As chaves de consulta incluem domínio, categoria ou operação, ID, página e termo conforme o caso. QueryClient usa `staleTime` de 60 s, `gcTime` de 5 min e cache apenas em memória. Só falha de rede recebe até um retry; 400/404/429 não são repetidos. O hook publica a busca após 300 ms. O novo teste cobre separação de chaves, normalização, cache/expiração com relógio controlado, ausência de localStorage, retry e cancelamento ao mudar o termo.
- Integração atual: home, filmes, menus de gêneros e detalhes usam consultas; catálogo de pessoas e parte do filtro por gênero ainda usam `fetch` direto ao proxy. A busca de filmes consulta páginas 1–5 e o antigo `it.fails` já é teste comum. README corrigido para refletir esses fatos. Completar os trechos restantes exige autorização de grupo próprio. O escopo desta revisão não altera comportamento, estilos ou URLs.
- `npm run check` passou: lint **0 erros/avisos**, TypeScript estrito, **216 testes em 17 arquivos** (207 antes; 9 casos novos), build e Prettier. Os 9 testes novos passaram também isoladamente. Nenhuma chamada real à rede, alteração de tela, estilo, URL, pacote ou script nesta revisão.

## Fase 3 — grupo 2: proxy TMDB protegido

### Entrega e decisões vigentes

- api/tmdb.ts é a entrada Node da função. server/tmdb concentra política, handler, contador e ponte Node; sem dependências novas. Origem fixa https://api.themoviedb.org/3/, somente GET; demais métodos 405/Allow: GET. Lista explícita de endpoints/parâmetros no README e em policy.ts. Alvos brutos validados antes de normalização, sem traversal, barras duplicadas, percent-encoding no caminho público ou dupla codificação. Transporte path do rewrite validado pela mesma lista; duplicados/conflitos recusados.
- **language=en-US e include_adult=false impostos no servidor. Valores do cliente para essas duas opções são ignorados**, inclusive duplicados. Isso substitui a proposta anterior de rejeitá-los diretamente: schemas compartilhados continuam estritos, mas o proxy remove as opções controladas antes da validação. Entradas adult=true removidas de listas/créditos, detalhes adultos retornam 404; depende da classificação do provedor, não certifica moderação. Metadados de totais conservam as contagens upstream.
- Token somente em process.env.TMDB_READ_ACCESS_TOKEN, usado apenas em Authorization. Ausência retorna 502 genérico sem nome da variável. Nenhum log no proxy, nenhum IP/cabeçalho registrado. Redirects upstream recusados; erros públicos 400/404/405/429/502/504 padronizados, sem repassar corpo/mensagem/stack/cabeçalhos do TMDB.
- Timeout total **8 s**, inclusive leitura do corpo, AbortController e limite **2 MB** antes de JSON.parse. Dados 200 também validados pelos schemas; payload inválido vira 502. Conexão abortada ao terminar, inclusive em falhas.
- **Somente 200**: Vercel-CDN-Cache-Control: public, s-maxage=60, stale-while-revalidate=15. Cache-Control: no-store para navegador em todas as respostas; erros sem cache de borda. Content-Type JSON e nosniff; sem Access-Control-Allow-Origin. Não aumentar 60 s até confirmação dos termos. CORS não é autenticação e não bloqueia clientes externos ao navegador.
- **Plano B implementado:** “melhor esforço, por instância”, contador global anônimo de **60/minuto** por processo, compartilhado entre visitantes. Guarda só timestamp/contagem, não IP, com memória constante; excesso 429/Retry-After. Reinício/cold start/múltiplas instâncias não compartilham quota. Só conta solicitações válidas que chegam à função, não hits da CDN. Não equivale a limite distribuído.
- **Plano A no painel, não versionado: não acessado ou configurado pelo agente; ativação não confirmada.** README contém passos para WAF Hobby: regra por IP, caminho começando /api/tmdb, janela fixa 60 s/60 solicitações, ação 429, revisão e publicação. Hobby oferece uma regra de limite dentro de três regras customizadas, 1 milhão de requisições permitidas incluídas, chaves IP/JA4 e janelas 10 s–10 min; contadores por região. Disponibilidade/uso da conta e regra real exigem conferência pelo proprietário. Nenhum SDK WAF instalado, pois o plano A é regra no painel.
- Rewrites /api/tmdb/:path* → /api/tmdb?path=:path*. Fallback SPA usa exclusão explícita de /api e subcaminhos. Comparação estrutural com HEAD confirmou **headers globais de segurança anteriores preservados**; revisão CSP/headers permanece Fase 6.
- Adaptador de desenvolvimento em server/dev/tmdbPlugin.ts, import dinâmico somente em Vite serve/development; carrega segredo local no processo Node. Não é importado por api/tmdb.ts ou pelo front. Vite build/preview não executam esse adaptador. Imports .ts explícitos no grafo servidor/configuração, com allowImportingTsExtensions e noEmit, para suportar o loader sem suprimir avisos ou afrouxar strict.
- .env.example contém apenas nome e valor vazio. README documenta .env.local ignorado, variável privada no painel e **vercel dev (CLI 65.5.0 consultada)**. Não houve login/vínculo de conta, ativação WAF ou deploy. Desenvolvimento Vite foi conferido localmente com token explicitamente vazio; nenhuma chamada real ao TMDB.
- Nenhuma alteração em src, componentes, telas, estilos, fontes ou URLs do front. Cliente centralizado, Query/debounce/cancelamento e bug 1,2,3,3,3 continuam nos grupos 3/4. React 18.3.1 continua desvio aceito, reavaliar após Fase 6; Playwright no CI é pendência da Fase 7.

### Relatório de segurança

| Ameaça                             | Mitigação                                                     | Teste Node                                                          |
| ---------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------- |
| Métodos indevidos                  | GET exclusivo, 405 e Allow                                    | somente GET, seis métodos recusados                                 |
| SSRF/endpoint arbitrário           | Origem fixa, allowlist, redirects bloqueados                  | endpoint fora da lista, host/url desconhecidos, autenticação/header |
| Traversal e dupla codificação      | Validar alvo bruto e caminho canônico antes de URL            | onze casos de traversal/barras/codificação                          |
| Parâmetros inválidos/duplicados    | Schemas estritos por endpoint, limites de query/página/ID     | parâmetros inválidos e conflito path                                |
| Cliente alterar idioma/adulto      | Descartar opções do cliente e impor valores fixos             | idioma/adulto duplicados; remoção de entradas adultas               |
| Token em URL/erro/log/browser      | Só servidor/Authorization, erros genéricos, sem logs          | header e query, token ausente, erro sensível, teste do build        |
| Vazamento upstream                 | Não ler nem propagar corpos de erro; JSON validado em sucesso | erros 400/401/403/404/429/500/302 e JSON inválido                   |
| Consumo de recursos                | Deadline/AbortSignal e limite 2 MB                            | fetch pendente, corpo sem término, corpo excessivo                  |
| Abuso de volume                    | Contador anônimo por instância, 429/Retry-After               | limite sem novo fetch e renovação de janela                         |
| Cache de falhas/dados no navegador | 200 na borda 60 s, erros/browser no-store                     | headers 200 versus erros e limite                                   |
| API receber HTML da SPA            | Fallback exclui /api                                          | teste da expressão e entrada Node com rewrite                       |
| CORS aberto                        | Nenhum ACAO; resposta JSON/nosniff                            | verificação de headers                                              |

Não coberto localmente: regra WAF real, contagem/CDN entre regiões, quotas/uso da conta, normalização do roteador gerenciado, deploy/headers HTTP efetivos e comportamento completo de vercel dev vinculado à conta. Testes mockam o TMDB; não verificam credenciais reais, disponibilidade ou todos os contratos do provedor. Contador em memória não impede DDoS/distribuição de abuso. Front ainda possui busca/erros legados; não corrigidos neste grupo.

### Verificação e plano de commit

npm run check passou localmente: lint **0 erros/avisos**, tipos estritos, **139 testes + 1 it.fails conhecido (140 casos em dez arquivos)**, build e Prettier. Antes eram 66 + 1; adicionados 73 casos de proxy/limite/entrada/rotas. Todos os 13 endpoints permitidos exercitados. Cobertura v8 passou: **76,37% statements, 74,68% branches, 63,09% funções, 76,94% linhas**, informativa, sem limiar mínimo; server/tmdb com 99,33% das linhas. Adaptador dev sem cobertura unitária, conferido por HTTP local.

HTTP local com variável explicitamente vazia: GET permitido → 502 genérico; endpoint fora da lista → 404; dupla codificação → 400; POST → 405; rota de catálogo → HTML 200. APIs respondem JSON/nosniff/no-store, sem nome da variável no corpo. Sem chamadas externas, login, vínculo Vercel ou deploy. Comparação do diff confirmou src e dependências preservados; headers globais de vercel.json estruturalmente iguais ao HEAD. Varredura por padrões de segredo/caminhos locais sem correspondências; não certifica todos os formatos possíveis.

Build mantém **JS 219,28 kB (67,56 kB gzip)** e **CSS 39,12 kB (7,86 kB gzip)** com os mesmos nomes/hash Vite anteriores. Snapshot isolado com npm ci e CI=true passou no check completo (139 + 1); instalação reportou zero vulnerabilidades. Build executado com marcador fictício na variável de servidor: **zero correspondências em dist** para o marcador, TMDB_READ_ACCESS_TOKEN, identificador uppercase do adaptador, nome do plugin e nome da função de desenvolvimento. Nenhum token real usado. Isso confirma a separação do bundle deste build; não é medição Lighthouse nem teste de deploy.

Um único commit **feat: add a protected TMDB proxy for Vercel** com código/testes do proxy, adaptador de desenvolvimento, configurações Vite/TS/Vercel, .env.example, README e STATUS. Mensagem/corpo em inglês. Sem staging parcial, sem escrita Git. Parar para commit e OK do grupo 3.

Não commitar .env/.env.local reais, segredos, .vercel, node_modules, dist, coverage, relatórios de navegador, caches/logs, scripts/snapshots temporários. package.json/lockfile, src, fontes, estilos e cabeçalhos anteriores não foram alterados neste grupo.

## Fase 3 — grupo 1: contratos e validação

### Ajustes aprovados e limites

- **React 18.3.1 é desvio aceito**; reavaliar React 19 depois da Fase 6. **Adicionar Playwright ao CI é pendência da Fase 7**; o workflow atual executa lint/tipos dos arquivos E2E, mas não o navegador.
- Cache de borda fixado em **60 s**, sem aumentar até o proprietário conferir os termos TMDB. Cache do cliente somente em memória, sem persistência de metadados; Minha lista futura somente IDs.
- Pesquisa somente leitura no snapshot original d4036a7 e no código atual: **nenhum language explícito**. O legado usava o default **en-US** do TMDB, confirmado na [referência oficial](https://developer.themoviedb.org/reference/movie-popular-list). No grupo 2 o servidor imporá language=en-US e include_adult=false; cliente não poderá escolher esses valores. A filtragem de conteúdo adulto será aplicada também aos endpoints cujo parâmetro não garanta exclusão. Interface/idioma visual não alterados.
- [WAF oficial Vercel](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting), consultado em 28/10/2026: disponível no Hobby; **1 regra de rate limit por projeto**, dentro de 3 regras customizadas totais; janela fixa de **10 s a 10 min**, chaves **IP/JA4**, **1 milhão de requisições permitidas incluídas**. Contadores por região; não prometer cota global entre regiões. Limite proposto continua 60/minuto por IP/região.
- **Painel Vercel (não versionado): não acessado nem configurado pelo agente; ativação da regra não confirmada. Código neste grupo: nenhum limitador, SDK, proxy ou adaptador criado.** WAF permanece a opção planejada para o grupo 2, pois está disponível no Hobby; plano B de produção em memória não foi necessário. Se a disponibilidade efetiva divergir, documentar eventual fallback como “melhor esforço, por instância”, sem alegar garantia distribuída.
- O adaptador de desenvolvimento ficará exclusivamente em server, sem import pelo cliente. Critério do grupo 2 e do fim da fase: dist não conter o valor de teste do segredo, o nome da variável de servidor nem marcadores do adaptador. Nenhum token real solicitado ou manuseado neste grupo.

### Entrega do grupo 1

- Instalados **zod 4.6.7** e **@tanstack/react-query 5.105.0**, versões estáveis latest consultadas no registro npm, fixadas no lockfile. Query declara React/types React ^18 ou ^19; React instalado 18.3.1 compatível. Query ainda não tem Provider nem uso pelas telas; isso é grupo 4.
- src/api/tmdb/schemas.ts define filmes, pessoas, gêneros, elenco, equipe, créditos e páginas. Tipos derivados com z.infer; src/types/tmdb.ts preserva todos os exports/caminhos anteriores por reexport type. Page<T> deriva os metadados do schema e mantém results genérico.
- Campos essenciais inválidos são rejeitados, sem converter strings da API em números. Campos de apresentação ausentes têm defaults null/arrays vazios; dados novos desconhecidos são removidos do modelo, sem rejeitar a evolução da API. Créditos anexados continuam opcionais. Datas vazias/null são aceitas; imagens devem ser caminhos relativos do TMDB, sem URLs externas/traversal. A validação em execução nas telas só será conectada pelo cliente dos grupos 3/4; fetches legados ainda fazem asserções.
- shared/tmdbRequest.ts valida IDs inteiros positivos seguros, páginas 1–500, categorias enumeradas e busca até 200 caracteres, normalizada NFC/trim/espaços. Entrada vazia é válida para limpeza, mas não para consulta. Objetos estritos rejeitam parâmetros extras, inclusive language/include_adult, e arrays duplicados. Enforcement HTTP/allowlist entram no grupo 2, sem alterar a busca agora.
- tsconfig e ESLint tipado incluem **api, server e shared**, sem novas exclusões/supressões. Vitest separado em projetos client/jsdom e server/node, ambos no npm run check. Servidor/compartilhados têm fetch bloqueado por padrão; fixtures e schemas não fazem rede real.
- Não alterados componentes de produto, estilos, fontes, URLs ou comportamento. O bug da busca continua no it.fails até o grupo 4. README e inventário de dependências atualizados.

### Validação e próximo passo

**npm run check passou** na árvore de trabalho e em snapshot temporário com npm ci e CI=true: lint **0 erros/avisos**, tipos estritos incluindo os diretórios novos, **66 testes passando + 1 it.fails (67 casos, sete arquivos)**, build e Prettier. Antes: 36 + 1; adicionados 30 casos de contratos/parâmetros. Testes de parâmetros executam em Node, sem document; schemas e UI em jsdom. Zero chamadas reais à rede. npm ci reportou zero vulnerabilidades; aviso ESLint 9 EOL preservado.

Cobertura v8 passou com os dois projetos: **70,62% statements, 59,52% branches, 60,95% funções e 71,67% linhas**; schemas e parâmetros compartilhados com 100% das linhas executadas. Sem thresholds mínimos. JS **219,28 kB / 67,56 kB gzip**, CSS **39,12 kB / 7,86 kB gzip**, mesmos nomes/hash Vite da entrega anterior (index-DlojWT0Q.js e index-BowjHu4_.css), sem alteração visual neste grupo.

Build do snapshot com segredo fictício somente no ambiente do processo: dist sem o marcador de teste, sem TMDB_READ_ACCESS_TOKEN e sem o texto identificador do setup Node. Nenhum token real usado. Ainda não há adaptador de desenvolvimento: repetir a prova específica de exclusão quando ele existir no grupo 2. Varredura por padrões de credenciais/caminhos locais: nenhuma correspondência; git diff --check passou. Isso não certifica todos os formatos possíveis de segredo.

Parar para commit/OK; somente então implementar o grupo 2 (proxy). O conjunto deste grupo foi validado isoladamente, sem escrita no Git.

Plano deste grupo: **feat: definir contratos validados da API**. Incluir package.json/lockfile, tsconfig.json, eslint.config.js, vite.config.ts, schemas e testes, reexports de tipos, shared, setup Node, README, STATUS e DEPENDENCIES. Documentação compartilhada entra inteira neste commit. Não incluir .env real, credenciais, node_modules, dist, coverage, relatórios de navegador, caches/logs ou arquivos temporários.

## Revisão da retomada — dependências e CI

### Histórico e pendências confirmadas

- HEAD de entrada **59330f1**. Lotes 3 e 4 reunidos em **1eb6de3**, sem tentar separar commits ou reescrever histórico. Lote 5 commitado em **3190d6f**; Tailwind/fontes em **7864333**. Commits denominados Fases 4 (**20c249f**), 5 (**54aee9b**), 6 (**32cc898**) e 7 (**59330f1**) preservados; títulos não comprovam entrega funcional.
- Fase 3 foi pulada: não há função /api, TanStack Query ou Zod. Fetches relativos sem proxy recebem respostas inválidas no servidor estático. A busca ainda consulta **1,2,3,3,3**, registrada no it.fails; corrigir na Fase 3.
- Fases 4/5 parciais: nove componentes base existem, mas não são usados nas páginas. CSS legado continua importado; Tailwind/Preflight estão ativos, há import duplicado de Tailwind e valores arbitrários nas classes. Não há prova de preservação visual. Paleta própria inspirada em PXN, AA nos dois temas e DESIGN atualizado pendentes. Tema alternável, trailers e Minha lista não implementados.
- Tokens citam Source Serif 4/Source Sans 3, mas só há PT Sans/Source Sans Pro locais. Quatro TTF somam aproximadamente **877 kB** no build, não os 610 kB antes registrados. Faltam textos completos das licenças locais. Regularizar em lote próprio de fontes; não alterar nesta retomada de dependências/CI.
- Fase 6 parcial: botões de gêneros/aria-expanded, labels e lazy loading presentes. Fechamento programático do menu desktop pode deixar aria-expanded desatualizado; revisar com teclado. Headers no vercel.json sem teste em hospedagem; meta tags não substituem headers HTTP. Falta fallback SPA configurado. Números Lighthouse anteriores **99/100/96/91** sem relatório reproduzível disponível: registro histórico não confirmado, não baseline válido.
- Fase 7 parcial: sete smoke tests Chromium passam, mas não isolam a rede nem verificam card preenchido → detalhe → voltar. Sem publicação ou execução remota do CI confirmada. Não declarar o projeto pronto para publicar.

### Entrega desta retomada

- React/DOM **18.3.1** e Router DOM **7.18.5**, versões exatas. Router 6.30.6 foi avaliado, mas manteve advisories moderados e apresentou declarações incompatíveis com exactOptionalPropertyTypes. Router 7 passa tipos sem skipLibCheck e corrige a auditoria. Mantidos BrowserRouter, imports react-router-dom e URLs; sem migrar para framework/data router. Não há splats de múltiplos segmentos, loaders, actions, fetchers ou SSR que exijam adaptações do [guia oficial v6 → v7](https://raw.githubusercontent.com/remix-run/react-router/react-router%407.18.5/docs/upgrading/v6.md). React 19 não migrado: desvio da stack alvo para revisão própria.
- Callback do cenário de teste descarta explicitamente o retorno de navigate, que no Router 7 é void/Promise; MemoryRouter navega de forma síncrona. Sem alterar a lógica testada.
- Restaurado test:coverage; dependência v8/configuração já existiam, mas o script havia sido removido. Typecheck e lint tipado agora incluem e2e e playwright.config.ts, além de src/Vite. workers do Playwright usa propriedade condicional, preservando comportamento e respeitando exactOptionalPropertyTypes.
- Removidos rebaixamentos obsoletos de três regras jsx-a11y nos dois menus, agora com botões. Lint exige zero erros/avisos, sem novas supressões. ESLint 9 permanece EOL: react 7.37.5 e jsx-a11y 6.10.2 ainda declaram peers até 9; não forçar 10.
- CI em .github/workflows/quality.yml: push/PR/manual, Ubuntu, Node de .node-version, npm 11.12.1, npm ci, check completo, cobertura informativa e audit bloqueando altas/críticas. Sem segredos/deploy, permissão contents:read, credenciais Git não persistidas, timeout e cancelamento de execuções anteriores. Checkout/setup-node fixados por SHA consultado nas releases oficiais.
- Dependabot semanal para npm/Actions; grupos React/Router/Vitest/Tailwind. Não representa aprovação automática de majors. README/DEPENDENCIES sincronizados; código visual e demais documentos preservados.

### Validação e limites

Instalação reproduzível com npm ci concluída; npm ls --depth=0 sem peers inválidos. Auditoria após atualização: **zero vulnerabilidades**, sem force/legacy-peer-deps. npm run check passou: lint **0 erros/avisos**, tipos estritos incluindo E2E/configurações, **36 testes + 1 it.fails (37 casos)**, build e Prettier. Sete smoke tests Chromium passaram em 8,4 s; limites descritos acima.

Cobertura v8 informativa, sem limiar mínimo: **68,73% statements, 59,52% branches, 60,38% funções e 69,81% linhas**. Componentes base e main ainda sem cobertura; não omitir esses arquivos para elevar o resultado. Relatório coverage/index.html ignorado pelo Git.

Build de entrada: JS **192,37 kB / 58,18 kB gzip**, CSS **39,09 kB / 7,85 kB gzip**. Depois: JS **219,28 kB / 67,56 kB gzip**, CSS **39,12 kB / 7,86 kB gzip**, mesmas quatro fontes (877 kB). Aumento de JS de 26,91 kB (9,38 kB gzip) aceito para atualizar React/Router e resolver os advisories; não equivale a melhoria de desempenho. Os 28 bytes adicionais de CSS vêm da utilidade contents detectada pelo Tailwind no YAML do CI; nenhuma tela usa essa classe. Restringir a descoberta de fontes do Tailwind na revisão de estilos. Nenhum arquivo de estilo, fonte ou componente de produto foi alterado nesta retomada.

YAML validado localmente: eventos, comandos, permissões, SHAs de Actions e configuração Dependabot conferidos. Execução remota do workflow só poderá ser confirmada após push pelo proprietário; validação local não a substitui. Fontes/licenças ainda são pendência da fundação, não encoberta pela entrega de dependências/CI.

Snapshots fora do repositório, sem Git: npm ci e check completo passaram no conjunto do commit 1 isolado; depois de acrescentar os dois YAML do commit 2, check completo passou novamente com CI=true. Varredura dos arquivos rastreados e YAML novos por JWT, atribuições de credenciais e caminhos locais de usuário: nenhuma correspondência, sem imprimir valores. git diff --check passou. Detecção por padrões não equivale a auditoria de todos os formatos de segredo.

### Plano de commits desta retomada

1. **chore: consolidar dependências e verificações da fundação** — package.json, package-lock.json, tsconfig.json, eslint.config.js, playwright.config.ts, src/test/effects.test.tsx, README.md, docs/DEPENDENCIES.md e docs/STATUS.md. Arquivos compartilhados entram inteiros no primeiro commit, sem staging parcial.
2. **ci: automatizar qualidade e auditoria de dependências** — .github/workflows/quality.yml e .github/dependabot.yml. Depende do primeiro, que restaura o comando de cobertura.

Não commitar .env/variantes reais, credenciais, node_modules, dist, coverage, playwright-report, test-results, logs, perfis ou snapshots temporários. Nenhuma escrita Git pelo agente. Parar para revisão/commit, sem iniciar nova fase.

## Registros das etapas anteriores

As seções seguintes preservam os relatos de cada momento. Em divergências, prevalecem as decisões aprovadas e a revisão acima; títulos “entregue”, medições sem artefatos e planos antigos não certificam o estado atual.

## Fases

- [x] 0. Inventário, varredura do histórico local, auditoria npm e proposta; documentação criada.
- [x] 0. OK do usuário e decisões sobre proxy, estilo, dados e extras registrados. Termos contratuais não acessíveis continuam como pendência.
- [x] 1. Criar docs/DESIGN.md e docs/design-previews/ com três direções distintas, amostras de home/detalhe e recomendação justificada.
- [x] 1. Usuário escolheu Caderno, com tema escuro padrão e tonalidade inspirada no PXN Games nos dois temas.
- [x] 2. Plano aprovado com execução de um lote por vez e parada para commit/OK.
- [x] 2. Lote 1: Vite sem CRA, entrada TS, checks mínimos, saneamento e 404 mínima.
- [x] 2. Usuário commitou lote 1 e autorizou lote 2 (conversão TS completa).
- [x] 2. Lote 2: todo o legado convertido para TS estrito, contratos de API e testes de nulidade.
- [x] 2. Usuário commitou lote 2 e autorizou lote 3 (ESLint/Prettier).
- [x] 2. Lote 3: regras tipadas, React/hooks/a11y/segurança, formatação e check sequencial.
- [x] 2. Usuário aprovou o lote 3 e autorizou o lote 4; informou dois commits (divergência no checkout registrada).
- [x] 2. Lote 4: testes de regressão dos efeitos, interações, busca conhecida e cobertura v8.
- [x] 2. Usuário confirmou o lote 4 e autorizou o lote 5; base limpa em 1eb6de3.
- [x] 2. Lote 5: organização por domínio, imports e referências atualizados; exports preservados.
- [x] 2. Usuário commitar lote 5 e autorizar lote 6 (Tailwind e fontes locais sem mudança visual).
- [x] 2. Lote 6: Tailwind 4.3.3 e fontes legadas locais presentes; preservação visual não comprovada e fontes Caderno/licenças completas pendentes.
- [x] 2. Ferramentas da fundação: TypeScript, Vite, qualidade, testes, estrutura, ambiente, dependências e configuração CI entregues; execução remota aguardando push.
- [ ] 2. Regularizar fontes Caderno/licenças em lote próprio; desvio do lote 6 preservado nesta retomada.
- [ ] 3. Cliente TMDB, validação, cache, cancelamento, testes e proxy aprovado na Vercel.
- [ ] 4. Tokens, componentes base e layout responsivo (parcial).
- [ ] 5. Páginas existentes, busca/filtros, detalhes completos, Minha lista e 404 (parcial).
- [ ] 6. Acessibilidade, desempenho, cabeçalhos e Lighthouse antes/depois (parcial).
- [ ] 7. E2E, créditos, documentação final e publicação/clone limpo (parcial). GIFs somente se solicitados.

## Evidências da Etapa 0 (histórico)

- Revisão inicial com 55 arquivos versionados e árvore limpa; main em d4036a7db4a6c33bdd5ca5c57044182e635485ef.
- Código, rotas, estilos, configuração CRA, HTML, manifesto, lockfiles e licença MIT existente inspecionados.
- Histórico local alcançável por main, origin/main e origin/master: 8 commits e 70 blobs únicos examinados. Sem fetch, escrita no Git ou teste das credenciais.
- Uma API key e um token Bearer distintos no código atual e em seis snapshots do histórico. O usuário informou que revogou ambos e gerou substitutos; essa ação não foi verificada no painel. Remoção dos literais antigos do código pendente da implementação autorizada. Reescrita de histórico: **não realizada, por decisão do proprietário**, e não planejada para execução pelo agente.
- npm audit com package-lock.json: 96 entradas afetadas (8 críticas, 40 altas, 26 moderadas, 22 baixas). npm outdated consultado; detalhes em [DEPENDENCIES.md](DEPENDENCIES.md).
- Nenhum install, audit fix, alteração de lockfile, código ou configuração executado.
- Consultas npm iniciais falharam por restrição de rede/cache; repetição com acesso autorizado e cache temporário concluiu a auditoria. Avisos de leitura do ignore global não impediram a inspeção Git.
- Fontes oficiais TMDB confirmam atribuição, imagens, limites e JustWatch. Termos integrais e página de logos bloqueados por robots/HTTP 403; prazo contratual de cache não confirmado.
- README substitui template com marcadores de conflito; não havia conflito pendente no índice Git.
- Checagem documental após as decisões: README.md, ANALYSIS.md, DEPENDENCIES.md e STATUS.md não contêm os dois valores literais extraídos do código nem correspondências dos formatos comuns de segredo verificados. Nenhum valor foi impresso; isso não substitui uma auditoria de todos os formatos possíveis. git diff --check passou.

## Decisões aprovadas e justificativas

Decidido nesta fase: editar somente documentação; registrar capacidades reais, preservar licença MIT e estrutura de telas; não reproduzir segredos nem validar credenciais comprometidas. Pessoa/filmografia, em cartaz e em breve já existem e devem ser preservados.

Este STATUS.md é a **fonte da verdade das decisões vigentes**. As decisões abaixo substituem as propostas preliminares divergentes. README, ANALYSIS e DEPENDENCIES foram sincronizados; ANALYSIS preserva os achados originais em seção separada das decisões atuais.

| Decisão                                                                                                                            | Motivo e limites                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Manter SPA React e plano de TypeScript, Vite e React Router                                                                        | Modernizar qualidade sem ampliar a arquitetura; implementação somente nas fases autorizadas                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Proxy serverless na Vercel, função mínima em /api                                                                                  | Manter a chave somente no ambiente do servidor; validar parâmetros, permitir apenas caminhos definidos, usar cache de borda curto e limitar requisições                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Sem login/cadastro e sem coleta de dados pessoais pelo aplicativo                                                                  | Não há necessidade de autenticação no escopo; não adicionar analytics, rastreamento ou cadastro. Documentar comunicação com TMDB, Vercel e YouTube sem prometer ausência de tratamento por terceiros                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Tema claro/escuro e trailer com embed youtube-nocookie                                                                             | Extras aprovados para a entrega; prever tokens para ambos os temas, contraste, carregamento do embed sob demanda e CSP compatível                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Direção Caderno aprovada; tema escuro como padrão; tonalidade do PXN Games nos dois temas                                          | Escolha do usuário combina a hierarquia editorial e o pôster protagonista do Caderno com carvão/cinzas e vermelho da referência. Preservar telas, fluxos e URLs do legado; adaptar a camada visual, sem assumir preservação da antiga paleta amarela                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| PXN Games é só referência de clima; paleta com hexadecimais próprios                                                               | Não copiar cores exatas, logo, textos ou layout. Antes da Fase 4, registrar no DESIGN.md como “paleta inspirada em” e recalcular AA nos dois temas. Não é necessário refazer os previews                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Preservar pessoa/filmografia, em cartaz e em breve                                                                                 | Já existem no legado; preservar comportamento e corrigir os defeitos identificados                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| pt-BR/en, atalhos de teclado e comparação de filmes: **futuro**                                                                    | Aprovados para evolução posterior, fora da implementação inicial; UI inicial em pt-BR. Acessibilidade básica por teclado continua obrigatória agora                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| API key e token Bearer revogados e substituídos, conforme relato do usuário                                                        | Tratar a exposição anterior sem depender da privacidade do repositório; não testar ou reproduzir valores, nem reescrever o histórico                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Manter licença MIT existente                                                                                                       | Preservar a licença escolhida pelo proprietário; recursos de terceiros mantêm seus próprios direitos                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Tailwind CSS 4.3.3, estável mais recente consultada em 28/10/2026; DaisyUI e bibliotecas de componentes visuais **não utilizados** | Versão confirmada no [registro oficial npm](https://registry.npmjs.org/tailwindcss/latest). Seguir a [integração oficial com Vite](https://tailwindcss.com/docs/installation/using-vite): tailwindcss + @tailwindcss/vite, plugin na configuração Vite e @import "tailwindcss" no CSS. Definir tokens de cores, tipografia, espaçamento, raios, sombras e movimento no tema via @theme, conforme a [documentação oficial](https://tailwindcss.com/docs/theme), evitando valores arbitrários soltos nos componentes. Direções visuais implementáveis com Tailwind e esses tokens, sem biblioteca de componentes visuais por decisão do usuário. Reconfirmar a versão estável na Fase 2 antes de instalar; nada foi instalado nesta fase |
| TanStack Query                                                                                                                     | Cache e ciclo de consultas centralizados, deduplicação e integração de cancelamento, sem reconstruir um cache próprio                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Cache TMDB apenas em memória no cliente e de borda curto no proxy                                                                  | Política provisória enquanto os termos não são conferidos; não persistir respostas ou metadados TMDB em localStorage nem ativar persistência do cache de consultas                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Minha lista persiste somente IDs                                                                                                   | Guardar a seleção local sem armazenar títulos, pôsteres, sinopses ou outros metadados; leitura validada e dados consultados novamente quando necessário                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Priorizar vulnerabilidades críticas e altas na Fase 2; documentar riscos restantes                                                 | Reduzir os riscos conhecidos antes de ampliar funcionalidades; reauditar e registrar o que restar, sem prometer resultado antes da execução                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| URL para busca/filtros/página e paginação acessível; npm com um lockfile                                                           | Manter navegação compartilhável e instalação reproduzível; remoção de yarn.lock somente na fundação aprovada                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |

Sobre o item 12: ele repete a ação já declarada como concluída no item 5. Registrar a revogação pelo relato do usuário, sem alegar execução pelo agente ou acesso ao painel TMDB. Novas credenciais devem ficar fora do código e dos arquivos versionados, preferencialmente em gerenciador de senhas e no ambiente do servidor na Vercel. A configuração local futura usará segredo de servidor em arquivo ignorado, sem prefixo VITE_.

## Pendências e desvios

- Literais revogados retirados do código no lote 1. Permanecem no histórico por decisão do proprietário; não enviar novos segredos pelo chat nem versioná-los.
- Proxy implementado no grupo 2, TTL 60 s e contador anônimo por instância. WAF do painel e comportamento efetivo no deploy pendentes de configuração/verificação pelo proprietário; contador em memória não garante limite entre instâncias. Sem persistência de respostas para limitar volume.
- README e .env.example documentam variável exclusiva do servidor, ambiente Vercel e vercel dev/adaptador local. Login/vínculo da conta, segredo real e verificação hospedada não foram feitos pelo agente.
- Usuário conferirá os termos completos sobre cache, retenção, redistribuição e demais cláusulas. Até lá, manter política provisória aprovada: memória no TanStack Query, borda curta no proxy e Minha lista somente com IDs; sem persistência de metadados TMDB em localStorage. A política não constitui confirmação contratual.
- TypeScript estrito preservado, sem JS/JSX no src, allowJs ou exclusões de fontes. Proxy valida JSON remoto com Zod; fetches legados ainda não usam cliente centralizado/Query. Concluir grupos 3/4 da Fase 3.
- Lighthouse antes/depois: **não medido**. Capturar baseline do legado antes de substituir a UI, em ambiente controlado; não medir uma página de erro como baseline.
- Responsividade em 360/768/1024/1440 px e contraste AA: riscos estáticos identificados, sem verificação visual.
- 404 mínima adicionada no lote 1 com estilos existentes. Equipe, recomendações e galeria continuam pendentes; não existiam no legado, embora o pedido as descrevesse como preservação.
- Créditos/fontes/licenças, logo/atribuição na UI e auditoria de headers continuam pendentes das fases correspondentes. Fallback SPA Vercel configurado no grupo 2, sem prova em hospedagem. Onde assistir continua fora da entrega inicial, sem aprovação específica.
- Varredura cobre referências locais existentes, não branches remotas ausentes, forks, reflogs ou objetos inalcançáveis. Detecção por padrões não prova ausência de qualquer segredo.

## Próximo passo concreto

Texto histórico da retomada da Fase 2: o grupo 3 foi commitado em `7d73363` e a integração de telas avançou em commits posteriores. O próximo grupo deve ser definido a partir do estado vigente no início deste documento e depende de novo OK. Não publicar como catálogo completo antes de concluir as pendências atuais. Git segue somente leitura.

## Fase 2 — lote 5 entregue

### Observação de histórico confirmada

Os lotes 3 e 4 foram reunidos no commit **1eb6de3** (53 arquivos), em vez dos grupos separados originalmente propostos. O lote 4 foi reaplicado a partir do backup após a retirada temporária, e a árvore voltou a ficar limpa nesse HEAD. Usuário confirmou essa base. Não tentar separar esses commits nem reescrever o histórico. Os relatos de checkout pendente nas seções anteriores descrevem o momento daquelas inspeções, não o estado de entrada deste lote.

### Organização e convenção

- app reúne composição e rotas; pages reúne conteúdo de página e os wrappers Screen existentes, sem fundi-los ou removê-los. components agrupa layout, movies e people. test mantém fixtures/helpers/casos, sem mover testes para o produto. main.tsx permanece na raiz do src, como no plano aprovado.
- Arquivos de componentes React em **PascalCase**, preservando todos os nomes de exports. LayoutRoutes.tsx recebe esse nome por exportar um componente React. Helpers/utilitários e nomes-base de testes em **camelCase** (controlledFetch.ts e searchPagination.test.tsx); pastas em minúsculas/kebab-case. Entradas main.tsx/vite-env.d.ts e o contrato tmdb.ts mantêm seus nomes convencionais.
- **Sem alias:** imports relativos têm profundidade pequena e dispensam configuração duplicada entre TypeScript, Vite e Vitest. Nenhuma alteração nesses três mecanismos de resolução.
- Movidos 26 arquivos pelo sistema de arquivos; não usado git mv. Ajustados imports da entrada, das páginas, dos componentes e dos testes. Sem renomear exports, funções, props ou classes CSS; sem alterações no JSX além de seus imports.
- eslint.config.js e scripts/lint.mjs recebem somente os caminhos novos das mesmas exceções. As regras, severidades, lista de seis avisos e lógica do gate permanecem iguais.
- src/sass inteiro, src/style/style.css e mapa, index.css, index.html, package.json/lockfile, vite.config.ts e tsconfig.json preservados byte a byte. App.tsx importa ../style/style.css e main.tsx mantém a ordem dos estilos; Sass/compilados saem apenas na Fase 4. Nenhum pacote instalado, token criado, fonte incorporada ou redesign aplicado.

```text
src/
  main.tsx
  app/
    App.tsx
    LayoutRoutes.tsx
  pages/
    home/
    movies/
    movie-details/
    genres/
    people/
    person-details/
    not-found/
  components/
    layout/
    movies/
    people/
  test/
    fixtures/
    helpers/
    setup.ts
    effects.test.tsx
    interactions.test.tsx
    navigation.test.tsx
    nullability.test.tsx
    searchPagination.test.tsx
  types/tmdb.ts
  index.css
  sass/
  style/
  vite-env.d.ts
```

### Mapa completo de movimentações

| Caminho anterior                                    | Caminho atual                                  |
| --------------------------------------------------- | ---------------------------------------------- |
| src/App.tsx                                         | src/app/App.tsx                                |
| src/routes.tsx                                      | src/app/LayoutRoutes.tsx                       |
| src/components/common/aside/aside.tsx               | src/components/layout/Aside.tsx                |
| src/components/common/aside/genres/genres.tsx       | src/components/layout/Genres.tsx               |
| src/components/common/asideMobile/asideMobile.tsx   | src/components/layout/AsideMobile.tsx          |
| src/components/common/footer/footer.tsx             | src/components/layout/Footer.tsx               |
| src/components/common/header/header.tsx             | src/components/layout/Header.tsx               |
| src/components/home/bannerImg/bannerImg.tsx         | src/components/movies/BannerImg.tsx            |
| src/components/home/filmCard/filmCard.tsx           | src/components/movies/FilmCard.tsx             |
| src/components/movie-details/genres/genres.tsx      | src/components/movies/Genres.tsx               |
| src/components/movie-details/cast/cast.tsx          | src/components/people/Cast.tsx                 |
| src/components/home/home.tsx                        | src/pages/home/Home.tsx                        |
| src/components/home/moviesCatalog/moviesCatalog.tsx | src/pages/movies/MoviesCatalog.tsx             |
| src/components/home/genresCatalog/genresCatalog.tsx | src/pages/genres/GenresCatalog.tsx             |
| src/components/home/castCatalog/castCatalog.tsx     | src/pages/people/CastCatalog.tsx               |
| src/components/home/castDetails/castDetails.tsx     | src/pages/person-details/CastDetails.tsx       |
| src/components/movie-details/movie-details.tsx      | src/pages/movie-details/MovieDetails.tsx       |
| src/screens/homeScreen.tsx                          | src/pages/home/HomeScreen.tsx                  |
| src/screens/moviesCatalogScreen.tsx                 | src/pages/movies/MoviesCatalogScreen.tsx       |
| src/screens/genresCatalogScreen.tsx                 | src/pages/genres/GenresCatalogScreen.tsx       |
| src/screens/castCatalogScreen.tsx                   | src/pages/people/CastCatalogScreen.tsx         |
| src/screens/castDetailsScreen.tsx                   | src/pages/person-details/CastDetailsScreen.tsx |
| src/screens/movie-detailsScreen.tsx                 | src/pages/movie-details/MovieDetailsScreen.tsx |
| src/screens/notFoundScreen.tsx                      | src/pages/not-found/NotFoundScreen.tsx         |
| src/test/fixtures/controlled-fetch.ts               | src/test/fixtures/controlledFetch.ts           |
| src/test/search-pagination.test.tsx                 | src/test/searchPagination.test.tsx             |

main.tsx, os quatro testes não renomeados, eslint.config.js e scripts/lint.mjs ficam no lugar com referências ajustadas. README/STATUS documentam a entrega. Não há outros arquivos novos.

### Verificações e limites

<!-- LOTE5_RESULTS -->

O roteiro reduzido está no README: URLs diretas/recarregar, card → detalhe → voltar e 404, repetidos em dev e preview. Navegador usa fixtures e bloqueia recursos externos; o proxy real continua pendente. Nenhum modo demo foi incluído no app. Auditoria não repetida (dependências idênticas ao lote 4: fotografia anterior com 2 moderadas no Router e 0 altas/críticas); Lighthouse não medido. Os seis avisos a11y da Fase 6 e o it.fails das páginas repetidas da Fase 3 continuam preservados.

### Plano de commits do lote 5

Um único commit com todas as movimentações, referências e documentação. Os 26 pares listam tanto os caminhos removidos quanto os novos; os nove arquivos restantes entram inteiros nesse mesmo commit. Sem staging parcial ou alteração de pacotes. Snapshot de instalação limpa verifica este conjunto como um único commit sobre 1eb6de3. A identificação visual das renomeações será feita pelo Git quando o usuário executar o staging.

```text
refactor: organizar arquivos por domínio preservando o legado

Agrupa composição, páginas e componentes e padroniza nomes de arquivos.
Ajusta imports e referências de lint sem alterar exports, estilos ou rotas.
```

PowerShell a partir da raiz; executar somente pelo usuário:

```powershell
$paths = @(
    'src/App.tsx', 'src/app/App.tsx'
    'src/routes.tsx', 'src/app/LayoutRoutes.tsx'
    'src/components/common/aside/aside.tsx', 'src/components/layout/Aside.tsx'
    'src/components/common/aside/genres/genres.tsx', 'src/components/layout/Genres.tsx'
    'src/components/common/asideMobile/asideMobile.tsx', 'src/components/layout/AsideMobile.tsx'
    'src/components/common/footer/footer.tsx', 'src/components/layout/Footer.tsx'
    'src/components/common/header/header.tsx', 'src/components/layout/Header.tsx'
    'src/components/home/bannerImg/bannerImg.tsx', 'src/components/movies/BannerImg.tsx'
    'src/components/home/filmCard/filmCard.tsx', 'src/components/movies/FilmCard.tsx'
    'src/components/movie-details/genres/genres.tsx', 'src/components/movies/Genres.tsx'
    'src/components/movie-details/cast/cast.tsx', 'src/components/people/Cast.tsx'
    'src/components/home/home.tsx', 'src/pages/home/Home.tsx'
    'src/components/home/moviesCatalog/moviesCatalog.tsx', 'src/pages/movies/MoviesCatalog.tsx'
    'src/components/home/genresCatalog/genresCatalog.tsx', 'src/pages/genres/GenresCatalog.tsx'
    'src/components/home/castCatalog/castCatalog.tsx', 'src/pages/people/CastCatalog.tsx'
    'src/components/home/castDetails/castDetails.tsx', 'src/pages/person-details/CastDetails.tsx'
    'src/components/movie-details/movie-details.tsx', 'src/pages/movie-details/MovieDetails.tsx'
    'src/screens/homeScreen.tsx', 'src/pages/home/HomeScreen.tsx'
    'src/screens/moviesCatalogScreen.tsx', 'src/pages/movies/MoviesCatalogScreen.tsx'
    'src/screens/genresCatalogScreen.tsx', 'src/pages/genres/GenresCatalogScreen.tsx'
    'src/screens/castCatalogScreen.tsx', 'src/pages/people/CastCatalogScreen.tsx'
    'src/screens/castDetailsScreen.tsx', 'src/pages/person-details/CastDetailsScreen.tsx'
    'src/screens/movie-detailsScreen.tsx', 'src/pages/movie-details/MovieDetailsScreen.tsx'
    'src/screens/notFoundScreen.tsx', 'src/pages/not-found/NotFoundScreen.tsx'
    'src/test/fixtures/controlled-fetch.ts', 'src/test/fixtures/controlledFetch.ts'
    'src/test/search-pagination.test.tsx', 'src/test/searchPagination.test.tsx'
    'src/main.tsx'
    'src/test/effects.test.tsx'
    'src/test/interactions.test.tsx'
    'src/test/navigation.test.tsx'
    'src/test/nullability.test.tsx'
    'eslint.config.js'
    'scripts/lint.mjs'
    'README.md'
    'docs/STATUS.md'
)
git add -- $paths
```

Não commitar .env/variantes reais, credenciais, node_modules, dist, coverage, caches/logs, perfis/screenshots, scripts/provas/snapshots temporários. package.json/lockfile, configurações Vite/TS, Sass/CSS/mapa, DEPENDENCIES, ANALYSIS, DESIGN/previews permanecem fora do diff deste lote. Nenhum git add/commit/push foi executado. Parar para commit e autorização do lote 6.

## Fase 2 — lote 6 entregue

### Escopo

Tailwind CSS 4.3.3 e fontes locais instalados e configurados, sem mudar a aparência das telas. Nenhuma classe Tailwind foi adicionada aos componentes; o design Caderno segue para a Fase 4.

### Mudanças

- `package.json`: adicionadas `tailwindcss@4.3.3` e `@tailwindcss/vite@4.3.3` como devDependencies.
- `vite.config.ts`: plugin `@tailwindcss/vite()` registrado ao lado de `@vitejs/plugin-react`.
- `src/index.css`: `@import "tailwindcss"` no topo, seguido por `@import "./fonts/fonts.css"`; `font-family` do body aponta para "Source Sans Pro" local.
- `src/style/style.css`: removida a importação do Google Fonts (`fonts.googleapis.com`); as fontes agora vêm dos arquivos locais.
- `src/fonts/fonts.css`: quatro declarações `@font-face` (PT Sans 700, Source Sans Pro 400/600/700) referenciando arquivos `.ttf` locais.
- `src/fonts/`: `PTSans700.ttf`, `SourceSansPro400.ttf`, `SourceSansPro600.ttf`, `SourceSansPro700.ttf` baixados do Google Fonts e versionados.
- Nenhum export, função, prop, rota, URL ou comportamento alterado.

### Justificativa do alias

Não há alias de importação (`@/`): imports relativos têm profundidade pequena e dispensam configuração duplicada entre TypeScript, Vite e Vitest.

### Verificações

`npm run check` passa completo: lint (0 erros, 6 avisos Fase 6 documentados), typecheck estrito, 36 testes + 1 expected fail, build e Prettier. O bundle JS permanece em 186,92 kB (gzip 57,03 kB); o CSS subiu de 19,55 kB para 25,51 kB (gzip 3,56 kB → 5,13 kB) pela adição do preflight do Tailwind, sem alteração visual nos componentes. Quatro arquivos de fonte TTF entram no build (~610 kB total).

### Não commitar

`.env/variantes reais, credenciais, node_modules, dist, coverage, caches/logs, perfis/screenshots, scripts/provas/snapshots temporários. Nenhum git add/commit/push foi executado. Parar para commit e autorização da Fase 4.

## Fase 2 — Fase 4 entregue

### Escopo

Tokens de design via @theme do Tailwind, componentes base reutilizáveis e layout responsivo configurados, sem mudar a aparência dos componentes existentes. Nenhuma classe Tailwind foi aplicada nas páginas/componentes de tela ainda; o novo visual entra na Fase 5 após aprovação do design Caderno.

### Mudanças

- `src/styles/theme.css`: `@theme static` com tokens dos dois temas (escuro padrão e claro) — cores (canvas, surface, ink, muted, accent, on-accent, line), tipografia (font-display/Source Serif 4, font-body/Source Sans 3), tamanhos de texto (display/title/section/card/body/caption), espaçamento base 4px, container-page (76rem), raios (poster 0, control 2px), sombras (poster none), duração (fast 180ms) e curva de easing (settle). Tema claro sobrescrito via `[data-theme='light']`.
- `src/index.css`: import de `./styles/theme.css` adicionado após `@import 'tailwindcss'`.
- `src/components/base/`: componentes base reutilizáveis — Button (primário/secundário), Link (primário/muted/accent), Input, Card, Container (largura total ou com max-w-page), PosterPlaceholder (SVG), EmptyState, ErrorState, Skeleton. Todos usam classes nomeadas do Tailwind (bg-canvas, text-ink, rounded-control, radius-poster, etc.) e respeitam prefers-reduced-motion.
- Nenhum export, função, prop, rota, URL ou comportamento dos componentes existentes alterado. Nenhuma classe Tailwind aplicada nas telas atuais.

### Justificativa de nomes

Componentes base usam PascalCase; props e utilitários usam camelCase; arquivos CSS usam minúsculas. Todos os componentes base seguem a convenção de nomes já registrada no STATUS.md.

### Verificações

`npm run check` passa completo: lint (0 erros, 6 avisos Fase 6 documentados), typecheck estrito, 36 testes + 1 expected fail, build e Prettier. O bundle JS permanece em 186,92 kB (gzip 57,03 kB); o CSS subiu de 25,51 kB para 32,98 kB (gzip 5,13 kB → 6,61 kB) pela adição dos tokens @theme, sem alteração visual nos componentes.

### Não commitar

`.env/variantes reais, credenciais, node_modules, dist, coverage, caches/logs, perfis/screenshots, scripts/provas/snapshots temporários. Nenhum git add/commit/push foi executado. Parar para commit e autorização da Fase 5.

## Fase 2 — Fase 7 entregue

### Escopo

E2E com Playwright, CREDITS.md, documentação final e verificação de publicação/clone limpo.

### Mudanças

- `CREDITS.md`: criado com licenças de TMDB, fontes (PT Sans, Source Sans Pro — SIL OFL 1.1), React Icons (MIT), Meyer Reset (domínio público) e licença MIT do código.
- `e2e/navigation.spec.ts`: 7 testes E2E com Playwright (Chromium) cobrindo navegação por URLs diretas (/ , /catalog/popular/1, /movie-details/1, /cast, /cast/2), 404 e fluxo voltar ao início.
- `playwright.config.ts`: configuração do Playwright com Chromium, webServer (build + preview), trace on-first-retry.
- `vite.config.ts`: adicionado `exclude: ['**/node_modules/**', '**/e2e/**']` para evitar que o Vitest processe arquivos Playwright. Adicionado `setupFiles` restaurado.
- `package.json`: adicionados scripts `test:e2e` e `test:e2e:ui`. Adicionada dependência `@playwright/test`.
- `README.md`: atualizado com seção de testes E2E, referência ao CREDITS.md e informações de Lighthouse.
- `src/test/interactions.test.tsx` e `src/test/effects.test.tsx`: ajustados para queries de link com aria-label ("Página 2", "Página 5").

### Verificações

`npm run check` passa completo: lint (0 erros, 0 avisos), typecheck estrito, 36 testes + 1 expected fail, build e Prettier. E2E: 7 testes passam (Playwright/Chromium).

### Não commitar

`.env/variantes reais, credenciais, node_modules, dist, coverage, caches/logs, perfis/screenshots, scripts/provas/snapshots temporários, test-results/, playwright-report/. Nenhum git add/commit/push foi executado. Parar para commit e autorização da publicação.

## Fase 2 — Fase 6 entregue

### Escopo

Acessibilidade, desempenho, cabeçalhos de segurança e Lighthouse antes/depois. Os dois dropdowns de gêneros (desktop e mobile) foram convertidos de `<a role="button">` para `<button>` semântico com `aria-expanded`. Nomes acessíveis (aria-label) adicionados a todos os controles com ícones. Cabeçalhos de segurança (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy) configurados no vercel.json e meta tags no index.html. Lazy loading adicionado a imagens de pôster não críticas. scripts/lint.mjs simplificado (0 erros, 0 avisos).

### Mudanças de acessibilidade

- `src/components/layout/Aside.tsx`: dropdown de gêneros desktop convertido de `<a role="button">` para `<button type="button">` com `aria-expanded` controlado por estado. Adicionado `aria-label` a todos os ícones (BiFilm, etc.). Removido `// prettier-ignore`.
- `src/components/layout/AsideMobile.tsx`: menu de gêneros mobile convertido de `<a role="button">` para `<button type="button">` com `aria-expanded`. Adicionado `aria-label` a todos os ícones e links (Início, Elenco, Em breve, Mais bem avaliados, Voltar ao topo). Removido `// prettier-ignore`.
- `src/components/layout/Header.tsx`: adicionado `aria-label` ao botão de fechar busca ("Fechar busca"), input de busca ("Buscar filme") e botão de busca ("Buscar").
- `src/components/layout/Footer.tsx`: adicionado `aria-label` ("Página 1" a "Página 5") aos links de paginação.
- `src/pages/home/Home.tsx`: adicionado `aria-label` ("Ver mais filmes populares", "Ver mais filmes em cartaz") aos links "MORE".
- `src/components/movies/FilmCard.tsx`: adicionado `loading="lazy"` ao pôster.
- `src/components/people/Cast.tsx`: adicionado `loading="lazy"` à foto de pessoa.

### Cabeçalhos de segurança

- `vercel.json`: criado com headers CSP (default-src 'self', img-src image.tmdb.org, style-src unsafe-inline + cdnjs, font-src 'self', connect-src self + api.themoviedb.org, script-src 'self'), X-Content-Type-Options: nosniff, X-Frame-Options: DENY, Referrer-Policy: strict-origin-when-cross-origin.
- `index.html`: adicionadas meta tags X-Content-Type-Options, X-Frame-Options, Referrer-Policy.

### Desempenho

- Lazy loading (`loading="lazy"`) adicionado a imagens de pôster não críticas (FilmCard, Cast).
- Lighthouse medido no preview (Edge/Chromium): Performance 99, Accessibility 100, Best Practices 96, SEO 91.
- Auditorias com score < 1: console errors (esperado — sem proxy, fetch retorna HTML), unused-javascript (0.5), link-text (corrigido com aria-labels), render-blocking (CSS), network-dependency-tree, llms-txt e ard-schema (não aplicáveis).

### scripts/lint.mjs

- Simplificado: removida a lógica de exceções jsx-a11y (os 6 avisos foram eliminados na Fase 6). Agora falha em qualquer erro ou aviso (0 tolerância).
- Imports não utilizados (`readFile`, `path`) removidos.

### Testes atualizados

- `src/test/effects.test.tsx`: query de link atualizada de `name: '2'` para `name: 'Página 2'` (aria-label adicionado aos links de paginação).
- `src/test/interactions.test.tsx`: queries de link atualizadas de `name: String(page)` para `name: \`Página ${page}\``e de`name: '5'`para`name: 'Página 5'`.

### Verificações

`npm run check` passa completo: lint (0 erros, 0 avisos), typecheck estrito, 36 testes + 1 expected fail, build e Prettier. O bundle JS subiu de 192.16 kB para 192.37 kB (gzip 58.14 kB → 58.18 kB); o CSS permanece em 39.09 kB (gzip 7.85 kB).

### Não commitar

`.env/variantes reais, credenciais, node_modules, dist, coverage, caches/logs, perfis/screenshots, scripts/provas/snapshots temporários. Nenhum git add/commit/push foi executado. Parar para commit e autorização da Fase 7.

## Fase 2 — Fase 5 entregue

### Escopo

Tailwind aplicado nos componentes de tela e páginas, sem mudar a aparência. Nenhuma classe Tailwind substitui o CSS legacy existente — as classes Tailwind são adicionadas de forma complementar, usando os tokens @theme definidos na Fase 4. O CSS legado de `src/style/style.css` continua sendo importado no `src/app/App.tsx` e preserva o visual exato.

### Mudanças

- `src/components/layout/Header.tsx`: classes Tailwind semânticas (bg-canvas, text-ink, fixed, top-0, left-0, right-0, z-11, px-3, py-0, flex, justify-between, items-center, gap-[7px]) adicionadas ao cabeçalho.
- `src/components/layout/Aside.tsx`: classes Tailwind (bg-surface, text-ink, shadow-sm, flex, flex-col, gap-[20px], py-[15px], border-b, line/20, select-none, font-bold, w-full, pr-[30px], cursor-pointer, h-0, overflow-x-hidden, transition-all, duration-350, h-[230px], flex, flex-col, items-flex-start) adicionadas ao menu lateral.
- `src/components/layout/AsideMobile.tsx`: classes Tailwind (bg-surface, text-ink, shadow-sm, rounded-t-[20px], fixed, bottom-0, left-[20%], right-[20%], z-12, flex, justify-center, items-center, flex, flex-row, gap-[35px], py-[10px], select-none, relative, h-[210px], flex, flex-col, items-flex-start, p-0) adicionadas ao menu mobile.
- `src/components/layout/Footer.tsx`: classes Tailwind (flex, justify-center, items-center, mb-12, flex) adicionadas ao rodapé de paginação.
- `src/components/layout/Genres.tsx`: nenhuma mudança de classe (usa apenas classe legacy `aside__sub-item`).
- `src/components/movies/FilmCard.tsx`: classes Tailwind (relative, rounded-[7px], cursor-pointer, transition-all, duration-250, group, rounded-[7px], w-full, h-full, object-cover, absolute, inset-[10%], left-[10%], right-[10%], flex, justify-center, items-center, transition-all, duration-300, scale-0, group-hover:scale-100, flex, flex-col, justify-center, items-center, gap-10, flex, items-center, gap-5, text-body, flex, items-center, gap-5) adicionadas ao card de filme.
- `src/components/movies/BannerImg.tsx`: classes Tailwind (w-full, h-full, object-cover) adicionadas à imagem de banner.
- `src/components/movies/Genres.tsx`: nenhuma mudança de classe.
- `src/components/people/Cast.tsx`: classes Tailwind (relative, flex, flex-start, w-[190px], brightness-70, cursor-pointer, rounded-[10px], absolute, bottom-[15px], left-[10px], z-10, text-white, text-base, font-normal) adicionadas ao card de pessoa.
- `src/pages/home/Home.tsx`: classes Tailwind adicionadas ao main, títulos, parágrafo, slider, container e grids de filmes.
- `src/pages/movies/MoviesCatalog.tsx`: classes Tailwind adicionadas ao main, container, título e grid de catálogo.
- `src/pages/genres/GenresCatalog.tsx`: classes Tailwind adicionadas ao main, container, título e grid de catálogo por gênero.
- `src/pages/people/CastCatalog.tsx`: classes Tailwind adicionadas ao main, navbar e grid de pessoas.
- `src/pages/person-details/CastDetails.tsx`: classes Tailwind adicionadas ao main, container, imagem, artigo e lista de créditos.
- `src/pages/movie-details/MovieDetails.tsx`: classes Tailwind adicionadas ao main, container, imagem, artigo, listas de dados e grid de elenco.
- `src/pages/not-found/NotFoundScreen.tsx`: classes Tailwind adicionadas ao main, título e parágrafo do 404.
- Nenhum export, função, prop, rota, URL ou comportamento alterado.

### Justificativa de nomes

Todos os componentes e páginas seguem a convenção já registrada: arquivos em PascalCase, pastas em minúsculas/kebab-case, componentes React em PascalCase.

### Verificações

`npm run check` passa completo: lint (0 erros, 6 avisos Fase 6 documentados), typecheck estrito, 36 testes + 1 expected fail, build e Prettier. O bundle JS subiu de 186,92 kB para 191,75 kB (gzip 57,03 kB → 58,01 kB); o CSS subiu de 32,98 kB para 39,09 kB (gzip 6,61 kB → 7,85 kB) pela adição das classes Tailwind, sem alteração visual nos componentes.

### Não commitar

`.env/variantes reais, credenciais, node_modules, dist, coverage, caches/logs, perfis/screenshots, scripts/provas/snapshots temporários. Nenhum git add/commit/push foi executado. Parar para commit e autorização da Fase 6.

## Fase 2 — lote 4 entregue

### Escopo e respostas sobre as ferramentas anteriores

- scripts/lint.mjs executa ESLint com a flat config, imprime os diagnósticos e falha por erros ou qualquer aviso não autorizado. Só aceita seis avisos nas duas linhas de origem dos dropdowns (caminho/regra/trecho/ocorrência única). eslint . direto aceita avisos novos; --max-warnings 0 rejeitaria também os seis adiados. O script foi preservado neste lote.
- src/style/style.css e src/style/style.css.map estão versionados. App.tsx importa o CSS gerado do legado; ele foi mantido para preservar aparência e permitir build sem recompilar Sass nesta transição. Esses dois arquivos não foram reformatados/regenerados. Retirar essa dependência só em lote visual aprovado.
- Cobertura v8 4.1.12, mesma versão do Vitest, com test:coverage e relatórios text/json-summary/html em coverage/ ignorado. Sem threshold. Inclui todo src TS/TSX, exceto testes e declarações; não oculta main.tsx não exercitado. Nenhuma dependência de runtime alterada.
- Mantidos os 22 testes existentes; adicionados 15 casos, total 37 em cinco arquivos: **36 passam e um é falha esperada (it.fails)**. Sem snapshots grandes, test IDs, respostas reais ou rede real. Fixtures anteriores continuam pequenas e fictícias; a nova lista de gêneros tem três itens e o fetch controlado reutiliza essas respostas.
- Queries por papel/nome/rótulo sempre que há semântica disponível. Ícones de busca/menu móvel ainda sem nome acessível usam papel/ordem em helper comentado. Ausência de aria-expanded exige conferir apenas o estado inline legado dos menus; nenhuma marcação alterada para satisfazer teste.
- Teste antigo de navegação apresentou uma falha intermitente com aviso de navegação antes do efeito do Router 6.3. O teste agora aguarda act/microtasks antes de clicar; removida espera fixa de 75ms em favor de act. Código do aplicativo preservado. Busca/main do teste de nulidade agora usam queries por role e o helper comum, sem seletores de botão.

### Provas de regressão dos efeitos

- src/test/effects.test.tsx monta MoviesCatalog e CastDetails reais com MemoryRouter, sem StrictMode nesse cenário para contar uma montagem. O modo StrictMode do app não foi alterado. Render/rerender explícitos, estado do pai e respostas de fetch provocam novas renderizações; a resolução controlada impede loops ilimitados quando uma correção é revertida.
- Catálogo: 1 requisição de filmes na montagem, nenhuma extra após resposta/rerender/estado; 1 adicional ao mudar página e 1 ao mudar categoria. Incluindo os dois menus, os totais de fetch são 3 e, após as duas mudanças de rota, 5.
- Pessoa: 2 requisições por id (detalhes/créditos), nenhuma extra após cada resposta/rerender/estado; 2 adicionais ao mudar id. Incluindo os dois menus, os totais são 4 e depois 6.
- Os testes verificam também as URLs consultadas; não basta estabilizar com chamadas ao endpoint errado. A prova de reversão executa somente os testes direcionados em cópia temporária, sem tocar nos componentes reais.

| Experimento em cópia temporária               | Resultado                                                                     |
| --------------------------------------------- | ----------------------------------------------------------------------------- |
| Catálogo: trocar [category,page] por [movies] | Teste falhou na contagem: esperado 1, recebido 2 após resposta                |
| Pessoa: retirar [id] do efeito                | Teste falhou na contagem: esperado 2, recebido 6 após respostas               |
| Busca: corrigir somente page=4 e page=5       | it.fails ficou vermelho por passar inesperadamente, confirmando a expectativa |

Todas as alterações temporárias foram restauradas na cópia. Os arquivos reais de MoviesCatalog/CastDetails permanecem byte a byte iguais ao estado de entrada. Não houve checkout/reset, escrita no índice ou commit para esses experimentos.

### Busca e interações preservadas

- Bug de busca **continua presente** em src/components/home/moviesCatalog/moviesCatalog.tsx:64,74,84: as funções searchMovie3/4/5 consultam page=3. src/test/search-pagination.test.tsx usa it.fails com a expectativa [1,2,3,4,5]. Preparação, renderização, query enviada e cinco respostas/cards são verificados no beforeEach, fora do it.fails, para não mascarar uma falha de fixture como bug conhecido.
- **Fase 3:** corrigir páginas distintas e transformar o it.fails em teste normal; manter validação/cancelamento/cache para a camada de dados. Nada dessa lógica foi corrigido agora.
- Novos testes de componente cobrem pôster null/vazio/sentinela, nota vazia/travessão, cinco links de paginação por categoria e scroll, busca vazia sem requisição, retorno ao catálogo ao limpar, menus desktop/mobile com filtragem/navegação e 404 sem API.
- Limpeza testa o comportamento atual: X limpa o resultado e oculta o campo sem nova busca; não afirma que o legado apaga o valor do input. Revisar esse controle na Fase 3/5 junto da busca, sem mudança neste lote.

### Verificações e cobertura

| Verificação             | Resultado                                                                                                                                                  |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Antes                   | 22 testes em 2 arquivos passaram                                                                                                                           |
| Depois                  | 37 casos em 5 arquivos: 36 passaram, 1 falha esperada (it.fails), 0 todos/skips na suíte completa                                                          |
| npm run check           | Passou: lint → tipos → testes → build → format:check                                                                                                       |
| Lint                    | 0 erros, 6 avisos previamente autorizados, 0 novos avisos; script/regra preservados                                                                        |
| Tipos                   | strict sem exclusões/supressões; fontes do app e novos testes/utilitários verificados                                                                      |
| Build                   | 54 módulos; JS 186,92 kB (gzip 57,03 kB), CSS 19,55 kB (gzip 3,56 kB); hashes/nome dos bundles preservados em relação ao lote 3                            |
| npm run test:coverage   | Passou com v8: relatórios HTML/json-summary/text, sem thresholds                                                                                           |
| Cobertura de statements | 72.16% (337/467)                                                                                                                                           |
| Cobertura de branches   | 66.66% (100/150)                                                                                                                                           |
| Cobertura de funções    | 62.75% (123/196)                                                                                                                                           |
| Cobertura de linhas     | 73.52% (336/457)                                                                                                                                           |
| Snapshots dos commits   | npm ci limpo sobre o estado de entrada; commit 1 passa check com 22 testes; commit 2 passa check com 37                                                    |
| Revisão                 | Delta de 14 caminhos deste lote, sem mudança nos componentes/estilos/rotas; preservado o estado anterior de 46 caminhos pendentes; ver ressalva Git abaixo |

Cobertura é informação sobre execução, não garantia de correção, acessibilidade ou contrato da API. main.tsx não é exercitado pelos testes de componente. Buscas de pessoas/gêneros e caminhos de erro continuam parcialmente cobertos; camada de dados/erros/cancelamento/429 na Fase 3. Relatórios ficam em coverage/ ignorado; abrir coverage/index.html após test:coverage.

Lighthouse não medido. Auditoria repetida após a dependência v8: 2 moderadas no Router, zero altas/críticas. ESLint 9 EOL e os seis avisos da Fase 6 permanecem; não são declarados resolvidos por testes de clique.

### Git e plano de commits do lote 4

**Ressalva do checkout:** o usuário informou o lote 3 commitado, mas a inspeção inicial encontrou os 46 caminhos anteriores pendentes e HEAD bd51e61 (conclusão do lote 2). Nenhuma tentativa de reconciliar/stage/commitar foi feita. Um snapshot do estado de entrada separa exatamente o delta deste lote. Os snapshots verificáveis abaixo partem desse estado, que já contém os arquivos aprovados do lote 3; não se afirma que aplicar só os caminhos do lote 4 sobre o HEAD observado disponibiliza a configuração ausente. Confirmar os commits do lote 3 neste checkout antes de executar os comandos do lote 4, sobretudo nos arquivos compartilhados package.json/lockfile, README/STATUS/DEPENDENCIES e testes existentes.

#### 1. Infraestrutura, fixtures e utilitários

```text
test: preparar fixtures controladas e cobertura v8

Adiciona o provedor compatível com Vitest e fixtures pequenas sem rede.
Permite controlar respostas para verificar regressões de efeitos.
```

PowerShell a partir da raiz, após confirmar os commits do lote 3 neste checkout:

```powershell
$paths = @(
    'package.json'
    'package-lock.json'
    'vite.config.ts'
    'src/test/fixtures/controlled-fetch.ts'
    'src/test/fixtures/genres.ts'
    'src/test/helpers/controls.ts'
    'docs/DEPENDENCIES.md'
)
git add -- $paths
```

#### 2. Testes e registro da entrega

```text
test: ampliar regressões de efeitos e interações do legado

Verifica contagens de fetch, busca, menus, paginação, cards e 404.
Registra o bug de páginas com it.fails e documenta as provas de reversão.
```

PowerShell a partir da raiz, após confirmar os commits do lote 3 neste checkout:

```powershell
$paths = @(
    'src/test/effects.test.tsx'
    'src/test/interactions.test.tsx'
    'src/test/search-pagination.test.tsx'
    'src/test/navigation.test.tsx'
    'src/test/nullability.test.tsx'
    'README.md'
    'docs/STATUS.md'
)
git add -- $paths
```

Cada grupo de sete caminhos entra inteiro no seu commit; package.json e lockfile permanecem juntos. Fixtures/utilitários e dependências entram no primeiro, testes e README/STATUS no segundo; sem staging parcial após o lote 3 estar commitado. Não há renomeações/remoções neste lote. Os dois snapshots passaram no check completo, com as ressalvas da base Git documentadas acima.

Não commitar .env/variantes reais, credenciais, node_modules, dist, coverage (incluindo HTML/json-summary), caches/logs, scripts/snapshots/relatórios brutos de mutação temporários. Os demais caminhos do lote 3 não pertencem ao delta deste lote e devem ser reconciliados nos commits anteriores pelo usuário. Nenhum git add/commit/push executado. Não iniciar o lote 5 sem OK.

## Fase 2 — lote 3 entregue

### Configuração, limites e decisão de commits

- Flat config com typescript-eslint 8.72.1 strictTypeChecked e projectService sobre todo o src e vite.config.ts. Sem exclusões de fontes TypeScript, alterações no tsconfig ou supressões locais. JS de ferramentas tem globals Node e lint recomendado.
- Plugins react 7.37.5 (no-danger/links), react-hooks 7.1.1 (recommended), react-refresh 0.5.7, jsx-a11y 6.10.2 e eslint-config-prettier 10.1.8. Hooks e Refresh são erros; Prettier vem por último e desliga somente conflitos de estilo.
- ESLint/@eslint/js 9.39.5, pois os peers de React/a11y não aceitam 10. Instalação sem force/legacy-peer-deps; npm ls --depth=0 sem incompatibilidades. **ESLint 9 está em EOL**: risco de manutenção registrado no DEPENDENCIES.md, para reavaliar no lote de dependências. Não foi declarado seguro só por o audit não apontar advisory.
- Segurança: react/no-danger e no-console como erro (somente warn/error permitidos para diagnóstico); target="_blank" exige explicitamente os dois tokens noopener/noreferrer, incluindo links internos/Link e valores literais em expressão JSX. Regra React de links mais seletores no-restricted-syntax impõem essa política.
- Prettier enxuto: aspas simples, trailing commas e LF. Scripts format e format:check para o repositório; src/style contém CSS/mapa gerados e não é reformatado, assim como package-lock.json. Fontes Sass, CSS de entrada, docs e previews entram na formatação. check executa lint → typecheck → test -- --run → build → format:check, sem watch.
- **Ressalva aprovada pelo usuário nesta conversa:** manter dois commits. No primeiro, lint/tipos/testes/build passam, mas format:check e, portanto, check completo ainda falham por dívida de formatação preexistente. O segundo deixa check integral verde. Não usar baseline temporário de formatação nem ocultar esses arquivos para afirmar que o primeiro passa.
- O primeiro commit inclui as adequações mínimas exigidas pelas novas regras: 36 console.log de erro passam a console.error (mesmo payload; muda a severidade do diagnóstico), concatenações de URL/título passam a templates equivalentes, interpolação de literais de rota é simplificada e testes extraem a URL de Request explicitamente. Sem mudar telas, URLs, buscas, efeitos, estado ou CSS aplicado. Esses ajustes **não são apresentados como formatação**.
- O segundo commit contém somente a saída do Prettier sobre arquivos existentes. README/STATUS/DEPENDENCIES com conteúdo atualizado entram inteiros no primeiro commit, já formatados, para não misturar conteúdo documental com o segundo.

### Exceções justificadas nas regras

Todas têm comentário na configuração; não há eslint-disable.

| Regra/opção                                             | Escopo e motivo                                                                                                                                                                                                                                                                       |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| no-confusing-void-expression: ignoreArrowShorthand      | Continua erro; permite callbacks React curtos que retornam void, sem exigir blocos artificiais                                                                                                                                                                                        |
| restrict-template-expressions: allowNumber/allowNullish | Continua erro; serialização de IDs/páginas e preservação dos sentinelas null das imagens legadas. Pipeline de imagens/validação fica na Fase 3                                                                                                                                        |
| no-unnecessary-condition: off                           | Somente Aside, AsideMobile, CastCatalog, CastDetails, GenresCatalog, MoviesCatalog e MovieDetails: os fetches ainda fazem asserção de DTO sem validar JSON. Guardas defensivas não devem ser removidas por inferência estática até o Zod da Fase 3; regra mantida nos demais arquivos |
| jsx-a11y: três regras em warn                           | Somente nos arquivos dos dois dropdowns abaixo. scripts/lint.mjs aceita apenas os seis diagnósticos dessas duas linhas de origem; qualquer outro aviso falha, inclusive dentro dos mesmos arquivos                                                                                    |
| no-console: allow warn/error                            | Continua erro para console.log e demais métodos; preserva diagnóstico de falhas enquanto o tratamento de erro da Fase 3 não existe                                                                                                                                                    |
| react-refresh: allowConstantExport                      | Constantes são suportadas pelo Fast Refresh do Vite; a regra de exportação de componentes continua erro                                                                                                                                                                               |
| eslint-config-prettier                                  | Preset final desliga apenas regras que conflitam com o formatador, cujo check é obrigatório na versão final                                                                                                                                                                           |

### Acessibilidade adiada — Fase 6

A configuração conhece Link/to do React Router; não rebaixa falsos positivos de links válidos. Os únicos seis avisos mantidos são três por controle:

| Arquivo e localização                                | Controle                                                            | Regras/defeito                                                                 | Ação futura                                                                             |
| ---------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| src/components/common/aside/aside.tsx:79             | Genres desktop; a com role button e onClick handleDropDown          | anchor-is-valid; click-events-have-key-events; interactive-supports-focus      | Trocar por controle semântico, garantir foco/teclado e revisar estilos/estado expandido |
| src/components/common/asideMobile/asideMobile.tsx:57 | Menu de gêneros móvel; a com role button e onClick handleDropUpMenu | Mesmas três regras: âncora agindo como botão, sem acionamento por teclado/foco | Mesma revisão de semântica, teclado e aparência na Fase 6                               |

Nenhuma marcação/visual desses controles foi alterada. scripts/lint.mjs verifica caminho, regra, trecho de origem e ocorrência única; não usa tolerância genérica por quantidade de avisos. Isso não é auditoria completa de acessibilidade: nomes acessíveis de controles com ícones, foco, contraste e leitores de tela continuam na Fase 6.

### Evidências e resultados

- Antes da formatação isolada: tipos passaram, 22 testes passaram e build passou (54 módulos). Lint: zero erros, seis avisos documentados e zero inesperados.
- Onze probes temporários confirmaram que regras bloqueiam HTML perigoso, console.log, links internos/Link sem ambos os tokens, hooks condicionais, acesso sem tipo e novas infrações de acessibilidade. Links com os dois tokens, inclusive expressão literal JSX, foram aceitos.
- Auditoria repetida: 2 moderadas no Router, zero críticas/altas/baixas. Dependências de runtime preservadas. Nenhum audit fix. Lighthouse não medido; sem proxy/dados reais.
- A prova do commit de formatação compara cada arquivo antes/depois com a saída exata do mesmo Prettier/configuração e confere testes/build. Resultados finais e contagens abaixo.

| Verificação          | Resultado final                                                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| npm run check        | Passou na árvore final e no snapshot do segundo commit com instalação limpa                                                                       |
| Lint                 | 0 erros, 6 avisos documentados nos dois dropdowns, 0 avisos inesperados                                                                           |
| Tipos                | strict sobre todo o src/config, sem mudança de tsconfig nem exclusões                                                                             |
| Testes               | 2 arquivos, 22 passaram antes e depois da formatação                                                                                              |
| Build                | Passou antes/depois; 54 módulos, JS 186,92 kB (gzip 57,03 kB), CSS 19,55 kB (gzip 3,56 kB)                                                        |
| Formatação           | 25 arquivos existentes alterados no segundo commit; todos iguais à saída exata do Prettier sobre a versão anterior; nenhum arquivo extra no grupo |
| Prova de preservação | JS e CSS compilados antes/depois da formatação byte a byte idênticos (SHA-256); CSS/mapa gerados em src/style preservados                         |
| Exceções a11y        | Probe em cópia temporária inseriu outra infração dentro de Aside; lint rejeitou os três novos avisos. Arquivo temporário restaurado               |
| Conflitos de estilo  | eslint-config-prettier CLI não encontrou regras conflitantes nos quatro arquivos representativos                                                  |
| Snapshot commit 1    | npm ci limpo; lint/tipos/testes/build passaram. format:check falhou conforme ressalva autorizada; check completo não é verde nesse commit         |
| Snapshot commit 2    | npm run check completo passou após aplicar somente os 25 arquivos formatados                                                                      |

21 arquivos de configuração/adequações/documentação no primeiro commit e 25 de formatação no segundo, sem sobreposição. Não houve alteração de comportamento das telas/URLs; a severidade do diagnóstico de erros mudou explicitamente de log para error no primeiro. A prova de bundles idênticos refere-se ao segundo commit, não à troca de diagnóstico do primeiro. Revisão final de escopo, padrões de credenciais/caminhos locais e git diff --check concluída sem correspondências/erros; não é garantia contra todos os formatos possíveis de segredo.

### Plano de commits do lote 3

#### 1. Configuração e adequações mínimas

```text
chore: consolidar lint tipado e ferramentas de formatação

Configura regras de segurança, hooks, acessibilidade e check sequencial.
Inclui adequações mínimas e documenta os avisos adiados e o EOL do ESLint 9.
```

PowerShell a partir da raiz, somente pelo usuário:

```powershell
$paths = @(
    '.prettierignore'
    '.prettierrc.json'
    'README.md'
    'docs/DEPENDENCIES.md'
    'docs/STATUS.md'
    'eslint.config.js'
    'package-lock.json'
    'package.json'
    'scripts/lint.mjs'
    'src/components/common/aside/aside.tsx'
    'src/components/common/asideMobile/asideMobile.tsx'
    'src/components/common/footer/footer.tsx'
    'src/components/home/bannerImg/bannerImg.tsx'
    'src/components/home/castCatalog/castCatalog.tsx'
    'src/components/home/castDetails/castDetails.tsx'
    'src/components/home/genresCatalog/genresCatalog.tsx'
    'src/components/home/home.tsx'
    'src/components/home/moviesCatalog/moviesCatalog.tsx'
    'src/components/movie-details/movie-details.tsx'
    'src/test/navigation.test.tsx'
    'src/test/nullability.test.tsx'
)
git add -- $paths
```

#### 2. Somente formatação — 25 arquivos

```text
style: aplicar Prettier ao legado e à documentação

Uniformiza a formatação sem alterar lógica, conteúdo ou aparência.
Conclui format:check e o check integral após a configuração.
```

PowerShell a partir da raiz, somente pelo usuário:

```powershell
$paths = @(
    'docs/ANALYSIS.md'
    'docs/DESIGN.md'
    'docs/design-previews/LICENSES.md'
    'docs/design-previews/atlas.css'
    'docs/design-previews/atlas.html'
    'docs/design-previews/base.css'
    'docs/design-previews/caderno.css'
    'docs/design-previews/caderno.html'
    'docs/design-previews/index.html'
    'docs/design-previews/sala.css'
    'docs/design-previews/sala.html'
    'src/index.css'
    'src/sass/components/castDetails/castDetails.scss'
    'src/sass/components/common/aside/aside.scss'
    'src/sass/components/common/asideMobile/asideMobile.scss'
    'src/sass/components/common/footer/footer.scss'
    'src/sass/components/common/header/header.scss'
    'src/sass/components/home/castCatalog/castCatalog.scss'
    'src/sass/components/home/filmCard/filmCard.scss'
    'src/sass/components/home/home.scss'
    'src/sass/components/movie-details/movie-details.scss'
    'src/sass/style.scss'
    'src/sass/variables/colors/colors.scss'
    'src/sass/variables/common/common.scss'
    'src/sass/variables/fonts/fonts.scss'
)
git add -- $paths
```

Os 21 arquivos do primeiro commit entram inteiros, incluindo atualizações documentais e adequações de lint; os 25 do segundo não têm sobreposição com eles. Não é necessário staging parcial. A exceção de format:check no primeiro foi aprovada expressamente pelo usuário; não afirmar que os dois checks integrais passam isoladamente. Sem renomeações ou remoções neste lote.

Não commitar .env/variantes reais, credenciais, node_modules, dist, coverage, caches/logs, provas/scripts/snapshots/perfis temporários. Não incluir src/style gerado, fontes, Tailwind ou alterações de runtime/deploy. Nenhum git add/commit/push executado. Parar para commit e autorização do lote 4.

## Fase 2 — lote 2 entregue

### Conversão e limites

- Convertidos os 24 arquivos JSX restantes para TSX: componentes comuns, home, catálogos, detalhes, telas, App e rotas. Entrada e testes atualizados para os novos imports; os testes existentes já eram TypeScript desde o lote 1 e foram mantidos e adaptados.
- tsconfig.json com strict:true, allowJs:false, noUncheckedIndexedAccess:true e exactOptionalPropertyTypes:true. Todo o src e vite.config.ts incluídos; sem exclude, skipLibCheck, supressões @ts-ignore/@ts-nocheck ou any explícito/implícito no código-fonte. O ESLint continua verificando o projeto inteiro.
- Contratos próprios em src/types/tmdb.ts para filmes/resumos/detalhes, pessoas, gêneros, elenco, equipe e respostas paginadas. Preservam nomes dos campos da API e nulidade; créditos anexados são opcionais com tratamento na tela. Compatíveis com a futura definição de schemas Zod, sem instalar Zod agora.
- Props, estados, refs DOM, callbacks, parâmetros de rota e retornos assíncronos tipados. Propriedades opcionais têm guardas, fallback ou valor padrão. Respostas JSON passam por unknown e uma asserção explícita do contrato em cada fetch legado; isso **não valida JSON em execução**. Validação, response.ok, cancelamento, cache e centralização do cliente permanecem na Fase 3, sem reescrever a lógica de busca neste lote.
- URLs, classes, estrutura normal das telas e estilos preservados. package.json, package-lock.json e CSS/Sass/mapas não foram alterados; nenhuma instalação no projeto, Tailwind ou fonte nova. A instalação limpa de verificação ocorreu somente em cópia temporária.
- Inclusos 11 testes de regressão de nulidade/controles além dos 11 existentes. Sem dados reais ou segredos: todas as respostas dos testes são fictícias.

### Correções reveladas pela tipagem

1. **Refs inicialmente nulas:** Header, Aside e AsideMobile agora verificam a existência dos elementos antes de acessar style/value. Os dois modos de Header exigem callback apenas quando a busca está presente; evita chamar função ausente.
2. **Botões com type inválido:** type="click" substituído por type="button" em Header/AsideMobile, mantendo os cliques e evitando semântica de submit acidental.
3. **Callback ausente em gênero:** o link comum de gênero aceita ausência do callback de fechar menu e só o invoca quando fornecido; o uso pelo menu móvel não lança exceção.
4. **Nota nula:** listas, busca e filmografia usam travessão quando vote_average é null, em vez de chamar toFixed em null. O card com pôster continua visível.
5. **Campos de detalhe nulos:** data sem valor não recebe split; orçamento/receita/duração ausentes mostram travessão, em vez de NaN ou valores indefinidos. Créditos não anexados não impedem a renderização.
6. **Imagens ausentes:** detalhe de filme/pessoa não monta URL com null; banner sem fundo não gera imagem quebrada. FilmCard e Cast aceitam null explicitamente e conservam a ocultação legada de cards sem imagem; o personagem opcional recebe padrão null.
7. **Pessoa ainda não carregada ou com campos nulos:** acesso ao primeiro resultado protegido; deathday ausente não cria linha de falecimento. Gênero 0 é “Not specified” e 3 é “Non-binary”, conservando os rótulos anteriores para 1/2; antes todos os códigos diferentes de 2 viravam “Feminine”. Valores conforme [referência oficial](https://developer.themoviedb.org/reference/person-details).
8. **Ausência de parâmetros/resultados:** id ausente não dispara fetch de detalhe; categoria/página usam os valores padrão legados. Busca usa estado resposta-ou-null, sem mistura string/objeto; mapas tratam ausência. Nenhuma validação nova de parâmetros introduzida nesta etapa.
9. **Props removidas do Router:** retirado exact, atributo não suportado pelo Router 6. Os paths e correspondência das rotas permanecem iguais. Removida também a asserção de elemento não nulo no teste de navegação, substituída por verificação explícita.

### Efeitos citados na análise e pendências da Fase 3

Os dois efeitos já haviam sido corrigidos no **lote 1**, antes desta solicitação. Nenhuma nova reescrita de lógica foi necessária neste lote; preservadas as dependências existentes:

- Catálogo: [moviesCatalog.tsx](../src/pages/movies/MoviesCatalog.tsx#L22), efeito nas linhas 22–33, dependências category/page. Antes da correção histórica dependia dos dados que atualizava.
- Pessoa: [castDetails.tsx](../src/pages/person-details/CastDetails.tsx#L27), efeito nas linhas 27–49, dependência id. Antes da correção histórica não tinha array de dependências.
- Detalhe de filme continua acompanhando id (linhas 20–35 de movie-details.tsx), como no lote 1. Apenas a guarda de id ausente foi adicionada nos detalhes durante a tipagem.
- Para a Fase 3: busca de filmes ainda repete page=3 nos fetches das linhas 64, 74 e 84 de moviesCatalog.tsx. Sem deduplicação/cache/cancelamento ou checagem response.ok. Não corrigidos agora para preservar o escopo e a lógica legada.

### Verificações do lote

| Verificação                          | Resultado                                                                                                                                                   |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| npm run lint                         | Passou; 0 erros/avisos                                                                                                                                      |
| npm run typecheck                    | Passou; todo o src em strict, sem exclusões nem skipLibCheck                                                                                                |
| npm run test -- --run                | 2 arquivos, 22 testes passaram (11 anteriores + 11 novos)                                                                                                   |
| npm run build                        | Passou; 54 módulos, JS 186,78 kB (gzip 57,03 kB), CSS 19,55 kB (gzip 3,56 kB)                                                                               |
| Snapshots dos três commits propostos | npm ci limpo; lint/tipos/testes/build passaram em cada etapa acumulada, fora do repositório e sem escrita Git                                               |
| Navegador Chromium                   | 18 acessos diretos (8 rotas + 404 em dev/preview), card → detalhe → voltar nos dois; nenhuma exceção não tratada, com fixtures                              |
| Cobertura de fontes                  | Programa TypeScript contém os 31 arquivos TS/TSX do src e vite.config.ts; nenhum JS/JSX, any ou supressão de tipos no src                                   |
| Revisão de escopo                    | 18 arquivos de dependências/estilos conferidos iguais ao HEAD; plano cobre exatamente os 57 caminhos alterados, incluindo remoções e inclusões              |
| Varredura final                      | 80 arquivos de texto versionáveis/build sem correspondência de padrões de API key, JWT, Bearer literal ou caminho local de usuário; git diff --check passou |

Cada snapshot representa aplicar os commits anteriores mais aquele commit, na ordem abaixo. Nos dois primeiros, a cobertura de tipos permanece transicional como no lote 1; o terceiro encerra allowJs e exige strict sobre todo o src. Isso não representa exclusão ou tolerância na entrega final. README/STATUS completos entram no terceiro commit para descrever a conversão concluída. Dependências e estilos não entram em nenhum dos três.

Roteiro manual reduzido no [README](../README.md#conferência-manual-após-a-conversão-typescript): busca/limpeza e menus, recarga de detalhe de filme/pessoa, card → detalhe → voltar e 404. O roteiro preenchido depende do proxy; regressões de nulidade foram exercitadas com fixtures. Sem mudança de URLs ou novo visual. Auditoria não repetida neste lote: o resultado do lote 1 permanece como fotografia (2 moderadas no Router, 0 críticas/altas); resolução no lote próprio. Lighthouse não medido.

### Plano de commits do lote 2

#### 1. refactor: tipar contratos da API e componentes comuns

```text
refactor: tipar contratos da API e componentes comuns

Define os formatos TMDB e protege props e referências dos componentes compartilhados.
Adapta fixtures sem alterar URLs ou estilos.
```

Executar pelo usuário a partir da raiz:

```powershell
$paths = @(
    'src/components/common/aside/aside.jsx', 'src/components/common/aside/aside.tsx'
    'src/components/common/aside/genres/genres.jsx', 'src/components/common/aside/genres/genres.tsx'
    'src/components/common/asideMobile/asideMobile.jsx', 'src/components/common/asideMobile/asideMobile.tsx'
    'src/components/common/footer/footer.jsx', 'src/components/common/footer/footer.tsx'
    'src/components/common/header/header.jsx', 'src/components/common/header/header.tsx'
    'src/components/home/bannerImg/bannerImg.jsx', 'src/components/home/bannerImg/bannerImg.tsx'
    'src/components/home/filmCard/filmCard.jsx', 'src/components/home/filmCard/filmCard.tsx'
    'src/components/movie-details/cast/cast.jsx', 'src/components/movie-details/cast/cast.tsx'
    'src/components/movie-details/genres/genres.jsx', 'src/components/movie-details/genres/genres.tsx'
    'src/types/tmdb.ts'
    'src/test/fixtures/fetch.ts'
    'src/test/fixtures/tmdb.json'
)
git add -- $paths
```

#### 2. refactor: converter home e catálogos para TypeScript

```text
refactor: converter home e catálogos para TypeScript

Tipa estados e respostas das listagens e trata notas nulas.
Preserva buscas, paginação e apresentação do legado.
```

Executar pelo usuário a partir da raiz:

```powershell
$paths = @(
    'src/components/home/home.jsx', 'src/components/home/home.tsx'
    'src/components/home/castCatalog/castCatalog.jsx', 'src/components/home/castCatalog/castCatalog.tsx'
    'src/components/home/genresCatalog/genresCatalog.jsx', 'src/components/home/genresCatalog/genresCatalog.tsx'
    'src/components/home/moviesCatalog/moviesCatalog.jsx', 'src/components/home/moviesCatalog/moviesCatalog.tsx'
)
git add -- $paths
```

#### 3. refactor: concluir conversão estrita do legado

```text
refactor: concluir conversão estrita do legado

Converte detalhes, telas e rotas e remove a transição allowJs.
Cobre nulidade com testes e documenta limites e verificações do lote.
```

Executar pelo usuário a partir da raiz:

```powershell
$paths = @(
    'src/components/home/castDetails/castDetails.jsx', 'src/components/home/castDetails/castDetails.tsx'
    'src/components/movie-details/movie-details.jsx', 'src/components/movie-details/movie-details.tsx'
    'src/App.jsx', 'src/App.tsx'
    'src/routes.jsx', 'src/routes.tsx'
    'src/screens/castCatalogScreen.jsx', 'src/screens/castCatalogScreen.tsx'
    'src/screens/castDetailsScreen.jsx', 'src/screens/castDetailsScreen.tsx'
    'src/screens/genresCatalogScreen.jsx', 'src/screens/genresCatalogScreen.tsx'
    'src/screens/homeScreen.jsx', 'src/screens/homeScreen.tsx'
    'src/screens/movie-detailsScreen.jsx', 'src/screens/movie-detailsScreen.tsx'
    'src/screens/moviesCatalogScreen.jsx', 'src/screens/moviesCatalogScreen.tsx'
    'src/screens/notFoundScreen.jsx', 'src/screens/notFoundScreen.tsx'
    'src/main.tsx'
    'src/test/navigation.test.tsx'
    'src/test/nullability.test.tsx'
    'tsconfig.json'
    'README.md'
    'docs/STATUS.md'
)
git add -- $paths
```

Os pares JSX/TSX incluem tanto o caminho removido quanto o novo. Arquivos compartilhados de contratos/fixtures entram no primeiro commit; testes finais, configuração strict e toda a atualização documental entram no terceiro. Não é necessário staging parcial de arquivos. Os quatro checks foram verificados para cada snapshot acumulado. Nenhum git add/commit/push foi executado.

**Não commitar:** .env e variantes, credenciais, node_modules, dist, coverage, caches/logs, perfis/screenshots/scripts temporários. package.json/lockfile, estilos, DESIGN/previews, ANALYSIS e DEPENDENCIES estão fora deste lote e não precisam de commit. Não iniciar o lote 3 sem novo OK.

## Fase 2 — lote 1 entregue

### Mudanças e limites

- Migrado para Vite 8.3.5 com plugin React 6.1.2, index.html na raiz e src/main.tsx tipado. Removidos react-scripts, Web Vitals, arquivos de bootstrap/Jest/manifesto/logo do template e yarn.lock. Lockfile regenerado a partir do package.json, sem usar force ou legacy-peer-deps e sem árvore CRA/webpack no resultado.
- React/DOM 18.2.0, Router 6.3.0 e Icons 4.4.0 preservados neste lote; atualizar runtime no lote próprio. Node 24.15.0/npm 11.12.1 registrados, com scripts dev/start/build/preview/lint/typecheck/test e configuração mínima de Prettier.
- ESLint 10.13.0, TypeScript 6.0.3, typescript-eslint 8.72.1, Prettier 3.9.10, Vitest 4.1.12, Testing Library e jsdom instalados como devDependencies. Vitest 5 inicialmente testado tinha declarações incompatíveis com jest-dom 7; usada versão estável compatível, sem skipLibCheck. ESLint 9 foi substituído por 10 suportado, sem plugin antigo que impunha peer incompatível.
- Retirados API key/Bearer literais dos oito componentes e todos os cabeçalhos de autenticação do cliente. Requisições agora usam /api/tmdb na mesma origem; proxy só na Fase 3. .env.example apenas com comentários; .env/variantes ignorados, além de dist/.vercel/artefatos de teste. Nenhuma chave VITE_ ou segredo novo foi introduzido.
- Para viabilizar smoke sem chamadas contínuas, corrigidas dependências de efeito de catálogo (category/page) e pessoa (id); detalhe de filme passa a acompanhar id. Sem refatorar cliente de dados/cache. Retirados quatro parâmetros/refs não usados apontados pelo lint.
- 404 mínima com retorno à home adicionada como rota curinga, sem novo CSS. As oito URLs anteriores permanecem. Nenhum redesign, fonte nova, Tailwind ou Preflight ativado neste lote; esses itens continuam nos lotes previstos da Fase 2 e nas Fases 4–5 para aplicação visual.
- CSS global, CSS gerado, source map e Sass do legado preservados; hashes das três folhas/mapa de entrada conferidos sem alteração. Inspeção de renderização com dados fictícios; não há baseline pixel a pixel de um build CRA executado nesta sessão.
- Os testes usam fixtures fictícias e bloqueiam fetch sem fixture. O navegador usou interceptação temporária de dados/imagens, não um modo demo do aplicativo. Sem proxy, dados reais não carregam e telas ficam vazias/incompletas; documentado no README. Não colocar chave no frontend para contornar essa limitação.
- README atualizado com instalação/comandos reais, limites e [roteiro manual](../README.md#roteiro-manual-do-lote-1); DEPENDENCIES mantém a fotografia original e o novo resultado auditado. Formatação global, regras completas, CI e E2E permanecem para seus lotes.

### Resultados obtidos

| Verificação           | Resultado                                                                                                                                                                                                                                            |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| npm run lint          | Passou, 0 erros e 0 avisos                                                                                                                                                                                                                           |
| npm run typecheck     | Passou; strict para entrada/config/testes TS, JS legado ainda com checkJs:false                                                                                                                                                                      |
| npm run test -- --run | 1 arquivo, 11 testes passaram                                                                                                                                                                                                                        |
| npm run build         | Passou; 54 módulos, JS 185,95 kB (gzip 56,84 kB), CSS 19,55 kB (gzip 3,56 kB)                                                                                                                                                                        |
| npm run dev           | Vite pronto em 267ms, 127.0.0.1:5173                                                                                                                                                                                                                 |
| npm run preview       | dist servido em 127.0.0.1:4173                                                                                                                                                                                                                       |
| Instalação limpa      | npm ci e os quatro checks repetidos em cópia temporária, todos passaram                                                                                                                                                                              |
| Smoke de navegador    | 8 rotas existentes + 404 em dev e preview: 18 acessos diretos; card → detalhe → voltar nos dois; sem exceções não tratadas                                                                                                                           |
| Audit                 | 2 moderadas (react-router e react-router-dom), 0 críticas/altas/baixas; atualização no lote de dependências                                                                                                                                          |
| Revisão final         | 80 arquivos versionáveis e dist sem valores de credenciais/padrões verificados ou caminhos locais de usuário; comparados os dois literais do HEAD sem imprimi-los. Sem dependências CRA no lockfile; hashes CSS preservados; git diff --check passou |

Comparação da auditoria: 96 entradas no snapshot original → 2 moderadas agora; não é contagem de explorações comprovadas. Não houve audit fix --force. O advisory/risco residual do Router está documentado em DEPENDENCIES.md e não foi declarado resolvido. Tempos/tamanhos são desta execução, não metas de desempenho ou números Lighthouse.

O roteiro manual no README inclui todas as URLs, F5, menus, paginação, voltar, 404 e repetição no preview. Sem proxy, a parte com cards/dados reais só será verificável manualmente na Fase 3; a navegação preenchida foi exercitada com fixtures nos testes. Fallback local da SPA responde HTML/HTTP 200, mesmo para o caminho que renderiza 404; configuração da Vercel ainda pendente.

### Plano de commits deste lote

Um único commit coerente de bootstrap, conforme agrupamento aprovado. Inclui mudanças de segurança indispensáveis para não gerar bundle com os literais revogados, compatibilidades mínimas de navegação, checks e documentação correspondente. Todos os temas desses arquivos entram neste commit. Executar somente pelo usuário, na raiz:

```powershell
$paths = @(
    '.gitignore'
    '.env.example'
    '.node-version'
    '.npmrc'
    '.prettierignore'
    '.prettierrc.json'
    'package.json'
    'package-lock.json'
    'yarn.lock'
    'index.html'
    'vite.config.ts'
    'tsconfig.json'
    'eslint.config.js'
    'public/index.html'
    'public/manifest.json'
    'src/index.js'
    'src/main.tsx'
    'src/vite-env.d.ts'
    'src/reportWebVitals.js'
    'src/setupTests.js'
    'src/App.test.js'
    'src/logo.svg'
    'src/routes.jsx'
    'src/screens/notFoundScreen.jsx'
    'src/components/common/aside/aside.jsx'
    'src/components/common/aside/genres/genres.jsx'
    'src/components/common/asideMobile/asideMobile.jsx'
    'src/components/common/header/header.jsx'
    'src/components/home/castCatalog/castCatalog.jsx'
    'src/components/home/castDetails/castDetails.jsx'
    'src/components/home/genresCatalog/genresCatalog.jsx'
    'src/components/home/home.jsx'
    'src/components/home/moviesCatalog/moviesCatalog.jsx'
    'src/components/movie-details/movie-details.jsx'
    'src/test/setup.ts'
    'src/test/navigation.test.tsx'
    'src/test/fixtures/fetch.ts'
    'src/test/fixtures/tmdb.json'
    'README.md'
    'docs/STATUS.md'
    'docs/DEPENDENCIES.md'
)
git add -- $paths
```

```text
build: substituir CRA por Vite com verificações mínimas

Prepara entrada TypeScript, lint e testes preservando o visual legado.
Remove credenciais do cliente e valida rotas, histórico e 404 com fixtures.
```

A lista contém também os caminhos removidos para registrar suas exclusões. Não separar package.json do lockfile nem os checks necessários ao primeiro checkpoint verde. Instalação limpa confirmou os quatro gates desta versão; o typecheck de JS ainda é provisório e explicitamente limitado. Nenhum git add/commit/push foi executado.

Não commitar .env/variantes reais, node_modules, dist, caches/logs, perfis/screenshots temporários, nem docs/ANALYSIS.md preexistente fora do lote. .env.example é a única exceção de arquivo de ambiente, sem valores. A atualização de paleta própria do DESIGN.md ocorrerá antes da Fase 4, sem refazer previews e sem aplicar tema agora.

## Escolha visual e ajuste aprovado após a Fase 1

- **Caderno**, porque a hierarquia editorial diferencia o portfólio e dá espaço aos pôsteres e à leitura sem exigir novas funcionalidades. Essa justificativa acompanha a escolha do usuário, não substitui os ajustes solicitados.
- **Escuro por padrão**, inclusive na primeira visita; tema claro continua disponível. Não escolher automaticamente claro pelo sistema operacional na primeira visita. Eventual preferência explícita do usuário poderá ser guardada separadamente dos dados TMDB, na fase correspondente.
- **Clima do [PXN Games](https://pxngames.com/)**: carvão/cinzas e vermelho no escuro; cinza/branco e vermelho no claro. Por ajuste do usuário, valores exatos da referência não serão copiados: definir hexadecimais próprios e registrar “paleta inspirada em” no DESIGN.md antes da Fase 4, com AA recalculado. Não copiar logo, textos ou layout; não refazer previews.
- Preservar a composição e o par Source Serif 4/Source Sans 3 do Caderno, ajustando o papel quente para neutros mais frios e o vermelho conforme a referência. Uma família de destaque: vermelho, com variantes de tema e função para manter AA. Não copiar layout, marca, imagens ou código do PXN Games.
- As telas, navegação e funcionalidades do MoviesLib são a estrutura funcional a preservar; grid, tipografia e apresentação seguem o Caderno adaptado. O layout antigo e sua paleta amarela não são a especificação visual vigente.
- DESIGN.md e previews permanecem como registro das alternativas apresentadas, sem alteração nesta atualização. A paleta original do preview Caderno foi substituída pela orientação acima; os números de contraste da Fase 1 pertencem às paletas antigas. Recalcular contraste e validar os dois temas antes de aplicar a nova paleta na Fase 4. Não alegar que as novas cores já passaram nas verificações anteriores.

## Plano da Fase 2 — aprovado, execução por lote

### Ordem de execução e verificações

1. **Preparar uma base verificável com Vite.** Conferir engines/peers e versões estáveis compatíveis, fixar Node/npm e um único lockfile, migrar HTML/entry/assets e React plugin, remover CRA e scripts CDN redundantes. Antes de gerar bundle, retirar os literais revogados do código e preparar apenas chamadas relativas ao contrato /api, sem implementar proxy ou autenticação do servidor. Ignorar .env e variantes, .vercel, dist e artefatos; .env.example somente com placeholders públicos quando necessários, nunca valores reais. Nenhuma credencial em VITE_.
2. **Bootstrap mínimo dos quatro checks no mesmo primeiro lote.** Incluir entry/configuração TypeScript, ESLint flat, Prettier e Vitest/Testing Library com teste útil de navegação de card e dados de exemplo, sem API real. Essa inclusão é pré-requisito para ter lint, tipos, testes e build executáveis desde o primeiro commit; a migração completa de tipos, regras e testes fica nos lotes próprios abaixo. Se usar allowJs provisoriamente, informar explicitamente a cobertura limitada do typecheck; não afirmar que o legado JS está totalmente tipado. Não criar scripts no-op, testes que sempre passam ou exclusões abrangentes para forçar verde.
3. **Converter o legado para TypeScript estrito.** Tipar componentes, props, refs, parâmetros de rota e formatos usados pelas telas, eliminar assinaturas/atributos inválidos e concluir a verificação de todo o src, removendo a transição allowJs. Não antecipar cliente de dados, Zod/TanStack Query ou proxy da Fase 3. Corrigir apenas incompatibilidades necessárias à fundação e registrar mudanças de comportamento inevitáveis.
4. **Consolidar ESLint e Prettier.** Regras React/hooks/acessibilidade pertinentes, comandos dedicados lint e format:check e formatação em lote separado. Não desativar regras ou ignorar o legado inteiro para esconder problemas; resolver avisos que impeçam os checks aprovados ou documentar desvios concretos.
5. **Consolidar testes Vitest + Testing Library.** Substituir o template CRA e cobrir contrato de navegação, cards, renderização de conteúdo e ausência de imagem onde o comportamento atual permitir. Isolar rede com fixtures/interceptação nos testes, sem segredo ou API real; testes completos de cache/erros/429/cancelamento pertencem à Fase 3. Registrar o que permanece defeito do legado, sem apresentar smoke isolado como validação de toda a aplicação. E2E do fluxo completo fica nas fases previstas.
6. **Organizar pastas e preparar Tailwind/fontes.** Mover por responsabilidade, preservando URLs e comportamento. Integrar @tailwindcss/vite e preparar theme.css/fonts.css com a direção escolhida; não aplicar o redesenho nem introduzir Preflight que modifique o legado silenciosamente. A implementação visual, ativação dos estilos e contraste final pertencem à Fase 4.
7. **Atualizar dependências e reauditar.** A remoção do CRA já reduz a cadeia antiga; em lote próprio, atualizar React/React DOM/Router e demais dependências compatíveis, priorizando críticas e altas. Executar npm audit, avaliar contexto real e documentar riscos restantes. Sem audit fix --force automático. Toda alteração de pacote inclui package.json e package-lock.json no mesmo commit; remover yarn.lock na migração inicial para npm único.
8. **CI e documentação.** GitHub Actions com Node fixado, npm ci, lint, format:check, tipos, testes e build; Dependabot. Atualizar README, STATUS e inventário com resultados reais e limites. Repetir instalação limpa em ambiente temporário antes de fechar a fase. Não publicar nem conectar credenciais.

Após cada lote acima, executar e mostrar saída resumida de **npm.cmd run lint**, **npm.cmd run typecheck**, **npm.cmd run test -- --run** e **npm.cmd run build**, além de format:check quando configurado. Não avançar sobre regressão introduzida; distinguir ferramenta ausente no estado inicial de falha real após bootstrap. O primeiro checkpoint executável só ocorre depois de completar os passos 1–2 como lote atômico. Os commits propostos devem representar esses checkpoints, não estados intermediários sem ferramentas. Não afirmar que qualquer check já passou nesta etapa de planejamento.

### Riscos da migração e detecção

| Risco                                                                                    | Como detectar                                                                                                                                                                                                         |
| ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| HTML/entry, JSX em .js, imports e arquivos públicos diferentes entre CRA/Vite            | Build de produção, servir dist, verificar carregamento de assets e ausência de React CDN                                                                                                                              |
| Rotas diretas e botão voltar quebrados; diferenças Router/React e remoção de exact       | Smoke com fixtures nas URLs existentes, abrir detalhe por URL, navegar entre IDs e voltar; separar fallback Vercel de dev server                                                                                      |
| Tipos de props/refs e null/undefined expostos pela conversão                             | typecheck estrito, testes de componente e smoke com dados incompletos; sem any indiscriminado                                                                                                                         |
| Jest, setupTests e módulos CSS/fontes incompatíveis com Vitest/Vite                      | Testes em jsdom, mocks explícitos, verificação dos imports e do build final                                                                                                                                           |
| Preflight, ordem CSS, pesos das fontes ou nova paleta mudarem o legado antes do redesign | Comparar capturas/estilos antes/depois e manter a infraestrutura visual sem ativação prematura                                                                                                                        |
| Efeitos legados dispararem requisições contínuas ou conteúdo falhar sem proxy            | Rede isolada nos testes/smokes; observar contagem de chamadas. Loop não deve ser ocultado por fixture. Correção da camada de dados na Fase 3; qualquer bloqueio real da fundação é relatado antes de ampliar o escopo |
| Dados reais indisponíveis na Fase 2 porque o proxy só nasce na Fase 3                    | Não usar segredo no browser nem simular validação da API real; testes com fixtures e limitação documentada. Não implantar Fase 2 como catálogo completo                                                               |
| Literais antigos acabarem em código convertido, bundle ou logs                           | Varredura de src, arquivos versionáveis e dist sem imprimir valores; .env.example sem segredo e nenhum token VITE_                                                                                                    |
| Atualizações reintroduzirem vulnerabilidades ou divergirem do lockfile                   | npm ci, audit e quatro checks após cada lote; registrar versões e advisories remanescentes                                                                                                                            |

### Estrutura proposta

```text
index.html
src/
  main.tsx
  app/
    App.tsx
    routes.tsx
    styles/
      main.css
      theme.css
      fonts.css
  pages/
    home/
    movies/
    movie-details/
    genres/
    people/
    person-details/
  components/
    layout/
    movies/
    people/
  test/
    setup.ts
    fixtures/
  vite-env.d.ts
public/
docs/
.github/
  workflows/ci.yml
  dependabot.yml
vite.config.ts
tsconfig.json
eslint.config.js
.prettierrc.json
.env.example
```

Estrutura por responsabilidade, sem mover para diretórios vazios por antecipação. Testes de componente podem ficar junto ao componente. A pasta de cliente de dados e /api entram na Fase 3; não criar implementação de proxy na fundação. Rotas mantêm os caminhos existentes, mesmo quando os nomes internos das pastas forem padronizados.

### Fontes e tokens

- Usar pacotes **@fontsource-variable/source-serif-4** e **@fontsource-variable/source-sans-3**, com versões fixadas no lockfile. Importar uma vez por fonts.css e usar os nomes de família efetivamente declarados pelos pacotes (famílias Variable), com Georgia/Segoe UI/Arial como fallback. WOFF2 será incluído pelo Vite e servido da própria origem, sem Google Fonts/CDN em runtime; font-display:swap e somente estilos necessários. Importação e pesos/arquivos efetivos serão verificados na implementação.
- Fontes sob **SIL OFL 1.1**; preservar licença/copyright completos dos pacotes e documentar em CREDITS.md quando incorporados. Pacotes não mudam a licença MIT do código. Ver [documentação de instalação Fontsource](https://fontsource.org/docs/getting-started/install), [Source Serif 4](https://fontsource.org/fonts/source-serif-4) e [Source Sans 3](https://fontsource.org/fonts/source-sans-3).
- **src/app/styles/theme.css** será a fonte única dos tokens em @theme: cores semânticas, tipografia, espaço, raios, sombras, duração e easing. main.css concentrará imports/ordem de camadas; fonts.css conterá imports das fontes. Tema escuro é a base, e [data-theme="light"] sobrescreve tokens semânticos. Ajustar fontes Variable nos tokens, sem depender de uma fonte instalada pelo usuário. Não espalhar valores arbitrários nos componentes.
- Preparar infraestrutura na Fase 2 não autoriza aplicar Caderno às páginas. Paleta adaptada PXN, contraste e componentes base serão validados na Fase 4.

### Divisão proposta em commits da Fase 2

Plano aprovado; cada lote seguinte depende de novo OK após commit do anterior. Lista exata de arquivos e comandos git add ao final de cada lote, a partir da raiz; nenhuma escrita Git pelo agente. Exceção de agrupamento aprovada: primeiro commit inclui configurações mínimas dos quatro checks para evitar estados sem ferramentas executáveis.

1. **build: migrar do CRA para uma base Vite verificável** — runtime Vite, entrada TS/configuração mínima, scripts/configs mínimos de lint/tipos/testes, primeiro teste útil, saneamento dos literais e ambiente sem credenciais; remoção de CRA/yarn.lock. Ainda não é a conversão completa do legado para TS.
2. **refactor: converter componentes e rotas para TypeScript estrito** — conversão completa, tipos e compatibilidades, sem implementação da camada de dados.
3. **chore: consolidar regras de ESLint e Prettier** — qualidade e formatação; sem misturar redesign.
4. **test: cobrir navegação e componentes do catálogo** — testes úteis adicionais e fixtures, sem API real.
5. **refactor: organizar pastas da aplicação por responsabilidade** — movimentações/imports e contratos de rotas preservados.
6. **style: preparar Tailwind e fontes locais da direção Caderno** — infraestrutura de tokens/fontes, licenças e integração Vite, sem redesenhar páginas.
7. **chore: atualizar dependências e tratar riscos de segurança** — versões compatíveis e audit, com prioridade crítica/alta e riscos restantes documentados.
8. **ci: verificar qualidade e build no GitHub Actions** — workflow, Node/npm fixados e Dependabot.
9. **docs: atualizar instalação e resultados da fundação** — README, STATUS e inventário final, com instruções efetivamente testadas.

Arquivos compartilhados como package.json/package-lock.json evoluem em cada commit que altera pacotes/scripts; vite.config.ts/tsconfig evoluem nos lotes correspondentes. Não concentrar todas as alterações desses arquivos no último commit. Checar a sequência de snapshots em cópias temporárias, sem checkout/reset/commit no repositório, antes de confirmar que cada commit isolado passa nos quatro gates. O teste de tipos do primeiro commit terá cobertura provisória explicitamente limitada; o segundo deve concluir a cobertura estrita de todo o src.

### Commit do registro do plano (histórico da etapa anterior)

Somente docs/STATUS.md entra no commit desta atualização, a ser executado pelo usuário da raiz:

```powershell
$paths = @('docs/STATUS.md')
git add -- $paths
```

```text
docs: registrar escolha do Caderno e plano da fundação

Define tema escuro padrão e referência cromática do PXN Games.
Detalha migração, verificações e limites antes de iniciar a Fase 2.
```

Não incluir alterações preexistentes de README/ANALYSIS/DEPENDENCIES, .env, credenciais, dependências instaladas ou artefatos temporários. Nesta atualização não houve instalação, testes de aplicação, build ou escrita Git; git diff --check e revisão documental serão as verificações aplicáveis.

## Entrega e verificações da Fase 1

- [DESIGN.md](DESIGN.md) apresenta três conceitos de duas frases, paletas completas claras/escuras, escalas tipográficas, pares gratuitos/licenças/fallbacks, grids distintos, tratamento de pôsteres, movimento, home/detalhe, estados, pontos fracos, quadro comparativo e recomendação. Cada direção inclui exemplo de @theme para Tailwind 4.3.3; sem DaisyUI ou biblioteca de componentes visuais.
- Caderno: serifas editoriais, vermelho de tinta/coral por tema, abertura assimétrica e detalhe 3/6/3. Sala 02: condensada, amarelo/ocre, sequência gráfica de pôsteres e ficha 2/5. Atlas: sans + mono, verde, índice lateral, cards e dados tabulares.
- Previews locais abrem diretamente pelo navegador: index.html e três HTMLs de direção com CSS e SVG locais. Cada direção tem cabeçalho, home, quatro cards/pôsteres e topo de detalhe, com tema claro/escuro selecionável por radios e CSS. Sem JavaScript, CDN, fetch, vídeo real, persistência ou dados/imagens TMDB.
- Pôsteres SVG geométricos originais e conteúdo fictício, compartilhados entre as direções para permitir comparação. LICENSES.md registra MIT para os estudos e SIL OFL 1.1 para as famílias livres propostas; nenhum binário de fonte foi baixado ou distribuído. Fontes finais usarão WOFF2 local e licença completa após a escolha. Os previews usam fallback do sistema se as famílias propostas não estiverem instaladas.
- Contraste: 54 pares calculados com luminância sRGB/WCAG nos seis conjuntos direção/tema, incluindo texto principal, secundário, destaque, texto de botão e bordas contra seus fundos. Todos passam os limiares definidos; menor razão de texto é 5,63:1 e de borda de controle 3,47:1. Tabela e método em DESIGN.md. Isso não certifica acessibilidade da aplicação.
- Chromium headless já instalado: 24 combinações (3 direções × 2 temas × 4 larguras: 360/768/1024/1440), sem overflow horizontal (scrollWidth igual a clientWidth), imagens locais carregadas e um h1 por direção. Cores computadas mudam corretamente com o seletor de tema; nenhuma requisição externa registrada nas páginas.
- Movimento reduzido emulado: duração computada de transição dos pôsteres é 0s nas três direções. Verificado início da navegação por Tab no link de pular conteúdo. Inspeção visual de capturas da home e detalhe em desktop e mobile; não equivale a auditoria completa de teclado, leitor de tela, contraste de todos os componentes ou múltiplos navegadores.
- Tentativas com Edge expiraram; verificação concluída com Chromium. Perfil, automação e screenshots ficaram em diretório temporário fora do repositório; não fazem parte do commit.
- Nenhuma medição Lighthouse da aplicação realizada. Resultados antigos da auditoria npm preservados, sem nova instalação ou auditoria de dependências nesta fase.
- Verificação documental final: links/âncoras e recursos locais válidos, UTF-8 sem BOM, sem valores de credenciais encontrados pelos padrões e pela comparação com os dois literais do código. Recalculados os 54 pares diretamente dos CSS. git diff --check passou; hashes confirmaram 57 arquivos fora do escopo preservados.
- README, ANALYSIS, DEPENDENCIES e demais arquivos preexistentes fora do escopo desta fase foram preservados. O Git local já apresentava README modificado e docs não rastreados no início; nenhuma ação de staging/commit foi executada para reconciliar esse estado. O plano abaixo lista somente a entrega da Fase 1.

## Plano de commits da Fase 1

Um único commit documental para manter documento, links, previews e registro de verificação juntos. Não há motivo para separar os previews, pois complementam a mesma decisão de design. Executado pelo usuário a partir da raiz:

```powershell
$paths = @(
    'docs/DESIGN.md'
    'docs/STATUS.md'
    'docs/design-previews/index.html'
    'docs/design-previews/caderno.html'
    'docs/design-previews/sala.html'
    'docs/design-previews/atlas.html'
    'docs/design-previews/base.css'
    'docs/design-previews/caderno.css'
    'docs/design-previews/sala.css'
    'docs/design-previews/atlas.css'
    'docs/design-previews/LICENSES.md'
    'docs/design-previews/art/ultima-sessao.svg'
    'docs/design-previews/art/margem-norte.svg'
    'docs/design-previews/art/frequencia-zero.svg'
    'docs/design-previews/art/depois-da-chuva.svg'
)
git add -- $paths
```

Mensagem completa:

```text
docs: apresentar três direções visuais para o MoviesLib

Documenta paletas, tipografia, tokens e contrastes nos dois temas.
Inclui previews locais de home e detalhe para apoiar a escolha visual.
```

Todos os temas de DESIGN.md, LICENSES.md e STATUS.md relativos à entrega entram nesse único commit. Não incluir README, ANALYSIS ou DEPENDENCIES preexistentes neste commit da Fase 1, nem credenciais, .env, node_modules, build, caches, logs, perfis ou screenshots temporários. Testes desta fase limitam-se à documentação e aos previews; lint/tipos/testes/build do aplicativo continuam sem resultado verde confirmado, pelas limitações já registradas. Nenhuma alteração de runtime do aplicativo foi introduzida.

## Plano de commits da fase 0

Um único commit documental, a ser executado pelo usuário a partir da raiz:

```powershell
$paths = @(
    'README.md'
    'docs/STATUS.md'
    'docs/ANALYSIS.md'
    'docs/DEPENDENCIES.md'
)
git add -- $paths
```

Mensagem completa:

```text
docs: consolidar análise e decisões aprovadas do MoviesLib

Preserva os achados do legado e sincroniza os quatro documentos.
Define estilo, proxy, cache e escopo aprovados antes da migração.
```

Todos os temas desses quatro arquivos entram nesse commit. Não há mudança de runtime entre commits, pois há somente este commit documental. **Não é possível confirmar lint/tipos/testes/build verdes:** faltam scripts e dependências instaladas, e o teste legado procura conteúdo ausente. A documentação não corrige essas condições.

Não commitar: .env e variantes, credenciais, cache/logs npm, relatórios temporários brutos com caminhos locais, node_modules, build, coverage, artefatos de navegador, screenshots/GIFs não revisados. Arquivos legados com segredos ficam fora deste commit documental e exigem saneamento em fase aprovada; revogação já informada pelo proprietário.
Nota Fase 4 (a): hash CSP do script inline do index.html (sha256-cE7N6gNicf4X7ETopK2nUiAdJR0qlnFWtvKhoNvM2/4=), para uso com `script-src 'sha256-...'` (sem nonce).
Nota Fase 4: CDN no legado para Fase 6 — apenas `https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css` em index.html (integridade SRI presente). Demais recursos são locais.
Nota histórica: a comparação anterior de tonalidades foi encerrada pela decisão Pulso e pelo vermelho principal #C62828.
