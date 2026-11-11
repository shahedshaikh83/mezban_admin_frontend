import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { getApiBase } from './utils/api'

// 1. Auto-route relative /api calls to backend port 5000 with offline resilience
if (typeof window !== 'undefined' && window.fetch) {
  const originalFetch = window.fetch;
  window.fetch = async function(input, init) {
    let target = input;
    if (typeof input === 'string' && input.startsWith('/api')) {
      const base = getApiBase();
      if (base) {
        target = `${base}${input}`;
      }
    } else if (input && typeof input === 'object' && input.url && input.url.startsWith('/api')) {
      const base = getApiBase();
      if (base) {
        target = new Request(`${base}${input.url}`, input);
      }
    }

    try {
      return await originalFetch.call(this, target, init);
    } catch (err) {
      const urlStr = typeof target === 'string' ? target : (target?.url || '');
      if (urlStr.includes('/api/')) {
        // Return a graceful 503 response instead of unhandled TypeError: Failed to fetch
        return new Response(
          JSON.stringify({
            success: false,
            offline: true,
            message: 'Mezban backend is not reachable. Operating in local storage mode.'
          }),
          {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      throw err;
    }
  };
}

// 2. Safe Response.prototype.json patch to prevent "Unexpected end of JSON input" fatal exceptions
if (typeof Response !== 'undefined' && Response.prototype && Response.prototype.json) {
  Response.prototype.json = async function() {
    try {
      const text = await this.text();
      if (!text || text.trim().length === 0) {
        return { success: false, error: 'Empty server response. Ensure backend server is running.' };
      }
      return JSON.parse(text);
    } catch (err) {
      console.warn('Failed to parse response as JSON:', err);
      return { success: false, error: 'Server returned non-JSON response.' };
    }
  };
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

