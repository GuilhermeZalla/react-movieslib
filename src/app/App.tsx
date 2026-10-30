import { QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { createQueryClient } from './queryClient';
import LayoutRoutes from './LayoutRoutes';
import SavedMoviesProvider from './SavedMoviesProvider';
import ErrorBoundary from './ErrorBoundary';
export default function App() {
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
