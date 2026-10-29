import { tmdbImageUrl } from '../../api/tmdb/client';
import { Link } from 'react-router-dom';

interface BannerImgProps {
  movieId: number;
  url: string | null;
  title: string;
}

const BannerImg = (props: BannerImgProps) => {
  const src = tmdbImageUrl(props.url);
  if (!src) return null;
  return (
    <Link to={`/movie-details/${props.movieId}`}>
      <img src={src} alt={props.title} className="w-full h-full object-cover" />
    </Link>
  );
};

export default BannerImg;
