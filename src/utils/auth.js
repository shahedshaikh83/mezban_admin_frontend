/**
 * Authentication & Authorization Utilities for MEZBAAN Platform
 * Provides role verification and admin headers for protected internal operations.
 */

export const MEZBAAN_ADMIN_SECRET = 'mezbaan_admin_sec_2026_beed_token';

let inMemoryAdminAuth = false;

/**
 * Checks if current runtime is authorized for Admin OS
 */
export const isAdminAuthenticated = () => {
  if (inMemoryAdminAuth) return true;
  try {
    return sessionStorage.getItem('mezbaan_admin_active') === 'true';
  } catch {
    return false;
  }
};

/**
 * Sets admin authorization session
 */
export const setAdminAuthenticated = (active = true) => {
  inMemoryAdminAuth = Boolean(active);
  try {
    if (active) {
      sessionStorage.setItem('mezbaan_admin_active', 'true');
    } else {
      sessionStorage.removeItem('mezbaan_admin_active');
    }
  } catch {}
};

/**
 * Returns authorization headers for admin API requests
 */
export const getAdminAuthHeaders = (force = false) => {
  if (force || isAdminAuthenticated()) {
    return {
      'Authorization': `Bearer ${MEZBAAN_ADMIN_SECRET}`,
      'x-admin-token': MEZBAAN_ADMIN_SECRET
    };
  }
  return {};
};
