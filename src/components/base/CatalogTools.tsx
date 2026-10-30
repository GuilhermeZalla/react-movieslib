import { t } from '../../i18n/translate';
import { useLocale } from '../../i18n/useLocale';
import { genreName } from '../../i18n/metadata';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import type { Genre } from '../../api/tmdb/schemas';
interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  people?: boolean;
}
export function SearchField({
  value,
  onChange,
  people = false,
}: SearchFieldProps) {
  useLocale();
  const label = people ? t('Buscar pessoa') : t('Buscar filme');
  return (
    <form
      role="search"
      aria-label={people ? t('Busca de pessoas') : t('Busca de filmes')}
      onSubmit={(event) => event.preventDefault()}
      className="flex flex-wrap items-end gap-3"
    >
      <label className="grid min-w-0 flex-1 gap-2 text-preview-body font-semibold">
        {t(label)}
        <input
          type="search"
          name="q"
          value={value}
          maxLength={200}
          onChange={(event) => onChange(event.target.value)}
          className="control w-full"
          placeholder={
            people ? t('Nome de uma pessoa') : t('Qual filme ficou na cabeça?')
          }
        />
      </label>
      <button type="submit" className="button-primary" aria-label={t(label)}>
        {t('Buscar')}
      </button>
      {value && (
        <button
          type="button"
          className="button-secondary"
          onClick={() => onChange('')}
        >
          {t('Limpar busca')}
        </button>
      )}
    </form>
  );
}
export function CatalogFilters({
  params,
  update,
  genres,
  lockedGenre,
}: {
  params: URLSearchParams;
  update: (key: string, value: string) => void;
  genres: Genre[];
  lockedGenre?: number;
}) {
  useLocale();
  const [expanded, setExpanded] = useState(() =>
    typeof window.matchMedia === 'function'
      ? window.matchMedia('(min-width: 1024px)').matches
      : true,
  );
  return (
    <details
      className="catalog-filter-panel"
      open={expanded}
      onToggle={(event) => setExpanded(event.currentTarget.open)}
    >
      <summary>{t('Filtrar catálogo')}</summary>
      <fieldset>
        <legend className="mb-3 font-semibold">{t('Refinar filmes')}</legend>
        <label className="grid gap-2">
          {t('Gênero')}
          <select
            className="control"
            disabled={lockedGenre !== undefined}
            value={
              lockedGenre !== undefined
                ? String(lockedGenre)
                : (params.get('genre') ?? '')
            }
            onChange={(event) => update('genre', event.target.value)}
          >
            <option value="">{t('Todos')}</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genreName(genre)}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2">
          {t('Ano')}
          <input
            className="control"
            inputMode="numeric"
            type="number"
            min="1870"
            max="2100"
            placeholder={t('Qualquer ano')}
            value={params.get('year') ?? ''}
            onChange={(event) => update('year', event.target.value)}
          />
        </label>
        <label className="grid gap-2">
          {t('Nota mínima')}
          <select
            className="control"
            value={params.get('rating') ?? ''}
            onChange={(event) => update('rating', event.target.value)}
          >
            <option value="">{t('Todas')}</option>
            {[5, 6, 7, 8, 9].map((rating) => (
              <option key={rating} value={rating}>
                {t('{score} de 10', { score: rating })}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2">
          {t('Ordenar')}
          <select
            className="control"
            value={params.get('sort') ?? 'popularity.desc'}
            onChange={(event) => update('sort', event.target.value)}
          >
            <option value="popularity.desc">{t('Popularidade')}</option>
            <option value="vote_average.desc">{t('Melhor nota')}</option>
            <option value="primary_release_date.desc">
              {t('Mais recentes')}
            </option>
            <option value="title.asc">{t('Título A–Z')}</option>
          </select>
        </label>
      </fieldset>
    </details>
  );
}
export function Pagination({
  page,
  total,
  href,
}: {
  page: number;
  total: number;
  href: (page: number) => string;
}) {
  useLocale();
  const limit = Math.min(500, Math.max(1, total));
  const pages = [
    ...new Set([
      1,
      ...Array.from({ length: 5 }, (_, index) => page - 2 + index),
      limit,
    ]),
  ]
    .filter((value) => value > 0 && value <= limit)
    .sort((a, b) => a - b);
  return (
    <nav
      aria-label={t('Paginação')}
      className="flex flex-wrap items-center gap-2 border-t border-preview-line pt-6"
    >
      {page > 1 && (
        <Link className="button-secondary" to={href(page - 1)}>
          {t('Anterior')}
        </Link>
      )}
      {pages.map((value) => (
        <Link
          key={value}
          to={href(value)}
          aria-label={t('Página {number}', { number: value })}
          aria-current={value === page ? 'page' : undefined}
          className={value === page ? 'button-primary' : 'button-secondary'}
        >
          {value}
        </Link>
      ))}
      {page < limit && (
        <Link className="button-secondary" to={href(page + 1)}>
          {t('Próxima página')}
        </Link>
      )}
    </nav>
  );
}
