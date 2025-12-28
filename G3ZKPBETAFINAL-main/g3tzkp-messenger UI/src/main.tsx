import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { G3ZKPProvider } from './contexts/G3ZKPContext';
import './index.css';

console.log('[G3ZKP] ========================================');
console.log('[G3ZKP] G3ZKP MESSENGER BETA - INITIALIZING');
console.log('[G3ZKP] Environment:', import.meta.env.MODE);
console.log('[G3ZKP] API URL:', import.meta.env.VITE_API_URL || 'NOT SET');
console.log('[G3ZKP] ========================================');

// Global error handler
window.onerror = (message, source, lineno, colno, error) => {
  console.error('[G3ZKP] GLOBAL ERROR:', { message, source, lineno, colno, error });
  return false;
};

window.onunhandledrejection = (event) => {
  console.error('[G3ZKP] UNHANDLED PROMISE REJECTION:', event.reason);
};

console.log('[G3ZKP] Looking for root element...');
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('[G3ZKP] FATAL: Root element not found!');
  throw new Error('Root element not found');
}
console.log('[G3ZKP] Root element found, mounting React app...');

try {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <G3ZKPProvider>
        <App />
      </G3ZKPProvider>
    </React.StrictMode>
  );
  console.log('[G3ZKP] React app mounted successfully');
} catch (error) {
  console.error('[G3ZKP] FATAL: Failed to mount React app:', error);
}
