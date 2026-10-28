import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GenresCatalogScreen from '../pages/genres/GenresCatalogScreen';
import HomeScreen from '../pages/home/HomeScreen';
import MovieDetailsScreen from '../pages/movie-details/MovieDetailsScreen';
import MoviesCatalogScreen from '../pages/movies/MoviesCatalogScreen';
import CastDetailsScreen from '../pages/person-details/CastDetailsScreen';
import CastCatalogScreen from '../pages/people/CastCatalogScreen';
import NotFoundScreen from '../pages/not-found/NotFoundScreen';

const LayoutRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={'/'} element={<HomeScreen />} />
        <Route path={'/movie-details/:id'} element={<MovieDetailsScreen />} />
        <Route
          path={'/catalog/:category/:page'}
          element={<MoviesCatalogScreen />}
        />
        <Route
          path={'/upcoming_&_just_released/:category/:page'}
          element={<MoviesCatalogScreen />}
        />
        <Route
          path={'/top_rated/:category/:page'}
          element={<MoviesCatalogScreen />}
        />
        <Route path={'/genres/:id/:genre'} element={<GenresCatalogScreen />} />
        <Route path={'/cast/:id'} element={<CastDetailsScreen />} />
        <Route path={'/cast'} element={<CastCatalogScreen />} />
        <Route path="*" element={<NotFoundScreen />} />
      </Routes>
    </BrowserRouter>
  );
};

export default LayoutRoutes;
