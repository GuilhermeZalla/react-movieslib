# Créditos dos previews

Estes arquivos são estudos estáticos da Fase 1, sob a [licença MIT do projeto](../../LICENSE). Não alteram a aplicação. Abra index.html diretamente no navegador; não há build, JavaScript, CDN, embed, consulta TMDB ou persistência. O seletor claro/escuro usa radios nativos e CSS :has(), disponíveis em navegadores modernos.

## Pôsteres e conteúdo

Os quatro SVGs em art/ são desenhos geométricos originais criados para estes estudos, disponibilizados sob a licença MIT do projeto. Não usam imagens TMDB, screenshots, marcas, fotografias ou desenhos de outros sites. Títulos, sinopses, notas, datas e nomes associados às fichas são exemplos fictícios, sem alegar que correspondam a um filme real. Coincidências de nomes são possíveis. Os mesmos pôsteres em todas as direções permitem comparar layout sem favorecer uma delas por imagem.

Setas e sinais são caracteres de texto; não há pacote de ícones. base.css e os três CSS de direção são CSS de apresentação dos estudos; não são uma segunda solução de estilo para a aplicação. Seus tokens correspondem às propostas @theme em DESIGN.md. A migração futura usará Tailwind 4.3.3 conforme STATUS.md, sem DaisyUI ou biblioteca visual.

## Fontes propostas e licença

Nenhum binário de fonte é distribuído ou baixado por estes previews. As famílias livres são nomes preferenciais nas pilhas CSS: se estiverem instaladas localmente, o navegador pode usá-las; caso contrário, usa o fallback. Portanto, a métrica e a quebra de linha podem diferir da futura fonte hospedada no projeto.

| Direção | Par gratuito proposto | Licença verificada | Fallback efetivo sem instalação |
| --- | --- | --- | --- |
| Caderno | Source Serif 4 + Source Sans 3 | SIL Open Font License 1.1; Adobe | Georgia/Times New Roman + Segoe UI/Arial |
| Sala 02 | Barlow Condensed + Barlow | SIL Open Font License 1.1; The Barlow Project Authors | Impact/Arial Narrow + Arial |
| Atlas | IBM Plex Sans + IBM Plex Mono | SIL Open Font License 1.1; IBM Corp. | Segoe UI/Arial + Consolas/Courier New |

Fontes das licenças, consultadas em 28/10/2026:

- [Source Serif](https://raw.githubusercontent.com/adobe-fonts/source-serif/release/LICENSE.md).
- [Source Sans](https://raw.githubusercontent.com/adobe-fonts/source-sans/release/LICENSE.md).
- [Barlow, incluindo a família Condensed](https://raw.githubusercontent.com/jpt/barlow/main/OFL.txt).
- [IBM Plex](https://raw.githubusercontent.com/IBM/plex/master/LICENSE.txt).

OFL permite uso e distribuição com os avisos/licença, respeitando as demais condições e nomes reservados; os arquivos de fonte não são relicenciados como MIT. Se fontes forem incorporadas após a escolha visual, usar WOFF2 local, font-display:swap e incluir os avisos de copyright e a licença completa junto aos arquivos. Limitar famílias/pesos e verificar licença do release efetivamente usado. Não redistribuímos fontes do sistema: Georgia, Impact, Segoe UI, Arial, Consolas etc. permanecem sujeitas às licenças de seus fornecedores.

O aplicativo futuro continuará exigindo os créditos TMDB definidos no STATUS.md. Estes estudos não acessam a API e não empregam o logo ou imagens TMDB.
