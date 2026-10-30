import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  discoverRequestSchema,
  pageParameterSchema,
  searchInputSchema,
  type DiscoverInput,
} from '../../shared/tmdbRequest';
import { useDebouncedValue } from './useDebouncedValue';

export function useCatalogParams(pathPage?: string) {
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const input = (params.get('q') ?? '').slice(0, 200);
  const debounced = useDebouncedValue(input);
  const term = searchInputSchema.parse(debounced);
  const parsedPage = pageParameterSchema.safeParse(
    pathPage ?? params.get('page') ?? '1',
  );
  const page = parsedPage.success ? parsedPage.data : 1;
  const filters = {
    ...(params.get('genre') ? { with_genres: params.get('genre') ?? '' } : {}),
    ...(params.get('year')
      ? { primary_release_year: params.get('year') ?? '' }
      : {}),
    ...(params.get('rating')
      ? { 'vote_average.gte': params.get('rating') ?? '' }
      : {}),
    ...(params.get('sort') ? { sort_by: params.get('sort') ?? '' } : {}),
  };
  const validated = discoverRequestSchema.safeParse(filters);
  const safeFilters: DiscoverInput = validated.success
    ? {
        ...(filters.with_genres ? { with_genres: filters.with_genres } : {}),
        ...(filters.primary_release_year
          ? { primary_release_year: filters.primary_release_year }
          : {}),
        ...(filters['vote_average.gte']
          ? { 'vote_average.gte': filters['vote_average.gte'] }
          : {}),
        ...(filters.sort_by ? { sort_by: validated.data.sort_by } : {}),
      }
    : {};
  function pageHref(next: number, source = params) {
    const query = new URLSearchParams(source);
    let pathname = location.pathname;
    if (pathPage !== undefined)
      pathname = pathname.replace(/\/[^/]+$/, `/${next}`);
    else query.set('page', String(next));
    return pathname + (query.size ? '?' + query.toString() : '');
  }
  function update(key: string, value: string) {
    const query = new URLSearchParams(params);
    if (value) query.set(key, key === 'q' ? value.slice(0, 200) : value);
    else query.delete(key);
    void navigate(pageHref(1, query), { replace: true });
  }
  return { input, term, page, params, filters: safeFilters, update, pageHref };
}
