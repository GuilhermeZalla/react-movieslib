import { t } from '../i18n/translate';
import { useLocale } from '../i18n/useLocale';
import { useEffect } from 'react';
export function usePageTitle(title: string) {
  const locale = useLocale();
  useEffect(() => {
    document.title = t(title, {}, locale) + ' | MoviesLib';
  }, [title, locale]);
}
