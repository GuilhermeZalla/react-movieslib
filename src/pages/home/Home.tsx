import { useQuery } from '@tanstack/react-query';
import { trendingQuery } from '../../api/tmdb/queries';

const Home = () => {
  const trending = useQuery(trendingQuery(1));

  return (
    <div className="py-8">
      <h1 className="font-preview-bricolage text-preview-display font-extrabold text-preview-ink">
        A tela acende.
        <br />O mundo espera.
      </h1>
      <p className="mt-4 max-w-prose text-preview-body text-preview-muted">
        Histórias para dar play sem pensar duas vezes.
      </p>
      {trending.isLoading && (
        <p className="mt-8 text-preview-muted">Carregando...</p>
      )}
      {trending.isError && (
        <p className="mt-8 text-preview-accent-text">Erro ao carregar.</p>
      )}
    </div>
  );
};

export default Home;
