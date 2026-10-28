import Header from '../../components/layout/Header';
import FilmCard from '../../components/movies/FilmCard';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import Aside from '../../components/layout/Aside';
import AsideMobile from '../../components/layout/AsideMobile';
import BannerImg from '../../components/movies/BannerImg';
import { HiArrowSmRight } from 'react-icons/hi';
import { useQuery } from '@tanstack/react-query';
import { movieListQuery, trendingQuery } from '../../api/tmdb/queries';

const Home = () => {
  const trending = useQuery(trendingQuery(1));
  const popular = useQuery(movieListQuery('popular', 1));
  const nowPlaying = useQuery(movieListQuery('now_playing', 1));

  const trendingResults = trending.data?.results ?? [];
  const popularResults = popular.data?.results ?? [];
  const nowPlayingResults = nowPlaying.data?.results ?? [];

  return (
    <Fragment>
      <Header search={true} />
      <Aside />
      <AsideMobile />
      <main className="home__main relative mb-[5%] mt-[7%] pl-[100px] pr-[30px] pt-[20px] pb-[20px] text-ink">
        <h1 className="home__title text-center text-[2.8rem] mb-[15px]">
          Welcome to the Movie Library
        </h1>
        <p className="home__paragraph text-center text-[1.4rem] leading-[.7cm]">
          find the best latest movies you are looking for!
        </p>
        <div className="home__container-slider mb-[8%] mt-[5%]">
          <h2 className="home__container-title font-bold font-display text-[1.3rem] text-accent mb-[10px] flex items-center relative">
            Just arrived!{' '}
            <span>
              <HiArrowSmRight />
            </span>
          </h2>
          <div className="home__slider overflow-x-scroll smooth-scroll flex flex-row gap-15">
            {trendingResults.map((img, index) => (
              <BannerImg
                key={index}
                movieId={img.id}
                url={img.backdrop_path}
                title={img.title}
              />
            ))}
          </div>
        </div>
        <div className="home__container mb-[5%] mt-[5%]">
          <div className="trending container__films relative border-t line/40 mt-[8%] pt-[10px] grid grid-cols-[repeat(auto-fill,minmax(150px,2fr))] gap-10">
            {trendingResults.map((movie, index) => (
              <FilmCard
                key={index}
                poster={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                title={movie.title}
                vote={movie.vote_average?.toFixed(1) ?? '\u2014'}
                movieId={movie.id}
              />
            ))}
          </div>
          <div className="popular container__films relative border-t line/40 mt-[8%] pt-[10px] grid grid-cols-[repeat(auto-fill,minmax(150px,2fr))] gap-10">
            <Link
              to={`/catalog/popular/1`}
              aria-label="Ver mais filmes populares"
            >
              MORE
            </Link>
            {popularResults.map((movie, index) => (
              <FilmCard
                key={index}
                poster={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                title={movie.title}
                vote={movie.vote_average?.toFixed(1) ?? '\u2014'}
                movieId={movie.id}
              />
            ))}
          </div>
          <div className="now-playing container__films relative border-t line/40 mt-[8%] pt-[10px] grid grid-cols-[repeat(auto-fill,minmax(150px,2fr))] gap-10">
            <Link
              to={`/catalog/now_playing/1`}
              aria-label="Ver mais filmes em cartaz"
            >
              MORE
            </Link>
            {nowPlayingResults.map((movie, index) => (
              <FilmCard
                key={index}
                poster={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                title={movie.title}
                vote={movie.vote_average?.toFixed(1) ?? '\u2014'}
                movieId={movie.id}
              />
            ))}
          </div>
        </div>
      </main>
    </Fragment>
  );
};

export default Home;
