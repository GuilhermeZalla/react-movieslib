import { BrowserRouter, Routes, Route } from "react-router-dom";
import GenresCatalogScreen from "./screens/genresCatalogScreen";
import HomeScreen from "./screens/homeScreen";
import MovieDetailsScreen from "./screens/movie-detailsScreen";
import MoviesCatalogScreen from "./screens/moviesCatalogScreen";
import CastDetailsScreen from "./screens/castDetailsScreen";
import CastCatalogScreen from "./screens/castCatalogScreen";

const LayoutRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path={'/'} element={<HomeScreen />} />
                <Route exact path={'/movie-details/:id'} element={<MovieDetailsScreen />} />
                <Route exact path={'/catalog/:category/:page'} element={<MoviesCatalogScreen />} />
                <Route exact path={'/upcoming_&_just_released/:category/:page'} element={<MoviesCatalogScreen />} />
                <Route exact path={'/top_rated/:category/:page'} element={<MoviesCatalogScreen />} />
                <Route exact path={'/genres/:id/:genre'} element={<GenresCatalogScreen />} />
                <Route exact path={'/cast/:id'} element={<CastDetailsScreen />} />
                <Route exact path={'/cast'} element={<CastCatalogScreen />} />
            </Routes>
        </BrowserRouter>
    )
}

export default LayoutRoutes;