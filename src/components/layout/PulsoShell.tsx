import { t } from '../../i18n/translate';
import { useLocale } from '../../i18n/useLocale';
import { useContext, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { SavedMoviesContext } from '../../app/savedMoviesContext';
import { searchInputSchema } from '../../../shared/tmdbRequest';
import LanguageSwitcher from './LanguageSwitcher';

const links = [
  ['/catalog/popular/1', 'Filmes', 'M4 4h16v16H4zM4 9h16M9 4v5M15 4v5'],
  [
    '/catalog/now_playing/1',
    'Em cartaz',
    'M3 7h18v13H3zM3 7l3-4h15l-3 4M8 3l-3 4M14 3l-3 4',
  ],
  ['/catalog/upcoming/1', 'Em breve', 'M8 3v4m8-4v4M4 10h16M4 5h16v16H4z'],
  [
    '/cast',
    'Pessoas',
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8m11 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  ],
  ['/minha-lista', 'Minha lista', 'M6 3h12v18l-6-4-6 4V3Z'],
] as const;

export default function PulsoShell({
  children,
}: {
  children: React.ReactNode;
}) {
  useLocale();
  const saved = useContext(SavedMoviesContext);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const previousPath = useRef(pathname);
  useEffect(() => {
    if (previousPath.current !== pathname) {
      document.getElementById('main')?.focus({ preventScroll: true });
      previousPath.current = pathname;
    }
  }, [pathname]);
  return (
    <div data-design-preview data-design-theme="dark" className="cinema-shell">
      <a href="#main" className="skip-link">
        {t('Pular para o conteúdo principal')}
      </a>
      <header className="cinema-header">
        <Link
          to="/"
          aria-label={t('MoviesLib — início')}
          className="cinema-brand"
        >
          <span aria-hidden="true" className="cinema-brand__mark">
            <img src="/favicon.svg" width="32" height="32" alt="" />
          </span>
          movieslib<span className="text-preview-accent-text">.</span>
        </Link>
        <form
          role="search"
          aria-label={t('Busca global')}
          className="cinema-search"
          onSubmit={(event) => {
            event.preventDefault();
            const term = searchInputSchema.parse(search);
            if (term)
              void navigate('/catalog/popular/1?q=' + encodeURIComponent(term));
          }}
        >
          <label className="sr-only" htmlFor="global-film-search">
            {t('Pesquisar catálogo')}
          </label>
          <input
            id="global-film-search"
            type="search"
            value={search}
            maxLength={200}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t('Encontre seu próximo filme')}
          />
          <button type="submit" aria-label={t('Pesquisar no catálogo')}>
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="10.5"
                cy="10.5"
                r="6.5"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path d="m16 16 5 5" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
        </form>
        <span className="cinema-header__note">
          {t('O cinema continua por aqui.')}
        </span>
      </header>
      <aside aria-label={t('Exploração')} className="cinema-sidebar">
        <p className="cinema-sidebar__label">{t('Explorar')}</p>
        <nav aria-label={t('Navegação principal')}>
          <ul className="cinema-menu">
            {links.map(([path, label, icon]) => (
              <li key={path}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    'cinema-menu__link' +
                    (isActive ? ' cinema-menu__link--active' : '')
                  }
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d={icon} />
                  </svg>
                  <span>{t(label)}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="cinema-sidebar__end">
          <span aria-hidden="true" />
          {t('Uma boa história muda o dia.')}
        </div>
      </aside>
      <main id="main" tabIndex={-1} className="cinema-main">
        {children}
      </main>
      {saved?.error && (
        <p role="status" className="cinema-notice">
          {t(saved.error)}
        </p>
      )}
      <footer className="cinema-footer">
        <section aria-label={t('Créditos')}>
          <h2 className="sr-only">{t('Créditos')}</h2>
          <p>
            {t('Feito por')}{' '}
            <strong className="font-semibold text-preview-ink">
              Guilherme Zalla
            </strong>{' '}
            ·{' '}
            <a
              href="https://github.com/GuilhermeZalla/react-movieslib"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('Código no GitHub ↗')}
            </a>
          </p>
          <p>
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('Dados e imagens: The Movie Database (TMDB)')}
            </a>
          </p>
          <p>
            This product uses the TMDB API but is not endorsed or certified by
            TMDB.
          </p>
        </section>
        <div className="grid gap-3">
          <LanguageSwitcher />
          {pathname === '/' && (
            <Link to="/catalog/popular/1" className="cinema-footer__link">
              {t('A próxima sessão →')}
            </Link>
          )}
        </div>
      </footer>
    </div>
  );
}
