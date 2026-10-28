import { Link } from 'react-router-dom';

interface CastProps {
  id: number;
  photo: string | null;
  name: string;
  character?: string | null;
}

const Cast = ({ character = null, ...props }: CastProps) => {
  const goToTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };
  if (!props.photo || props.photo === 'https://image.tmdb.org/t/p/w500null') {
    return null;
  } else {
    return (
      <Link to={`/cast/${props.id}`} onClick={goToTop}>
        <div className="cast relative flex flex-start">
          <img
            src={props.photo}
            alt={props.name}
            className="w-[190px] brightness-70 cursor-pointer rounded-[10px]"
          />
          <h2 className="cast__title absolute bottom-[15px] left-[10px] z-10 text-white text-base font-normal">
            {props.name}
          </h2>
          <h3>{character}</h3>
        </div>
      </Link>
    );
  }
};

export default Cast;
