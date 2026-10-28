# MoviesLib

Catálogo de filmes e pessoas com dados do The Movie Database (TMDB). Projeto de estudo e portfólio, sem vínculo com TMDB ou estúdios.

MoviesLib is a React single-page application for browsing movies and people.
It builds with Vite and uses strict TypeScript throughout the application.
Existing screens retain their URLs; the visual migration is still incomplete.
The server-only TMDB proxy requires a private environment variable.

Deploy: [LINK DO DEPLOY]

## Funcionalidades e limites atuais

- Home com estrutura de tendências, populares, em cartaz e faixa de imagens.
- Catálogo por categoria, páginas 1–5, busca de filmes e recorte por gênero.
- Estrutura de detalhe com sinopse, orçamento, receita, duração, gêneros e elenco.
- Catálogo/busca de pessoas, biografia e filmografia.
- Menus desktop/mobile e acesso a em breve/bem avaliados.
- 404 mínima com retorno ao início e os estilos existentes.

**O catálogo real depende da configuração do segredo no servidor.** O proxy está implementado; o cliente centralizado e TanStack Query ainda não foram integrados às telas. Estrutura e navegação foram verificadas com dados fictícios; fixtures não são um modo de demonstração publicado. Sem configuração, o proxy retorna erro genérico e as telas legadas podem ficar vazias/incompletas. Não coloque uma chave no cliente.

Dois loops de requisição foram corrigidos para validar a migração; outras limitações do legado estão na [análise](docs/ANALYSIS.md). Minha lista, filtros completos, recomendações, galeria e equipe ainda não estão implementados. Os [previews de design](docs/design-previews/index.html) são estudos estáticos separados do app; não há GIF de demonstração do aplicativo.

## Stack e decisões

React/DOM 18.3.1, Router DOM 7.18.5 e React Icons 4.4.0. Fundação: Vite 8.3.5, TypeScript 6.0.3, ESLint 9.39.5, Prettier 3.9.10 e Vitest 4.1.12. Router atualizado para corrigir os advisories da linha 6, mantendo BrowserRouter, imports e URLs. Removidos CRA/react-scripts e seus transitivos exclusivos; somente package-lock.json permanece. React 19 requer migração própria, não realizada nesta atualização. ESLint 9 atende aos peers dos plugins React/a11y, mas está fora de suporte; risco em [DEPENDENCIES.md](docs/DEPENDENCIES.md).

TypeScript estrito cobre src, api, server, shared, e2e e configurações Vite/Playwright, com allowJs:false, noUncheckedIndexedAccess e exactOptionalPropertyTypes, sem exclusões de fontes ou skipLibCheck. Os contratos são derivados de schemas **Zod 4.6.7** em [schemas.ts](src/api/tmdb/schemas.ts); [src/types/tmdb.ts](src/types/tmdb.ts) preserva os exports anteriores. Há validação de IDs, páginas, categorias e busca em shared/tmdbRequest.ts. Os fetches legados ainda usam asserções; a validação em execução será conectada pelo cliente da API nos próximos grupos. **TanStack Query 5.105.0** está instalado e aceita React 18, mas ainda não foi integrado às telas. Tailwind CSS 4.3.3 usa o plugin Vite; tokens @theme ficam em src/styles/theme.css. As telas combinam classes Tailwind e CSS legado, inclusive valores arbitrários que precisam ser substituídos por tokens. Componentes base ainda não integrados; preservação visual das mudanças anteriores não comprovada.

O [STATUS.md](docs/STATUS.md) é a fonte da verdade. Direção **Caderno**, escuro padrão; PXN Games é referência apenas de clima. A paleta terá hexadecimais próprios, descritos como “paleta inspirada em” no DESIGN.md, com contraste AA recalculado nos dois temas antes da Fase 4. Não copiar cores exatas, logo, textos ou layout; os previews não precisam ser refeitos.

Estilo aprovado: Tailwind CSS 4.3.3, tokens em @theme, sem DaisyUI ou biblioteca de componentes visuais. Há fontes legadas locais (PT Sans/Source Sans Pro); as famílias Caderno Source Serif 4/Source Sans 3 e os arquivos completos de licença ficam para a Fase 4. Proxy implementado; cliente centralizado e consultas integradas (Fase 3). Fase 4 (b): componentes base (Button, IconButton, PosterImage, MovieCard, Skeleton, EmptyState, ErrorState, Badge, ThemeToggle) com testes e página /design (dev-only). [Inventário de dependências](docs/DEPENDENCIES.md).

Tema claro/escuro e trailer youtube-nocookie aprovados; preservar pessoa/filmografia e em cartaz/em breve. pt-BR/en, atalhos e comparação ficam como **futuro**. Sem login/cadastro, analytics, rastreamento ou coleta de dados pessoais pelo aplicativo; documentar comunicação com provedores terceiros.

Cache aprovado: apenas memória no TanStack Query e borda curta no proxy. Minha lista guardará somente IDs validados, sem metadados/respostas TMDB em localStorage. **Pendência: o proprietário conferirá os termos**; essa política provisória não comprova conformidade contratual.

## Estrutura do código

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
    base/
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
  styles/
  fonts/
  vite-env.d.ts
```

app contém App e LayoutRoutes; pages preserva as telas e seus wrappers existentes. components agrupa layout, filmes, pessoas e componentes base (Button, Link, Input, Card, Container, PosterPlaceholder, EmptyState, ErrorState, Skeleton); test guarda os testes e dados fictícios. Componentes usam PascalCase; utilitários/testes, camelCase; pastas, minúsculas/kebab-case. Imports relativos simples, sem alias. Os exports e as URLs existentes permanecem iguais.

src/sass e src/style continuam no lugar durante a transição. O app consome o CSS legado compilado e seu mapa junto com Tailwind. A retirada do legado, a paleta própria e a validação visual permanecem pendentes.

## Como rodar

1. Use Node.js **24.15.0** e npm **11.12.1**, ambiente validado. .node-version, engines e packageManager registram a configuração.
2. Abra o PowerShell na raiz e instale pelo lockfile:

   ```powershell
   npm.cmd ci
   ```

3. Para dados reais, configure .env.local conforme a seção de credenciais. Sem variável, as rotas abrem, mas o proxy responde 502 genérico. Inicie:

   ```powershell
   npm.cmd run dev
   ```

4. Acesse `http://127.0.0.1:5173`. Encerre com Ctrl+C. npm start é um alias para o Vite.
5. Para produção local:

   ```powershell
   npm.cmd run build
   npm.cmd run preview
   ```

6. Abra `http://127.0.0.1:4173`. As portas são fixas; encerre servidores anteriores se estiverem ocupadas.

No macOS/Linux, use npm no lugar de npm.cmd. O dev Vite tem adaptador local do proxy, importado somente em serve/development. O preview serve apenas arquivos estáticos e não executa /api; para testar as funções/regras Vercel use vercel dev. Fontes locais; imagens TMDB e reset CDN dependem de rede.

## Credenciais

Revogação da API key e do Bearer e geração de substitutos **informadas como concluídas pelo proprietário**, sem verificação do painel pelo agente. Os literais antigos foram retirados do código neste lote; permanecem no histórico antigo. Reescrita de histórico: **não realizada, por decisão do proprietário**.

.env e variantes estão ignorados; .env.example contém somente o nome da variável com valor vazio. **TMDB_READ_ACCESS_TOKEN** é o token de leitura Bearer do TMDB, exclusivo do servidor. Nunca usar prefixo VITE_, copiar para src ou informar pelo chat/logs. Sem variável, o proxy retorna 502 genérico sem revelar seu nome. Authorization é enviado somente ao host TMDB fixo, nunca na query string ou ao navegador.

Configuração local e execução com a CLI Vercel:

1. Copie o exemplo para arquivo ignorado:

   ```powershell
   Copy-Item .env.example .env.local
   ```

2. Preencha o valor apenas no editor local, a partir do gerenciador de senhas. Não cole o segredo em comandos de terminal. npm run dev já executa o adaptador local do proxy; é necessário reiniciar após mudar .env.local.
3. Para o ambiente equivalente às funções Vercel, execute a CLI consultada nesta entrega:

   ```powershell
   npm.cmd exec --package=vercel@65.5.0 -- vercel dev
   ```

   Na primeira execução, faça login/vincule ao seu projeto conforme os prompts da CLI. Configure antes a variável no ambiente Development do painel (passo 4): vercel dev baixa essas variáveis em memória, sem precisar de env pull. Isso cria .vercel ignorado; não versione. Use preset Vite, build npm run build e saída dist. Abra o endereço informado pela CLI (normalmente porta 3000). A integração com a conta e o deploy não foram executados pelo agente. [Ambiente local oficial](https://vercel.com/docs/environment-variables).

4. No painel do projeto Vercel, abra Settings → Environment Variables e crie TMDB_READ_ACCESS_TOKEN para os ambientes desejados (Development, Preview, Production), com o valor privado. Reimplante versões já publicadas para aplicar alterações; o agente não publicou nada. Não configurar essa variável como pública ou VITE_.

### Política do proxy

Somente GET em /api/tmdb/...; outros métodos retornam 405/Allow: GET. Endpoints permitidos: movie/popular, movie/top_rated, movie/now_playing, movie/upcoming, trending/movie/day, person/popular, search/movie, search/person, genre/movie/list, movie/:id, movie/:id/credits, person/:id e person/:id/movie_credits. page (1–500) somente em listas/buscas; query (até 200 caracteres normalizados) somente nas buscas; append_to_response=credits somente em movie/:id. IDs positivos seguros. path é apenas o transporte do rewrite, sujeito à mesma lista; URLs externas, traversal, barras ambíguas, codificação dupla, parâmetros desconhecidos/duplicados são rejeitados.

O servidor impõe **language=en-US** (default do legado) e **include_adult=false**, ignorando esses dois parâmetros do cliente, inclusive duplicados. Entradas explicitamente adult=true são removidas das listas/créditos; detalhes com esse sinalizador retornam 404. Isso depende da classificação fornecida pelo TMDB e não é moderação de conteúdo.

Timeout de 8 s inclui o corpo; resposta máxima de 2 MB, JSON validado pelos schemas. Erros públicos padronizados, sem corpo/mensagem/stack upstream e sem logs do proxy. Redirects upstream são bloqueados. Content-Type JSON e nosniff em todas as respostas; nenhum CORS aberto. Ausência de CORS não autentica o endpoint público nem impede clientes fora do navegador.

Somente 200 recebe Vercel-CDN-Cache-Control: public, s-maxage=60, stale-while-revalidate=15. Cache-Control: no-store para o navegador em todas as respostas; erros não recebem cache de borda. Não aumentar os 60 s antes de confirmar os termos. Headers globais anteriores em vercel.json foram preservados; rewrites excluem /api do fallback da SPA. Comportamento efetivo de CDN/roteamento em hospedagem ainda requer conferência após deploy.

### Limite de requisições

**Plano B no código: melhor esforço, por instância.** Contador global anônimo de 60 requisições válidas/minuto por processo, compartilhado entre visitantes; sem armazenar ou registrar IP, sem mapa crescente de clientes. Excesso retorna 429/Retry-After e no-store. Reinícios/cold starts e instâncias diferentes renovam a quota; não garante limite distribuído. Só conta chamadas que chegam à função, não hits já servidos pela CDN.

**Plano A no painel: WAF Vercel, ativação não confirmada.** Está disponível no Hobby: uma regra por projeto, dentro de três regras customizadas; janela fixa de 10 s a 10 min, chaves IP/JA4, 1 milhão de requisições permitidas incluídas. Contadores regionais. Confira disponibilidade/uso atual da conta antes de ativar. [Limites oficiais](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting).

1. Abra projeto → Firewall → Configure → New Rule.
2. Nomeie a regra e defina a condição de caminho: começa com /api/tmdb.
3. Ação Rate Limit, algoritmo Fixed Window, chave IP, janela 60 s e limite 60 solicitações.
4. Use bloqueio 429, não somente Log/Challenge. Confira a revisão de uso/custos mostrada pela conta.
5. Salve, revise e publique a regra no painel; confira depois em Firewall Observability e registre a ativação no STATUS. O agente não acessou nem alterou o painel. O aplicativo não grava IPs; o tratamento pelo provedor segue suas políticas.

Regras WAF não são exercitadas por testes locais ou pelo adaptador de desenvolvimento. O contador no código permanece como proteção complementar.

## Verificações

```powershell
npm.cmd run check
```

Lint, tipos estritos, testes e build passaram: **140 casos em dez arquivos: 139 passam e um it.fails registra o bug conhecido das páginas de busca**. Incluem o proxy protegido, sua entrada Node, contador por instância, roteamento, contratos, nulidade, navegação e interações. Vitest separa client/jsdom e server/node; ambos entram no check. Fetch bloqueado por padrão nos dois ambientes, com fixtures explícitas, sem API real. Falhas upstream, timeout, traversal, cache e token ausente estão cobertos; a ativação do WAF e comportamento da CDN dependem de verificação na Vercel. Vitest 4.1.12 mantém compatibilidade de tipos sem skipLibCheck.

check executa lint → tipos → testes (uma execução) → build → format:check. O workflow .github/workflows/quality.yml executa esse comando, cobertura informativa e npm audit --audit-level=high em push/PR, com Node de .node-version e npm 11.12.1. Não usa segredos ou deploy; a execução remota só poderá ser confirmada após o push pelo proprietário. Dependabot verifica npm e Actions semanalmente. npm run format aplica Prettier; format:check verifica sem escrever. CSS/mapa gerado em src/style e lockfile ficam fora do formatador; fontes Sass são formatados.

ESLint usa flat config, strictTypeChecked com projectService, React Hooks/Refresh, jsx-a11y e eslint-config-prettier. HTML perigoso e console.log são erros; links target="_blank" exigem explicitamente noopener e noreferrer. O lint aceita zero avisos; os controles de gêneros agora são botões e não precisam mais de rebaixamento das regras. As exceções restantes têm justificativas na configuração. Isso não substitui auditoria de acessibilidade.

Para gerar o relatório informativo de cobertura v8, sem percentual mínimo:

```powershell
npm.cmd run test:coverage
```

Abra coverage/index.html após o comando. coverage/ é ignorado pelo Git. O relatório inclui os fontes do src (inclusive main.tsx não exercitado por estes testes), excluindo apenas testes e declarações .d.ts. A suíte usa respostas fictícias e fetch bloqueado por padrão. Os testes dos dois efeitos controlam a entrega das respostas e verificam contagens após atualizações de estado e de rota; a prova de regressão em cópias temporárias fica no STATUS.md.

## Testes E2E

Há sete smoke tests com Playwright (Chromium): URLs diretas, estrutura básica, 404 e retorno ao início. Ainda não verificam o fluxo preenchido card → detalhe → voltar, nem isolam a rede com fixtures; não entram neste CI de fundação. Instale o navegador uma vez com npm.cmd exec playwright install chromium antes de executá-los.

```powershell
npm.cmd run test:e2e
```

Modo interativo:

```powershell
npm.cmd run test:e2e:ui
```

O it.fails compara as páginas esperadas 1–5 com as chamadas atuais 1,2,3,3,3. Se o bug for corrigido, esse teste falhará por passar inesperadamente e deverá virar it normal na Fase 3. Testes de cliques dos menus não certificam acessibilidade por teclado; essa revisão continua na Fase 6.

Auditoria do lockfile em 28/10/2026 após atualizar React/Router: **zero vulnerabilidades reportadas**. Isso não cobre fim de suporte (ESLint 9) ou problemas da aplicação. Sem audit fix --force ou legacy-peer-deps. Detalhes em [DEPENDENCIES.md](docs/DEPENDENCIES.md).

## Acessibilidade e Lighthouse

Há botões semânticos nos menus de gêneros, labels em controles e lazy loading em imagens. vercel.json declara cabeçalhos, mas seu comportamento em deploy, CSP com dados/embeds e fallback SPA ainda não foram verificados. Meta tags não substituem cabeçalhos HTTP. Os resultados Lighthouse registrados anteriormente não têm relatório reproduzível disponível e não são apresentados como medição confirmada. Auditoria de teclado, contraste, responsividade e baseline antes/depois continuam pendentes.

## Conferência rápida de rotas

1. Execute npm run dev e, em http://127.0.0.1:5173, abra diretamente /, /catalog/popular/1, /movie-details/1, /cast/2 e /endereco-inexistente. Recarregue cada URL. As demais categorias/gêneros mantêm os caminhos da tabela completa abaixo.
2. Com o segredo configurado e o proxy rodando, abra um card, confira o detalhe e use Voltar do navegador. Na 404, use Voltar ao início. Sem essa configuração, dados preenchidos ficam restritos às fixtures dos testes; não coloque credenciais no frontend.
3. Execute npm run build e npm run preview. Repita as mesmas URLs e a navegação em http://127.0.0.1:4173.

## Roteiro manual do lote 1

1. Com npm run dev, abra cada caminho diretamente após `http://127.0.0.1:5173` e recarregue com F5:

   | Caminho                              | Conferência                                                 |
   | ------------------------------------ | ----------------------------------------------------------- |
   | /                                    | Cabeçalho, menus e estrutura da home                        |
   | /catalog/popular/1                   | Catálogo e paginação                                        |
   | /upcoming_&_just_released/upcoming/1 | Categoria em breve                                          |
   | /top_rated/top_rated/1               | Categoria bem avaliados                                     |
   | /genres/18/Drama                     | Estrutura por gênero                                        |
   | /movie-details/1                     | Estrutura do detalhe; dados dependem do proxy               |
   | /cast                                | Busca e estrutura de pessoas                                |
   | /cast/2                              | Estrutura de biografia/filmografia; dados dependem do proxy |
   | /endereco-inexistente                | 404 com link Voltar ao início                               |

2. Na home, use MORE, abra página 2 no catálogo, volte pelo navegador e recarregue. Confira links de categorias no menu. Gêneros/cards dependem de dados e serão conferidos manualmente após o proxy; os testes com fixtures já exercitam card → filme → voltar.
3. Na 404, clique Voltar ao início. A rota da SPA usa fallback HTML com HTTP 200 no dev/preview; não é uma resposta HTTP 404 do servidor.
4. Encerre o dev, execute build/preview e repita os caminhos na porta 4173 (estrutura estática, sem função /api). O fallback Vercel está configurado para excluir /api; confirmar comportamento hospedado após deploy.
5. Confira o visual legado e ausência de chave no código/Network. Não espere dados reais nem insira credenciais para completar essa conferência.

## Conferência manual após a conversão TypeScript

As URLs não mudaram. Com npm run dev, confira somente os pontos afetados pela conversão:

1. Em /catalog/popular/1 e /cast, abra a busca pela lupa, digite e limpe pelo X; confira também abrir/fechar menus. Resultados dependem do proxy; os testes usam fixtures.
2. Recarregue /movie-details/1 e /cast/2: a estrutura deve abrir sem erro de importação. Com dados disponíveis, confirme card → detalhe → voltar; campos ausentes não devem produzir NaN, URLs de imagem terminadas em null ou atribuir gênero feminino a pessoas sem gênero informado.
3. Abra /endereco-inexistente e use Voltar ao início. Não é necessário repetir todas as categorias do roteiro anterior; os caminhos foram mantidos e cobertos pelos testes.

Sem configurar e executar o proxy, a conferência preenchida e dos campos nulos fica limitada às fixtures dos testes. Não adicione credenciais ao frontend para fazê-la.

## Créditos e licença

Dados e imagens futuros: [TMDB](https://www.themoviedb.org). A interface ainda precisa de logo aprovado e atribuição em Sobre/Créditos, conforme a [documentação oficial](https://developer.themoviedb.org/docs/faq). Aviso: “This product uses the TMDB API but is not endorsed or certified by TMDB.” README não substitui atribuição na interface.

Ícones: React Icons. Fontes: PT Sans e Source Sans Pro, locais em src/fonts/. Reset: Meyer Reset via cdnjs. Licenças detalhadas em [CREDITS.md](CREDITS.md). Licenças específicas serão registradas em CREDITS.md ao incorporar/substituir recursos; créditos dos estudos estão em [LICENSES.md](docs/design-previews/LICENSES.md).

Código sob [MIT](LICENSE), sem transferir direitos sobre dados, imagens e marcas de terceiros. Não há autenticação, lista persistente ou tratamento completo de erros. Interface legada em inglês; 404 em pt-BR. Há configuração parcial de headers, sem publicação validada ou Lighthouse reproduzível. Não publicar esta etapa como catálogo completo.
