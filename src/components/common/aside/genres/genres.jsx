import { Link } from "react-router-dom";

const Genres = (props, {handleAside}) => {
    return (
        <li className="aside__sub-item">
            <Link to={`/genres/${props.id}/${props.name}`} onClick={props.handleAside}>{props.name}</Link>
        </li>
    );
};

export default Genres;