import { HiStar } from 'react-icons/hi';
import { IoEyeSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';

interface FilmCardProps {
  poster: string | null;
  title: string;
  vote: string;
  movieId: number;
}

const FilmCard = (props: FilmCardProps) => {
  const goToTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };
  if (
    !props.poster ||
    props.poster === 'https://image.tmdb.org/t/p/w500/null'
  ) {
    return null;
  } else {
    return (
      <div className="home__card relative rounded-[7px] cursor-pointer transition-all duration-250 group">
        <img
          src={props.poster}
          alt={props.title}
          className="rounded-[7px] w-full h-full object-cover"
        />
        <div className="home__card-info absolute inset-[10%] left-[10%] right-[10%] flex justify-center items-center transition-all duration-300 scale-0 group-hover:scale-100">
          <ul className="home__list flex flex-col justify-center items-center gap-10">
            <li className="home__item flex items-center gap-5 text-body">
              <Link
                to={`/movie-details/${props.movieId}`}
                onClick={goToTop}
                className="home__link flex items-center gap-5"
              >
                <IoEyeSharp className="text-accent" /> View
              </Link>
            </li>
            <li className="home__item flex items-center gap-5 text-body">
              <HiStar className="text-accent" /> {props.vote}
            </li>
          </ul>
        </div>
      </div>
    );
  }
};

export default FilmCard;
