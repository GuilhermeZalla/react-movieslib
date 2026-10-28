# Status do MoviesLib

Atualizado em 28/10/2026. Fase atual: **1 — direções visuais entregues, aguardando escolha do usuário**. Fase 0 aprovada e informada como commitada pelo usuário; Fase 1 autorizada. Nesta fase foram criados somente docs/DESIGN.md e docs/design-previews/, com atualização deste STATUS.md. Nenhum código da aplicação, dependência ou configuração foi alterado. A leitura integral dos termos TMDB e a validação da aplicação em execução continuam pendentes.

## Fases

- [x] 0. Inventário, varredura do histórico local, auditoria npm e proposta; documentação criada.
- [x] 0. OK do usuário e decisões sobre proxy, estilo, dados e extras registrados. Termos contratuais não acessíveis continuam como pendência.
- [x] 1. Criar docs/DESIGN.md e docs/design-previews/ com três direções distintas, amostras de home/detalhe e recomendação justificada.
- [ ] 1. Usuário escolher entre Caderno, Sala 02 e Atlas; nenhuma direção foi aprovada ainda.
- [ ] 2. Fundação: TypeScript, Vite, ferramentas de qualidade, testes, CI, ambiente e dependências.
- [ ] 3. Cliente TMDB, validação, cache, cancelamento, testes e proxy aprovado na Vercel.
- [ ] 4. Tokens, componentes base e layout responsivo.
- [ ] 5. Páginas existentes, busca/filtros, detalhes completos, Minha lista e 404.
- [ ] 6. Acessibilidade, desempenho, cabeçalhos e Lighthouse antes/depois.
- [ ] 7. E2E, créditos, documentação final e verificação de publicação/clone limpo. GIFs somente se solicitados.

## Evidências

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

- Remover credenciais antigas do código na fase de implementação autorizada. Revogação e substituição já informadas pelo usuário; não enviar novos segredos pelo chat nem versioná-los.
- Implementar proxy aprovado na Vercel. Definir TTL curto de borda e mecanismo efetivo de rate limit; contador em memória não garante limite entre instâncias. Não persistir respostas TMDB para implementar esse controle.
- Completar o README na fase de configuração do proxy com os nomes efetivos das variáveis de servidor na Vercel e o passo a passo local com vercel dev ou equivalente, incluindo arquivo ignorado e .env.example sem valores reais. O README já registra a decisão e esclarece que o proxy ainda não está implementado.
- Usuário conferirá os termos completos sobre cache, retenção, redistribuição e demais cláusulas. Até lá, manter política provisória aprovada: memória no TanStack Query, borda curta no proxy e Minha lista somente com IDs; sem persistência de metadados TMDB em localStorage. A política não constitui confirmação contratual.
- Sem node_modules: runtime, testes e build não executados. Lint/tipos sem scripts; teste template incompatível com o conteúdo atual por inspeção.
- Lighthouse antes/depois: **não medido**. Capturar baseline do legado antes de substituir a UI, em ambiente controlado; não medir uma página de erro como baseline.
- Responsividade em 360/768/1024/1440 px e contraste AA: riscos estáticos identificados, sem verificação visual.
- 404, equipe, recomendações e galeria não existem no legado, embora o pedido os descreva como preservação; planejar implementação dentro do escopo solicitado.
- CREDITS.md, fontes locais/licenças, logo e atribuição na UI, headers e fallback SPA na Vercel pendentes das fases de implementação. Onde assistir continua fora da entrega inicial, sem aprovação específica.
- Varredura cobre referências locais existentes, não branches remotas ausentes, forks, reflogs ou objetos inalcançáveis. Detecção por padrões não prova ausência de qualquer segredo.

## Próximo passo concreto

**Parar e aguardar a escolha visual do usuário.** Abrir [o índice dos previews](design-previews/index.html), alternar claro/escuro em cada direção e escolher 01 Caderno, 02 Sala 02 ou 03 Atlas, ou solicitar ajustes. Recomendação: Caderno, sem tratá-la como decisão já aprovada. Não iniciar Fase 2 ou implementar o design no aplicativo antes da autorização correspondente.

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
