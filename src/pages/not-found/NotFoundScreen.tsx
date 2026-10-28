import { Link } from 'react-router-dom';
import Header from '../../components/layout/Header';

const NotFoundScreen = () => (
  <>
    <Header search={true} />
    <main className="home__main relative mb-[5%] mt-[7%] pl-[100px] pr-[30px] pt-[20px] pb-[20px] text-ink">
      <h1 className="home__title text-center text-[2.8rem] mb-[15px]">
        404 — Página não encontrada
      </h1>
      <p className="home__paragraph text-center text-[1.4rem] leading-[.7cm]">
        Esse endereço não está no catálogo. <Link to="/">Voltar ao início</Link>
        .
      </p>
    </main>
  </>
);

export default NotFoundScreen;
