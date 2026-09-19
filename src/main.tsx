// Ensure window.fetch is writable and has setter in restricted iframe/browser environments
if (typeof window !== 'undefined') {
  try {
    const origFetch = window.fetch ? window.fetch.bind(window) : null;
    let currentFetch = origFetch;
    const desc = {
      configurable: true,
      enumerable: true,
      get() {
        return currentFetch;
      },
      set(newFetch: typeof window.fetch) {
        currentFetch = newFetch;
      },
    };
    try {
      Object.defineProperty(window, 'fetch', desc);
    } catch {}
    try {
      if (typeof Window !== 'undefined' && Window.prototype) {
        Object.defineProperty(Window.prototype, 'fetch', desc);
      }
    } catch {}
  } catch {}
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
