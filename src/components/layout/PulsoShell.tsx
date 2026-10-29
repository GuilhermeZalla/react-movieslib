import '@fontsource-variable/bricolage-grotesque/wght.css';
import '@fontsource-variable/figtree/wght.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../base/ThemeToggle';

const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'dark';
  try {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // Blocked storage must not prevent the home from rendering.
  }
  return 'dark';
};

const PulsoShell = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);
  const [logoFailed, setLogoFailed] = useState(false);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      // Theme still works for this visit when storage is unavailable.
    }
  };

  return (
    <div
      data-design-preview
      data-design-theme={theme}
      className="min-h-screen bg-preview-canvas text-preview-ink font-preview-figtree"
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-preview-control focus:bg-preview-accent focus:px-4 focus:py-2 focus:text-preview-on-accent"
      >
        Pular para o conteúdo principal
      </a>
      <header className="sticky top-0 z-20 border-b border-preview-line bg-preview-canvas">
        <nav
          aria-label="Navegação principal"
          className="mx-auto flex max-w-preview-wide flex-wrap items-center justify-between gap-4 px-5 py-3"
        >
          <Link
            to="/"
            className="font-preview-bricolage text-preview-card font-extrabold text-preview-ink"
          >
            movieslib<span className="text-preview-accent-text">.</span>
          </Link>
          <ul className="flex items-center gap-4 text-preview-caption text-preview-muted">
            <li>
              <Link to="/catalog/popular/1" className="hover:text-preview-ink">
                Filmes
              </Link>
            </li>
            <li>
              <Link to="/cast" className="hover:text-preview-ink">
                Pessoas
              </Link>
            </li>
            <li>
              <Link
                to="/catalog/now_playing/1"
                className="hover:text-preview-ink"
              >
                Em cartaz
              </Link>
            </li>
          </ul>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </nav>
      </header>
      <main id="main" className="mx-auto max-w-preview-wide px-5 py-8">
        {children}
      </main>
      <footer className="border-t border-preview-line px-5 py-8 text-preview-caption text-preview-muted">
        <section
          aria-label="Créditos"
          className="mx-auto flex max-w-preview-wide flex-col items-center gap-4 text-center"
        >
          <div className="flex items-center gap-3">
            {logoFailed ? (
              <span>TMDB</span>
            ) : (
              <img
                src="/tmdb-logo.svg"
                alt="The Movie Database (TMDB)"
                width="80"
                height="16"
                className="h-4 w-auto"
                onError={() => setLogoFailed(true)}
              />
            )}
          </div>
          <p>
            This product uses the TMDB API but is not endorsed or certified by
            TMDB.
          </p>
          <p>
            Projeto de estudo e portfólio, sem vínculo com TMDB ou estúdios.
          </p>
          <p>
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-preview-ink"
            >
              themoviedb.org
            </a>
          </p>
        </section>
      </footer>
    </div>
  );
};

export default PulsoShell;
