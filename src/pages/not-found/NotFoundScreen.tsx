import { Link } from 'react-router-dom';
import { usePageTitle } from '../../hooks/usePageTitle';
export default function NotFoundScreen() {
  usePageTitle('Página não encontrada');
  return (
    <section className="empty-panel py-16">
      <p className="eyebrow">Fim da bobina</p>
      <h1 className="font-display text-preview-title font-extrabold">
        404 — Página não encontrada
      </h1>
      <p>
        Esse endereço ficou fora do catálogo. A próxima sessão começa na home.
      </p>
      <Link className="button-primary" to="/">
        Voltar ao início
      </Link>
    </section>
  );
}
