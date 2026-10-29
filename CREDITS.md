# Créditos e licenças

## Fontes (Fase 4)

- **Source Serif 4** — SIL Open Font License 1.1 (OFL). Distribuída via `@fontsource/source-serif-4` (WOFF2 no bundle).
- **Source Sans 3** — SIL Open Font License 1.1 (OFL). Distribuída via `@fontsource/source-sans-3` (WOFF2 no bundle).

Ambas são carregadas localmente (sem CDN), com `font-display: swap` e fallback tipográfico.

## Fontes da amostra Pulso (escolha B)

- [Bricolage Grotesque](https://fontsource.org/fonts/bricolage-grotesque/about) — SIL Open Font License 1.1; pacote `@fontsource-variable/bricolage-grotesque` 5.3.0. Usada nos títulos da amostra `/design`.
- [Figtree](https://fontsource.org/fonts/figtree/about) — SIL Open Font License 1.1; pacote `@fontsource-variable/figtree` 5.3.0. Usada no corpo e nos números da amostra `/design`.

Os dois pacotes fornecem WOFF2 local, `font-display: swap` e textos completos de licença no diretório de cada pacote. A rota `/design` importa as fontes apenas no desenvolvimento. As fontes antigas (Source Serif 4, Source Sans 3, PT Sans, Source Sans Pro) permanecem instaladas até a migração visual das telas de produção.

## Reset CSS

- meyer-reset 2.0 (domínio público / Eric Meyer), hospedado em `public/meyer-reset.css`.

## Ícones

SVGs inline próprios; sem biblioteca de ícones com licença duvidosa.
