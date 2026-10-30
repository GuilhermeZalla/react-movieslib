import { t } from '../../i18n/translate';
import { useLocale } from '../../i18n/useLocale';
import { useEffect, useState } from 'react';
export default function Trailer({
  videoKey,
  title,
}: {
  videoKey: string;
  title: string;
}) {
  useLocale();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [open]);
  if (!/^[A-Za-z0-9_-]{11}$/.test(videoKey)) return null;
  return (
    <div className="grid gap-3">
      <div>
        <button
          type="button"
          className="button-primary"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="movie-trailer"
        >
          {open ? t('Fechar trailer') : t('Abrir trailer')}
        </button>
      </div>
      <p className="text-preview-caption text-preview-muted">
        {t('Ao abrir, você se conecta ao YouTube. O vídeo não começa sozinho.')}
      </p>
      {open && (
        <div
          id="movie-trailer"
          className="aspect-video overflow-hidden rounded-preview-poster bg-preview-surface"
        >
          <iframe
            className="size-full border-0"
            src={
              'https://www.youtube-nocookie.com/embed/' +
              videoKey +
              '?autoplay=0&rel=0'
            }
            title={t('Trailer de {title}', { title })}
            allow="encrypted-media; picture-in-picture; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
            sandbox="allow-scripts allow-same-origin allow-presentation"
            allowFullScreen
          />
        </div>
      )}
      {open && (
        <p className="text-preview-caption text-preview-muted">
          {t('Se o player não abrir, assista diretamente no YouTube.')}{' '}
          <a
            className="text-preview-accent-text underline"
            href={'https://www.youtube.com/watch?v=' + videoKey}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('Assistir no YouTube')}
          </a>
        </p>
      )}
    </div>
  );
}
