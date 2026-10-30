import { t } from '../../i18n/translate';
import { useLocale } from '../../i18n/useLocale';
import { Link } from 'react-router-dom';
import { usePageTitle } from '../../hooks/usePageTitle';
export default function NotFoundScreen() {
  useLocale();
  usePageTitle(t('Página não encontrada'));
  return (
    <section className="empty-panel py-16">
      <p className="eyebrow">{t('Fim da bobina')}</p>
      <h1 className="font-display text-preview-title font-extrabold">
        {t('404 — Página não encontrada')}
      </h1>
      <p>
        {t(
          'Esse endereço ficou fora do catálogo. A próxima sessão começa na home.',
        )}
      </p>
      <Link className="button-primary" to="/">
        {t('Voltar ao início')}
      </Link>
    </section>
  );
}
