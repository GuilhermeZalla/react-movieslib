import type { Genre } from '../api/tmdb/schemas';
import { getLocale } from './locale';
const genres: Readonly<Record<number, readonly [string, string]>> = {
  28: ['Ação', 'Action'],
  12: ['Aventura', 'Adventure'],
  16: ['Animação', 'Animation'],
  35: ['Comédia', 'Comedy'],
  80: ['Crime', 'Crime'],
  99: ['Documentário', 'Documentary'],
  18: ['Drama', 'Drama'],
  10751: ['Família', 'Family'],
  14: ['Fantasia', 'Fantasy'],
  36: ['História', 'History'],
  27: ['Terror', 'Horror'],
  10402: ['Música', 'Music'],
  9648: ['Mistério', 'Mystery'],
  10749: ['Romance', 'Romance'],
  878: ['Ficção científica', 'Science Fiction'],
  10770: ['Filme para TV', 'TV Movie'],
  53: ['Suspense', 'Thriller'],
  10752: ['Guerra', 'War'],
  37: ['Faroeste', 'Western'],
};
export function genreName(genre: Genre) {
  return genres[genre.id]?.[getLocale() === 'pt-BR' ? 0 : 1] ?? genre.name;
}
const metadata: Readonly<Record<string, string>> = {
  Released: 'Lançado',
  Planned: 'Planejado',
  Rumored: 'Rumor',
  'In Production': 'Em produção',
  'Post Production': 'Pós-produção',
  Canceled: 'Cancelado',
  Acting: 'Atuação',
  Directing: 'Direção',
  Writing: 'Roteiro',
  Production: 'Produção',
  Editing: 'Montagem',
  Sound: 'Som',
  Art: 'Arte',
  Camera: 'Câmera',
  'Costume & Make-Up': 'Figurino e maquiagem',
  'Visual Effects': 'Efeitos visuais',
  Crew: 'Equipe',
  Lighting: 'Iluminação',
  Director: 'Diretor(a)',
  Screenplay: 'Roteiro',
  Writer: 'Roteirista',
  Producer: 'Produtor(a)',
  'Executive Producer': 'Produtor(a) executivo(a)',
  'Original Music Composer': 'Compositor(a)',
  'Director of Photography': 'Diretor(a) de fotografia',
  Editor: 'Montador(a)',
  Story: 'História',
  Characters: 'Personagens',
  Casting: 'Seleção de elenco',
  'Production Design': 'Direção de arte',
  'Costume Design': 'Figurino',
};
export function metadataLabel(value: string) {
  return getLocale() === 'pt-BR' ? (metadata[value] ?? value) : value;
}
