import { Link } from 'react-router-dom';

interface GenresProps {
  id: number;
  genre: string;
}

const Genres = (props: GenresProps) => {
  return (
    <li className="main__item">
      <Link to={`/genres/${props.id}/${props.genre}`}>{props.genre}</Link>
    </li>
  );
};

export default Genres;
