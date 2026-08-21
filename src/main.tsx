import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { adManager } from './ads/AdManager.ts';
import './index.css';

// Global Unhandled Rejection & Error listeners to harden against unhandled promise rejections or external script failures
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    // Log politely and prevent browser default crash
    console.warn('[Global UnhandledRejection Caught]:', event.reason);
    event.preventDefault();
  });

  window.addEventListener('error', (event) => {
    // Suppress benign ResizeObserver loop limit exceeded error
    if (
      event.message &&
      (event.message.includes('ResizeObserver loop') ||
        event.message.includes('ResizeObserver loop completed with undelivered notifications'))
    ) {
      event.stopImmediatePropagation();
      return;
    }
    console.warn('[Global Error Caught]:', event.error || event.message);
  });
}

// Initialize Poki SDK at game startup safely
try {
  adManager.init().catch((err) => {
    console.warn("Poki SDK init error during startup:", err);
  });
} catch (err) {
  console.warn("Poki SDK startup exception:", err);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);


