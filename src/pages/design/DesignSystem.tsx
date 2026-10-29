import '@fontsource-variable/plus-jakarta-sans/wght.css';
import '@fontsource-variable/bricolage-grotesque/wght.css';
import '@fontsource-variable/figtree/wght.css';
import { useState } from 'react';
import Button from '../../components/base/Button';
import MovieCard from '../../components/base/MovieCard';
import Skeleton from '../../components/base/Skeleton';
import EmptyState from '../../components/base/EmptyState';
import ErrorState from '../../components/base/ErrorState';

type FontOption = 'a' | 'b' | 'c';
type PreviewTheme = 'dark' | 'light';
type PreviewSize = 'mobile' | 'wide';

const fontOptions: { value: FontOption; label: string; note: string }[] = [
  {
    value: 'a',
    label: 'A · Plus Jakarta Sans',
    note: 'Uma família, números calmos e leitura nítida.',
  },
  {
    value: 'b',
    label: 'B · Bricolage + Figtree',
    note: 'Título expressivo, corpo leve.',
  },
  {
    value: 'c',
    label: 'C · Figtree',
    note: 'Uma família, títulos em 800 e entreletras justas.',
  },
];

const FilmStrip = () => (
  <svg viewBox="0 0 180 270" className="size-full" aria-hidden="true">
    <rect width="180" height="270" fill="var(--color-preview-accent-soft)" />
    <path
      d="M25 0v270M155 0v270"
      stroke="var(--color-preview-accent-text)"
      strokeWidth="3"
    />
    {[18, 60, 102, 144, 186, 228].map((y) => (
      <g key={y} fill="var(--color-preview-canvas)">
        <rect x="8" y={y} width="10" height="20" rx="2" />
        <rect x="162" y={y} width="10" height="20" rx="2" />
      </g>
    ))}
    <circle cx="90" cy="110" r="43" fill="var(--color-preview-accent)" />
    <path d="M60 192l30-56 30 56H60Z" fill="var(--color-preview-ink)" />
    <path d="M48 210h84" stroke="var(--color-preview-ink)" strokeWidth="3" />
  </svg>
);

const Ticket = () => (
  <svg viewBox="0 0 180 270" className="size-full" aria-hidden="true">
    <rect width="180" height="270" fill="var(--color-preview-surface)" />
    <path
      d="M24 70h132v42a14 14 0 0 0 0 28v60H24v-60a14 14 0 0 0 0-28V70Z"
      fill="var(--color-preview-accent)"
    />
    <path
      d="M60 70v130"
      stroke="var(--color-preview-on-accent)"
      strokeDasharray="5 8"
      strokeWidth="2"
    />
    <circle cx="108" cy="136" r="25" fill="var(--color-preview-on-accent)" />
    <path d="m101 124 22 12-22 12v-24Z" fill="var(--color-preview-accent)" />
  </svg>
);

const EmptySeat = () => (
  <svg
    viewBox="0 0 64 64"
    className="size-12 text-preview-accent-text"
    aria-hidden="true"
  >
    <path
      d="M17 31V15c0-5 4-8 8-8h14c4 0 8 3 8 8v16M12 32v15c0 4 3 7 7 7h26c4 0 7-3 7-7V32M12 40h40M20 54v5m24-5v5"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BrokenTicket = () => (
  <svg
    viewBox="0 0 64 64"
    className="size-12 text-preview-accent-text"
    aria-hidden="true"
  >
    <path
      d="M7 17h50v12c-4 0-6 2-6 5s2 5 6 5v9H7v-9c4 0 6-2 6-5s-2-5-6-5V17Zm25 0v9l-5 7 8 4-4 11"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TypeScale = () => (
  <div className="grid gap-3 border-t border-preview-line pt-5">
    <p className="text-preview-caption text-preview-muted">
      Escala · 360 / 1440 px
    </p>
    <p className="preview-headline font-display text-preview-display font-extrabold leading-none text-preview-ink">
      Filme para ver de perto{' '}
      <small className="font-body text-preview-caption font-normal text-preview-muted">
        display
      </small>
    </p>
    <p className="preview-headline font-display text-preview-title font-extrabold text-preview-ink">
      A noite em cartaz{' '}
      <small className="font-body text-preview-caption font-normal text-preview-muted">
        título
      </small>
    </p>
    <p className="font-display text-preview-section font-bold text-preview-ink">
      Escolhas da semana{' '}
      <small className="font-body text-preview-caption font-normal text-preview-muted">
        seção
      </small>
    </p>
    <p className="font-display text-preview-card font-bold text-preview-ink">
      Depois da última sessão{' '}
      <small className="font-body text-preview-caption font-normal text-preview-muted">
        card
      </small>
    </p>
    <p className="text-preview-body text-preview-muted">
      Um encontro, uma cidade, uma história que fica.{' '}
      <small className="text-preview-caption">corpo</small>
    </p>
    <p className="text-preview-caption text-preview-muted">
      12 de outubro · legenda
    </p>
    <p className="text-preview-number font-extrabold text-preview-accent-text">
      08.7 <small className="text-preview-caption font-normal">número</small>
    </p>
  </div>
);

interface PreviewFrameProps {
  font: FontOption;
  theme: PreviewTheme;
  size: PreviewSize;
}

const PreviewFrame = ({ font, theme, size }: PreviewFrameProps) => (
  <section
    data-design-preview
    data-design-theme={theme}
    data-font-option={font}
    data-preview-size={size}
    aria-label={
      'Amostra ' +
      (theme === 'dark' ? 'escura' : 'clara') +
      ' em ' +
      (size === 'mobile' ? '360' : '1440') +
      ' pixels'
    }
    className="bg-preview-canvas p-5 font-body text-preview-ink"
  >
    <header className="flex items-center justify-between gap-4 border-b border-preview-line pb-4">
      <span className="font-display text-preview-card font-extrabold tracking-preview-tight">
        movieslib<span className="text-preview-accent-text">.</span>
      </span>
      <nav
        aria-label="Navegação da amostra"
        className="flex gap-4 text-preview-caption text-preview-muted"
      >
        <span>Filmes</span>
        <span>Pessoas</span>
        <span>Minha lista</span>
      </nav>
    </header>
    <div
      className={
        size === 'wide'
          ? 'grid grid-cols-2 items-center gap-8 py-10'
          : 'grid gap-5 py-8'
      }
    >
      <div className="grid content-center gap-4">
        <p className="text-preview-caption font-bold uppercase tracking-wide text-preview-accent-text">
          A escolha de hoje
        </p>
        <h2 className="preview-headline font-display text-preview-display font-extrabold leading-none text-preview-ink">
          A tela acende.
          <br />O mundo espera.
        </h2>
        <p className="max-w-prose text-preview-body text-preview-muted">
          Histórias para dar play sem pensar duas vezes. O próximo favorito pode
          estar logo abaixo.
        </p>
        <div>
          <Button preview>Explorar filmes</Button>
        </div>
      </div>
      <div className="mx-auto w-preview-card">
        <MovieCard
          movieId={1}
          title="Última sessão"
          vote="8.7"
          artwork={<FilmStrip />}
        />
      </div>
    </div>
    <section
      aria-label="Populares agora"
      className="grid gap-4 border-t border-preview-line py-6"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-preview-section font-bold text-preview-ink">
          Todo mundo está vendo
        </h2>
        <span className="text-preview-caption text-preview-muted">
          Populares agora
        </span>
      </div>
      <div className="flex flex-wrap items-start gap-5">
        <MovieCard
          movieId={2}
          title="Ingresso de ida"
          vote="7.9"
          rank={1}
          artwork={<Ticket />}
        />
        <MovieCard
          movieId={3}
          title="Última sessão"
          vote="8.7"
          rank={2}
          artwork={<FilmStrip />}
        />
        <Skeleton variant="poster" />
      </div>
    </section>
    <section
      aria-label="Estados de resultado"
      className={
        size === 'wide' ? 'grid grid-cols-2 gap-5 py-6' : 'grid gap-5 py-6'
      }
    >
      <EmptyState
        preview
        title="A sala está vazia"
        message="Nenhum filme por aqui. Tente outro título."
        actionLabel="Ver populares"
        onAction={() => {}}
        illustration={<EmptySeat />}
      />
      <ErrorState
        preview
        message="A sessão caiu"
        retryLabel="Tentar de novo"
        onRetry={() => {}}
        illustration={<BrokenTicket />}
      />
    </section>
    <TypeScale />
  </section>
);

const DesignSystem = () => {
  const [font, setFont] = useState<FontOption>('c');
  return (
    <main className="min-h-screen bg-preview-canvas p-5 font-preview-figtree text-preview-ink">
      <div className="mx-auto max-w-preview-wide">
        <p className="text-preview-caption font-bold uppercase tracking-wide text-preview-accent-text">
          Laboratório visual · apenas desenvolvimento
        </p>
        <h1 className="mt-2 font-preview-figtree text-preview-title font-extrabold text-preview-ink">
          Pulso: escolha a voz dos títulos
        </h1>
        <p className="mt-2 max-w-prose text-preview-body text-preview-muted">
          O pôster abre a conversa. Troque a fonte e compare os dois temas em
          360 e 1440 px. Os filmes desta página são fictícios.
        </p>
        <fieldset className="my-8 grid gap-3 border-t border-preview-line pt-5">
          <legend className="text-preview-section font-bold">Tipografia</legend>
          {fontOptions.map((option) => (
            <label
              key={option.value}
              htmlFor={'font-' + option.value}
              className="flex cursor-pointer items-start gap-3 rounded-preview-control border border-preview-line bg-preview-surface p-3 text-preview-body"
            >
              <span className="sr-only">Selecionar </span>
              <input
                id={'font-' + option.value}
                type="radio"
                name="font"
                value={option.value}
                checked={font === option.value}
                onChange={() => setFont(option.value)}
                className="mt-1 accent-preview-accent"
              />
              <span>
                <strong>{option.label}</strong>
                <br />
                <span className="text-preview-muted">{option.note}</span>
              </span>
            </label>
          ))}
        </fieldset>
        {(['dark', 'light'] as const).flatMap((theme) =>
          (['mobile', 'wide'] as const).map((size) => (
            <div key={theme + '-' + size} className="mb-10">
              <h2 className="mb-2 text-preview-section font-bold">
                {theme === 'dark' ? 'Escuro' : 'Claro'} ·{' '}
                {size === 'mobile' ? '360 px' : '1440 px'}
              </h2>
              <div className="overflow-x-auto rounded-preview-control border border-preview-line">
                <PreviewFrame font={font} theme={theme} size={size} />
              </div>
            </div>
          )),
        )}
      </div>
    </main>
  );
};

export default DesignSystem;
