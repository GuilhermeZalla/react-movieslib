import Header from "../common/header/header";
import { useParams } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { BsWallet2 } from 'react-icons/bs';
import { BiTimer } from 'react-icons/bi';
import { FaChartLine } from 'react-icons/fa';
import Genres from "./genres/genres";
import Cast from "./cast/cast";
import Aside from "../common/aside/aside";
import AsideMobile from "../common/asideMobile/asideMobile";

const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZTVhYmNiMDQ5YzY0YzY2MTQyYThjOTlhMDRkN2U2YyIsInN1YiI6IjYyYzUwNTcwMjIzYThiMDBiODIxYmU5MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wKjRI_GKf8zJjtqWyRrgavhGIpA7VlOr3zom2OrupPk';

let dollarUSLocale = Intl.NumberFormat('en-US');

const MovieDetails = (props) => {
    const [details, setDetails] = useState([]);
    let { id } = useParams();

    useEffect(() => {
        async function getDetails() {
            let response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=fe5abcb049c64c66142a8c99a04d7e6c&append_to_response=credits`, {
                method: 'GET',
                headers: {
                    "Authorization": 'Bearer ' + accessToken
                }
            });
            let result = response.json();
            return result;
        }
        getDetails().then(details => setDetails(details)).catch((err) => console.log(err));
    }, []);

    return (
        <Fragment>
            <Header search={true} />
            <Aside />
            <AsideMobile />
            <main className="main">
                <div className="container">
                    <div className="main__img"><img src={'https://image.tmdb.org/t/p/w500/' + details.poster_path} alt={details.title} /></div>
                    <article className="main__article">
                        <h1 className="main__title">{details.title}</h1>
                        <p className="movie-year">{details.release_date?.split('-')[0]}  <span>Status:</span> <span>{details.status}</span></p>
                        <h2 className="main__subtitle">{details.tagline}</h2>
                        <p className="main__paragraph">{details.overview}</p>
                        <ul className="main__list">
                            <li className="main__item"><BsWallet2 /> Budget: <span>${dollarUSLocale.format(details.budget)}</span></li>
                            <li className="main__item"><FaChartLine /> Revenue: <span>${dollarUSLocale.format(details.revenue)}</span></li>
                            <li className="main__item"><BiTimer /> Runtime:  <span>{details.runtime} minutes</span></li>
                        </ul>
                        <ul className="main__list">
                            {
                                details.genres?.map((genre, index) => <Genres key={index} id={genre.id} genre={genre.name} />)
                            }
                        </ul>
                    </article>
                </div>
                <div className="container-cast">
                    {
                        details.credits?.cast?.map((cast, index) => index < 20 ? <Cast key={index} id={cast.id} photo={'https://image.tmdb.org/t/p/w500' + cast.profile_path} name={cast.name} character={cast.character} /> : null)
                    }
                </div>
            </main>
        </Fragment>
    );
};

export default MovieDetails;