import { Link } from 'react-router-dom';

interface GenresProps {
  id: number;
  name: string;
  handleAside?: () => void;
}

const Genres = (props: GenresProps) => {
  return (
    <li className="aside__sub-item">
      <Link
        to={`/genres/${props.id}/${props.name}`}
        onClick={() => props.handleAside?.()}
      >
        {props.name}
      </Link>
    </li>
  );
};

export default Genres;
