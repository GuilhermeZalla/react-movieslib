import { useParams } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import Aside from "../../common/aside/aside";
import AsideMobile from "../../common/asideMobile/asideMobile";
import Header from "../../common/header/header";
import FilmCard from "../filmCard/filmCard";

const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZTVhYmNiMDQ5YzY0YzY2MTQyYThjOTlhMDRkN2U2YyIsInN1YiI6IjYyYzUwNTcwMjIzYThiMDBiODIxYmU5MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wKjRI_GKf8zJjtqWyRrgavhGIpA7VlOr3zom2OrupPk';

const CastDetails = () => {
    const [cast, setCast] = useState([]);
    const [credits, setCredits] = useState([]);
    let { id } = useParams();

    useEffect(() => {
        async function getCast() {
            let response = await fetch(`https://api.themoviedb.org/3/person/${id}?api_key=fe5abcb049c64c66142a8c99a04d7e6c`, {
                method: 'GET',
                headers: {
                    "Authorization": 'Bearer ' + accessToken
                }
            });
            let result = response.json();
            return result;
        }
        async function getCredits() {
            let response = await fetch(`https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=fe5abcb049c64c66142a8c99a04d7e6c`, {
                method: 'GET',
                headers: {
                    "Authorization": 'Bearer ' + accessToken
                }
            });
            let result = response.json();
            return result;
        }
        getCast().then(cast => setCast([cast])).catch((err) => console.log(err));
        getCredits().then(cast => setCredits([cast])).catch((err) => console.log(err));
    }, [cast, credits]);

    return (
        <Fragment>
            <Header search={true}/>
            <Aside />
            <AsideMobile />
            <main className="main cast-detail">
                <div className="container">
                    <img src={'https://image.tmdb.org/t/p/w500' + cast[0]?.profile_path} alt={cast[0]?.name} className="main__img" />
                    <article className="article">
                        <h1 className="article__title">{cast[0]?.name}</h1>
                        <span>Biography</span>
                        <p className="article__paragraph">{cast[0]?.biography}</p>
                        <ul className="article__list">
                            <li className="article__item"><span>Birthday: </span>{cast[0]?.birthday}</li>
                            {
                                cast[0]?.deathday === null ? null : <li className="article__item"><span>Deathday: </span>{cast[0]?.deathday}</li>
                            }
                            <li className="article__item"><span>Known for: </span>{cast[0]?.known_for_department}</li>
                            <li className="article__item"><span>Gender: </span>{cast[0]?.gender === 2 ? "Masculine" : "Feminine"}</li>
                            <li className="article__item"><span>Place of birth: </span>{cast[0]?.place_of_birth}</li>
                            <li className="article__item"><span>IMDB ID: </span>{cast[0]?.imdb_id}</li>
                        </ul>
                    </article>
                </div>
                <div className="container-credits">
                    {
                        credits[0]?.cast.map((movie, index) => <FilmCard key={index} poster={'https://image.tmdb.org/t/p/w500/' + movie.poster_path} title={movie.title} vote={movie.vote_average.toFixed(1)} movieId={movie.id} />)
                    }
                </div>
            </main>
        </Fragment>
    );
};

export default CastDetails;