import { Link } from "react-router-dom";

const Footer = (props) => {
    const goToTop = () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }

    return(
        <footer className="home__footer">
                <ul className="home__list">
                    <li className="home__item"><Link to={`/catalog/${props.category}/${1}`} onClick={goToTop}>1</Link></li>
                    <li className="home__item"><Link to={`/catalog/${props.category}/${2}`} onClick={goToTop}>2</Link></li>
                    <li className="home__item"><Link to={`/catalog/${props.category}/${3}`} onClick={goToTop}>3</Link></li>
                    <li className="home__item"><Link to={`/catalog/${props.category}/${4}`} onClick={goToTop}>4</Link></li>
                    <li className="home__item"><Link to={`/catalog/${props.category}/${5}`} onClick={goToTop}>5</Link></li>
                </ul>
        </footer>
    );
};

export default Footer;