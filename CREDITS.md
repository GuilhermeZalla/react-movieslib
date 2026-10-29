# Créditos e licenças

## Fontes (Fase 4)

- **Source Serif 4** — SIL Open Font License 1.1 (OFL). Distribuída via `@fontsource/source-serif-4` (WOFF2 no bundle).
- **Source Sans 3** — SIL Open Font License 1.1 (OFL). Distribuída via `@fontsource/source-sans-3` (WOFF2 no bundle).

Ambas são carregadas localmente (sem CDN), com `font-display: swap` e fallback tipográfico.

## Fontes da amostra Pulso (escolha B)

- [Bricolage Grotesque](https://fontsource.org/fonts/bricolage-grotesque/about) — SIL Open Font License 1.1; pacote `@fontsource-variable/bricolage-grotesque` 5.3.0. Títulos da home e da amostra `/design`.
- [Figtree](https://fontsource.org/fonts/figtree/about) — SIL Open Font License 1.1; pacote `@fontsource-variable/figtree` 5.3.0. Corpo e números da home e da amostra `/design`.

Os dois pacotes fornecem WOFF2 local, `font-display: swap` e textos completos de licença no diretório de cada pacote. O shell da home importa as fontes em produção; `/design` é apenas de desenvolvimento. Fontes antigas (Source Serif 4, Source Sans 3, PT Sans, Source Sans Pro) permanecem instaladas durante a migração visual.

## Logotipo TMDB (atribuição)

- O logo aprovado deve ser obtido em [Logos e atribuição TMDB](https://www.themoviedb.org/about/logos-attribution) e colocado em `public/tmdb-logo.svg`. **Arquivo ainda ausente**, pendência antes de publicar. Após falha de carregamento, a home mostra fallback textual TMDB; ele não substitui o logo exigido.
- Aviso exato em inglês, conforme a [FAQ oficial sobre atribuição](https://developer.themoviedb.org/docs/faq): "This product uses the TMDB API but is not endorsed or certified by TMDB."
- O logotipo TMDB deve ser menos proeminente que o logotipo do aplicativo e não deve implicar endosso. A atribuição deve estar na seção de créditos/rodapé.

Não alterar cor, proporção, rotação ou espelhamento do logo aprovado. O shell não aplica opacidade/filtros à imagem e inclui uma seção Créditos identificável.

## Reset CSS

- meyer-reset 2.0 (domínio público / Eric Meyer), hospedado em `public/meyer-reset.css`.

## Ícones

SVGs inline próprios; sem biblioteca de ícones com licença duvidosa.
