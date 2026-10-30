import { createContext } from 'react';
export interface SavedMoviesValue {
  ids: number[];
  toggle: (id: number) => void;
  error: string | null;
}
export const SavedMoviesContext = createContext<SavedMoviesValue | null>(null);
