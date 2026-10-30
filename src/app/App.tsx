import { useLocale } from '../i18n/useLocale';
import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { isLocale, DEFAULT_LOCALE } from '../../shared/locale';
import { LOCALE_STORAGE_KEY, setLocale } from '../i18n/locale';
import { createQueryClient } from './queryClient';
import LayoutRoutes from './LayoutRoutes';
import SavedMoviesProvider from './SavedMoviesProvider';
import ErrorBoundary from './ErrorBoundary';
export default function App() {
  const locale = useLocale();
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === LOCALE_STORAGE_KEY || event.key === null)
        setLocale(
          isLocale(event.newValue) ? event.newValue : DEFAULT_LOCALE,
          false,
        );
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  const [queryClient] = useState(createQueryClient);
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SavedMoviesProvider>
          <LayoutRoutes />
        </SavedMoviesProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
