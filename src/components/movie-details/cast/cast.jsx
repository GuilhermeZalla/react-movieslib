import { Link } from "react-router-dom";

const Cast = (props) => {
    const goToTop = () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
    if (props.photo === 'https://image.tmdb.org/t/p/w500null') {
        return null;
    } else {
        return (
            <Link to={`/cast/${props.id}`} onClick={goToTop}>
                <div className="cast">
                    <img src={props.photo} alt={props.name} />
                    <h2 className="cast__title">{props.name}</h2>
                    <h3>{props.character}</h3>
                </div>
            </Link>
        );
    };
};

export default Cast;

