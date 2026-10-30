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
  const label = people ? 'Buscar pessoa' : 'Buscar filme';
  return (
    <form
      role="search"
      aria-label={people ? 'Busca de pessoas' : 'Busca de filmes'}
      onSubmit={(event) => event.preventDefault()}
      className="flex flex-wrap items-end gap-3"
    >
      <label className="grid min-w-0 flex-1 gap-2 text-preview-body font-semibold">
        {label}
        <input
          type="search"
          name="q"
          value={value}
          maxLength={200}
          onChange={(event) => onChange(event.target.value)}
          className="control w-full"
          placeholder={
            people ? 'Nome de uma pessoa' : 'Qual filme ficou na cabeça?'
          }
        />
      </label>
      <button type="submit" className="button-primary" aria-label={label}>
        Buscar
      </button>
      {value && (
        <button
          type="button"
          className="button-secondary"
          onClick={() => onChange('')}
        >
          Limpar busca
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
      <summary>Filtrar catálogo</summary>
      <fieldset>
        <legend className="mb-3 font-semibold">Refinar filmes</legend>
        <label className="grid gap-2">
          Gênero
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
            <option value="">Todos</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2">
          Ano
          <input
            className="control"
            inputMode="numeric"
            type="number"
            min="1870"
            max="2100"
            placeholder="Qualquer ano"
            value={params.get('year') ?? ''}
            onChange={(event) => update('year', event.target.value)}
          />
        </label>
        <label className="grid gap-2">
          Nota mínima
          <select
            className="control"
            value={params.get('rating') ?? ''}
            onChange={(event) => update('rating', event.target.value)}
          >
            <option value="">Todas</option>
            {[5, 6, 7, 8, 9].map((rating) => (
              <option key={rating} value={rating}>
                {rating} de 10
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2">
          Ordenar
          <select
            className="control"
            value={params.get('sort') ?? 'popularity.desc'}
            onChange={(event) => update('sort', event.target.value)}
          >
            <option value="popularity.desc">Popularidade</option>
            <option value="vote_average.desc">Melhor nota</option>
            <option value="primary_release_date.desc">Mais recentes</option>
            <option value="title.asc">Título A–Z</option>
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
      aria-label="Paginação"
      className="flex flex-wrap items-center gap-2 border-t border-preview-line pt-6"
    >
      {page > 1 && (
        <Link className="button-secondary" to={href(page - 1)}>
          Anterior
        </Link>
      )}
      {pages.map((value) => (
        <Link
          key={value}
          to={href(value)}
          aria-label={`Página ${value}`}
          aria-current={value === page ? 'page' : undefined}
          className={value === page ? 'button-primary' : 'button-secondary'}
        >
          {value}
        </Link>
      ))}
      {page < limit && (
        <Link className="button-secondary" to={href(page + 1)}>
          Próxima página
        </Link>
      )}
    </nav>
  );
}
