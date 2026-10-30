# Relatório — conclusão dos itens 1 a 6

## Atualização vigente — carrossel e links (30/10/2026)

Carrossel automático contínuo a cada 7 s, sem play/pausa ou salto direto; restam apenas avançar/voltar, sem interromper a rotação por foco ou hover. Movimento reduzido remove a transição. Check aprovado: **341 testes Vitest em 32 arquivos**, lint/tipos/build/distribuição/formatação; **91 testes Playwright** aprovados. Os números de testes foram mantidos, com expectativas atualizadas para os ciclos contínuos e as duas setas. Axe não comprova conformidade integral das atualizações automáticas sem mecanismo de pausa.

Corrigidos 14 links quebrados após a limpeza documental; 39 links/âncoras locais nos sete arquivos Markdown verificados sem destinos ausentes. Arquivos removidos não foram recriados. Guia separado e JSONs Lighthouse não estão presentes; medições abaixo são históricas. Build atual: CSS 56,50 kB (9,47 gzip), JS 362,10 kB (111,95 gzip). Sem dependências novas, credenciais ou escrita no Git.

## Atualização anterior — idiomas e interações (histórico)

Base **2ec9c70**. Idiomas pt-BR/en-US, cache/cliente/proxy enumerados por preferência, carrossel manual + automático de 7 s com quadro fixo, ranking dourado menor, CTA só na home e correção de Referer do trailer. Guia de entrevista em Markdown/PDF de quatro páginas.

Check final: **340 testes Vitest em 32 arquivos**, lint/tipos/build/distribuição/formatação aprovados. Playwright: **90 casos**, incluindo 64 combinações de rota/largura/idioma com axe AA, sem overflow horizontal. Seis testes novos verificam idioma com recarga/lista/URL, CTA e estados em inglês, Referer real do iframe e src/dimensões do destaque nas duas larguras extremas, além de conferir limites dos rótulos do menu em 360/390 px. Sem rede real TMDB/YouTube.

O teste do player intercepta a requisição HTTPS e exige Referer igual à origem local, antes ausente por no-referrer. Isso valida a configuração corrigida, não disponibilidade/permissão de vídeo real. CSP, sandbox, ausência de autoplay e link externo seguro preservados.

Localização verificada por auditoria AST dos textos estáticos e chaves, paridade de parâmetros e testes de preferência/cache/cancelamento. Erros guardados mantêm mensagem canônica e traduzem na renderização. Preferência local é independente dos IDs; nenhuma resposta TMDB persistida.

Build: CSS **56,48 kB** (9,45 gzip), JS **363,63 kB** (112,32 gzip). Lighthouse não foi repetido nesta revisão: JSONs e pontuações abaixo retratam a entrega anterior, sem promessa de nota atual. Nenhuma dependência nova, credencial pública ou escrita no Git. Detalhes em [REVIEW.md](REVIEW.md) e início de [STATUS.md](../STATUS.md).

## Atualização anterior — Pulso Cinema (histórico)

Redesenho escuro solicitado pelo proprietário, com carrossel automático, grade densa, créditos, ícones unificados e demonstrações. Revisão por gravidade: [REVIEW.md](REVIEW.md). Resultado atual: **319 testes Vitest** e **52 Playwright**; a matriz clara foi retirada pela decisão de escuro fixo, preservando as oito rotas nas quatro larguras e adicionando as provas de rotação/dimensões e créditos/favicon. Check de implementação isolado e check final registrados no STATUS.

Lighthouse repetido após o redesenho: **home 100/100/100/100; catálogo 100/100/100/100**, na ordem desempenho/acessibilidade/boas práticas/SEO. Fixture local, uma medição por rota com throttling móvel simulado, sem promessa de nota em produção. Os JSONs de evidência foram removidos pelo proprietário na limpeza; estes números são apenas o registro histórico, não uma medição atual.

Build atual: CSS **56,13 kB / 9,40 kB gzip**; JS **349,75 kB / 107,55 kB gzip**. O aumento de CSS em relação à migração abaixo decorre das composições do novo layout; mídias do README não entram no bundle. O SVG da marca deriva também ICO/Apple Touch Icon.

12 screenshots em 1440×1000/390×844 e dois GIFs com oito quadros cada capturam a interface real, com dados fictícios/artes SVG próprias e sem TMDB. Codificação e decodificação verificadas localmente. A guarda de distribuição e os testes de CSP/cliente/proxy continuam ativos; nenhuma dependência nova nesta revisão.

Uma primeira execução E2E foi invalidada por reconstrução concorrente de dist; repetida com build estável, a suíte completa passou. Nenhuma regra da aplicação foi afrouxada para isso. Varredura de padrões não encontrou credenciais reais/caminhos locais; o hash público no nome da imagem de referência é um falso positivo documentado.

## Registro anterior — antes do redesenho

As contagens, métricas e referências a dois temas abaixo registram a entrega anterior. Seus números não são as medições vigentes; a abertura acima e STATUS prevalecem. O JSON after foi atualizado para a execução atual.

Base: 13bc68d, 29/10/2026. Trabalho autorizado em sequência, sem escrita no Git. Os registros antigos em STATUS.md são históricos; esta entrega mantém a direção Pulso e as decisões vigentes.

## Implementação

| Item           | Entrega                                                                                                                                                                                                          |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 — catálogos  | Filmes, pessoas e gêneros em Pulso; busca, filtros, paginação e histórico de URL. Uma página por consulta, sem carregamento antecipado de cinco/seis páginas.                                                    |
| 2 — detalhes   | Ficha, elenco/equipe, galeria, recomendações, biografia/filmografia e trailer por ação explícita, com youtube-nocookie e sem autoplay.                                                                           |
| 3 — lista/404  | Lista persistindo somente IDs, lotes de 12, corrupção/bloqueio/sincronização entre abas; 404 e recuperação de erro de renderização.                                                                              |
| 4 — legado     | Sass/CSS compilado/mapa, fontes TTF, reset Meyer e componentes sem uso removidos; Bricolage/Figtree locais, licenças integrais distribuídas.                                                                     |
| 5 — qualidade  | Hierarquia de títulos, fotos decorativas sem descrição duplicada, foco, teclado, contraste e movimento reduzido. CSP restrita sem inline/eval; Zod sem JIT para não disparar violações. Lighthouse reproduzível. |
| 6 — integração | Jornada completa, erros/vazio, armazenamento, temas, reflow/axe e Playwright no CI; instalação limpa pelo lockfile e documentação atualizada.                                                                    |

**Limite funcional explícito:** filtros com busca por título refinam somente a página devolvida pelo provedor. Sem termo, gênero/ano/nota/ordem consultam discover/movie. O aviso está junto aos controles; não se afirma filtragem global combinada.

## Verificação local

- Vitest: **273 antes → 311 depois**, em 28 arquivos, sem chamadas reais ao TMDB.
- Cobertura v8 informativa: **93,33% linhas**, 92,74% instruções, 89,55% branches e 89,36% funções. Sem percentual mínimo obrigatório; main/adaptador e caminhos de recuperação não estão integralmente exercitados por testes unitários.
- Playwright Chromium: **15 antes → 86 depois**. A matriz de 64 casos verifica oito rotas × quatro larguras (360/768/1024/1440) × dois temas, sem overflow horizontal e sem violações encontradas pelo axe nas regras WCAG AA e boas práticas selecionadas. Os demais casos cobrem navegação, carrossel, teclado, jornada completa, rede, armazenamento, movimento reduzido e CSP.
- Lint sem erros/avisos, TypeScript estrito, build, guarda de distribuição e Prettier integram npm run check.
- npm ci em cópia temporária sem node_modules ou ambientes privados instalou **518 pacotes**, pelo lockfile, usando cache local. O check do commit de implementação foi exercitado com README/STATUS/DESIGN/DEPENDENCIES/CREDITS e workflow anteriores; o check final cobre também a documentação e o CI atualizados.
- Desenvolvimento na cópia limpa com token explicitamente vazio: Vite iniciou, página retornou 200 e proxy retornou 502 genérico, sem expor o nome da variável privada. A porta de conferência foi encerrada após a verificação; nenhum pedido real ao TMDB.
- npm audit --audit-level=high: **zero vulnerabilidades**. Não certifica segurança da aplicação ou suporte das ferramentas; ESLint 9 EOL e React 19 continuam reavaliações documentadas.
- Build com marcador fictício, nunca segredo real: dist sem marcador, nome da variável privada, adaptador de desenvolvimento, servidor de fixtures ou hosts TMDB diretos. Guarda permanente em scripts/verifyDistribution.mjs.
- Varredura AST de src fora de cliente/testes: zero chamadas fetch/XMLHttpRequest/axios ou URLs diretas dos hosts de dados/imagens TMDB. ESLint mantém essa restrição.
- Padrões de caminhos absolutos de usuário e credenciais sem achados nos arquivos alterados. Isso não certifica o histórico nem detecta toda possível forma de segredo.

Uma execução concorrente de Vitest e quatro navegadores excedeu a espera curta de três testes; os checks finais são executados em sequência, como no CI, preservando as asserções. Nenhum prazo foi aumentado para ocultar falhas de aplicação.

## Lighthouse antes/depois

Lighthouse **13.6.0**, Chromium local do Playwright, build de produção e respostas fictícias, porta 4180. Modo mobile com throttling simulado e configurações padrão. Uma medição por rota em cada fotografia; não é benchmark estatístico nem resultado de produção.

| Rota               | Desempenho antes → depois | Acessibilidade | Boas práticas | SEO       |
| ------------------ | ------------------------- | -------------- | ------------- | --------- |
| /                  | 99 → 99                   | 100 → 100      | 92 → 100      | 100 → 100 |
| /catalog/popular/1 | 83 → 100                  | 96 → 100       | 92 → 100      | 100 → 100 |

CSS: **63,35 → 31,77 kB** (gzip 11,36 → 6,45 kB). JavaScript: **354,90 → 350,40 kB** (gzip 108,19 → 107,13 kB). A remoção do legado reduziu o CSS aproximadamente à metade. Fontes antigas não participam mais do bundle.

Os arquivos JSON da baseline e do resultado final foram removidos na limpeza. O resumo histórico permanece acima: a baseline foi capturada sobre o build 13bc68d antes da migração e o resultado final sobre a árvore daquela entrega. Uma nova execução gera novas evidências; não comprova novamente os números históricos.

Para repetir o resultado final, instale dependências e Chromium conforme README, rode npm run build e depois npm run audit:lighthouse, sem outras suítes concorrentes. Para reproduzir o antes, use uma cópia da revisão 13bc68d e o mesmo ferramental/fixtures. Variações da máquina e do navegador afetam as pontuações. Permanecem oportunidades informativas de reduzir JS não usado e a cadeia crítica de carregamento, listadas no JSON; não há promessa de nota fixa em hospedagem.

O aviso de CSP encontrado na medição intermediária veio da tentativa de JIT do Zod (new Function). O modo jitless foi centralizado em shared/zod.ts; a CSP permaneceu estrita e o teste de navegador exige ausência de securitypolicyviolation ao validar respostas/navegar.

## Segurança e limites da prova

| Risco                               | Proteção e evidência                                                                                                                              |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Endpoint/filtro arbitrário          | Allowlist, parâmetros estritos e testes Node em server/tmdb/extensions.test.ts; origem, idioma, adulto, timeout e limites anteriores preservados. |
| Respostas/URLs malformadas          | Schemas do cliente e testes src/api/tmdb/extensions.test.ts; chaves completas e AbortSignal.                                                      |
| Script/estilo remoto ou eval        | CSP self sem inline/eval, frame exclusivamente youtube-nocookie; server/security.test.ts e e2e/journey.spec.ts.                                   |
| Conexão ao YouTube antes da decisão | Iframe só após clique, chave validada, sem autoplay, fecha por botão/Escape; testes de detalhe e jornada.                                         |
| Persistência indevida               | Somente IDs de filmes e preferência de tema; src/test/savedMovies.test.tsx e jornada com recarga. Cache Query apenas em memória.                  |
| Exposição do servidor no bundle     | verify:dist no check e build com marcador fictício.                                                                                               |

O servidor de fixtures e o adaptador Vite não entram no bundle. Testar os headers localmente não confirma a aplicação deles pela Vercel. O player externo é substituído por fixture nos E2E; disponibilidade e comportamento real do YouTube exigem conferência posterior.

## Próxima etapa — antes da publicação

Continuam pendentes: logo aprovado TMDB, revisão dos termos de dados/proxy/cache de imagens, WAF no painel, quotas/custos e contador compartilhado, segredo/dados reais, CDN/rewrites/headers em hospedagem, validação entre navegadores/leitores de tela e execução remota do CI. Nenhum deploy realizado. Os detalhes vigentes estão no início de STATUS.md e no README.

O plano de staging anterior foi removido pelo proprietário. Mensagens de commit continuam em inglês; caminhos explícitos são entregues no relatório da solicitação. Não incluir arquivos de ambiente, segredos, node_modules, dist, coverage, relatórios HTML brutos, caches, logs ou capturas temporárias.
