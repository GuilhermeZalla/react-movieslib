import type { GenreList } from '../../../types/tmdb';
// Legacy JSON is trusted only at these explicit boundaries; schema validation is Phase 3.
import { useRef, useState, useEffect } from 'react';
import { AiOutlineHome } from 'react-icons/ai';
import { BiCameraMovie, BiFilm, BiTimer, BiStar } from 'react-icons/bi';
import { IoPeopleOutline } from 'react-icons/io5';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { Link } from 'react-router-dom';
import Genres from './genres/genres';

const Aside = () => {
  const [genres, setGenres] = useState<GenreList | null>(null);
  const dropdown = useRef<HTMLLIElement>(null);
  const menu = useRef<HTMLElement>(null);
  const arrow = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    async function getGenres(): Promise<GenreList> {
      const response = await fetch(`/api/tmdb/genre/movie/list`, {
        method: 'GET',
      });
      const result: unknown = await response.json();
      return result as GenreList;
    }
    getGenres()
      .then((genres) => setGenres(genres))
      .catch((error: unknown) => console.error(error));
  }, []);

  const handleAside = () => {
    if (!menu.current || !dropdown.current) return;
    if (
      menu.current.style.width === '70px' ||
      menu.current.style.width === ''
    ) {
      menu.current.style.width = '250px';
    } else {
      menu.current.style.width = '70px';
      dropdown.current.style.height = '0px';
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }
  };

  const handleDropDown = () => {
    if (!dropdown.current || !arrow.current) return;
    if (
      dropdown.current.style.height === '0px' ||
      dropdown.current.style.height === ''
    ) {
      dropdown.current.style.height = '230px';
      arrow.current.style.transform = 'rotate(180deg)';
    } else {
      dropdown.current.style.height = '0px';
      arrow.current.style.transform = 'rotate(0deg)';
    }
  };

  return (
    <aside className="aside" ref={menu}>
      <ul className="aside__list">
        <li className="aside__item">
          <Link to={'/'} onClick={handleAside}>
            <BiCameraMovie /> MoviesLib
          </Link>
        </li>
        <li className="aside__item">
          <button type="button" onClick={handleAside}>
            <AiOutlineHome />
          </button>
          <Link to={'/'} onClick={handleAside}>
            Home
          </Link>
        </li>
        <li className="aside__item">
          <button type="button" onClick={handleAside}>
            <BiFilm />
          </button>
          <a role="button" className="aside__dropdown" onClick={handleDropDown}>
            Genres{' '}
            <span className="arrow" ref={arrow}>
              <MdOutlineKeyboardArrowDown />
            </span>
          </a>
        </li>
        <li className="aside__item menu-dropdown" ref={dropdown}>
          <ul className="aside__sub-list">
            {genres?.genres?.map((genre, index) =>
              genre.name === 'TV Movie' ||
              genre.name === 'Documentary' ? null : (
                <Genres
                  key={index}
                  handleAside={handleAside}
                  id={genre.id}
                  name={genre.name}
                />
              ),
            )}
          </ul>
        </li>
        <li className="aside__item">
          <button type="button" onClick={handleAside}>
            <IoPeopleOutline />
          </button>
          <Link to={'/cast'} onClick={handleAside}>
            Cast
          </Link>
        </li>
        <li className="aside__item">
          <button type="button" onClick={handleAside}>
            <BiTimer />
          </button>
          <Link
            to={`/upcoming_&_just_released/upcoming/1`}
            onClick={handleAside}
          >
            Upcoming
          </Link>
        </li>
        <li className="aside__item">
          <button type="button" onClick={handleAside}>
            <BiStar />
          </button>
          <Link to={`/top_rated/top_rated/1`} onClick={handleAside}>
            Top Rated
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Aside;
