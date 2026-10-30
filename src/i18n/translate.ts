import messages from './en-US.json';
import { getLocale } from './locale';
import type { Locale } from '../../shared/locale';
const english: Readonly<Record<string, string>> = messages;
export function t(
  key: string,
  values: Readonly<Record<string, string | number>> = {},
  locale: Locale = getLocale(),
): string {
  const message = locale === 'en-US' ? (english[key] ?? key) : key;
  return message.replace(/\{(\w+)\}/g, (placeholder: string, name: string) =>
    String(values[name] ?? placeholder),
  );
}
