# Plano de commits — Pulso Cinema e demonstrações

Executar pelo proprietário no PowerShell, a partir da raiz. Nenhuma escrita no Git pelo agente. Base **13bc68d**: a implementação anterior ainda está pendente junto ao redesenho. Os caminhos abaixo cobrem toda a árvore recebida e as mudanças desta solicitação, não apenas o último ajuste. Como arquivos se sobrepõem, o plano usa dois conjuntos completos e coerentes, sem separar alterações de um mesmo arquivo por suposição.

## 1. Implementação, layout, ícones, testes e ferramentas

Inclui remoções antigas e caminhos novos; o staging reconhece os arquivos removidos. Ferramenta de capturas depende apenas de arquivos de código deste conjunto; a saída de mídia fica no segundo.

```powershell
$paths = @(
    '.gitignore'
    '.prettierignore'
    'e2e/accessibility.spec.ts'
    'e2e/home.spec.ts'
    'e2e/journey.spec.ts'
    'e2e/resilience.spec.ts'
    'index.html'
    'package-lock.json'
    'package.json'
    'playwright.config.ts'
    'public/apple-touch-icon.png'
    'public/favicon.ico'
    'public/favicon.svg'
    'public/licenses/bricolage-grotesque.txt'
    'public/licenses/figtree.txt'
    'public/meyer-reset.css'
    'scripts/audit.mjs'
    'scripts/demo/gif.mjs'
    'scripts/demo/record.mjs'
    'scripts/demo/showcase.mjs'
    'scripts/fixtureServer.mjs'
    'scripts/startTestServer.mjs'
    'scripts/verifyDistribution.mjs'
    'server/security.test.ts'
    'server/tmdb/extensions.test.ts'
    'server/tmdb/policy.ts'
    'shared/tmdbRequest.ts'
    'shared/zod.ts'
    'src/api/tmdb/client.ts'
    'src/api/tmdb/extensions.test.ts'
    'src/api/tmdb/queries.ts'
    'src/api/tmdb/schemas.ts'
    'src/app/App.tsx'
    'src/app/ErrorBoundary.tsx'
    'src/app/LayoutRoutes.tsx'
    'src/app/SavedMoviesProvider.tsx'
    'src/app/savedMoviesContext.ts'
    'src/app/styles/components.css'
    'src/app/styles/theme.css'
    'src/components/base/Button.tsx'
    'src/components/base/Card.tsx'
    'src/components/base/CatalogTools.tsx'
    'src/components/base/ErrorState.tsx'
    'src/components/base/IconButton.tsx'
    'src/components/base/Input.tsx'
    'src/components/base/Link.tsx'
    'src/components/base/MovieCard.tsx'
    'src/components/base/MovieGrid.tsx'
    'src/components/base/PersonCard.tsx'
    'src/components/base/PosterImage.tsx'
    'src/components/base/QueryContent.tsx'
    'src/components/base/SaveMovieButton.tsx'
    'src/components/base/Skeleton.tsx'
    'src/components/base/ThemeToggle.tsx'
    'src/components/base/Trailer.tsx'
    'src/components/base/components.test.tsx'
    'src/components/layout/Aside.tsx'
    'src/components/layout/AsideMobile.tsx'
    'src/components/layout/Footer.tsx'
    'src/components/layout/Genres.tsx'
    'src/components/layout/Header.tsx'
    'src/components/layout/PulsoShell.test.tsx'
    'src/components/layout/PulsoShell.tsx'
    'src/components/movies/BannerImg.tsx'
    'src/components/movies/FilmCard.tsx'
    'src/components/movies/Genres.tsx'
    'src/components/movies/PopularHero.test.tsx'
    'src/components/movies/PopularHero.tsx'
    'src/components/people/Cast.tsx'
    'src/fonts/PTSans700.ttf'
    'src/fonts/SourceSansPro400.ttf'
    'src/fonts/SourceSansPro600.ttf'
    'src/fonts/SourceSansPro700.ttf'
    'src/fonts/fonts.css'
    'src/hooks/useCatalogParams.ts'
    'src/hooks/usePageTitle.ts'
    'src/hooks/useSavedMovies.ts'
    'src/index.css'
    'src/main.tsx'
    'src/pages/design/DesignSystem.test.tsx'
    'src/pages/design/DesignSystem.tsx'
    'src/pages/genres/GenresCatalog.tsx'
    'src/pages/home/Home.test.tsx'
    'src/pages/home/Home.tsx'
    'src/pages/movie-details/MovieDetails.tsx'
    'src/pages/movies/MoviesCatalog.tsx'
    'src/pages/my-list/MyList.tsx'
    'src/pages/not-found/NotFoundScreen.tsx'
    'src/pages/people/CastCatalog.tsx'
    'src/pages/person-details/CastDetails.tsx'
    'src/sass/components/castDetails/castDetails.scss'
    'src/sass/components/common/aside/aside.scss'
    'src/sass/components/common/asideMobile/asideMobile.scss'
    'src/sass/components/common/footer/footer.scss'
    'src/sass/components/common/header/header.scss'
    'src/sass/components/home/castCatalog/castCatalog.scss'
    'src/sass/components/home/filmCard/filmCard.scss'
    'src/sass/components/home/home.scss'
    'src/sass/components/movie-details/movie-details.scss'
    'src/sass/style.scss'
    'src/sass/variables/colors/colors.scss'
    'src/sass/variables/common/common.scss'
    'src/sass/variables/fonts/fonts.scss'
    'src/style/style.css'
    'src/style/style.css.map'
    'src/styles/theme.css'
    'src/test/detail-and-person.test.tsx'
    'src/test/effects.test.tsx'
    'src/test/errorBoundary.test.tsx'
    'src/test/fixtures/fetch.ts'
    'src/test/helpers/app.tsx'
    'src/test/helpers/controls.ts'
    'src/test/interactions.test.tsx'
    'src/test/navigation.test.tsx'
    'src/test/nullability.test.tsx'
    'src/test/remainingFlows.test.tsx'
    'src/test/savedMovies.test.tsx'
    'src/test/search-behavior.test.tsx'
    'src/test/searchPagination.test.tsx'
    'vercel.json'
)
git add -- $paths
```

Mensagem em inglês:

```text
feat: refine movie browsing with a cinematic dark layout

Complete browsing flows and add accessible automatic popular highlights.
Unify branding, add author credits and preserve proxy-only data access.
```

Validação: check da implementação em cópia temporária, com documentação/workflow anteriores, registrado no STATUS. Não há segredo ou arquivo externo necessário para executar os checks.

## 2. CI, documentação e mídias revisadas

```powershell
$paths = @(
    '.github/workflows/quality.yml'
    'CREDITS.md'
    'README.md'
    'docs/COMMIT_PLAN.md'
    'docs/DEPENDENCIES.md'
    'docs/DESIGN.md'
    'docs/STATUS.md'
    'docs/demo/movieslib-desktop.gif'
    'docs/demo/movieslib-mobile.gif'
    'docs/quality/QUALITY.md'
    'docs/quality/REVIEW.md'
    'docs/quality/lighthouse-after.json'
    'docs/quality/lighthouse-baseline.json'
    'docs/screenshots/catalogo-desktop.png'
    'docs/screenshots/catalogo-mobile.png'
    'docs/screenshots/filme-desktop.png'
    'docs/screenshots/filme-mobile.png'
    'docs/screenshots/home-desktop.png'
    'docs/screenshots/home-mobile.png'
    'docs/screenshots/minha-lista-desktop.png'
    'docs/screenshots/minha-lista-mobile.png'
    'docs/screenshots/pessoa-desktop.png'
    'docs/screenshots/pessoa-mobile.png'
    'docs/screenshots/pessoas-desktop.png'
    'docs/screenshots/pessoas-mobile.png'
)
git add -- $paths
```

Mensagem em inglês:

```text
docs: add visual demonstrations and document the cinema layout

Include desktop and mobile captures, original demo artwork and quality findings.
Update current decisions, publication limits and browser CI instructions.
```

Aplicar após o primeiro. Inclui a habilitação de E2E no workflow já pendente da entrega anterior. O check final valida a composição completa; o CI remoto só será confirmado após push pelo proprietário.

## Não commitar

.env e variantes, segredos, node_modules, dist, dist-css-regression, coverage, playwright-report, test-results, caches, logs, perfis, referências baixadas e relatórios brutos com caminhos locais. As 12 capturas e os dois GIFs revisados **em docs/** entram neste segundo commit; o script que os reproduz entra no primeiro. Os ícones próprios e licenças também entram. .env.example já existente permanece sem valor.

Relatórios: [REVIEW.md](quality/REVIEW.md), [QUALITY.md](quality/QUALITY.md) e início de [STATUS.md](STATUS.md).
