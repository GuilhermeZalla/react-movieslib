import { useContext } from 'react';
import { SavedMoviesContext } from '../app/savedMoviesContext';
export function useSavedMovies() {
  const state = useContext(SavedMoviesContext);
  if (!state) throw new Error('SavedMoviesProvider is required.');
  return state;
}
