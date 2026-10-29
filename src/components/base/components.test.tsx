import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Button from './Button';
import IconButton from './IconButton';
import PosterImage from './PosterImage';
import MovieCard from './MovieCard';
import Skeleton from './Skeleton';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
import Badge from './Badge';
import ThemeToggle from './ThemeToggle';

describe('Button', () => {
  it('renderiza variantes e foco visível', () => {
    render(<Button variant="primary">Salvar</Button>);
    const btn = screen.getByRole('button', { name: 'Salvar' });
    expect(btn.className).toContain('focus-visible:ring-2');
  });
  it('dispara onClick', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>X</Button>);
    fireEvent.click(screen.getByRole('button', { name: 'X' }));
    expect(onClick).toHaveBeenCalled();
  });
});

describe('IconButton', () => {
  it('tem rótulo acessível', () => {
    render(<IconButton label="Fechar">x</IconButton>);
    expect(screen.getByRole('button', { name: 'Fechar' })).toBeInTheDocument();
  });
});

describe('PosterImage', () => {
  it('renderiza imagem com lazy loading', () => {
    render(<PosterImage src="/p.jpg" alt="Filme" />);
    const img = screen.getByRole('img', { name: 'Filme' });
    expect(img).toHaveAttribute('loading', 'lazy');
  });
  it('fallback sem pôster', () => {
    render(<PosterImage src={null} alt="Sem pôster" />);
    expect(screen.getByText('Sem pôster')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Sem pôster' })).toBeInTheDocument();
  });
});

describe('MovieCard', () => {
  it('renderiza título e nota', () => {
    render(
      <MovieCard posterPath={null} title="Filme" vote="8.0" movieId={1} />,
    );
    expect(screen.getByText('Filme')).toBeInTheDocument();
    expect(screen.getByText('8.0')).toBeInTheDocument();
  });
  it('mostra ranking e nota com texto equivalente para leitor de tela', () => {
    render(
      <MovieCard
        title="Ingresso de ida"
        movieId={2}
        rank={1}
        vote="7.9"
        artwork={<svg aria-hidden="true" />}
      />,
    );
    const link = screen.getByRole('link', {
      name: /Posição 1.*Ingresso de ida.*Nota 7.9 de 10/,
    });
    expect(link).toHaveAttribute('href', '/movie-details/2');
    expect(link.querySelector('img')).toBeNull();
    expect(link.className).toContain('focus-visible:outline');
  });
});

describe('Skeleton', () => {
  it('respeita prefers-reduced-motion', () => {
    render(<Skeleton />);
    const el = document.querySelector('.animate-pulse');
    expect(el?.className).toContain('motion-reduce:animate-none');
  });
  it('usa a proporção do pôster e pode parar de animar', () => {
    render(<Skeleton variant="poster" />);
    const skeleton = screen.getByRole('status', { name: 'Carregando pôster' });
    expect(skeleton.className).toContain('aspect-preview-poster');
    expect(skeleton.className).toContain('motion-reduce:animate-none');
  });
});

describe('EmptyState', () => {
  it('renderiza título e ação opcional', () => {
    const onAction = vi.fn();
    render(
      <EmptyState title="Vazio" actionLabel="Tentar" onAction={onAction} />,
    );
    expect(screen.getByText('Vazio')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Tentar' }));
    expect(onAction).toHaveBeenCalled();
  });
  it('mantém ilustração decorativa e ação na versão de design', () => {
    const onAction = vi.fn();
    render(
      <EmptyState
        preview
        title="A sala está vazia"
        actionLabel="Ver populares"
        onAction={onAction}
        illustration={<svg />}
      />,
    );
    const button = screen.getByRole('button', { name: 'Ver populares' });
    expect(button.className).toContain('bg-preview-accent');
    fireEvent.click(button);
    expect(onAction).toHaveBeenCalledOnce();
    expect(
      screen.getByRole('heading', { name: 'A sala está vazia' }),
    ).toBeInTheDocument();
  });
  it('sem botão quando sem ação', () => {
    render(<EmptyState title="Vazio" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

describe('ErrorState', () => {
  it('renderiza retry opcional', () => {
    const onRetry = vi.fn();
    render(<ErrorState message="Falhou" onRetry={onRetry} />);
    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(onRetry).toHaveBeenCalled();
  });
  it('sem botão quando sem retry', () => {
    render(<ErrorState message="Falhou" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
  it('usa o tom de texto acessível e permite retry na amostra', () => {
    const onRetry = vi.fn();
    render(<ErrorState preview message="A sessão caiu" onRetry={onRetry} />);
    expect(screen.getByText('A sessão caiu').className).toContain(
      'text-preview-accent-text',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});

describe('Badge', () => {
  it('renderiza variante accent', () => {
    render(<Badge variant="accent">Novo</Badge>);
    expect(screen.getByText('Novo').className).toContain('bg-accent');
  });
});

describe('ThemeToggle', () => {
  it('alterna e tem rótulo', () => {
    const onToggle = vi.fn();
    render(<ThemeToggle theme="dark" onToggle={onToggle} />);
    const btn = screen.getByRole('button', {
      name: /Alternar para tema light/,
    });
    fireEvent.click(btn);
    expect(onToggle).toHaveBeenCalled();
  });
});
