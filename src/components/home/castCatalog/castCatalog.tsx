import type { PersonPage } from '../../../types/tmdb';
// Legacy JSON is trusted only at these explicit boundaries; schema validation is Phase 3.
import Header from '../../common/header/header';
import Aside from '../../common/aside/aside';
import AsideMobile from '../../common/asideMobile/asideMobile';
import Cast from '../../movie-details/cast/cast';
import { Fragment, useEffect, useRef, useState } from 'react';
import { BiSearchAlt2 } from 'react-icons/bi';

const CastCatalog = () => {
  const [people, setPeople] = useState<PersonPage[]>([]);
  const [people2, setPeople2] = useState<PersonPage[]>([]);
  const [people3, setPeople3] = useState<PersonPage[]>([]);
  const [people4, setPeople4] = useState<PersonPage[]>([]);
  const [people5, setPeople5] = useState<PersonPage[]>([]);
  const [people6, setPeople6] = useState<PersonPage[]>([]);
  const [person, setPerson] = useState<PersonPage | null>(null);
  const [person2, setPerson2] = useState<PersonPage | null>(null);
  const [person3, setPerson3] = useState<PersonPage | null>(null);
  const [person4, setPerson4] = useState<PersonPage | null>(null);
  const [person5, setPerson5] = useState<PersonPage | null>(null);
  const [person6, setPerson6] = useState<PersonPage | null>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function getPeople(): Promise<PersonPage> {
      const response = await fetch(`/api/tmdb/person/popular?page=1`, {
        method: 'GET',
      });
      const result: unknown = await response.json();
      return result as PersonPage;
    }
    async function getPeople2(): Promise<PersonPage> {
      const response = await fetch(`/api/tmdb/person/popular?page=2`, {
        method: 'GET',
      });
      const result: unknown = await response.json();
      return result as PersonPage;
    }
    async function getPeople3(): Promise<PersonPage> {
      const response = await fetch(`/api/tmdb/person/popular?page=3`, {
        method: 'GET',
      });
      const result: unknown = await response.json();
      return result as PersonPage;
    }
    async function getPeople4(): Promise<PersonPage> {
      const response = await fetch(`/api/tmdb/person/popular?page=4`, {
        method: 'GET',
      });
      const result: unknown = await response.json();
      return result as PersonPage;
    }
    async function getPeople5(): Promise<PersonPage> {
      const response = await fetch(`/api/tmdb/person/popular?page=5`, {
        method: 'GET',
      });
      const result: unknown = await response.json();
      return result as PersonPage;
    }
    async function getPeople6(): Promise<PersonPage> {
      const response = await fetch(`/api/tmdb/person/popular?page=6`, {
        method: 'GET',
      });
      const result: unknown = await response.json();
      return result as PersonPage;
    }
    getPeople()
      .then((data) => setPeople([data]))
      .catch((error: unknown) => console.log(error));
    getPeople2()
      .then((data) => setPeople2([data]))
      .catch((error: unknown) => console.log(error));
    getPeople3()
      .then((data) => setPeople3([data]))
      .catch((error: unknown) => console.log(error));
    getPeople4()
      .then((data) => setPeople4([data]))
      .catch((error: unknown) => console.log(error));
    getPeople5()
      .then((data) => setPeople5([data]))
      .catch((error: unknown) => console.log(error));
    getPeople6()
      .then((data) => setPeople6([data]))
      .catch((error: unknown) => console.log(error));
  }, []);

  const handleSearch = () => {
    if (!input.current) return;
    let person = input.current.value;
    if (person === '') {
      setPerson(null);
    } else {
      person = person.replace(/\s/g, '+');
      async function searchPerson(): Promise<PersonPage> {
        const response = await fetch(
          `/api/tmdb/search/person?query=${person}`,
          {
            method: 'GET',
          },
        );
        const result: unknown = await response.json();
        return result as PersonPage;
      }
      async function searchPerson2(): Promise<PersonPage> {
        const response = await fetch(
          `/api/tmdb/search/person?query=${person}&page=2`,
          {
            method: 'GET',
          },
        );
        const result: unknown = await response.json();
        return result as PersonPage;
      }
      async function searchPerson3(): Promise<PersonPage> {
        const response = await fetch(
          `/api/tmdb/search/person?query=${person}&page=3`,
          {
            method: 'GET',
          },
        );
        const result: unknown = await response.json();
        return result as PersonPage;
      }
      async function searchPerson4(): Promise<PersonPage> {
        const response = await fetch(
          `/api/tmdb/search/person?query=${person}&page=4`,
          {
            method: 'GET',
          },
        );
        const result: unknown = await response.json();
        return result as PersonPage;
      }
      async function searchPerson5(): Promise<PersonPage> {
        const response = await fetch(
          `/api/tmdb/search/person?query=${person}&page=5`,
          {
            method: 'GET',
          },
        );
        const result: unknown = await response.json();
        return result as PersonPage;
      }
      async function searchPerson6(): Promise<PersonPage> {
        const response = await fetch(
          `/api/tmdb/search/person?query=${person}&page=6`,
          {
            method: 'GET',
          },
        );
        const result: unknown = await response.json();
        return result as PersonPage;
      }
      searchPerson()
        .then((data) => setPerson(data))
        .catch((error: unknown) => console.log(error));
      searchPerson2()
        .then((data) => setPerson2(data))
        .catch((error: unknown) => console.log(error));
      searchPerson3()
        .then((data) => setPerson3(data))
        .catch((error: unknown) => console.log(error));
      searchPerson4()
        .then((data) => setPerson4(data))
        .catch((error: unknown) => console.log(error));
      searchPerson5()
        .then((data) => setPerson5(data))
        .catch((error: unknown) => console.log(error));
      searchPerson6()
        .then((data) => setPerson6(data))
        .catch((error: unknown) => console.log(error));
    }
  };

  if (person === null) {
    return (
      <Fragment>
        <Header search={true} />
        <Aside />
        <AsideMobile />
        <main className="main main-casts">
          <nav className="main__navbar">
            <input type="text" placeholder="Search for a person" ref={input} />
            <button type="button" onClick={handleSearch}>
              <BiSearchAlt2 />
            </button>
          </nav>
          <div className="casts">
            {people[0]?.results?.map((cast, index) => (
              <Cast
                key={index}
                id={cast.id}
                photo={'https://image.tmdb.org/t/p/w500' + cast.profile_path}
                name={cast.name}
              />
            ))}
            {people2[0]?.results?.map((cast, index) => (
              <Cast
                key={index}
                id={cast.id}
                photo={'https://image.tmdb.org/t/p/w500' + cast.profile_path}
                name={cast.name}
              />
            ))}
            {people3[0]?.results?.map((cast, index) => (
              <Cast
                key={index}
                id={cast.id}
                photo={'https://image.tmdb.org/t/p/w500' + cast.profile_path}
                name={cast.name}
              />
            ))}
            {people4[0]?.results?.map((cast, index) => (
              <Cast
                key={index}
                id={cast.id}
                photo={'https://image.tmdb.org/t/p/w500' + cast.profile_path}
                name={cast.name}
              />
            ))}
            {people5[0]?.results?.map((cast, index) => (
              <Cast
                key={index}
                id={cast.id}
                photo={'https://image.tmdb.org/t/p/w500' + cast.profile_path}
                name={cast.name}
              />
            ))}
            {people6[0]?.results?.map((cast, index) => (
              <Cast
                key={index}
                id={cast.id}
                photo={'https://image.tmdb.org/t/p/w500' + cast.profile_path}
                name={cast.name}
              />
            ))}
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
            <button type="button" onClick={handleSearch}>
              <BiSearchAlt2 />
            </button>
          </nav>
          <div className="casts">
            {person?.results?.map((cast, index) => (
              <Cast
                key={index}
                id={cast.id}
                photo={'https://image.tmdb.org/t/p/w500' + cast.profile_path}
                name={cast.name}
              />
            ))}
            {person2?.results?.map((cast, index) => (
              <Cast
                key={index}
                id={cast.id}
                photo={'https://image.tmdb.org/t/p/w500' + cast.profile_path}
                name={cast.name}
              />
            ))}
            {person3?.results?.map((cast, index) => (
              <Cast
                key={index}
                id={cast.id}
                photo={'https://image.tmdb.org/t/p/w500' + cast.profile_path}
                name={cast.name}
              />
            ))}
            {person4?.results?.map((cast, index) => (
              <Cast
                key={index}
                id={cast.id}
                photo={'https://image.tmdb.org/t/p/w500' + cast.profile_path}
                name={cast.name}
              />
            ))}
            {person5?.results?.map((cast, index) => (
              <Cast
                key={index}
                id={cast.id}
                photo={'https://image.tmdb.org/t/p/w500' + cast.profile_path}
                name={cast.name}
              />
            ))}
            {person6?.results?.map((cast, index) => (
              <Cast
                key={index}
                id={cast.id}
                photo={'https://image.tmdb.org/t/p/w500' + cast.profile_path}
                name={cast.name}
              />
            ))}
          </div>
        </main>
      </Fragment>
    );
  }
};

export default CastCatalog;
