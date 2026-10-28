import { Link } from 'react-router-dom';

interface FooterProps {
  category: string;
}

const Footer = (props: FooterProps) => {
  const goToTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  return (
    <footer className="home__footer flex justify-center items-center mb-12">
      <ul className="home__list flex">
        <li className="home__item">
          <Link
            to={`/catalog/${props.category}/1`}
            onClick={goToTop}
            aria-label="Página 1"
          >
            1
          </Link>
        </li>
        <li className="home__item">
          <Link
            to={`/catalog/${props.category}/2`}
            onClick={goToTop}
            aria-label="Página 2"
          >
            2
          </Link>
        </li>
        <li className="home__item">
          <Link
            to={`/catalog/${props.category}/3`}
            onClick={goToTop}
            aria-label="Página 3"
          >
            3
          </Link>
        </li>
        <li className="home__item">
          <Link
            to={`/catalog/${props.category}/4`}
            onClick={goToTop}
            aria-label="Página 4"
          >
            4
          </Link>
        </li>
        <li className="home__item">
          <Link
            to={`/catalog/${props.category}/5`}
            onClick={goToTop}
            aria-label="Página 5"
          >
            5
          </Link>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
