import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { adManager } from './ads/AdManager.ts';
import './index.css';

// Initialize Poki SDK at game startup
adManager.init().catch((err) => {
  console.warn("Poki SDK init error during startup:", err);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);


