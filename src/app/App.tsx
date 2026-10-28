import { QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { createQueryClient } from './queryClient';
import '../style/style.css';
import LayoutRoutes from './LayoutRoutes';

function App() {
  const [queryClient] = useState(() => createQueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <LayoutRoutes />
    </QueryClientProvider>
  );
}

export default App;
