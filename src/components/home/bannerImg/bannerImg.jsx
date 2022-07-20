import { Link } from "react-router-dom";

const BannerImg = (props) => {
    return (
        <Link to={`/movie-details/${props.movieId}`}><img src={'https://image.tmdb.org/t/p/w500/' + props.url} alt={props.title} /></Link>
    );
};

export default BannerImg;