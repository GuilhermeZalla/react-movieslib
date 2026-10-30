import { t } from '../../i18n/translate';
import { useLocale } from '../../i18n/useLocale';
import { useContext } from 'react';
import { SavedMoviesContext } from '../../app/savedMoviesContext';
export default function SaveMovieButton({
  id,
  title,
  compact = false,
  fullWidth = true,
}: {
  id: number;
  title: string;
  compact?: boolean;
  fullWidth?: boolean;
}) {
  useLocale();
  const saved = useContext(SavedMoviesContext);
  if (!saved) return null;
  const selected = saved.ids.includes(id);
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={t(
        selected
          ? 'Retirar {title} na minha lista'
          : 'Guardar {title} na minha lista',
        { title },
      )}
      onClick={() => saved.toggle(id)}
      className={
        compact
          ? 'save-movie-icon'
          : 'button-secondary text-preview-caption' +
            (fullWidth ? ' mt-2 w-full' : '')
      }
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M6 3h12v18l-6-4-6 4V3Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        {selected && (
          <path d="m9 9 2 2 4-4" stroke="currentColor" strokeWidth="2" />
        )}
      </svg>
      {!compact && (selected ? t('Na minha lista') : t('Guardar'))}
    </button>
  );
}
