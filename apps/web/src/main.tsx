import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { afterPaint } from './lib/after-paint';
import './styles.css';

const client = new QueryClient({ defaultOptions: { queries: { staleTime: 60_000 } } });
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);

// The reporter's observers are buffered, so attaching it once the page is
// idle loses no metric and keeps both its code and its request off the path to
// the first paint.
afterPaint(() => {
  void import('./lib/web-vitals').then(({ startWebVitalsReporting }) => startWebVitalsReporting());
});
