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
      <header className="header">
        <nav className="header__navbar">
          <ul className="header__list">
            <li className="header__item">
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
      <header className="header">
        <nav className="header__navbar">
          <ul className="header__list">
            <li className="header__item">
              <Link to={'/'}>
                <BiCameraMovie /> MoviesLib
              </Link>
            </li>
            <li className="header__item">
              <button type="button" onClick={handleOpenedInput} ref={btClose}>
                <IoClose />
              </button>
              <input type="text" placeholder="Search for a movie" ref={input} />
              <button type="button" name="search" onClick={handleClosedInput}>
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
