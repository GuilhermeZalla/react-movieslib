import { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { genresQuery } from '../../api/tmdb/queries';
import { AiOutlineHome } from 'react-icons/ai';
import { BiFilm, BiTimer, BiStar } from 'react-icons/bi';
import { BsArrowUpSquare } from 'react-icons/bs';
import { IoPeopleOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import Genres from './Genres';

const AsideMobile = () => {
  const [dropupOpen, setDropupOpen] = useState(false);
  const scrollTop = useRef<HTMLButtonElement>(null);
  const dropup = useRef<HTMLDivElement>(null);

  const goToTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  const genresQueryResult = useQuery(genresQuery());
  const genres = genresQueryResult.data ?? null;

  const handleDropUpMenu = () => {
    if (!dropup.current) return;
    setDropupOpen((prev) => !prev);
    if (
      dropup.current.style.visibility === 'hidden' ||
      dropup.current.style.visibility === ''
    ) {
      dropup.current.style.visibility = 'visible';
      dropup.current.style.opacity = '1';
    } else {
      dropup.current.style.visibility = 'hidden';
      dropup.current.style.opacity = '0';
    }
  };

  return (
    <aside
      className="aside-mobile bg-surface text-ink shadow-sm rounded-t-[20px] fixed bottom-0 left-[20%] right-[20%] z-12 flex justify-center items-center"
      ref={scrollTop}
    >
      <ul className="aside__list flex flex-row gap-[35px]">
        <li className="aside__item flex items-center py-[10px] select-none relative">
          <Link to={'/'} aria-label="Início">
            <AiOutlineHome />
          </Link>
        </li>
        <li className="aside__item">
          <button
            type="button"
            onClick={handleDropUpMenu}
            aria-expanded={dropupOpen}
          >
            <BiFilm aria-label="Gêneros" />
          </button>
          <div className="menu-dropup" ref={dropup}>
            <ul className="aside__sub-list h-[210px] flex flex-col items-flex-start p-0">
              {genres?.genres?.map((genre, index) =>
                genre.name === 'TV Movie' ||
                genre.name === 'Documentary' ? null : (
                  <Genres key={index} id={genre.id} name={genre.name} />
                ),
              )}
            </ul>
          </div>
        </li>
        <li className="aside__item">
          <Link to={'/cast'} aria-label="Elenco">
            <IoPeopleOutline />
          </Link>
        </li>
        <li className="aside__item">
          <Link
            to={`/upcoming_&_just_released/upcoming/1`}
            aria-label="Em breve"
          >
            <BiTimer />
          </Link>
        </li>
        <li className="aside__item">
          <Link to={`/top_rated/top_rated/1`} aria-label="Mais bem avaliados">
            <BiStar />
          </Link>
        </li>
        <li className="aside__item">
          <button
            type="button"
            ref={scrollTop}
            onClick={goToTop}
            aria-label="Voltar ao topo"
          >
            <BsArrowUpSquare />
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default AsideMobile;
