import { useRef } from "react";
import { BiCameraMovie, BiSearchAlt2 } from 'react-icons/bi';
import { IoClose } from 'react-icons/io5';
import { Link } from 'react-router-dom';

const Header = (props, { handleSearchMovies }) => {
    let input = useRef(null);
    let btClose = useRef(null);

    const handleClosedInput = () => {
        input.current.style.width = '170px';
        input.current.style.opacity = '1';
        btClose.current.style.opacity = '1';
        props.handleSearchMovies(input.current.value);
    }

    const handleOpenedInput = () => {
        input.current.style.width = '0';
        input.current.style.opacity = '0';
        btClose.current.style.opacity = '0';
        props.handleSearchMovies('');
    }

    if (props.search) {
        return (
            <header className="header">
                <nav className="header__navbar">
                    <ul className="header__list">
                        <li className="header__item"><Link to={'/'}><BiCameraMovie /> MoviesLib</Link></li>
                    </ul>
                </nav>
            </header>
        );
    } else {
        return (
            <header className="header">
                <nav className="header__navbar">
                    <ul className="header__list">
                        <li className="header__item"><Link to={'/'}><BiCameraMovie /> MoviesLib</Link></li>
                        <li className="header__item">
                            <button type="click" onClick={handleOpenedInput} ref={btClose}><IoClose /></button>
                            <input type="text" placeholder='Search for a movie' ref={input} />
                            <button type="click" name="search" onClick={handleClosedInput}><BiSearchAlt2 /></button>
                        </li>
                    </ul>
                </nav>
            </header>
        );
    }
};

export default Header;