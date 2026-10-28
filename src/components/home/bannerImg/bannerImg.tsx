import { Link } from 'react-router-dom';

interface BannerImgProps {
  movieId: number;
  url: string | null;
  title: string;
}

const BannerImg = (props: BannerImgProps) => {
  if (!props.url) return null;
  return (
    <Link to={`/movie-details/${props.movieId}`}>
      <img
        src={'https://image.tmdb.org/t/p/w500/' + props.url}
        alt={props.title}
      />
    </Link>
  );
};

export default BannerImg;
