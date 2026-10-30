import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { t } from '../i18n/translate';
import { useLocale } from '../i18n/useLocale';
import { lazy, Suspense } from 'react';
import GenresCatalogScreen from '../pages/genres/GenresCatalogScreen';
import HomeScreen from '../pages/home/HomeScreen';
import MovieDetailsScreen from '../pages/movie-details/MovieDetailsScreen';
import MoviesCatalogScreen from '../pages/movies/MoviesCatalogScreen';
import CastDetailsScreen from '../pages/person-details/CastDetailsScreen';
import CastCatalogScreen from '../pages/people/CastCatalogScreen';
import NotFoundScreen from '../pages/not-found/NotFoundScreen';
import MyList from '../pages/my-list/MyList';
import PulsoShell from '../components/layout/PulsoShell';
const DesignSystem = import.meta.env.DEV
  ? lazy(() => import('../pages/design/DesignSystem'))
  : null;
export default function LayoutRoutes() {
  useLocale();
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <PulsoShell>
              <Outlet />
            </PulsoShell>
          }
        >
          <Route path="/" element={<HomeScreen />} />
          <Route path="/movie-details/:id" element={<MovieDetailsScreen />} />
          <Route
            path="/catalog/:category/:page"
            element={<MoviesCatalogScreen />}
          />
          <Route
            path="/upcoming_&_just_released/:category/:page"
            element={<MoviesCatalogScreen />}
          />
          <Route
            path="/top_rated/:category/:page"
            element={<MoviesCatalogScreen />}
          />
          <Route path="/genres/:id/:genre" element={<GenresCatalogScreen />} />
          <Route path="/cast/:id" element={<CastDetailsScreen />} />
          <Route path="/cast" element={<CastCatalogScreen />} />
          <Route path="/minha-lista" element={<MyList />} />
          <Route path="*" element={<NotFoundScreen />} />
        </Route>
        {DesignSystem && (
          <Route
            path="/design"
            element={
              <Suspense fallback={<p>{t('Preparando a amostra…')}</p>}>
                <DesignSystem />
              </Suspense>
            }
          />
        )}
      </Routes>
    </BrowserRouter>
  );
}
