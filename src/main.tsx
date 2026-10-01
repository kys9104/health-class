import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Intercept and cleanly suppress Firestore internal quota & backoff delay console spam
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  const combined = args.map(a => (typeof a === 'string' ? a : (a?.message || ''))).join(' ');
  if (
    combined.includes('Quota limit exceeded') ||
    combined.includes('Free daily write units') ||
    combined.includes('Using maximum backoff delay') ||
    combined.includes('resource-exhausted')
  ) {
    return;
  }
  originalConsoleError.apply(console, args);
};

const originalConsoleWarn = console.warn;
console.warn = (...args: any[]) => {
  const combined = args.map(a => (typeof a === 'string' ? a : (a?.message || ''))).join(' ');
  if (
    combined.includes('Quota limit exceeded') ||
    combined.includes('Free daily write units') ||
    combined.includes('Using maximum backoff delay')
  ) {
    return;
  }
  originalConsoleWarn.apply(console, args);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
