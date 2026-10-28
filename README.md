# MoviesLib

Catálogo de filmes e pessoas com dados do The Movie Database (TMDB). Projeto de estudo e portfólio, sem vínculo com TMDB ou estúdios.

MoviesLib is a React single-page application for browsing movies and people.
It builds with Vite and uses strict TypeScript throughout the application.
Existing screens retain their URLs; the visual migration is still incomplete.
Live data awaits the server-only TMDB proxy planned for Phase 3.

Deploy: [LINK DO DEPLOY]

## Funcionalidades e limites atuais

- Home com estrutura de tendências, populares, em cartaz e faixa de imagens.
- Catálogo por categoria, páginas 1–5, busca de filmes e recorte por gênero.
- Estrutura de detalhe com sinopse, orçamento, receita, duração, gêneros e elenco.
- Catálogo/busca de pessoas, biografia e filmografia.
- Menus desktop/mobile e acesso a em breve/bem avaliados.
- 404 mínima com retorno ao início e os estilos existentes.

**O catálogo real depende do proxy da Fase 3.** Estrutura e navegação foram verificadas com dados fictícios em testes e no navegador. Fixtures não são um modo de demonstração publicado. Sem o proxy, as telas podem ficar vazias/incompletas e registrar falhas de resposta no console. Não coloque uma chave no cliente para preencher esses dados.

Dois loops de requisição foram corrigidos para validar a migração; outras limitações do legado estão na [análise](docs/ANALYSIS.md). Minha lista, filtros completos, recomendações, galeria e equipe ainda não estão implementados. Os [previews de design](docs/design-previews/index.html) são estudos estáticos separados do app; não há GIF de demonstração do aplicativo.

## Stack e decisões

React/DOM 18.3.1, Router DOM 7.18.5 e React Icons 4.4.0. Fundação: Vite 8.3.5, TypeScript 6.0.3, ESLint 9.39.5, Prettier 3.9.10 e Vitest 4.1.12. Router atualizado para corrigir os advisories da linha 6, mantendo BrowserRouter, imports e URLs. Removidos CRA/react-scripts e seus transitivos exclusivos; somente package-lock.json permanece. React 19 requer migração própria, não realizada nesta atualização. ESLint 9 atende aos peers dos plugins React/a11y, mas está fora de suporte; risco em [DEPENDENCIES.md](docs/DEPENDENCIES.md).

TypeScript estrito cobre src, api, server, shared, e2e e configurações Vite/Playwright, com allowJs:false, noUncheckedIndexedAccess e exactOptionalPropertyTypes, sem exclusões de fontes ou skipLibCheck. Os contratos são derivados de schemas **Zod 4.6.7** em [schemas.ts](src/api/tmdb/schemas.ts); [src/types/tmdb.ts](src/types/tmdb.ts) preserva os exports anteriores. Há validação de IDs, páginas, categorias e busca em shared/tmdbRequest.ts. Os fetches legados ainda usam asserções; a validação em execução será conectada pelo cliente da API nos próximos grupos. **TanStack Query 5.105.0** está instalado e aceita React 18, mas ainda não foi integrado às telas. Tailwind CSS 4.3.3 usa o plugin Vite; tokens @theme ficam em src/styles/theme.css. As telas combinam classes Tailwind e CSS legado, inclusive valores arbitrários que precisam ser substituídos por tokens. Componentes base ainda não integrados; preservação visual das mudanças anteriores não comprovada.

O [STATUS.md](docs/STATUS.md) é a fonte da verdade. Direção **Caderno**, escuro padrão; PXN Games é referência apenas de clima. A paleta terá hexadecimais próprios, descritos como “paleta inspirada em” no DESIGN.md, com contraste AA recalculado nos dois temas antes da Fase 4. Não copiar cores exatas, logo, textos ou layout; os previews não precisam ser refeitos.

Estilo aprovado: Tailwind CSS 4.3.3, tokens em @theme, sem DaisyUI ou biblioteca de componentes visuais. Há fontes legadas locais (PT Sans/Source Sans Pro); as famílias Caderno Source Serif 4/Source Sans 3 e os arquivos completos de licença ficam para a Fase 4. Proxy e integração das consultas ainda pendentes na Fase 3. [Inventário de dependências](docs/DEPENDENCIES.md).

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

3. Este lote não requer .env ou chave TMDB. Inicie:

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

No macOS/Linux, use npm no lugar de npm.cmd. /api/tmdb é o contrato relativo preparado para o proxy futuro, ainda sem implementação. As fontes atuais são locais; imagens TMDB e reset CDN ainda dependem de rede.

## Credenciais

Revogação da API key e do Bearer e geração de substitutos **informadas como concluídas pelo proprietário**, sem verificação do painel pelo agente. Os literais antigos foram retirados do código neste lote; permanecem no histórico antigo. Reescrita de histórico: **não realizada, por decisão do proprietário**.

.env e variantes estão ignorados; .env.example contém apenas comentários. Não há credencial no cliente ou em VITE_. Não coloque valores reais no código, logs ou chat. Guarde substitutos em gerenciador de senhas e, na Fase 3, no ambiente do servidor Vercel.

Proxy aprovado: função mínima em /api na Vercel, validação de parâmetros, caminhos permitidos, cache curto e limite de requisições. Nomes efetivos das variáveis, configuração Vercel e execução local por vercel dev ou equivalente serão documentados com a implementação na Fase 3. Não existe comando de proxy funcional nesta etapa.

O servidor imporá **language=en-US**, default usado pelo legado que não enviava idioma explícito, e **include_adult=false**. O cliente não poderá alterar esses parâmetros. O cache de borda ficará em **60 s**, sem aumento até confirmação dos termos. Essas políticas ainda não estão aplicadas por um proxy neste grupo de contratos.

Rate limiting planejado: WAF Vercel, disponível no Hobby com uma regra por projeto, janela fixa entre 10 s e 10 min, chaves IP/JA4 e 1 milhão de requisições permitidas incluídas. Contadores são regionais; limite inicial proposto de 60/minuto por IP/região. Regra do painel não foi acessada/ativada pelo agente, e limitador ainda não implementado. Não há fallback de produção em memória neste grupo. [Limites oficiais](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting).

## Verificações

```powershell
npm.cmd run check
```

Lint, tipos estritos, testes e build passaram: **67 casos em sete arquivos: 66 passam e um it.fails registra o bug conhecido das páginas de busca**. Incluem contratos de resposta, entradas inválidas, nulidade, rotas, card → filme → voltar, efeitos e interações. Vitest separa client/jsdom e server/node; os dois projetos entram no check. Fetch é bloqueado por padrão nos dois ambientes, com fixtures explícitas, sem API real. As verificações anteriores no navegador usaram dados fictícios; não equivalem ao proxy funcional. Vitest 4.1.12 mantém compatibilidade de tipos sem skipLibCheck.

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
2. Quando houver dados disponíveis, abra um card, confira o detalhe e use Voltar do navegador. Na 404, use Voltar ao início. Sem o proxy, dados preenchidos dependem das fixtures dos testes; não coloque credenciais no frontend.
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
4. Encerre o dev, execute build/preview e repita os caminhos na porta 4173. O fallback da hospedagem Vercel ainda não foi configurado.
5. Confira o visual legado e ausência de chave no código/Network. Não espere dados reais nem insira credenciais para completar essa conferência.

## Conferência manual após a conversão TypeScript

As URLs não mudaram. Com npm run dev, confira somente os pontos afetados pela conversão:

1. Em /catalog/popular/1 e /cast, abra a busca pela lupa, digite e limpe pelo X; confira também abrir/fechar menus. Resultados dependem do proxy; os testes usam fixtures.
2. Recarregue /movie-details/1 e /cast/2: a estrutura deve abrir sem erro de importação. Com dados disponíveis, confirme card → detalhe → voltar; campos ausentes não devem produzir NaN, URLs de imagem terminadas em null ou atribuir gênero feminino a pessoas sem gênero informado.
3. Abra /endereco-inexistente e use Voltar ao início. Não é necessário repetir todas as categorias do roteiro anterior; os caminhos foram mantidos e cobertos pelos testes.

Sem o proxy, a conferência preenchida e dos campos nulos está limitada às fixtures dos testes. Não adicione credenciais ao frontend para fazê-la.

## Créditos e licença

Dados e imagens futuros: [TMDB](https://www.themoviedb.org). A interface ainda precisa de logo aprovado e atribuição em Sobre/Créditos, conforme a [documentação oficial](https://developer.themoviedb.org/docs/faq). Aviso: “This product uses the TMDB API but is not endorsed or certified by TMDB.” README não substitui atribuição na interface.

Ícones: React Icons. Fontes: PT Sans e Source Sans Pro, locais em src/fonts/. Reset: Meyer Reset via cdnjs. Licenças detalhadas em [CREDITS.md](CREDITS.md). Licenças específicas serão registradas em CREDITS.md ao incorporar/substituir recursos; créditos dos estudos estão em [LICENSES.md](docs/design-previews/LICENSES.md).

Código sob [MIT](LICENSE), sem transferir direitos sobre dados, imagens e marcas de terceiros. Não há autenticação, lista persistente ou tratamento completo de erros. Interface legada em inglês; 404 em pt-BR. Há configuração parcial de headers, sem publicação validada ou Lighthouse reproduzível. Não publicar esta etapa como catálogo completo.
