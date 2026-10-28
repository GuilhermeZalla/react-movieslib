import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GenresCatalogScreen from './screens/genresCatalogScreen';
import HomeScreen from './screens/homeScreen';
import MovieDetailsScreen from './screens/movie-detailsScreen';
import MoviesCatalogScreen from './screens/moviesCatalogScreen';
import CastDetailsScreen from './screens/castDetailsScreen';
import CastCatalogScreen from './screens/castCatalogScreen';
import NotFoundScreen from './screens/notFoundScreen';

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
