# Status do MoviesLib

Atualizado em 28/10/2026. Fase atual: **2 — lote 1 (Vite e checks mínimos) entregue, aguardando commit e próximo OK do usuário**. Plano da Fase 2 aprovado com ajustes; somente um lote por vez está autorizado. CRA removido, dev/build Vite e checks mínimos verificados. Dados reais dependem do proxy da Fase 3; termos TMDB seguem pendentes. Não iniciar lote 2 nesta entrega.

## Fases

- [x] 0. Inventário, varredura do histórico local, auditoria npm e proposta; documentação criada.
- [x] 0. OK do usuário e decisões sobre proxy, estilo, dados e extras registrados. Termos contratuais não acessíveis continuam como pendência.
- [x] 1. Criar docs/DESIGN.md e docs/design-previews/ com três direções distintas, amostras de home/detalhe e recomendação justificada.
- [x] 1. Usuário escolheu Caderno, com tema escuro padrão e tonalidade inspirada no PXN Games nos dois temas.
- [x] 2. Plano aprovado com execução de um lote por vez e parada para commit/OK.
- [x] 2. Lote 1: Vite sem CRA, entrada TS, checks mínimos, saneamento e 404 mínima.
- [ ] 2. Usuário commitar lote 1 e autorizar lote 2 (conversão TS completa).
- [ ] 2. Fundação: TypeScript, Vite, ferramentas de qualidade, testes, CI, ambiente e dependências.
- [ ] 3. Cliente TMDB, validação, cache, cancelamento, testes e proxy aprovado na Vercel.
- [ ] 4. Tokens, componentes base e layout responsivo.
- [ ] 5. Páginas existentes, busca/filtros, detalhes completos, Minha lista e 404.
- [ ] 6. Acessibilidade, desempenho, cabeçalhos e Lighthouse antes/depois.
- [ ] 7. E2E, créditos, documentação final e verificação de publicação/clone limpo. GIFs somente se solicitados.

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

| Decisão | Motivo e limites |
| --- | --- |
| Manter SPA React e plano de TypeScript, Vite e React Router | Modernizar qualidade sem ampliar a arquitetura; implementação somente nas fases autorizadas |
| Proxy serverless na Vercel, função mínima em /api | Manter a chave somente no ambiente do servidor; validar parâmetros, permitir apenas caminhos definidos, usar cache de borda curto e limitar requisições |
| Sem login/cadastro e sem coleta de dados pessoais pelo aplicativo | Não há necessidade de autenticação no escopo; não adicionar analytics, rastreamento ou cadastro. Documentar comunicação com TMDB, Vercel e YouTube sem prometer ausência de tratamento por terceiros |
| Tema claro/escuro e trailer com embed youtube-nocookie | Extras aprovados para a entrega; prever tokens para ambos os temas, contraste, carregamento do embed sob demanda e CSP compatível |
| Direção Caderno aprovada; tema escuro como padrão; tonalidade do PXN Games nos dois temas | Escolha do usuário combina a hierarquia editorial e o pôster protagonista do Caderno com carvão/cinzas e vermelho da referência. Preservar telas, fluxos e URLs do legado; adaptar a camada visual, sem assumir preservação da antiga paleta amarela |
| PXN Games é só referência de clima; paleta com hexadecimais próprios | Não copiar cores exatas, logo, textos ou layout. Antes da Fase 4, registrar no DESIGN.md como “paleta inspirada em” e recalcular AA nos dois temas. Não é necessário refazer os previews |
| Preservar pessoa/filmografia, em cartaz e em breve | Já existem no legado; preservar comportamento e corrigir os defeitos identificados |
| pt-BR/en, atalhos de teclado e comparação de filmes: **futuro** | Aprovados para evolução posterior, fora da implementação inicial; UI inicial em pt-BR. Acessibilidade básica por teclado continua obrigatória agora |
| API key e token Bearer revogados e substituídos, conforme relato do usuário | Tratar a exposição anterior sem depender da privacidade do repositório; não testar ou reproduzir valores, nem reescrever o histórico |
| Manter licença MIT existente | Preservar a licença escolhida pelo proprietário; recursos de terceiros mantêm seus próprios direitos |
| Tailwind CSS 4.3.3, estável mais recente consultada em 28/10/2026; DaisyUI e bibliotecas de componentes visuais **não utilizados** | Versão confirmada no [registro oficial npm](https://registry.npmjs.org/tailwindcss/latest). Seguir a [integração oficial com Vite](https://tailwindcss.com/docs/installation/using-vite): tailwindcss + @tailwindcss/vite, plugin na configuração Vite e @import "tailwindcss" no CSS. Definir tokens de cores, tipografia, espaçamento, raios, sombras e movimento no tema via @theme, conforme a [documentação oficial](https://tailwindcss.com/docs/theme), evitando valores arbitrários soltos nos componentes. Direções visuais implementáveis com Tailwind e esses tokens, sem biblioteca de componentes visuais por decisão do usuário. Reconfirmar a versão estável na Fase 2 antes de instalar; nada foi instalado nesta fase |
| TanStack Query | Cache e ciclo de consultas centralizados, deduplicação e integração de cancelamento, sem reconstruir um cache próprio |
| Cache TMDB apenas em memória no cliente e de borda curto no proxy | Política provisória enquanto os termos não são conferidos; não persistir respostas ou metadados TMDB em localStorage nem ativar persistência do cache de consultas |
| Minha lista persiste somente IDs | Guardar a seleção local sem armazenar títulos, pôsteres, sinopses ou outros metadados; leitura validada e dados consultados novamente quando necessário |
| Priorizar vulnerabilidades críticas e altas na Fase 2; documentar riscos restantes | Reduzir os riscos conhecidos antes de ampliar funcionalidades; reauditar e registrar o que restar, sem prometer resultado antes da execução |
| URL para busca/filtros/página e paginação acessível; npm com um lockfile | Manter navegação compartilhável e instalação reproduzível; remoção de yarn.lock somente na fundação aprovada |

Sobre o item 12: ele repete a ação já declarada como concluída no item 5. Registrar a revogação pelo relato do usuário, sem alegar execução pelo agente ou acesso ao painel TMDB. Novas credenciais devem ficar fora do código e dos arquivos versionados, preferencialmente em gerenciador de senhas e no ambiente do servidor na Vercel. A configuração local futura usará segredo de servidor em arquivo ignorado, sem prefixo VITE_.

## Pendências e desvios

- Literais revogados retirados do código no lote 1. Permanecem no histórico por decisão do proprietário; não enviar novos segredos pelo chat nem versioná-los.
- Implementar proxy aprovado na Vercel. Definir TTL curto de borda e mecanismo efetivo de rate limit; contador em memória não garante limite entre instâncias. Não persistir respostas TMDB para implementar esse controle.
- Completar o README na fase de configuração do proxy com os nomes efetivos das variáveis de servidor na Vercel e o passo a passo local com vercel dev ou equivalente, incluindo arquivo ignorado e .env.example sem valores reais. O README já registra a decisão e esclarece que o proxy ainda não está implementado.
- Usuário conferirá os termos completos sobre cache, retenção, redistribuição e demais cláusulas. Até lá, manter política provisória aprovada: memória no TanStack Query, borda curta no proxy e Minha lista somente com IDs; sem persistência de metadados TMDB em localStorage. A política não constitui confirmação contratual.
- Lote 1 com instalação, lint, typecheck, 11 testes e build verificados. Tipos ainda não cobrem internamente JS legado (allowJs, checkJs:false); conversão completa no lote 2. Dados reais, cache e proxy não foram validados ou implementados nesta etapa.
- Lighthouse antes/depois: **não medido**. Capturar baseline do legado antes de substituir a UI, em ambiente controlado; não medir uma página de erro como baseline.
- Responsividade em 360/768/1024/1440 px e contraste AA: riscos estáticos identificados, sem verificação visual.
- 404 mínima adicionada no lote 1 com estilos existentes. Equipe, recomendações e galeria continuam pendentes; não existiam no legado, embora o pedido as descrevesse como preservação.
- CREDITS.md, fontes locais/licenças, logo e atribuição na UI, headers e fallback SPA na Vercel pendentes das fases de implementação. Onde assistir continua fora da entrega inicial, sem aprovação específica.
- Varredura cobre referências locais existentes, não branches remotas ausentes, forks, reflogs ou objetos inalcançáveis. Detecção por padrões não prova ausência de qualquer segredo.

## Próximo passo concreto

**Parar após o lote 1, para revisão/commit e novo OK do usuário.** Próximo lote: conversão estrita completa para TypeScript. Não implementar ainda Tailwind/fontes, redesign, CI, cliente de dados ou proxy. O plano abaixo é a referência da sequência aprovada. Git segue somente leitura; staging, commits e pushes são feitos pelo usuário.

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

| Verificação | Resultado |
| --- | --- |
| npm run lint | Passou, 0 erros e 0 avisos |
| npm run typecheck | Passou; strict para entrada/config/testes TS, JS legado ainda com checkJs:false |
| npm run test -- --run | 1 arquivo, 11 testes passaram |
| npm run build | Passou; 54 módulos, JS 185,95 kB (gzip 56,84 kB), CSS 19,55 kB (gzip 3,56 kB) |
| npm run dev | Vite pronto em 267ms, 127.0.0.1:5173 |
| npm run preview | dist servido em 127.0.0.1:4173 |
| Instalação limpa | npm ci e os quatro checks repetidos em cópia temporária, todos passaram |
| Smoke de navegador | 8 rotas existentes + 404 em dev e preview: 18 acessos diretos; card → detalhe → voltar nos dois; sem exceções não tratadas |
| Audit | 2 moderadas (react-router e react-router-dom), 0 críticas/altas/baixas; atualização no lote de dependências |
| Revisão final | 80 arquivos versionáveis e dist sem valores de credenciais/padrões verificados ou caminhos locais de usuário; comparados os dois literais do HEAD sem imprimi-los. Sem dependências CRA no lockfile; hashes CSS preservados; git diff --check passou |

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

| Risco | Como detectar |
| --- | --- |
| HTML/entry, JSX em .js, imports e arquivos públicos diferentes entre CRA/Vite | Build de produção, servir dist, verificar carregamento de assets e ausência de React CDN |
| Rotas diretas e botão voltar quebrados; diferenças Router/React e remoção de exact | Smoke com fixtures nas URLs existentes, abrir detalhe por URL, navegar entre IDs e voltar; separar fallback Vercel de dev server |
| Tipos de props/refs e null/undefined expostos pela conversão | typecheck estrito, testes de componente e smoke com dados incompletos; sem any indiscriminado |
| Jest, setupTests e módulos CSS/fontes incompatíveis com Vitest/Vite | Testes em jsdom, mocks explícitos, verificação dos imports e do build final |
| Preflight, ordem CSS, pesos das fontes ou nova paleta mudarem o legado antes do redesign | Comparar capturas/estilos antes/depois e manter a infraestrutura visual sem ativação prematura |
| Efeitos legados dispararem requisições contínuas ou conteúdo falhar sem proxy | Rede isolada nos testes/smokes; observar contagem de chamadas. Loop não deve ser ocultado por fixture. Correção da camada de dados na Fase 3; qualquer bloqueio real da fundação é relatado antes de ampliar o escopo |
| Dados reais indisponíveis na Fase 2 porque o proxy só nasce na Fase 3 | Não usar segredo no browser nem simular validação da API real; testes com fixtures e limitação documentada. Não implantar Fase 2 como catálogo completo |
| Literais antigos acabarem em código convertido, bundle ou logs | Varredura de src, arquivos versionáveis e dist sem imprimir valores; .env.example sem segredo e nenhum token VITE_ |
| Atualizações reintroduzirem vulnerabilidades ou divergirem do lockfile | npm ci, audit e quatro checks após cada lote; registrar versões e advisories remanescentes |

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
