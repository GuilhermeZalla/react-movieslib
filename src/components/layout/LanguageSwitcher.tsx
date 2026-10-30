import { isLocale } from '../../../shared/locale';
import { setLocale } from '../../i18n/locale';
import { useLocale } from '../../i18n/useLocale';
import { t } from '../../i18n/translate';
export default function LanguageSwitcher() {
  const locale = useLocale();
  return (
    <label className="grid gap-2 text-preview-caption text-preview-muted">
      {t('Idioma')}
      <select
        className="control"
        aria-label={t('Alterar idioma')}
        value={locale}
        onChange={(event) => {
          const value = event.target.value;
          if (isLocale(value)) setLocale(value);
        }}
      >
        <option value="pt-BR" lang="pt-BR">
          Português (Brasil)
        </option>
        <option value="en-US" lang="en-US">
          English
        </option>
      </select>
    </label>
  );
}
