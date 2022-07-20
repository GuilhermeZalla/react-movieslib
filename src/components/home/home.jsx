import Header from "../common/header/header";
import FilmCard from "./filmCard/filmCard";
import { Fragment, useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import Aside from "../common/aside/aside";
import AsideMobile from "../common/asideMobile/asideMobile";
import BannerImg from "./bannerImg/bannerImg";
import { HiArrowSmRight } from 'react-icons/hi';

const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZTVhYmNiMDQ5YzY0YzY2MTQyYThjOTlhMDRkN2U2YyIsInN1YiI6IjYyYzUwNTcwMjIzYThiMDBiODIxYmU5MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wKjRI_GKf8zJjtqWyRrgavhGIpA7VlOr3zom2OrupPk';
const popular = 'https://api.themoviedb.org/3/movie/popular?api_key=fe5abcb049c64c66142a8c99a04d7e6c&page=1';
const playing = 'https://api.themoviedb.org/3/movie/now_playing?api_key=fe5abcb049c64c66142a8c99a04d7e6c&page=1';
const trending = 'https://api.themoviedb.org/3/trending/movie/day?api_key=fe5abcb049c64c66142a8c99a04d7e6c&page=1';

async function getTrendingMovies() {
    let response = await fetch(trending, {
        method: 'GET',
        headers: {
            "Authorization": 'Bearer ' + accessToken
        }
    });
    let result = response.json();
    return result;
}

async function getPopularMovies() {
    let response = await fetch(popular, {
        method: 'GET',
        headers: {
            "Authorization": 'Bearer ' + accessToken
        }
    });
    let result = response.json();
    return result;
}

async function getNowPlayingMovies() {
    let response = await fetch(playing, {
        method: 'GET',
        headers: {
            "Authorization": 'Bearer ' + accessToken
        }
    });
    let result = response.json();
    return result;
}

const Home = () => {
    const [popularMovies, setPopularMovies] = useState([]);
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
    const [trendingMovies, setTrendingMovies] = useState([]);
    let next = useRef(null);
    let scroll = useRef(null);

    useEffect(() => {
        getTrendingMovies().then(movies => setTrendingMovies([movies])).catch((err) => console.log(err));
        getPopularMovies().then(movies => setPopularMovies([movies])).catch((err) => console.log(err));
        getNowPlayingMovies().then(movies => setNowPlayingMovies([movies])).catch((err) => console.log(err));
    }, []);

    return (
        <Fragment>
            <Header search={true} />
            <Aside />
            <AsideMobile />
            <main className="home__main">
                <h1 className="home__title">Welcome to the Movie Library</h1>
                <p className="home__paragraph">find the best latest movies you are looking for!</p>
                <div className="home__container-slider">
                    <h2 className="home__container-title">Just arrived! <span ref={next}><HiArrowSmRight/></span></h2>
                    <div className="home__slider" onScroll={() => next.current.style.opacity = '0'}>
                        {
                            trendingMovies[0]?.results.map((img, index) => <BannerImg key={index} movieId={img.id} url={img.backdrop_path} title={img.title} />)
                        }
                    </div>
                </div>
                <div className="home__container">
                    <div className="trending container__films">
                        {
                            trendingMovies[0]?.results.map((movie, index) => <FilmCard key={index} poster={'https://image.tmdb.org/t/p/w500/' + movie.poster_path} title={movie.title} vote={movie.vote_average.toFixed(1)} movieId={movie.id} />)
                        }
                    </div>
                    <div className="popular container__films">
                        <Link to={`/catalog/${'popular'}/${1}`}>MORE</Link>
                        {
                            popularMovies[0]?.results.map((movie, index) => <FilmCard key={index} poster={'https://image.tmdb.org/t/p/w500/' + movie.poster_path} title={movie.title} vote={movie.vote_average.toFixed(1)} movieId={movie.id} />)
                        }
                    </div>
                    <div className="now-playing container__films">
                        <Link to={`/catalog/${'now_playing'}/${1}`}>MORE</Link>
                        {
                            nowPlayingMovies[0]?.results.map((movie, index) => <FilmCard key={index} poster={'https://image.tmdb.org/t/p/w500/' + movie.poster_path} title={movie.title} vote={movie.vote_average.toFixed(1)} movieId={movie.id} />)
                        }
                    </div>
                </div>
            </main>
        </Fragment>
    );
};

export default Home;