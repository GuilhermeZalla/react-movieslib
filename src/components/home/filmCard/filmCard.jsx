import { HiStar } from 'react-icons/hi';
import { IoEyeSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';

const FilmCard = (props) => {
    const goToTop = () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
    if (props.poster === 'https://image.tmdb.org/t/p/w500/null') {
        return null;
    } else {
        return (
            <div className="home__card">
                <img src={props.poster} alt={props.title} />
                <div className="home__card-info">
                    <ul className="home__list">
                        <li className="home__item"><Link to={`/movie-details/${props.movieId}`} onClick={goToTop} className="home__link"><IoEyeSharp /> View</Link></li>
                        <li className="home__item"><HiStar /> {props.vote}</li>
                    </ul>
                </div>
            </div>
        );
    }
};

export default FilmCard;