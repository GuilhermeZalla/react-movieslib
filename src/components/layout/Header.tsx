import { useRef } from 'react';
import { BiCameraMovie, BiSearchAlt2 } from 'react-icons/bi';
import { IoClose } from 'react-icons/io5';
import { Link } from 'react-router-dom';

type HeaderProps =
  | { search: true; handleSearchMovies?: never }
  | { search?: false; handleSearchMovies: (query: string) => void };

const Header = (props: HeaderProps) => {
  const input = useRef<HTMLInputElement>(null);
  const btClose = useRef<HTMLButtonElement>(null);

  const handleClosedInput = () => {
    if (props.search || !input.current || !btClose.current) return;
    input.current.style.width = '170px';
    input.current.style.opacity = '1';
    btClose.current.style.opacity = '1';
    props.handleSearchMovies(input.current.value);
  };

  const handleOpenedInput = () => {
    if (props.search || !input.current || !btClose.current) return;
    input.current.style.width = '0';
    input.current.style.opacity = '0';
    btClose.current.style.opacity = '0';
    props.handleSearchMovies('');
  };

  if (props.search) {
    return (
      <header className="header bg-canvas text-ink fixed top-0 left-0 right-0 z-11">
        <nav className="header__navbar px-3 py-0">
          <ul className="header__list flex justify-between items-center">
            <li className="header__item flex items-center gap-[7px]">
              <Link to={'/'}>
                <BiCameraMovie /> MoviesLib
              </Link>
            </li>
          </ul>
        </nav>
      </header>
    );
  } else {
    return (
      <header className="header bg-canvas text-ink fixed top-0 left-0 right-0 z-11">
        <nav className="header__navbar px-3 py-0">
          <ul className="header__list flex justify-between items-center">
            <li className="header__item flex items-center gap-[7px]">
              <Link to={'/'}>
                <BiCameraMovie /> MoviesLib
              </Link>
            </li>
            <li className="header__item flex items-center gap-[7px]">
              <button
                type="button"
                onClick={handleOpenedInput}
                ref={btClose}
                aria-label="Fechar busca"
              >
                <IoClose />
              </button>
              <input
                type="text"
                placeholder="Search for a movie"
                ref={input}
                className="w-0 opacity-0 transition-all duration-300"
                aria-label="Buscar filme"
              />
              <button
                type="button"
                name="search"
                onClick={handleClosedInput}
                aria-label="Buscar"
              >
                <BiSearchAlt2 />
              </button>
            </li>
          </ul>
        </nav>
      </header>
    );
  }
};

export default Header;
