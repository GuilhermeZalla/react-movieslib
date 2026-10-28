import { Link } from 'react-router-dom';
import Header from '../components/common/header/header';

const NotFoundScreen = () => (
  <>
    <Header search={true} />
    <main className="home__main">
      <h1 className="home__title">404 — Página não encontrada</h1>
      <p className="home__paragraph">
        Esse endereço não está no catálogo. <Link to="/">Voltar ao início</Link>
        .
      </p>
    </main>
  </>
);

export default NotFoundScreen;
