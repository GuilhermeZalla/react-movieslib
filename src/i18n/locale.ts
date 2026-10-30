import { DEFAULT_LOCALE, isLocale, type Locale } from '../../shared/locale';
export const LOCALE_STORAGE_KEY = 'movieslib:locale';
let current: Locale = DEFAULT_LOCALE;
const listeners = new Set<() => void>();
export const getLocale = () => current;
export function subscribeLocale(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
export function setLocale(value: Locale, persist = true) {
  if (!isLocale(value)) return;
  if (persist) {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, value);
    } catch {
      /* Preference still works for this session when storage is blocked. */
    }
  }
  if (typeof document !== 'undefined') document.documentElement.lang = value;
  if (current === value) return;
  current = value;
  listeners.forEach((listener) => listener());
}
export function initializeLocale() {
  let saved: unknown;
  try {
    saved = localStorage.getItem(LOCALE_STORAGE_KEY);
  } catch {
    saved = null;
  }
  setLocale(isLocale(saved) ? saved : DEFAULT_LOCALE, false);
}
