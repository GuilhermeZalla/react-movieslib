import Header from "../../common/header/header";
import FilmCard from "../filmCard/filmCard";
import Aside from "../../common/aside/aside";
import AsideMobile from "../../common/asideMobile/asideMobile";
import { Fragment, useEffect, useState } from 'react';
import { useParams } from "react-router-dom";

const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZTVhYmNiMDQ5YzY0YzY2MTQyYThjOTlhMDRkN2U2YyIsInN1YiI6IjYyYzUwNTcwMjIzYThiMDBiODIxYmU5MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wKjRI_GKf8zJjtqWyRrgavhGIpA7VlOr3zom2OrupPk';

const GenresCatalog = () => {
    const [movies, setMovies] = useState([]);
    const [movies2, setMoviesPage2] = useState([]);
    const [movies3, setMoviesPage3] = useState([]);
    const [movies4, setMoviesPage4] = useState([]);
    const [movies5, setMoviesPage5] = useState([]);
    const [search, setSearch] = useState('');
    const [search2, setSearch2] = useState('');
    const [search3, setSearch3] = useState('');
    const [search4, setSearch4] = useState('');
    const [search5, setSearch5] = useState('');
    const [searchContent, setSearchContent] = useState('');
    let { genre } = useParams();
    let { id } = useParams();

    useEffect(() => {
        async function getMovies() {
            let response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=fe5abcb049c64c66142a8c99a04d7e6c&page=1`, {
                method: 'GET',
                headers: {
                    "Authorization": 'Bearer ' + accessToken
                }
            });
            let result = response.json();
            return result;
        }
        async function getMoviesPage2() {
            let response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=fe5abcb049c64c66142a8c99a04d7e6c&page=2`, {
                method: 'GET',
                headers: {
                    "Authorization": 'Bearer ' + accessToken
                }
            });
            let result = response.json();
            return result;
        }
        async function getMoviesPage3() {
            let response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=fe5abcb049c64c66142a8c99a04d7e6c&page=3`, {
                method: 'GET',
                headers: {
                    "Authorization": 'Bearer ' + accessToken
                }
            });
            let result = response.json();
            return result;
        }
        async function getMoviesPage4() {
            let response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=fe5abcb049c64c66142a8c99a04d7e6c&page=4`, {
                method: 'GET',
                headers: {
                    "Authorization": 'Bearer ' + accessToken
                }
            });
            let result = response.json();
            return result;
        }
        async function getMoviesPage5() {
            let response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=fe5abcb049c64c66142a8c99a04d7e6c&page=5`, {
                method: 'GET',
                headers: {
                    "Authorization": 'Bearer ' + accessToken
                }
            });
            let result = response.json();
            return result;
        }
        getMovies().then(data => setMovies(data)).catch((err) => console.log(err));
        getMoviesPage2().then(data => setMoviesPage2(data)).catch((err) => console.log(err));
        getMoviesPage3().then(data => setMoviesPage3(data)).catch((err) => console.log(err));
        getMoviesPage4().then(data => setMoviesPage4(data)).catch((err) => console.log(err));
        getMoviesPage5().then(data => setMoviesPage5(data)).catch((err) => console.log(err));
    }, []);

    const handleSearchMovies = result => {
        let movie = result;
        if (movie === '') {
            setSearch('');
        } else {
            movie = movie.replace(/\s/g, '+');
            setSearchContent(movie);
            async function searchMovie() {
                let response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=fe5abcb049c64c66142a8c99a04d7e6c&query=${movie}&page=1`, {
                    method: 'GET',
                    headers: {
                        "Authorization": 'Bearer ' + accessToken
                    }
                });
                let result = response.json();
                return result;
            }
            async function searchMovie2() {
                let response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=fe5abcb049c64c66142a8c99a04d7e6c&query=${movie}&page=2`, {
                    method: 'GET',
                    headers: {
                        "Authorization": 'Bearer ' + accessToken
                    }
                });
                let result = response.json();
                return result;
            }
            async function searchMovie3() {
                let response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=fe5abcb049c64c66142a8c99a04d7e6c&query=${movie}&page=3`, {
                    method: 'GET',
                    headers: {
                        "Authorization": 'Bearer ' + accessToken
                    }
                });
                let result = response.json();
                return result;
            }
            async function searchMovie4() {
                let response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=fe5abcb049c64c66142a8c99a04d7e6c&query=${movie}&page=4`, {
                    method: 'GET',
                    headers: {
                        "Authorization": 'Bearer ' + accessToken
                    }
                });
                let result = response.json();
                return result;
            }
            async function searchMovie5() {
                let response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=fe5abcb049c64c66142a8c99a04d7e6c&query=${movie}&page=5`, {
                    method: 'GET',
                    headers: {
                        "Authorization": 'Bearer ' + accessToken
                    }
                });
                let result = response.json();
                return result;
            }
            searchMovie().then(data => setSearch(data)).catch((err) => console.log(err));
            searchMovie2().then(data => setSearch2(data)).catch((err) => console.log(err));
            searchMovie3().then(data => setSearch3(data)).catch((err) => console.log(err));
            searchMovie4().then(data => setSearch4(data)).catch((err) => console.log(err));
            searchMovie5().then(data => setSearch5(data)).catch((err) => console.log(err));
        }
    }

    if (search === '') {
        return (
            <Fragment>
                <Header handleSearchMovies={handleSearchMovies} />
                <Aside />
                <AsideMobile />
                <main className="home__main">
                    <div className="home__container container__films catalog">
                        <h1 className="home__title movies-catalog">Overviewing <span>{genre}</span> movies</h1>
                        {
                            movies.results?.map((movie, index) => movie.genre_ids.map(ids => ids === Number(id) ? <FilmCard key={index} poster={'https://image.tmdb.org/t/p/w500/' + movie.poster_path} title={movie.title} vote={movie.vote_average.toFixed(1)} movieId={movie.id} /> : null))
                        }
                        {
                            movies2.results?.map((movie, index) => movie.genre_ids.map(ids => ids === Number(id) ? <FilmCard key={index} poster={'https://image.tmdb.org/t/p/w500/' + movie.poster_path} title={movie.title} vote={movie.vote_average.toFixed(1)} movieId={movie.id} /> : null))
                        }
                        {
                            movies3.results?.map((movie, index) => movie.genre_ids.map(ids => ids === Number(id) ? <FilmCard key={index} poster={'https://image.tmdb.org/t/p/w500/' + movie.poster_path} title={movie.title} vote={movie.vote_average.toFixed(1)} movieId={movie.id} /> : null))
                        }
                        {
                            movies4.results?.map((movie, index) => movie.genre_ids.map(ids => ids === Number(id) ? <FilmCard key={index} poster={'https://image.tmdb.org/t/p/w500/' + movie.poster_path} title={movie.title} vote={movie.vote_average.toFixed(1)} movieId={movie.id} /> : null))
                        }
                        {
                            movies5.results?.map((movie, index) => movie.genre_ids.map(ids => ids === Number(id) ? <FilmCard key={index} poster={'https://image.tmdb.org/t/p/w500/' + movie.poster_path} title={movie.title} vote={movie.vote_average.toFixed(1)} movieId={movie.id} /> : null))
                        }
                    </div>
                </main>
            </Fragment>
        );
    } else {
        return (
            <Fragment>
                <Header handleSearchMovies={handleSearchMovies} />
                <Aside />
                <AsideMobile />
                <main className="home__main">
                    <div className="home__container container__films catalog">
                        <h1 className="home__title movies-catalog">Movies by the name <span>{searchContent.replace('+', ' ')}</span></h1>
                        {
                            search.results?.map((movie, index) => <FilmCard key={index} poster={'https://image.tmdb.org/t/p/w500/' + movie.poster_path} title={movie.title} vote={movie.vote_average.toFixed(1)} movieId={movie.id} />)
                        }
                        {
                            search2.results?.map((movie, index) => <FilmCard key={index} poster={'https://image.tmdb.org/t/p/w500/' + movie.poster_path} title={movie.title} vote={movie.vote_average.toFixed(1)} movieId={movie.id} />)
                        }
                        {
                            search3.results?.map((movie, index) => <FilmCard key={index} poster={'https://image.tmdb.org/t/p/w500/' + movie.poster_path} title={movie.title} vote={movie.vote_average.toFixed(1)} movieId={movie.id} />)
                        }
                        {
                            search4.results?.map((movie, index) => <FilmCard key={index} poster={'https://image.tmdb.org/t/p/w500/' + movie.poster_path} title={movie.title} vote={movie.vote_average.toFixed(1)} movieId={movie.id} />)
                        }
                        {
                            search5.results?.map((movie, index) => <FilmCard key={index} poster={'https://image.tmdb.org/t/p/w500/' + movie.poster_path} title={movie.title} vote={movie.vote_average.toFixed(1)} movieId={movie.id} />)
                        }
                    </div>
                </main>
            </Fragment>
        );
    }
};

export default GenresCatalog;