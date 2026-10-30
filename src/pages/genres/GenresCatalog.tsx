import { useParams } from 'react-router-dom';
import {
  idParameterSchema,
  searchInputSchema,
} from '../../../shared/tmdbRequest';
import MoviesCatalog from '../movies/MoviesCatalog';
import NotFoundScreen from '../not-found/NotFoundScreen';
export default function GenresCatalog() {
  const { id, genre = '' } = useParams<'id' | 'genre'>();
  const parsedId = idParameterSchema.safeParse(id ?? '');
  const parsedName = searchInputSchema.safeParse(genre);
  if (!parsedId.success || !parsedName.success || !parsedName.data)
    return <NotFoundScreen />;
  return <MoviesCatalog genre={{ id: parsedId.data, name: parsedName.data }} />;
}
