import { useEffect, useState, type ReactNode } from 'react';
import { z } from '../../shared/zod.ts';
import { SavedMoviesContext } from './savedMoviesContext';
const KEY = 'movieslib:saved-ids';
const idsSchema = z
  .array(z.number().int().positive().max(Number.MAX_SAFE_INTEGER))
  .max(200);
function readSaved() {
  try {
    const text = localStorage.getItem(KEY);
    if (!text) return { ids: [] as number[], error: null };
    const data: unknown = JSON.parse(text);
    const parsed = idsSchema.safeParse(data);
    if (!parsed.success)
      return {
        ids: [] as number[],
        error: 'Não foi possível ler sua lista. Você pode começar outra.',
      };
    return { ids: [...new Set(parsed.data)], error: null };
  } catch {
    return {
      ids: [] as number[],
      error: 'Sua lista não pôde ser lida neste navegador.',
    };
  }
}
export default function SavedMoviesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, setState] = useState(readSaved);
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === KEY || event.key === null) setState(readSaved());
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  function toggle(id: number) {
    if (!Number.isSafeInteger(id) || id <= 0) return;
    const next = state.ids.includes(id)
      ? state.ids.filter((value) => value !== id)
      : [...state.ids, id];
    if (next.length > 200) {
      setState({
        ...state,
        error: 'Sua lista chegou a 200 filmes. Retire um para guardar outro.',
      });
      return;
    }
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
      setState({ ids: next, error: null });
    } catch {
      setState({
        ...state,
        error:
          'O navegador bloqueou o armazenamento. Sua lista não foi alterada.',
      });
    }
  }
  return (
    <SavedMoviesContext.Provider value={{ ...state, toggle }}>
      {children}
    </SavedMoviesContext.Provider>
  );
}
