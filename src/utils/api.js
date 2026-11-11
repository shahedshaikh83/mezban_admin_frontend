
import { getAdminAuthHeaders, isAdminAuthenticated } from './auth';

/**
 * Shared API client for MEZBAAN
 */

export const getApiBase = () => {
  // Use the backend URL configured in Vercel or a local .env file
  const configuredUrl = import.meta.env.VITE_API_URL;

  if (configuredUrl) {
    return configuredUrl.replace(/\/+$/, '');
  }

  // Local development fallback
  if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1')
  ) {
    return 'http://localhost:5000';
  }

  return '';
};

export const getApiUrl = (endpoint) => {
  if (!endpoint) return '';

  if (
    endpoint.startsWith('http://') ||
    endpoint.startsWith('https://')
  ) {
    return endpoint;
  }

  const base = getApiBase();
  return `${base}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
};

export const apiFetch = async (endpoint, options = {}) => {
  const url = getApiUrl(endpoint);
  const { asAdmin, ...fetchOptions } = options;

  const authHeaders = asAdmin ? getAdminAuthHeaders(true) : {};
  const mergedHeaders = {
    ...authHeaders,
    ...(fetchOptions.headers || {})
  };

  try {
    const res = await fetch(url, { ...fetchOptions, headers: mergedHeaders });
    const rawText = await res.text();

    let data = null;

    try {
      data = rawText ? JSON.parse(rawText) : null;
    } catch {
      data = null;
    }

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        data,
        error:
          data?.message ||
          data?.error ||
          `Server responded with status ${res.status}`,
        rawText,
      };
    }

    return {
      ok: true,
      status: res.status,
      data: data ?? {},
      rawText,
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      data: null,
      error: err.message || 'Network connection error',
      isNetworkError: true,
    };
  }
};
