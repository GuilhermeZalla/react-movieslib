import { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { genresQuery } from '../../api/tmdb/queries';
import { AiOutlineHome } from 'react-icons/ai';
import { BiCameraMovie, BiFilm, BiTimer, BiStar } from 'react-icons/bi';
import { IoPeopleOutline } from 'react-icons/io5';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { Link } from 'react-router-dom';
import Genres from './Genres';

const Aside = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdown = useRef<HTMLLIElement>(null);
  const menu = useRef<HTMLElement>(null);
  const arrow = useRef<HTMLSpanElement>(null);

  const genresQueryResult = useQuery(genresQuery());
  const genres = genresQueryResult.data ?? null;

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
    setDropdownOpen((prev) => !prev);
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
    <aside className="aside bg-surface text-ink shadow-sm" ref={menu}>
      <ul className="aside__list flex flex-col">
        <li className="aside__item flex items-center gap-[20px] py-[15px] border-b line/20 select-none font-bold">
          <Link to={'/'} onClick={handleAside}>
            <BiCameraMovie className="font-display" /> MoviesLib
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
            <BiFilm aria-label="Filmes" />
          </button>
          <button
            type="button"
            className="aside__dropdown w-full pr-[30px] cursor-pointer flex items-center gap-[7px]"
            onClick={handleDropDown}
            aria-expanded={dropdownOpen}
          >
            Genres{' '}
            <span className="arrow" ref={arrow}>
              <MdOutlineKeyboardArrowDown />
            </span>
          </button>
        </li>
        <li
          className="aside__item menu-dropdown h-0 overflow-x-hidden transition-all duration-350"
          ref={dropdown}
        >
          <ul className="aside__sub-list h-[230px] flex flex-col items-flex-start">
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
