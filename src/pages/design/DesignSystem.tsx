import { useState } from 'react';
import Button from '../../components/base/Button';
import IconButton from '../../components/base/IconButton';
import PosterImage from '../../components/base/PosterImage';
import MovieCard from '../../components/base/MovieCard';
import Skeleton from '../../components/base/Skeleton';
import EmptyState from '../../components/base/EmptyState';
import ErrorState from '../../components/base/ErrorState';
import Badge from '../../components/base/Badge';
import ThemeToggle from '../../components/base/ThemeToggle';
import Card from '../../components/base/Card';

const DesignSystem = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <div
      data-theme={theme}
      className="min-h-screen bg-canvas text-ink p-8 font-body"
    >
      <h1 className="font-display text-title text-ink mb-6">
        Design system (dev only)
      </h1>
      <section className="mb-8">
        <h2 className="font-display text-section text-ink mb-2">Tema</h2>
        <ThemeToggle theme={theme} onToggle={toggle} />
        <p className="font-body text-body text-muted mt-2">
          Tema atual: {theme}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-display text-section text-ink mb-2">
          Vermelho de destaque
        </h2>
        <div className="flex gap-4">
          <div
            className="p-4 rounded-control"
            style={{ background: '#ff9b85', color: '#191715' }}
          >
            Opção A — coral #ff9b85 (atual)
          </div>
          <div
            className="p-4 rounded-control"
            style={{ background: '#e85a4f', color: '#191715' }}
          >
            Opção B — vermelho saturado #e85a4f (alt.)
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="font-display text-section text-ink mb-2">Botões</h2>
        <div className="flex gap-2">
          <Button variant="primary">Primário</Button>
          <Button variant="secondary">Secundário</Button>
          <IconButton label="Fechar">✕</IconButton>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="font-display text-section text-ink mb-2">Badge</h2>
        <div className="flex gap-2">
          <Badge>Neutro</Badge>
          <Badge variant="accent">Destaque</Badge>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="font-display text-section text-ink mb-2">PosterImage</h2>
        <div className="flex gap-4">
          <PosterImage src={null} alt="Sem pôster" />
          <PosterImage src="/poster.jpg" alt="Com pôster" />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="font-display text-section text-ink mb-2">MovieCard</h2>
        <MovieCard
          posterPath={null}
          title="Filme exemplo"
          vote="8.0"
          movieId={1}
        />
      </section>

      <section className="mb-8">
        <h2 className="font-display text-section text-ink mb-2">Skeleton</h2>
        <Skeleton height={40} width={200} />
      </section>

      <section className="mb-8">
        <h2 className="font-display text-section text-ink mb-2">Card</h2>
        <Card>
          <p className="font-body text-body text-ink">Conteúdo do card</p>
        </Card>
      </section>

      <section className="mb-8">
        <h2 className="font-display text-section text-ink mb-2">EmptyState</h2>
        <EmptyState title="Nenhum resultado" message="Tente outro termo." />
      </section>

      <section className="mb-8">
        <h2 className="font-display text-section text-ink mb-2">ErrorState</h2>
        <ErrorState message="Falhou." onRetry={() => {}} />
      </section>
    </div>
  );
};

export default DesignSystem;
