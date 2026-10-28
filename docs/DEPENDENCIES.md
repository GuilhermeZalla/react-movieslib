# Inventário de dependências

Este inventário preserva os achados originais e registra a atualização do lote 1. O [STATUS.md](STATUS.md) é a fonte da verdade das decisões vigentes.

## Atualização — Fase 2, lote 1

Em 28/10/2026, o lockfile foi regenerado sem CRA (agora lockfileVersion 3) e as dependências foram instaladas. Removidos react-scripts, Web Vitals, ferramentas Jest do template e transitivos exclusivos; sem webpack, eslint-config-react-app ou babel-preset-react-app no lockfile. Somente package-lock.json permanece; yarn.lock removido. Sem force/legacy-peer-deps.

| Ferramenta | Versão instalada | Observação |
| --- | --- | --- |
| Vite / plugin React | 8.3.5 / 6.1.2 | Build/dev verificados; React/DOM 18.2.0, Router 6.3.0 e Icons 4.4.0 preservados |
| TypeScript / typescript-eslint | 6.0.3 / 8.72.1 | TS 6 dentro do peer do parser; allowJs provisório para legado |
| ESLint / @eslint/js | 10.13.0 / 10.0.1 | Versões suportadas, sem o plugin React antigo que limitava ESLint a 9 |
| Prettier | 3.9.10 | Configuração mínima; formatação global em lote posterior |
| Vitest / jsdom | 4.1.12 / 30.1.3 | Vitest 5 tinha declarações incompatíveis com jest-dom 7; sem skipLibCheck |
| Testing Library React / DOM / jest-dom | 16.3.3 / 10.4.2 / 7.0.1 | Dependências de desenvolvimento; 11 testes passando |
| Node / npm | 24.15.0 / 11.12.1 | Ambiente validado; .node-version e engines registrados |

Nova auditoria: **2 entradas moderadas, 0 críticas, 0 altas e 0 baixas**. São react-router e react-router-dom 6.3.0; não equivalem a explorações comprovadas no aplicativo. Router preservado para isolar a troca de build; atualização/revalidação no lote de dependências, antes da publicação.

- [GHSA-9jcx-v3wj-wh4m](https://github.com/advisories/GHSA-9jcx-v3wj-wh4m): redirecionamento externo inesperado com caminhos não confiáveis.
- [GHSA-wrjc-x8rr-h8h6](https://github.com/advisories/GHSA-wrjc-x8rr-h8h6): redirecionamento aberto com barra invertida em Link/useNavigate.
- As rotas atuais são construídas internamente; não aceitar destinos externos de busca/URL. Isso não dispensa atualizar a biblioteca e não foi usado para declarar o risco resolvido.

Tailwind/fontes locais ficam no lote próprio da Fase 2; TanStack Query e proxy na Fase 3. Sem segredo em VITE_: literais retirados, cliente aponta a /api/tmdb sem credencial.

## Fotografia original — Etapa 0

Consulta original em 28/10/2026 sobre package-lock.json então com lockfileVersion 2, sem node_modules. Tabelas históricas abaixo não representam o conjunto atualmente instalado.

## Dependências diretas do legado

Fonte das versões consultadas: npm outdated --json --package-lock-only --ignore-scripts, usando o registro npm na análise inicial. O campo current não é informado sem instalação; a coluna resolvida vem do lockfile. latest não garante compatibilidade: verificar engines, peers e APIs na fundação. Não houve nova auditoria nesta sincronização documental.

| Pacote | Declarada | Resolvida | Latest consultada |
| --- | --- | --- | --- |
| @testing-library/jest-dom | ^5.14.1 | 5.16.4 | 7.0.1 |
| @testing-library/react | ^13.0.0 | 13.3.0 | 16.3.3 |
| @testing-library/user-event | ^13.2.1 | 13.5.0 | 14.6.8 |
| react | ^18.2.0 | 18.2.0 | 19.3.1 |
| react-dom | ^18.2.0 | 18.2.0 | 19.3.1 |
| react-icons | ^4.4.0 | 4.4.0 | 5.7.0 |
| react-router-dom | ^6.3.0 | 6.3.0 | 7.18.5 |
| react-scripts | ^5.0.1 | 5.0.1 | 5.0.1 |
| web-vitals | ^2.1.0 | 2.1.4 | 6.2.3 |

react-scripts já está na latest consultada, mas CRA está descontinuado para novos projetos: [comunicado oficial](https://react.dev/blog/2025/02/14/sunsetting-create-react-app). Atualizar só react-scripts não resolve a manutenção da cadeia antiga. Manter somente package-lock.json na migração aprovada; yarn.lock continua inalterado nesta fase.

## Stack aprovada para a migração

SPA React, TypeScript, Vite, React Router e TanStack Query. Estilo: **Tailwind CSS 4.3.3**, versão estável registrada na consulta de 28/10/2026, ainda não instalada, com @tailwindcss/vite e tokens em @theme (cores, tipografia, espaçamento, raios, sombras e movimento). Reconfirmar a versão estável e a compatibilidade na Fase 2. **DaisyUI e bibliotecas de componentes visuais não utilizados**. Referências: [integração Vite](https://tailwindcss.com/docs/installation/using-vite) e [tema](https://tailwindcss.com/docs/theme).

Proxy serverless na Vercel aprovado, com segredo só no servidor, validação de parâmetros, caminhos permitidos, cache de borda curto e limite de requisições. TanStack Query mantém cache apenas em memória; não adicionar persistência de respostas ou metadados TMDB em localStorage. Minha lista guarda somente IDs. Política provisória, **pendente da conferência dos termos pelo proprietário**. Tema claro/escuro e trailer youtube-nocookie aprovados; pt-BR/en, atalhos de teclado e comparação ficam como futuro. Sem login/cadastro ou coleta de dados pessoais pelo aplicativo; manter MIT.

## Auditoria do lockfile

Comando: npm audit --json --package-lock-only --ignore-scripts. Consulta concluída após repetição com acesso de rede autorizado e cache temporário externo ao repositório. Não foi executado audit fix ou install.

**96 entradas de pacotes afetados: 8 críticas, 40 altas, 26 moderadas e 22 baixas.** Essas contagens incluem metavisos herdados de dependências e não são 96 falhas únicas ou prova de exploração na aplicação. O package.json declara inclusive ferramentas de teste/build em dependencies; a classificação npm prod não equivale a código servido ao navegador.

Entradas diretas afetadas: @testing-library/jest-dom, react-router-dom e react-scripts, com severidade moderada conforme npm. As oito entradas críticas são transitivas; analisar contexto de build, servidor de desenvolvimento e código embarcado. Uma SPA estática não executa automaticamente todos os servidores e parsers da cadeia npm.

A coluna versões lista versões afetadas presentes nos nós identificados pelo audit. via contém nomes de dependências quando a entrada herda risco; links são advisories informados pelo registro. A faixa é a faixa vulnerável reportada, não a recomendação de versão.

| Pacote | Severidade | Direta | Vers?es no lockfile | Faixa reportada | Via / advisories |
| --- | --- | --- | --- | --- | --- |
| @babel/core | low | Não | 7.18.6, 7.9.0 | <=7.29.0 | [1123528](https://github.com/advisories/GHSA-4x5r-pxfx-6jf8) |
| @babel/helpers | moderate | Não | 7.18.6, 7.9.0 | <7.26.10 | [1104001](https://github.com/advisories/GHSA-968p-4wvh-cqc8) |
| @babel/plugin-transform-modules-systemjs | high | Não | 7.18.6 | 7.12.0 - 7.29.0 | [1120258](https://github.com/advisories/GHSA-fv7c-fp4j-7gwp) |
| @babel/runtime | moderate | Não | 7.18.6, 7.9.0 | <7.26.10 | [1104000](https://github.com/advisories/GHSA-968p-4wvh-cqc8) |
| @babel/runtime-corejs3 | moderate | Não | 7.18.6 | <7.26.10 | [1103998](https://github.com/advisories/GHSA-968p-4wvh-cqc8) |
| @babel/traverse | critical | Não | 7.18.6, 7.9.0 | <7.23.2 | [1117420](https://github.com/advisories/GHSA-67hx-6x53-jw92) |
| @jest/core | low | Não | 27.5.1 | >=25.2.0-alpha.86 | jest-config, jest-runner |
| @pmmmwh/react-refresh-webpack-plugin | moderate | Não | 0.5.7 | 0.3.1 - 0.5.11 | webpack-dev-server |
| @rollup/plugin-node-resolve | low | Não | 11.2.1 | >=8.0.0 | deepmerge |
| @svgr/plugin-svgo | high | Não | 5.5.0 | * | deepmerge, svgo |
| @svgr/webpack | low | Não | 5.5.0 | >=5.5.0 | @svgr/plugin-svgo |
| @testing-library/jest-dom | moderate | Sim | 5.16.4 | <=5.16.4 | css |
| @tootallnate/once | low | Não | 1.1.2 | <2.0.1 | [1119438](https://github.com/advisories/GHSA-vpq2-c234-7xj6) |
| ajv | moderate | Não | 6.12.6, 8.11.2 | <6.14.0 &#124;&#124; >=7.0.0-alpha.0 <8.18.0 | [1113714](https://github.com/advisories/GHSA-2g4f-4pwh-qvx6), [1113715](https://github.com/advisories/GHSA-2g4f-4pwh-qvx6) |
| ansi-regex | high | Não | 5.0.0 | 5.0.0 | [1094092](https://github.com/advisories/GHSA-93q8-gq69-wqmw) |
| body-parser | high | Não | 1.20.0 | <=1.20.8 &#124;&#124; 2.0.0-beta.1 - 2.0.2 | [1099520](https://github.com/advisories/GHSA-qwcr-r2fm-qrc7), [1123977](https://github.com/advisories/GHSA-v422-hmwv-36x6), [1243073](https://github.com/advisories/GHSA-27r3-jxmh-p828), qs |
| brace-expansion | high | Não | 1.1.11, 2.0.1 | <=1.1.20 &#124;&#124; 2.0.0 - 2.1.6 | [1105443](https://github.com/advisories/GHSA-v6h2-p8h4-qcjw), [1105444](https://github.com/advisories/GHSA-v6h2-p8h4-qcjw), [1115540](https://github.com/advisories/GHSA-f886-m6hf-6m8v), [1115541](https://github.com/advisories/GHSA-f886-m6hf-6m8v), [1123896](https://github.com/advisories/GHSA-3jxr-9vmj-r5cp), [1123897](https://github.com/advisories/GHSA-3jxr-9vmj-r5cp), [1130588](https://github.com/advisories/GHSA-mh99-v99m-4gvg), [1130589](https://github.com/advisories/GHSA-mh99-v99m-4gvg), [1130736](https://github.com/advisories/GHSA-rgw5-rvv9-x895), [1130737](https://github.com/advisories/GHSA-rgw5-rvv9-x895), [1240100](https://github.com/advisories/GHSA-q2hr-2g5m-vwhr), [1240101](https://github.com/advisories/GHSA-q2hr-2g5m-vwhr), [1240104](https://github.com/advisories/GHSA-qhr7-859c-m2p7), [1240105](https://github.com/advisories/GHSA-qhr7-859c-m2p7), [1240108](https://github.com/advisories/GHSA-6j4f-fj2g-mc7p), [1240109](https://github.com/advisories/GHSA-6j4f-fj2g-mc7p) |
| braces | high | Não | 3.0.2 | <3.0.3 | [1098094](https://github.com/advisories/GHSA-grv7-fg5c-xmjg) |
| browserslist | high | Não | 4.21.1, 4.10.0 | <=4.28.6 | [1093035](https://github.com/advisories/GHSA-w8qv-6jwh-64r5), [1153171](https://github.com/advisories/GHSA-c83g-rgw3-j3cx), [1153172](https://github.com/advisories/GHSA-73wf-gq98-2v4g) |
| colord | moderate | Não | 2.9.2 | <2.9.4 | [1193675](https://github.com/advisories/GHSA-2wm5-q62r-hmrv) |
| compression | high | Não | 1.7.4 | <=1.8.1 | [1241221](https://github.com/advisories/GHSA-vc2v-76pw-4v95), on-headers |
| cookie | low | Não | 0.5.0 | <0.7.0 | [1103907](https://github.com/advisories/GHSA-pxg6-pf52-xh8x) |
| core-js-compat | high | Não | 3.23.3 | 3.6.0 - 3.25.0 | semver |
| cross-spawn | high | Não | 7.0.3 | 7.0.0 - 7.0.4 | [1104664](https://github.com/advisories/GHSA-3xgq-45jj-v275) |
| css | moderate | Não | 3.0.0 | >=2.2.2 | source-map-resolve |
| css-minimizer-webpack-plugin | moderate | Não | 3.4.1 | 1.1.4 - 7.0.4 | serialize-javascript |
| css-select | high | Não | 2.1.0 | <=3.1.0 | nth-check |
| debug | low | Não | 4.1.1, 3.2.6 | 3.2.0 - 3.2.6 &#124;&#124; 4.0.0 - 4.3.0 | [1096792](https://github.com/advisories/GHSA-gxpj-cx7g-858c), [1096793](https://github.com/advisories/GHSA-gxpj-cx7g-858c) |
| decode-uri-component | high | Não | 0.2.0 | <=0.4.1 | [1094087](https://github.com/advisories/GHSA-w573-4hg7-7wgq), [1147955](https://github.com/advisories/GHSA-vcc3-ghjq-m6fr) |
| deepmerge | low | Não | 4.2.2 | >=4.2.0 | [1243505](https://github.com/advisories/GHSA-gcqx-w48m-w2h4) |
| ejs | moderate | Não | 3.1.8 | <3.1.10 | [1098366](https://github.com/advisories/GHSA-ghr5-ch3p-vcr6) |
| express | high | Não | 4.18.1 | <=4.22.2 &#124;&#124; 5.0.0-alpha.1 - 5.0.1 | [1100530](https://github.com/advisories/GHSA-qw6h-vgh9-j6wx), [1111636](https://github.com/advisories/GHSA-rv95-896h-c2vc), body-parser, cookie, path-to-regexp, qs, send, serve-static |
| flatted | high | Não | 3.2.6 | <=3.4.1 | [1114526](https://github.com/advisories/GHSA-25h7-pfq9-p65f), [1241196](https://github.com/advisories/GHSA-rf6f-7fwh-wjgh) |
| follow-redirects | high | Não | 1.10.0 | <=1.15.11 | [1092623](https://github.com/advisories/GHSA-pw2r-vq6v-hr8c), [1096856](https://github.com/advisories/GHSA-cxjh-pqwp-8mfp), [1102323](https://github.com/advisories/GHSA-74fj-2j2h-c42q), [1109569](https://github.com/advisories/GHSA-jchw-25xp-jwwc), [1116560](https://github.com/advisories/GHSA-r4q5-vmmm-2653) |
| fork-ts-checker-webpack-plugin | low | Não | 6.5.2 | >=5.0.0-alpha.1 | deepmerge |
| form-data | critical | Não | 3.0.1 | 3.0.0 - 3.0.4 | [1109539](https://github.com/advisories/GHSA-fjxv-7rqg-78g4), [1120744](https://github.com/advisories/GHSA-hmw2-7cc7-3qxx) |
| http-proxy-agent | low | Não | 4.0.1 | 4.0.1 | @tootallnate/once |
| http-proxy-middleware | high | Não | 2.0.6 | <=2.0.10-beta.0 | [1100223](https://github.com/advisories/GHSA-c7qv-q95q-8v27), [1104105](https://github.com/advisories/GHSA-9gqv-wp59-fq42), [1104106](https://github.com/advisories/GHSA-4www-5p9h-95mh), [1121360](https://github.com/advisories/GHSA-64mm-vxmg-q3vj) |
| ini | high | Não | 1.3.5 | <1.3.6 | [1093224](https://github.com/advisories/GHSA-qqgx-2p2h-9c37) |
| jest | low | Não | 27.5.1 | >=25.2.0-alpha.86 | @jest/core, jest-cli |
| jest-cli | low | Não | 27.5.1 | >=25.2.0-alpha.86 | @jest/core, jest-config |
| jest-config | low | Não | 27.5.1 | >=25.2.0-alpha.86 | deepmerge, jest-environment-jsdom, jest-runner |
| jest-environment-jsdom | low | Não | 27.5.1 | 27.0.1 - 27.5.1 | jsdom |
| jest-runner | low | Não | 27.5.1 | 27.0.4 - 27.5.1 | jest-environment-jsdom |
| jest-watch-typeahead | low | Não | 1.1.0 | >=0.6.0 | jest |
| js-yaml | high | Não | 4.1.0, 3.13.1 | <=3.15.1 &#124;&#124; 4.0.0 - 4.3.1 | [1112714](https://github.com/advisories/GHSA-mh29-5h37-fv8m), [1112715](https://github.com/advisories/GHSA-mh29-5h37-fv8m), [1121859](https://github.com/advisories/GHSA-h67p-54hq-rp68), [1121860](https://github.com/advisories/GHSA-h67p-54hq-rp68), [1123911](https://github.com/advisories/GHSA-52cp-r559-cp3m), [1123912](https://github.com/advisories/GHSA-52cp-r559-cp3m), [1138114](https://github.com/advisories/GHSA-5p4m-2wfm-xmqj), [1138115](https://github.com/advisories/GHSA-5p4m-2wfm-xmqj), [1193726](https://github.com/advisories/GHSA-2883-xcg3-v3hh), [1193727](https://github.com/advisories/GHSA-2883-xcg3-v3hh) |
| jsdom | low | Não | 16.7.0 | 16.6.0 - 17.0.0 | http-proxy-agent |
| json5 | high | Não | 2.2.1, 2.1.2, 1.0.1 | <1.0.2 &#124;&#124; >=2.0.0 <2.2.2 | [1096543](https://github.com/advisories/GHSA-9c47-m6qq-7p4h), [1096544](https://github.com/advisories/GHSA-9c47-m6qq-7p4h) |
| loader-utils | critical | Não | 2.0.2, 3.2.0 | 2.0.0 - 2.0.3 &#124;&#124; 3.0.0 - 3.2.0 | [1094089](https://github.com/advisories/GHSA-76p3-8jx3-jpfq), [1095053](https://github.com/advisories/GHSA-3rfm-jhwj-7488), [1095054](https://github.com/advisories/GHSA-3rfm-jhwj-7488), [1109586](https://github.com/advisories/GHSA-hhq3-ff78-jv3g), [1109587](https://github.com/advisories/GHSA-hhq3-ff78-jv3g) |
| lodash | high | Não | 4.17.15, 4.17.21 | <=4.17.23 | [1106913](https://github.com/advisories/GHSA-35jh-r3h4-6jhm), [1106920](https://github.com/advisories/GHSA-p6mc-m468-83gw), [1108258](https://github.com/advisories/GHSA-29mw-wpgm-hmr9), [1115806](https://github.com/advisories/GHSA-r5fr-rjxr-66jc), [1115810](https://github.com/advisories/GHSA-f23m-r3pf-42rh), [1120370](https://github.com/advisories/GHSA-xxjr-mmjv-4gpg) |
| micromatch | moderate | Não | 4.0.5 | <4.0.8 | [1098681](https://github.com/advisories/GHSA-952p-6rrq-rcjv) |
| minimatch | high | Não | 3.1.2, 5.1.0, 3.0.4 | <=3.1.3 &#124;&#124; 5.0.0 - 5.1.7 | [1096485](https://github.com/advisories/GHSA-f8q6-p94x-37v3), [1113459](https://github.com/advisories/GHSA-3ppc-4f35-3m26), [1113461](https://github.com/advisories/GHSA-3ppc-4f35-3m26), [1113538](https://github.com/advisories/GHSA-7r86-cg39-jmmj), [1113540](https://github.com/advisories/GHSA-7r86-cg39-jmmj), [1113546](https://github.com/advisories/GHSA-23c5-xmqv-rm74), [1113548](https://github.com/advisories/GHSA-23c5-xmqv-rm74) |
| minimist | critical | Não | 1.2.5 | 1.0.0 - 1.2.5 | [1097678](https://github.com/advisories/GHSA-xvch-5gv4-984h) |
| nanoid | high | Não | 3.3.4 | <=3.3.17 | [1109563](https://github.com/advisories/GHSA-mwcw-c2x4-8c55), [1138811](https://github.com/advisories/GHSA-28wg-ghj8-5hjv), [1139427](https://github.com/advisories/GHSA-2v37-7h3g-55p8), [1153189](https://github.com/advisories/GHSA-xwg4-73v4-xw9w) |
| node-forge | high | Não | 1.3.1 | <=1.4.0 | [1110996](https://github.com/advisories/GHSA-554w-wpv2-vw27), [1110998](https://github.com/advisories/GHSA-5gfm-wpxj-wjgq), [1111068](https://github.com/advisories/GHSA-65ch-62r8-g69g), [1115545](https://github.com/advisories/GHSA-2328-f5f3-gj25), [1115546](https://github.com/advisories/GHSA-q67f-28xg-22rw), [1115548](https://github.com/advisories/GHSA-5m6q-g25r-mvwx), [1115612](https://github.com/advisories/GHSA-ppp5-5v6c-4jwp), [1240912](https://github.com/advisories/GHSA-86w9-cpqp-85rv) |
| nth-check | high | Não | 1.0.2 | <2.0.1 | [1095141](https://github.com/advisories/GHSA-rp65-9cf3-cjxr) |
| on-headers | low | Não | 1.0.2 | <1.1.0 | [1106812](https://github.com/advisories/GHSA-76c9-3jph-rj3q) |
| path-parse | moderate | Não | 1.0.6 | <1.0.7 | [1089681](https://github.com/advisories/GHSA-hj48-42vr-x3v9) |
| path-to-regexp | high | Não | 0.1.7 | <=0.1.12 | [1101850](https://github.com/advisories/GHSA-9wv6-86v2-598j), [1105199](https://github.com/advisories/GHSA-rhx6-c78j-4q9w), [1115527](https://github.com/advisories/GHSA-37ch-88jc-xwx2) |
| picomatch | high | Não | 2.2.1, 2.3.1 | <=2.3.1 | [1115549](https://github.com/advisories/GHSA-3v7f-55p6-f55p), [1115552](https://github.com/advisories/GHSA-c2c7-rcm5-vvqj) |
| postcss | high | Não | 8.4.14, 7.0.39 | <=8.5.22 | [1109574](https://github.com/advisories/GHSA-7fh5-64p2-3v2j), [1117015](https://github.com/advisories/GHSA-qx2v-qp2m-jg93), [1124252](https://github.com/advisories/GHSA-6g55-p6wh-862q), [1130709](https://github.com/advisories/GHSA-fxqj-rqcc-2cmp), [1139510](https://github.com/advisories/GHSA-r28c-9q8g-f849) |
| postcss-selector-parser | moderate | Não | 6.0.2, 6.0.10 | <6.1.5 | [1243379](https://github.com/advisories/GHSA-rj75-hqrm-r3gf) |
| proxy-addr | critical | Não | 2.0.7 | 1.1.0 - 2.0.7 | [1241210](https://github.com/advisories/GHSA-jqcg-44mw-7w3h) |
| qs | moderate | Não | 6.10.3 | <=6.16.0 | [1113161](https://github.com/advisories/GHSA-w7fw-mjwx-w883), [1113719](https://github.com/advisories/GHSA-6rw7-vpxm-498p), [1158507](https://github.com/advisories/GHSA-4mjr-xmp4-gh2g), [1243452](https://github.com/advisories/GHSA-6pq8-jhm2-2vcw) |
| react-dev-utils | low | Não | 12.0.1 | >=12.0.0-next.31 | fork-ts-checker-webpack-plugin |
| react-router | moderate | Não | 6.3.0 | 6.0.0 - 7.17.0 | [1112057](https://github.com/advisories/GHSA-9jcx-v3wj-wh4m), [1124268](https://github.com/advisories/GHSA-wrjc-x8rr-h8h6) |
| react-router-dom | moderate | Sim | 6.3.0 | 6.0.0-alpha.0 - 6.30.2-pre-v6.0 | react-router |
| react-scripts | moderate | Sim | 5.0.1 | >=0.1.0 | @svgr/webpack, css-minimizer-webpack-plugin, jest, jest-watch-typeahead, react-dev-utils, resolve-url-loader, webpack-dev-server, workbox-webpack-plugin |
| recursive-readdir | high | Não | 2.2.2 | 1.2.0 - 2.2.2 | minimatch |
| resolve-url-loader | moderate | Não | 4.0.0 | 0.0.1-experiment-postcss &#124;&#124; 3.0.0-alpha.1 - 4.0.0 | postcss |
| rollup | high | Não | 2.75.7 | <=2.79.2 | [1099757](https://github.com/advisories/GHSA-gcx4-mw62-g8wm), [1113517](https://github.com/advisories/GHSA-mw96-cpmx-2vgc) |
| rollup-plugin-terser | high | Não | 7.0.2 | 3.0.0 &#124;&#124; >=4.0.4 | serialize-javascript |
| semver | high | Não | 5.7.1, 7.3.7, 7.0.0, 6.3.0 | 2.0.0-alpha - 5.7.1 &#124;&#124; 6.0.0 - 6.3.0 &#124;&#124; 7.0.0 - 7.5.1 | [1112918](https://github.com/advisories/GHSA-c2qf-rxjj-qqgw), [1112921](https://github.com/advisories/GHSA-c2qf-rxjj-qqgw), [1112922](https://github.com/advisories/GHSA-c2qf-rxjj-qqgw) |
| send | low | Não | 0.18.0 | <0.19.0 | [1109556](https://github.com/advisories/GHSA-m6fv-jmcg-4jfg) |
| serialize-javascript | high | Não | 4.0.0, 6.0.0 | <=7.1.2 | [1113686](https://github.com/advisories/GHSA-5c6j-r48x-rmvq), [1119440](https://github.com/advisories/GHSA-qj8w-gfj5-8c6v), [1242290](https://github.com/advisories/GHSA-76p7-773f-r4q5), [1243082](https://github.com/advisories/GHSA-m5mm-p8h7-m29v) |
| serve-static | low | Não | 1.15.0 | <=1.16.0 | [1100528](https://github.com/advisories/GHSA-cm22-4g7w-348p), send |
| shell-quote | critical | Não | 1.7.3 | <=1.8.4 | [1120422](https://github.com/advisories/GHSA-w7jw-789q-3m8p), [1123944](https://github.com/advisories/GHSA-395f-4hp3-45gv) |
| sockjs | moderate | Não | 0.3.24 | >=0.3.17 | uuid |
| source-map-js | high | Não | 1.0.2 | 1.0.0 - 1.2.1 | [1241209](https://github.com/advisories/GHSA-68fv-2mgg-jv7q) |
| source-map-resolve | moderate | Não | 0.6.0 | >=0.5.1 | decode-uri-component |
| svgo | high | Não | 2.8.0, 1.3.2 | 1.0.0 - 2.8.3 | [1114152](https://github.com/advisories/GHSA-xpqw-6gx7-v673), [1139520](https://github.com/advisories/GHSA-2p49-hgcm-8545), [1193740](https://github.com/advisories/GHSA-4vpr-x523-8j87), [1243426](https://github.com/advisories/GHSA-w27v-7q3p-w38r), css-select |
| terser | high | Não | 5.14.1 | 5.0.0 - 5.14.1 | [1091690](https://github.com/advisories/GHSA-4wf5-vphf-c2xc) |
| terser-webpack-plugin | moderate | Não | 5.3.3 | 4.2.1 - 5.3.16 | serialize-javascript |
| tmpl | high | Não | 1.0.4 | <1.0.5 | [1095104](https://github.com/advisories/GHSA-jgrx-mgxx-jf9v) |
| tough-cookie | moderate | Não | 4.0.0 | <4.1.3 | [1097682](https://github.com/advisories/GHSA-72xf-g2v4-qvf3) |
| uuid | moderate | Não | 8.3.2 | <11.1.1 | [1119441](https://github.com/advisories/GHSA-w5hq-g745-h8pq) |
| webpack | critical | Não | 5.73.0 | 5.0.0-alpha.0 - 5.104.0 | [1094471](https://github.com/advisories/GHSA-hc6q-2mpp-qw7j), [1099351](https://github.com/advisories/GHSA-4vvj-4cpr-p986), [1113041](https://github.com/advisories/GHSA-8fgc-7cc6-rx7x), [1113042](https://github.com/advisories/GHSA-38r7-794h-5758) |
| webpack-dev-middleware | high | Não | 5.3.3 | <=7.4.4 | [1096729](https://github.com/advisories/GHSA-wr3j-pwj9-hqq6), [1240027](https://github.com/advisories/GHSA-g84c-rxfj-3j2c) |
| webpack-dev-server | moderate | Não | 4.9.3 | <=5.2.7 | [1108429](https://github.com/advisories/GHSA-9jgg-88mc-972h), [1108430](https://github.com/advisories/GHSA-4v9v-hfq4-rm2v), [1119074](https://github.com/advisories/GHSA-79cf-xcqc-c78w), [1121087](https://github.com/advisories/GHSA-mx8g-39q3-5c79), [1123965](https://github.com/advisories/GHSA-f5vj-f2hx-8m93), [1123966](https://github.com/advisories/GHSA-m28w-2pqf-7qgj), sockjs |
| websocket-driver | critical | Não | 0.7.3, 0.7.4 | <=0.7.4 | [1123482](https://github.com/advisories/GHSA-mp7j-qc5w-4988), [1123483](https://github.com/advisories/GHSA-xv26-6w52-cph6) |
| websocket-extensions | high | Não | 0.1.3 | <0.1.4 | [1087512](https://github.com/advisories/GHSA-g78m-2chm-r7qv) |
| word-wrap | moderate | Não | 1.2.3 | <1.2.4 | [1102444](https://github.com/advisories/GHSA-j8xg-fqg3-53r7) |
| workbox-build | high | Não | 6.5.3 | >=5.0.0-alpha.0 | @rollup/plugin-node-resolve, rollup-plugin-terser |
| workbox-webpack-plugin | low | Não | 6.5.3 | >=6.0.0-alpha.0 | workbox-build |
| ws | high | Não | 7.5.8, 8.8.0 | 7.0.0 - 7.5.10 &#124;&#124; 8.0.0 - 8.20.1 | [1118728](https://github.com/advisories/GHSA-3h5v-q93c-6h6q), [1118729](https://github.com/advisories/GHSA-3h5v-q93c-6h6q), [1119108](https://github.com/advisories/GHSA-58qx-3vcg-4xpx), [1123259](https://github.com/advisories/GHSA-96hv-2xvq-fx4p), [1123260](https://github.com/advisories/GHSA-96hv-2xvq-fx4p) |
| yaml | moderate | Não | 1.8.2, 1.10.2 | 1.0.0 - 1.10.2 | [1115555](https://github.com/advisories/GHSA-48c2-rrv3-qjmp) |

## Tratamento aprovado

Na Fase 2, **priorizar resolver vulnerabilidades críticas e altas**, substituir CRA por Vite, separar ferramentas em devDependencies, atualizar versões compatíveis e reauditar o novo lockfile. Documentar o que sobrar, com contexto e justificativa. Não aceitar automaticamente sugestões audit fix --force: há entradas que sugerem react-scripts 0.0.0 como correção, o que não é solução funcional de migração. Auditar novamente após instalar e construir; não prometer audit limpo antes da execução.

Manter um lockfile, adicionar Dependabot e CI, e validar lint/tipos/testes/build antes de propor commits de código. Os resultados acima são uma fotografia da consulta original, sujeitos a novas publicações e advisories. A sincronização documental não altera nem corrige as dependências auditadas.
