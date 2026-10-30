# MoviesLib

Projeto de estudo e portfólio feito por **Guilherme Zalla**, sem vínculo ou endosso do The Movie Database (TMDB) ou de estúdios. Código sob [licença MIT](LICENSE); fontes, ilustrações e atribuição em [CREDITS.md](CREDITS.md).

Catálogo de filmes e pessoas com React e um proxy serverless na Vercel. A interface reúne filmes populares, em cartaz e em breve, busca, filtros, detalhes, trailers, filmografias e uma lista pessoal local. Visual **Pulso Cinema**: tema exclusivamente escuro, carvão/cinzas, vermelho #C62828 e pôsteres em primeiro plano.

[Repositório do projeto](https://github.com/GuilhermeZalla/react-movieslib). Publicação ainda pendente; os dados reais exigem o token privado no servidor.

## Guia para entrevista

Os arquivos separados do guia não estão incluídos nesta árvore. Para explicar o projeto, consulte as [funcionalidades](#funcionalidades), a [estrutura e stack](#estrutura-e-stack) e o [roteiro de demonstração](#conferência-manual-com-dados-reais) deste README. O script docs:guide depende da recuperação do Markdown de origem antes de gerar um PDF.

## Idiomas

Use o seletor no rodapé para alternar **Português (Brasil)** e **English**. O português é o padrão; a preferência permanece ao recarregar e não apaga a lista nem muda as URLs. Textos da interface, gêneros conhecidos, datas/moeda e consultas de conteúdo acompanham o idioma. O TMDB pode não oferecer algumas traduções de sinopses/biografias; o projeto não inventa conteúdo ou usa tradutor externo. O aviso obrigatório de atribuição do TMDB permanece em inglês nos dois idiomas.

Preferência e IDs são configurações locais; respostas TMDB continuam apenas no cache em memória. Cada consulta inclui o idioma na chave, impedindo misturar respostas em português e inglês.

## Demonstrações

Gravações reais da interface executada no Chromium, com dados fictícios interceptados localmente e ilustrações SVG originais. Não são mockups nem capturas de dados/imagens do TMDB. A troca de destaque mostrada nos GIFs usa o controle manual; o avanço automático de 7 s tem teste próprio no navegador.

### Desktop

![Home, troca de destaque, catálogo, filme, pessoas, filmografia e Minha lista](docs/demo/movieslib-desktop.gif)

### Celular

<img src="docs/demo/movieslib-mobile.gif" alt="Navegação pelo MoviesLib no celular, da home até os filmes guardados" width="300">

## Screenshots

Capturas reais com o mesmo conteúdo fictício: desktop em **1440 × 1000** e celular em **390 × 844**. Os nomes, sinopses e artes da demonstração são locais; não representam lançamentos reais.

| Tela                 | Desktop                                                 | Celular                                                |
| -------------------- | ------------------------------------------------------- | ------------------------------------------------------ |
| Home                 | [Ver captura](docs/screenshots/home-desktop.png)        | [Ver captura](docs/screenshots/home-mobile.png)        |
| Catálogo e filtros   | [Ver captura](docs/screenshots/catalogo-desktop.png)    | [Ver captura](docs/screenshots/catalogo-mobile.png)    |
| Filme                | [Ver captura](docs/screenshots/filme-desktop.png)       | [Ver captura](docs/screenshots/filme-mobile.png)       |
| Pessoas              | [Ver captura](docs/screenshots/pessoas-desktop.png)     | [Ver captura](docs/screenshots/pessoas-mobile.png)     |
| Pessoa e filmografia | [Ver captura](docs/screenshots/pessoa-desktop.png)      | [Ver captura](docs/screenshots/pessoa-mobile.png)      |
| Minha lista          | [Ver captura](docs/screenshots/minha-lista-desktop.png) | [Ver captura](docs/screenshots/minha-lista-mobile.png) |

## Funcionalidades

- Home com carrossel dos populares que inicia sozinho, troca a cada 7 s e volta ao primeiro filme continuamente. Sem play, pausa ou seleção direta de slide; as únicas ações de navegação são avançar e voltar. Setas por mouse ou teclado reiniciam os 7 s sem desligar o automático; foco e hover não o interrompem. Movimento reduzido remove a transição, sem impedir o início automático. Cards sobem com zoom discreto no hover, com amplitude/duração menores no modo reduzido. A seção Em cartaz permanece, sem a abertura duplicada.
- Catálogos com busca normalizada, debounce de 300 ms, cancelamento e URL preservada. Filtros de gênero, ano, nota e ordem; paginação de uma página por requisição, até 500.
- **Limite dos filtros:** sem termo, consultam discover/movie. Com busca por título, refinam somente a página recebida de search/movie; o aviso aparece junto aos controles.
- Filmes com ficha, elenco, equipe, galeria e recomendações. Trailer youtube-nocookie só carrega ao clicar, sem autoplay, e fecha por botão/Escape. O iframe envia só a origem com strict-origin-when-cross-origin; há link alternativo no YouTube caso o player seja bloqueado.
- Pessoas com busca, paginação, biografia e filmografia deduplicada.
- Minha lista guarda **somente IDs** no localStorage (até 200), consulta 12 por página, sincroniza abas e trata armazenamento bloqueado/corrompido. É uma conveniência opcional, sem cadastro ou sincronização entre dispositivos. Persiste ao fechar o navegador; limpar os dados do site apaga a lista. O cache de respostas TMDB é separado e fica só em memória.
- Loading, vazio sem retry, erro com recuperação, 404 e barreira de erro de renderização. Layout responsivo e movimento reduzido; não há seletor de tema.

Sem login/cadastro, analytics ou coleta de dados pessoais pelo aplicativo. A infraestrutura e o YouTube têm suas próprias políticas; o player só é acessado por ação explícita.

## Estrutura e stack

React/DOM **18.3.1**, React Router **7.18.5**, Vite **8.3.5**, TypeScript **6.0.3** estrito, Tailwind **4.3.3**, Zod **4.6.7** e TanStack Query **5.105.0**. Sem DaisyUI ou biblioteca de componentes visuais. Fontes Bricolage Grotesque + Figtree locais, via Fontsource, SIL OFL 1.1. React 19 e o risco de suporte do ESLint 9 estão registrados em [DEPENDENCIES.md](docs/DEPENDENCIES.md).

```text
api/tmdb.ts                  entrada serverless Vercel
server/tmdb/                 política, handler, imagens e limites
server/dev/                  adaptador exclusivo de desenvolvimento
shared/                      parâmetros e contratos compartilhados
src/app/                     providers, rotas, barreira de erro e estilos
src/api/tmdb/                único cliente HTTP, schemas e consultas
src/components/base/         cards, controles, estados e trailer
src/components/movies/       carrossel de destaque
src/components/layout/       shell e navegação
src/pages/                   home, catálogos, detalhes, lista e 404
src/hooks/                   debounce, parâmetros, título e lista
src/i18n/                    preferência reativa e traduções locais
src/test/                    fixtures e testes de integração
e2e/                         jornada, reflow, carrossel e axe
scripts/demo/                conteúdo fictício, capturas e codificador GIF
docs/screenshots/ e docs/demo/ mídias reais da demonstração
docs/quality/                relatórios e resumos Lighthouse
```

Tokens em src/app/styles/theme.css (@theme); composições em components.css. Imports relativos; componentes em PascalCase, hooks/utilitários em camelCase e pastas em minúsculas/kebab-case. [STATUS.md](docs/STATUS.md) é a fonte da verdade; [DESIGN.md](docs/DESIGN.md) documenta as escolhas. /design existe apenas em desenvolvimento.

## Executar localmente

Requisitos: **Node.js 24.15.0** e **npm 11.12.1**. Na raiz, em PowerShell:

```powershell
npm.cmd ci
if (!(Test-Path .env.local)) { Copy-Item .env.example .env.local }
# Preencha o token no editor local, nunca no terminal ou no chat.
npm.cmd run dev
```

Abra http://127.0.0.1:5173. O Vite executa o proxy Node apenas no desenvolvimento; reinicie após alterar o ambiente ou atualizar o código do proxy. Se o projeto já está configurado, basta iniciar npm run dev, sem sobrescrever .env.local. No macOS/Linux, use npm no lugar de npm.cmd.

```powershell
npm.cmd run build
npm.cmd run preview
```

Preview em http://127.0.0.1:4173 é estático e **não executa /api**. Para funções e dados reais, use vercel dev, conforme abaixo. Testes e demonstrações possuem seu próprio servidor de fixtures; isso não configura dados fictícios no aplicativo publicado.

## Credenciais

Revogação da API key e do Bearer e geração de substitutos **informadas como concluídas pelo proprietário**, sem verificação do painel pelo agente. Os literais antigos foram retirados do código neste lote; permanecem no histórico antigo. Reescrita de histórico: **não realizada, por decisão do proprietário**.

.env e variantes estão ignorados; .env.example contém somente o nome da variável com valor vazio. **TMDB_READ_ACCESS_TOKEN** é o token de leitura Bearer do TMDB, exclusivo do servidor. Nunca usar prefixo VITE_, copiar para src ou informar pelo chat/logs. Sem variável, o proxy retorna 502 genérico sem revelar seu nome. Authorization é enviado somente ao host TMDB fixo, nunca na query string ou ao navegador.

Configuração local e execução com a CLI Vercel:

1. Copie o exemplo para arquivo ignorado:

   ```powershell
   if (!(Test-Path .env.local)) { Copy-Item .env.example .env.local }
   ```

2. Preencha o valor apenas no editor local, a partir do gerenciador de senhas. Não cole o segredo em comandos de terminal. npm run dev já executa o adaptador local do proxy; é necessário reiniciar após mudar .env.local.
3. Para o ambiente equivalente às funções Vercel, execute a CLI consultada nesta entrega:

   ```powershell
   npm.cmd exec --package=vercel@65.5.0 -- vercel dev
   ```

   Na primeira execução, faça login/vincule ao seu projeto conforme os prompts da CLI. Configure antes a variável no ambiente Development do painel (passo 4): vercel dev baixa essas variáveis em memória, sem precisar de env pull. Isso cria .vercel ignorado; não versione. Use preset Vite, build npm run build e saída dist. Abra o endereço informado pela CLI (normalmente porta 3000). A integração com a conta e o deploy não foram executados pelo agente. [Ambiente local oficial](https://vercel.com/docs/environment-variables).

4. No painel do projeto Vercel, abra Settings → Environment Variables e crie TMDB_READ_ACCESS_TOKEN para os ambientes desejados (Development, Preview, Production), com o valor privado. Reimplante versões já publicadas para aplicar alterações; o agente não publicou nada. Não configurar essa variável como pública ou VITE_.

### Política do proxy

Somente GET em /api/tmdb/...; outros métodos retornam 405/Allow: GET. Endpoints JSON permitidos: movie/popular, movie/top_rated, movie/now_playing, movie/upcoming, trending/movie/day, person/popular, search/movie, search/person, genre/movie/list, movie/:id, movie/:id/credits, person/:id, person/:id/movie_credits, movie/:id/videos, movie/:id/images, movie/:id/recommendations e discover/movie. Descoberta aceita gênero, ano (1870–2100), nota mínima (0–10) e ordenação enumerada; recomendações aceitam página. page (1–500) somente em listas/buscas; query (até 200 caracteres normalizados) somente nas buscas; append_to_response=credits somente em movie/:id. IDs positivos seguros. Para imagens, apenas image/w500/:arquivo com nome simples e extensão jpg/jpeg/png/webp; origem fixa image.tmdb.org, sem repassar o token, sem URLs ou tamanhos escolhidos pelo cliente. path é apenas o transporte do rewrite, sujeito às mesmas listas; URLs externas, traversal, barras ambíguas, codificação dupla, parâmetros desconhecidos/duplicados são rejeitados.

O servidor aceita **locale=pt-BR ou locale=en-US**, validado e sem duplicatas; sem parâmetro usa pt-BR. Reconstrói language apenas com esses valores e impõe **include_adult=false**. Os parâmetros brutos language/include_adult enviados pelo cliente são ignorados, inclusive duplicados. O nome/host do TMDB e o token continuam exclusivos do servidor. [Idiomas na documentação oficial](https://developer.themoviedb.org/docs/languages). Entradas explicitamente adult=true são removidas das listas/créditos; detalhes com esse sinalizador retornam 404. Isso depende da classificação fornecida pelo TMDB e não é moderação de conteúdo.

Timeout de 8 s inclui o corpo; resposta JSON máxima de 2 MB, validada pelos schemas. Imagens têm limite de 5 MB e Content-Type permitido (JPEG/PNG/WebP); o proxy devolve os bytes sem transformar o arquivo. Erros públicos padronizados em JSON, sem corpo/mensagem/stack upstream e sem logs do proxy. Redirects upstream são bloqueados. Respostas JSON e imagem têm Content-Type adequado e nosniff; nenhum CORS aberto. Ausência de CORS não autentica o endpoint público nem impede clientes fora do navegador.

Somente 200 recebe Vercel-CDN-Cache-Control: public, s-maxage=60, stale-while-revalidate=15. Cache-Control: no-store para o navegador em todas as respostas; erros não recebem cache de borda. Não aumentar os 60 s antes de confirmar os termos. CSP limita scripts, estilos, fontes, imagens e conexões à mesma origem, sem unsafe-inline/eval; frames somente de https://www.youtube-nocookie.com. Headers em vercel.json; rewrites excluem /api do fallback da SPA. Comportamento efetivo de CDN/roteamento em hospedagem ainda requer conferência após deploy.

### Limite de requisições

**Plano B no código: melhor esforço, por instância.** Contadores globais anônimos separados: 60 requisições JSON e 300 imagens válidas/minuto por processo, compartilhados entre todos os visitantes da instância; sem armazenar ou registrar IP, sem mapa crescente de clientes. Excesso retorna 429/Retry-After e no-store. Reinícios/cold starts e instâncias diferentes renovam a quota; não garante limite distribuído ou por visitante. Só conta chamadas que chegam à função, não hits já servidos pela CDN.

**Plano A no painel: WAF Vercel, ativação não confirmada.** Está disponível no Hobby: uma regra por projeto, dentro de três regras customizadas; janela fixa de 10 s a 10 min, chaves IP/JA4, 1 milhão de requisições permitidas incluídas. Contadores regionais. Confira disponibilidade/uso atual da conta antes de ativar. [Limites oficiais](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting).

1. Abra projeto → Firewall → Configure → New Rule.
2. Nomeie a regra e defina a condição de caminho: começa com /api/tmdb **e não começa com /api/tmdb/image/**. O tráfego de imagem tem quota separada no código; incluir imagens nesta regra de 60/min pode bloquear a montagem de catálogos.
3. Ação Rate Limit, algoritmo Fixed Window, chave IP, janela 60 s e limite 60 solicitações.
4. Use bloqueio 429, não somente Log/Challenge. Confira a revisão de uso/custos mostrada pela conta.
5. Salve, revise e publique a regra no painel; confira depois em Firewall Observability e registre a ativação no STATUS. O agente não acessou nem alterou o painel. O aplicativo não grava IPs; o tratamento pelo provedor segue suas políticas.

Regras WAF não são exercitadas por testes locais ou pelo adaptador de desenvolvimento. O contador no código permanece como proteção complementar.

## Verificações reproduzíveis

```powershell
npm.cmd run check
npm.cmd run test:coverage
npm.cmd exec playwright install chromium
npm.cmd run test:e2e -- --reporter=line
npm.cmd run audit:lighthouse
```

check roda lint → tipos estritos → Vitest → build → verify:dist → Prettier. A guarda de distribuição recusa variável privada, adaptador, fixtures e hosts TMDB diretos no bundle. ESLint aceita zero avisos e bloqueia rede fora do cliente, com exceções comentadas para mocks. Testes de servidor usam Node; os demais, jsdom. Cobertura v8 é informativa e ignorada pelo Git.

Playwright executa um build de produção com fixtures locais na porta 4180 e headers de vercel.json, sem token ou rede externa. Cobre navegação, busca, filtros, detalhes, trailer, lista, pessoas, 404, teclado, axe e reflow em 360/768/1024/1440 px no tema escuro e nos dois idiomas, além de ciclos contínuos, ausência de play/pausa, setas e dimensões uniformes do destaque. O Referer do player é conferido com embed interceptado; isso não garante reprodução de qualquer vídeo real. Axe não avalia integralmente atualizações automáticas; a remoção do mecanismo de pausa é uma decisão visual do proprietário, não uma prova de conformidade AA. Os testes também não certificam CDN ou WAF.

O CI roda npm ci, check, cobertura, audit de altas/críticas e Playwright com Chromium e fixtures. Sem segredo ou deploy. Execução remota depende do push pelo proprietário. Dependabot acompanha npm/Actions. Medições e limites de Lighthouse em [QUALITY.md](docs/quality/QUALITY.md); números anteriores ao redesenho são históricos.

### Recriar as mídias

```powershell
npm.cmd run build
npm.cmd exec playwright install chromium
npm.cmd run docs:media
```

O script usa a porta 4182, captura as seis telas em duas larguras e monta dois GIFs com um codificador local, sem adicionar dependências. Também deriva ICO e Apple Touch Icon do SVG da marca. Não usa .env, token ou rede TMDB, não altera a API de produção e não publica nada.

## Conferência manual com dados reais

Com o token privado configurado, em npm run dev ou vercel dev:

1. Abra / e aguarde 7 s, sem clicar em nenhum botão. Confirme a troca automática, inclusive com movimento reduzido ligado, e imagens com a mesma altura. Experimente as setas com mouse e teclado; a troca automática deve continuar em ciclos, sem botão de pausa/play. Os traços de posição são apenas visuais. Passe o mouse nos cards: subida/zoom devem aparecer e ficar mais suaves no modo reduzido. Abas em segundo plano podem ter temporizadores limitados pelo próprio navegador.
2. Abra diretamente /catalog/popular/1, /upcoming_&_just_released/upcoming/1, /top_rated/top_rated/1, /genres/18/Drama, /cast, /minha-lista e uma URL inexistente. Abra filme e pessoa pelo catálogo; recarregue e teste voltar/avançar.
3. Busque filmes/pessoas, avance página, altere gênero rapidamente e teste termo sem resultados. Confira os filtros na URL e o aviso de refinamento por página.
4. Abra/feche trailer e confira elenco, equipe, galeria e recomendações. Antes do clique não deve haver conexão com YouTube; dados/imagens passam apenas pelo proxy da mesma origem.
5. Guarde/remova filmes, recarregue Minha lista e confira só IDs no armazenamento. Limpar os dados do site remove a lista; nenhum dado TMDB é persistido.
6. Use teclado, foco visível e zoom em desktop/celular. Simule Offline numa consulta nova fora do cache, volte a Online e tente novamente; vazio não oferece retry. Confira créditos, link do repositório e favicon. Troque o idioma no rodapé, recarregue e confirme a preferência, gêneros, lista e URL preservados; o link A próxima sessão aparece somente na home.

## Antes da publicação

- Obter/integrar logo **aprovado** TMDB na seção Créditos, menor que a marca do app. O aviso exato em inglês permanece; texto não substitui o logo.
- Conferir termos sobre dados, proxy/cache de imagens e atribuição. Cache provisório de borda em 60 s; reavaliar proxy de imagens versus CDN direto com CSP restrita após os termos.
- Ativar/testar WAF no painel; medir quotas/custos e limite compartilhado de 60 JSON/300 imagens por minuto por instância. Tráfego alto pode quebrar imagens por 429.
- Validar funções, rewrites, headers/CDN, token e trailer com dados reais no ambiente publicado; conferir privacidade e acessibilidade em navegadores/leitores de tela.

pt-BR/en estão implementados. Atalhos próprios e comparação de filmes permanecem futuros. Nenhuma publicação, alteração de histórico ou escrita no Git foi executada.
