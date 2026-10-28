import Header from "../../common/header/header";
import Aside from "../../common/aside/aside";
import AsideMobile from "../../common/asideMobile/asideMobile";
import Cast from "../../movie-details/cast/cast";
import { Fragment, useEffect, useRef, useState } from 'react';
import { BiSearchAlt2 } from 'react-icons/bi';

const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZTVhYmNiMDQ5YzY0YzY2MTQyYThjOTlhMDRkN2U2YyIsInN1YiI6IjYyYzUwNTcwMjIzYThiMDBiODIxYmU5MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wKjRI_GKf8zJjtqWyRrgavhGIpA7VlOr3zom2OrupPk';

const CastCatalog = () => {
    const [people, setPeople] = useState([]);
    const [people2, setPeople2] = useState([]);
    const [people3, setPeople3] = useState([]);
    const [people4, setPeople4] = useState([]);
    const [people5, setPeople5] = useState([]);
    const [people6, setPeople6] = useState([]);
    const [person, setPerson] = useState('');
    const [person2, setPerson2] = useState('');
    const [person3, setPerson3] = useState('');
    const [person4, setPerson4] = useState('');
    const [person5, setPerson5] = useState('');
    const [person6, setPerson6] = useState('');
    let input = useRef(null);

    useEffect(() => {
        async function getPeople() {
            let response = await fetch(`https://api.themoviedb.org/3/person/popular?api_key=fe5abcb049c64c66142a8c99a04d7e6c&page=1`, {
                method: 'GET',
                headers: {
                    "Authorization": 'Bearer ' + accessToken
                }
            });
            let result = response.json();
            return result;
        }
        async function getPeople2() {
            let response = await fetch(`https://api.themoviedb.org/3/person/popular?api_key=fe5abcb049c64c66142a8c99a04d7e6c&page=2`, {
                method: 'GET',
                headers: {
                    "Authorization": 'Bearer ' + accessToken
                }
            });
            let result = response.json();
            return result;
        }
        async function getPeople3() {
            let response = await fetch(`https://api.themoviedb.org/3/person/popular?api_key=fe5abcb049c64c66142a8c99a04d7e6c&page=3`, {
                method: 'GET',
                headers: {
                    "Authorization": 'Bearer ' + accessToken
                }
            });
            let result = response.json();
            return result;
        }
        async function getPeople4() {
            let response = await fetch(`https://api.themoviedb.org/3/person/popular?api_key=fe5abcb049c64c66142a8c99a04d7e6c&page=4`, {
                method: 'GET',
                headers: {
                    "Authorization": 'Bearer ' + accessToken
                }
            });
            let result = response.json();
            return result;
        }
        async function getPeople5() {
            let response = await fetch(`https://api.themoviedb.org/3/person/popular?api_key=fe5abcb049c64c66142a8c99a04d7e6c&page=5`, {
                method: 'GET',
                headers: {
                    "Authorization": 'Bearer ' + accessToken
                }
            });
            let result = response.json();
            return result;
        }
        async function getPeople6() {
            let response = await fetch(`https://api.themoviedb.org/3/person/popular?api_key=fe5abcb049c64c66142a8c99a04d7e6c&page=6`, {
                method: 'GET',
                headers: {
                    "Authorization": 'Bearer ' + accessToken
                }
            });
            let result = response.json();
            return result;
        }
        getPeople().then(data => setPeople([data])).catch((err) => console.log(err));
        getPeople2().then(data => setPeople2([data])).catch((err) => console.log(err));
        getPeople3().then(data => setPeople3([data])).catch((err) => console.log(err));
        getPeople4().then(data => setPeople4([data])).catch((err) => console.log(err));
        getPeople5().then(data => setPeople5([data])).catch((err) => console.log(err));
        getPeople6().then(data => setPeople6([data])).catch((err) => console.log(err));
    }, []);

    const handleSearch = () => {
        let person = input.current.value;
        if (person === '') {
            setPerson('');
        } else {
            person = person.replace(/\s/g, '+');
            async function searchPerson() {
                let response = await fetch(`https://api.themoviedb.org/3/search/person?api_key=fe5abcb049c64c66142a8c99a04d7e6c&query=${person}`, {
                    method: 'GET',
                    headers: {
                        "Authorization": 'Bearer ' + accessToken
                    }
                });
                let result = response.json();
                return result;
            }
            async function searchPerson2() {
                let response = await fetch(`https://api.themoviedb.org/3/search/person?api_key=fe5abcb049c64c66142a8c99a04d7e6c&query=${person}&page=2`, {
                    method: 'GET',
                    headers: {
                        "Authorization": 'Bearer ' + accessToken
                    }
                });
                let result = response.json();
                return result;
            }
            async function searchPerson3() {
                let response = await fetch(`https://api.themoviedb.org/3/search/person?api_key=fe5abcb049c64c66142a8c99a04d7e6c&query=${person}&page=3`, {
                    method: 'GET',
                    headers: {
                        "Authorization": 'Bearer ' + accessToken
                    }
                });
                let result = response.json();
                return result;
            }
            async function searchPerson4() {
                let response = await fetch(`https://api.themoviedb.org/3/search/person?api_key=fe5abcb049c64c66142a8c99a04d7e6c&query=${person}&page=4`, {
                    method: 'GET',
                    headers: {
                        "Authorization": 'Bearer ' + accessToken
                    }
                });
                let result = response.json();
                return result;
            }
            async function searchPerson5() {
                let response = await fetch(`https://api.themoviedb.org/3/search/person?api_key=fe5abcb049c64c66142a8c99a04d7e6c&query=${person}&page=5`, {
                    method: 'GET',
                    headers: {
                        "Authorization": 'Bearer ' + accessToken
                    }
                });
                let result = response.json();
                return result;
            }
            async function searchPerson6() {
                let response = await fetch(`https://api.themoviedb.org/3/search/person?api_key=fe5abcb049c64c66142a8c99a04d7e6c&query=${person}&page=6`, {
                    method: 'GET',
                    headers: {
                        "Authorization": 'Bearer ' + accessToken
                    }
                });
                let result = response.json();
                return result;
            }
            searchPerson().then(data => setPerson(data)).catch((err) => console.log(err));
            searchPerson2().then(data => setPerson2(data)).catch((err) => console.log(err));
            searchPerson3().then(data => setPerson3(data)).catch((err) => console.log(err));
            searchPerson4().then(data => setPerson4(data)).catch((err) => console.log(err));
            searchPerson5().then(data => setPerson5(data)).catch((err) => console.log(err));
            searchPerson6().then(data => setPerson6(data)).catch((err) => console.log(err));
        }
    }

    if (person === '') {
        return (
            <Fragment>
                <Header search={true} />
                <Aside />
                <AsideMobile />
                <main className="main main-casts">
                    <nav className="main__navbar">
                        <input type="text" placeholder="Search for a person" ref={input} />
                        <button type="button" onClick={handleSearch}><BiSearchAlt2 /></button>
                    </nav>
                    <div className="casts">
                        {
                            people[0]?.results?.map((cast, index) => <Cast key={index} id={cast.id} photo={'https://image.tmdb.org/t/p/w500' + cast.profile_path} name={cast.name} />)
                        }
                        {
                            people2[0]?.results?.map((cast, index) => <Cast key={index} id={cast.id} photo={'https://image.tmdb.org/t/p/w500' + cast.profile_path} name={cast.name} />)
                        }
                        {
                            people3[0]?.results?.map((cast, index) => <Cast key={index} id={cast.id} photo={'https://image.tmdb.org/t/p/w500' + cast.profile_path} name={cast.name} />)
                        }
                        {
                            people4[0]?.results?.map((cast, index) => <Cast key={index} id={cast.id} photo={'https://image.tmdb.org/t/p/w500' + cast.profile_path} name={cast.name} />)
                        }
                        {
                            people5[0]?.results?.map((cast, index) => <Cast key={index} id={cast.id} photo={'https://image.tmdb.org/t/p/w500' + cast.profile_path} name={cast.name} />)
                        }
                        {
                            people6[0]?.results?.map((cast, index) => <Cast key={index} id={cast.id} photo={'https://image.tmdb.org/t/p/w500' + cast.profile_path} name={cast.name} />)
                        }
                    </div>
                </main>
            </Fragment>
        );
    } else {
        return (
            <Fragment>
                <Header search={true} />
                <Aside />
                <AsideMobile />
                <main className="main main-casts">
                    <nav className="main__navbar">
                        <input type="text" placeholder="Search for a person" ref={input} />
                        <button type="button" onClick={handleSearch}><BiSearchAlt2 /></button>
                    </nav>
                    <div className="casts">
                        {
                            person.results?.map((cast, index) => <Cast key={index} id={cast.id} photo={'https://image.tmdb.org/t/p/w500' + cast.profile_path} name={cast.name} />)
                        }
                        {
                            person2.results?.map((cast, index) => <Cast key={index} id={cast.id} photo={'https://image.tmdb.org/t/p/w500' + cast.profile_path} name={cast.name} />)
                        }
                        {
                            person3.results?.map((cast, index) => <Cast key={index} id={cast.id} photo={'https://image.tmdb.org/t/p/w500' + cast.profile_path} name={cast.name} />)
                        }
                        {
                            person4.results?.map((cast, index) => <Cast key={index} id={cast.id} photo={'https://image.tmdb.org/t/p/w500' + cast.profile_path} name={cast.name} />)
                        }
                        {
                            person5.results?.map((cast, index) => <Cast key={index} id={cast.id} photo={'https://image.tmdb.org/t/p/w500' + cast.profile_path} name={cast.name} />)
                        }
                        {
                            person6.results?.map((cast, index) => <Cast key={index} id={cast.id} photo={'https://image.tmdb.org/t/p/w500' + cast.profile_path} name={cast.name} />)
                        }
                    </div>
                </main>
            </Fragment>
        );
    }
};

export default CastCatalog;