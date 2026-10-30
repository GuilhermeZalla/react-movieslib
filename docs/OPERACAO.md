# Configuração e operação do MoviesLib

Documento de apoio para instalação, proxy, variáveis de ambiente, limites, verificações e publicação. A apresentação do projeto e as mídias ficam no [README](../README.md); decisões vigentes e pendências ficam no [STATUS.md](STATUS.md).

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

Preview em http://127.0.0.1:4173 é estático e **não executa /api**. Para funções e dados reais, use vercel dev, conforme abaixo. Os testes automatizados têm servidor de fixtures; as mídias de apresentação usam a aplicação real e seu proxy. Nenhum modo de dados fictícios é ativado no aplicativo publicado.

## Credenciais

Revogação da API key e do Bearer e geração de substitutos **informadas como concluídas pelo proprietário**, sem verificação do painel pelo agente. Os literais antigos foram retirados do código em etapa anterior; permanecem no histórico antigo. Reescrita de histórico: **não realizada, por decisão do proprietário**.

.env e variantes estão ignorados; .env.example contém somente o nome da variável com valor vazio. **TMDB_READ_ACCESS_TOKEN** é o token de leitura Bearer do TMDB, exclusivo do servidor. Nunca usar prefixo VITE_, copiar para src ou informar pelo chat/logs. Sem variável, o proxy retorna 502 genérico sem revelar seu nome. Authorization é enviado somente ao host TMDB fixo, nunca na query string ou ao navegador.

Configuração local e execução com a CLI Vercel:

1. Copie o exemplo para arquivo ignorado:

   ```powershell
   if (!(Test-Path .env.local)) { Copy-Item .env.example .env.local }
   ```

2. Preencha o valor apenas no editor local, a partir do gerenciador de senhas. Não cole o segredo em comandos de terminal. npm run dev já executa o adaptador local do proxy; é necessário reiniciar após mudar .env.local.
3. Para o ambiente equivalente às funções Vercel, execute a versão da CLI registrada no projeto:

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

O CI roda npm ci, check, cobertura, audit de altas/críticas e Playwright com Chromium e fixtures. Sem segredo ou deploy. Execução remota depende do push pelo proprietário. Dependabot acompanha npm/Actions. Medições e limites de Lighthouse em [QUALITY.md](quality/QUALITY.md); números anteriores ao redesenho são históricos.

### Atualizar fotos e GIFs

As mídias são capturas da aplicação com dados e imagens reais, sem fixtures ou pôsteres substitutos. Primeiro inicie npm run dev em outro terminal com o token já configurado no servidor. Depois, na raiz:

```powershell
npm.cmd exec playwright install chromium
npm.cmd run docs:media
```

O endereço padrão é http://127.0.0.1:5173. Para capturar outra instância sua, configure MOVIESLIB_DEMO_URL apenas com a URL pública do app, sem usuário/senha. O script não lê .env, tokens ou o perfil do seu navegador. Use a instância configurada; preview estático sem proxy não fornece dados reais. Não é necessário executar um build para capturar o servidor Vite em desenvolvimento.

Chromium usa perfis descartáveis, em português, com seis telas em 1440×1000 e 390×844. Filmes e pessoas são escolhidos pelos links reais, e os filmes de Minha lista são guardados pela interface; a lista pessoal do proprietário não é acessada. A gravação observa a troca automática do destaque e, no desktop, o hover. PNGs mantêm a qualidade da captura; GIFs usam a redução de resolução e paleta exigidas pelo formato.

Dados e imagens passam pelo proxy habitual, consumindo as cotas reais. O script recusa carregamento incompleto, erro de API ou overflow e só substitui os 12 PNGs e 2 GIFs quando as duas capturas terminam. Não gera ícones nem altera código do aplicativo. Mantenha os arquivos estáveis durante a gravação: alterações podem provocar recarga automática do Vite. Se houver 429, aguarde o limite reiniciar antes de repetir. Revise as mídias antes de versionar.

Capturas registram o catálogo no momento da gravação. Popularidade, disponibilidade e conteúdo podem mudar depois. As imagens de filmes e pessoas conservam os direitos dos respectivos titulares; a licença MIT do código não as relicencia. Atribuição em [CREDITS.md](../CREDITS.md), pendências de termos em [STATUS.md](STATUS.md).

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
