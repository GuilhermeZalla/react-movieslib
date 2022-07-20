import Header from "../../common/header/header";
import FilmCard from "../filmCard/filmCard";
import { Fragment, useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import Aside from "../../common/aside/aside";
import AsideMobile from "../../common/asideMobile/asideMobile";
import Footer from "../../common/footer/footer";

const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZTVhYmNiMDQ5YzY0YzY2MTQyYThjOTlhMDRkN2U2YyIsInN1YiI6IjYyYzUwNTcwMjIzYThiMDBiODIxYmU5MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wKjRI_GKf8zJjtqWyRrgavhGIpA7VlOr3zom2OrupPk';

const MoviesCatalog = () => {
    const [movies, setMovies] = useState([]);
    const [search, setSearch] = useState('');
    const [search2, setSearch2] = useState('');
    const [search3, setSearch3] = useState('');
    const [search4, setSearch4] = useState('');
    const [search5, setSearch5] = useState('');
    const [searchContent, setSearchContent] = useState('');
    let { category } = useParams();
    let { page } = useParams();

    useEffect(() => {
        async function getMovies() {
            let response = await fetch(`https://api.themoviedb.org/3/movie/${category}?api_key=fe5abcb049c64c66142a8c99a04d7e6c&page=${page}`, {
                method: 'GET',
                headers: {
                    "Authorization": 'Bearer ' + accessToken
                }
            });
            let result = response.json();
            return result;
        }
        getMovies().then(data => setMovies([data])).catch((err) => console.log(err));
    }, [movies]);

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
                let response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=fe5abcb049c64c66142a8c99a04d7e6c&query=${movie}&page=3`, {
                    method: 'GET',
                    headers: {
                        "Authorization": 'Bearer ' + accessToken
                    }
                });
                let result = response.json();
                return result;
            }
            async function searchMovie5() {
                let response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=fe5abcb049c64c66142a8c99a04d7e6c&query=${movie}&page=3`, {
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
                        <h1 className="home__title movies-catalog">Overviewing <span>{category.split('_')[0] + ' ' + (category.split('_')[1] === undefined ? '' : category.split('_')[1])}</span> movies</h1>
                        {
                            movies[0]?.results.map((movie, index) => <FilmCard key={index} poster={'https://image.tmdb.org/t/p/w500/' + movie.poster_path} title={movie.title} vote={movie.vote_average.toFixed(1)} movieId={movie.id} />)
                        }
                    </div>
                </main>
                <Footer category={category} />
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

export default MoviesCatalog;