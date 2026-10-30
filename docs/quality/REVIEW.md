# Revisão do Pulso Cinema

## Ajuste vigente — rotação contínua e limpeza documental (30/10/2026)

Por decisão do proprietário, o destaque não oferece play/pausa nem seleção direta; apenas avançar/voltar. Foco, hover e setas não interrompem a rotação de 7 s, que retorna ao primeiro slide continuamente. Indicadores são decorativos e o timer é limpo ao desmontar. Movimento reduzido remove a transição, preservando a troca. As descrições antigas de pausa abaixo são históricas. Axe não cobre integralmente os requisitos de atualização automática; sua aprovação não comprova conformidade dessa interação sem mecanismo de pausa.

Links para previews, plano de commit e JSONs removidos foram retirados, sem recriar os arquivos. Links do guia ausente também foram substituídos por orientação existente no README. Resultados finais desta revisão no início do STATUS.

## Correções posteriores — idiomas, reprodução e proporções

Base 2ec9c70. O proprietário relatou problemas reais após a entrega anterior; os resultados antigos abaixo não bastavam para garantir a experiência desejada.

| Gravidade | Achado                                                                                       | Correção e prova                                                                                                                                                                               |
| --------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Média     | Seleção manual desativava definitivamente o automático; min-height mudava com textos longos. | Manual por mouse reinicia 7 s; altura fixa por breakpoint. Navegador confere src e dimensões com imagem vertical/horizontal e título/sinopse longos.                                           |
| Média     | iframe no-referrer suprimia a identificação necessária ao YouTube.                           | strict-origin-when-cross-origin, Referer real com origem conferido no navegador, alternativa externa segura. Disponibilidade de vídeo real continua externa à prova.                           |
| Média     | Idioma fixo en-US e textos de interface em português.                                        | Nova preferência enumerada no proxy, pt-BR padrão, traduções locais e cache por idioma com cancelamento. Entradas desconhecidas/duplicadas continuam rejeitadas; include_adult=false não muda. |
| Baixa     | Ranking branco grande e CTA repetido em todas as telas.                                      | Dourado discreto, 36 px, fundo com contraste AA; link somente na home.                                                                                                                         |

Erros guardados em estado mantêm a mensagem canônica e são traduzidos na renderização, permitindo também trocar um aviso já aberto de inglês para português. Nenhum novo pacote, autenticação, migração, segredo público, alteração de limite ou aumento de cache. Guia de entrevista em Markdown/PDF; medições Lighthouse anteriores não representam esta revisão. Resultados atuais no início do STATUS.

## Registro da revisão anterior

29/10/2026. Revisão do código recente e dos ajustes solicitados, sem escrita no Git, mudança de contrato da API ou dependência nova. As correções abaixo foram precedidas pelo relato de gravidade/impacto ao proprietário. Nenhum achado grave identificado no escopo examinado; isso não equivale a uma auditoria de segurança integral.

| Gravidade | Problema e impacto                                                                                      | Correção / evidência                                                                                                                                                                                       |
| --------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Média     | Pausar ao passar o mouse em toda a abertura podia congelar a rotação com o cursor parado sobre o fundo. | Pausa por hover restrita aos controles e ações; relógio controlado comprova avanço de 7 s sobre o fundo, pausa e retomada. Foco, aba oculta e movimento reduzido continuam respeitados.                    |
| Média     | Dimensões intrínsecas de imagens verticais e horizontais podiam alterar o quadro e desalinhá-lo.        | Pôster 2:3 e imagem absoluta com cover; hero com quadro responsivo estável. Teste de navegador mistura as duas orientações e compara dimensões com tolerância inferior a 1 px para arredondamento do grid. |
| Média     | Regra de hover podia vencer a regra de movimento reduzido por especificidade.                           | Hover animado limitado a prefers-reduced-motion:no-preference; teste real verifica ausência de transformação e transição no modo reduzido.                                                                 |
| Baixa     | Duas buscas com rótulo parecido confundiam a identificação do campo.                                    | Busca global “Pesquisar catálogo” e busca local por filme/pessoa com formulários nomeados; jornada automatizada usa consultas acessíveis.                                                                  |
| Baixa     | Marca/favicon divergentes e autoria/repositório ausentes.                                               | SVG único compartilhado no cabeçalho e favicon; ICO/Apple renderizados do mesmo SVG. Créditos e link externo com noopener noreferrer testados.                                                             |
| Baixa     | Alternância de tema e descrições da documentação contrariavam a nova decisão de escuro fixo.            | ThemeToggle removido, testes atualizados, nenhuma leitura/escrita de preferência; decisão atual separada do histórico.                                                                                     |

## Arquitetura e manutenção

- O carrossel recebe a consulta de populares existente; nenhuma chamada adicional à API a cada slide. Lista limitada a seis, timer e listeners limpos no unmount, pausa com aba oculta. Navegação manual não reinicia o automático sem escolha explícita.
- Shell, card e filtros reutilizam os contratos existentes. SaveMovieButton mantém largura cheia por padrão e oferece largura natural para as ações do hero; não muda o armazenamento. Sem rotas novas de produção.
- Tokens em @theme e composições no CSS existente. Um SVG evita duplicar o desenho da marca. Sem dependência de carrossel, GIF, CDN ou biblioteca de componentes.
- ESLint/TypeScript verificam imports/variáveis não usados. Removido ThemeToggle sem uso após a decisão; exclusões anteriores de Sass/fontes/componentes legados já estavam pendentes e foram preservadas. Não se afirma que todo export não referenciado foi eliminado: componentes da amostra /design continuam intencionais.
- Comentários novos explicam limitações concretas (arredondamento de subpixel e LZW); não foi feita reescrita de estilo nem remoção de documentação/agentes. Os scripts de demonstração ficam fora do bundle.

## Erros, dados e segurança

O aplicativo é público e somente leitura: não há conta, autorização de usuário ou banco a migrar. Minha lista é opcional e local, apenas IDs validados; limpar os dados do site a apaga. Respostas TMDB não são persistidas. Providers e cliente centralizado existentes continuam tratando armazenamento bloqueado, erro/vazio, parâmetros, schemas e cancelamento. O visual não altera allowlists, origens, token, limites ou cache do proxy.

Textos da API são renderizados como texto, sem HTML bruto. Links externos mantêm rel seguro; trailer continua opt-in. CSP, guarda de rede do ESLint e verify:dist continuam obrigatórios. Capturas/GIFs usam somente fixtures fictícias e SVGs próprios, sem segredo, imagem ou requisição TMDB.

## Verificação e limites

Resultados finais no início de STATUS.md. Vitest cobre timer, pausa/retomada, foco, hover, movimento reduzido, visibilidade, ausência de chamadas novas e limpeza; Playwright verifica rotação real, dimensões, créditos, navegação, rede/vazio, armazenamento, CSP, axe AA e quatro larguras. Testes e captura são sequenciais em relação a builds: reconstruir dist enquanto um preview o serve invalida a execução.

Permanecem fora desta prova: logo aprovado TMDB, termos de dados/imagens/cache, WAF no painel, limites/custos sob tráfego, funções/CDN na Vercel e comportamento real do YouTube/leitores de tela. Nenhum deploy ou ativação de serviço realizado. Não reutilizar métricas históricas de Lighthouse como resultado do layout atual.
