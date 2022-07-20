import { Link } from "react-router-dom";

const Genres = (props) => {
    return (
        <li className="main__item">
            <Link to={`/genres/${props.id}/${props.genre}`}>{props.genre}</Link>
        </li>
    );
};

export default Genres;