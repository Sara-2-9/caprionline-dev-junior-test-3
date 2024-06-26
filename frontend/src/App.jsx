import React, { useEffect, useState } from 'react';
import { Button, Rating, Spinner } from 'flowbite-react';
import { Label, Select } from "flowbite-react";

const App = props => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [showNotFoundMessage, setShowNotFoundMessage] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchMovies = () => {
    setLoading(true);

    return fetch(`http://localhost:8000/movies`)
      .then(response => response.json())
      .then(data => {
        setMovies(data);
        setLoading(false);
      });
  }

  const fetchGenres = () => {
    setLoading(true);

    return fetch(`http://localhost:8000/genres`)
      .then(response => response.json())
      .then(data => {
        setGenres(data);
        setLoading(false);
      });
  }

  const fetchMoviesGenre = (id) => {
    setLoading(true);

    return fetch(`http://localhost:8000/testFindOneBySomeField/${id}`)
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        setMovies(data);
        setShowNotFoundMessage(false);
      } else {
        setMovies();
        setShowNotFoundMessage(true); // Mostra il messaggio "Not found"
      }
      setLoading(false);
    })
  }
  
  useEffect(() => {
    fetchMovies();
    fetchGenres();
  }, []);     

  const handleLatestClick = () => setMovies(prev => [...prev]?.sort((a, b) => b.year - a.year));

  const handleLatestClickRating = () => setMovies(prev => [...prev]?.sort((a, b) => b.rating - a.rating));

  const handleGenreChange = selectedGenreId => selectedGenreId ? fetchMoviesGenre(selectedGenreId) : fetchMovies();

  return (
    <Layout>
      <Heading />
      <Order onLatestClick ={handleLatestClick} onLatestClickRating={handleLatestClickRating} />
      <SearchByGenre genres={genres} onGenreChange={handleGenreChange}/>

      {showNotFoundMessage ? (
      <div className="text-center">No movies found. Select another genre.</div>
      ) : (
        <MovieList loading={loading}>
          {movies.map((item, key) => (
            <MovieItem key={key} {...item} />
          ))}
        </MovieList>
      )}
    </Layout>
  );
};

const Layout = props => {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        {props.children}
      </div>
    </section>
  );
};

const Heading = props => {
  return (
    <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
      <h1 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
        Movie Collection
      </h1>

      <p className="font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
        Explore the whole collection of movies
      </p>
    </div>
  );
};


const Order = props => {
  return (
    <div className='mb-10'>
      <p className='font-light text-gray-500 mb-3 sm:text-xl dark:text-gray-400'>
        Displays movies based on the following sorting criteria:
      </p>
      <div className='flex flex-row gap-3'>
        <Button
          gradientMonochrome="info" 
          size="md"
          className='shadow-md'
          onClick={props.onLatestClick}
        >
          Latest
        </Button>
        <Button 
          gradientMonochrome="info" 
          size="md" 
          className='shadow-md'
          onClick={props.onLatestClickRating}
        >
          Rating
        </Button>
      </div>
    </div>
  )
}

const SearchByGenre = ({ genres, onGenreChange }) => {
  const handleGenreChange = (event) => {
    const selectedGenreId = event.target.value;
    onGenreChange(selectedGenreId);
  };

  return (
    <div className="max-w-md">
    <div className="mb-2 block">
      <Label htmlFor="genres" value="Filter movies by genre" className="font-light text-gray-500 mb-3 sm:text-xl dark:text-gray-400"/>
    </div>
    <Select id="genres" required className='mb-10' onChange={handleGenreChange}>
      <option value="">Select a genre</option>
      {genres.map((genre, key) => (
          <option key={key} value={genre.id}>{genre.name}</option>
        ))}
    </Select>
  </div>
  )
}

const MovieList = props => {
  if (props.loading) {
    return (
      <div className="text-center">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:gap-y-8 xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3">
      {props.children}
    </div>
  );
};

const MovieItem = props => {
  return (
    <div className="flex flex-col w-full h-full rounded-lg shadow-md lg:max-w-sm">
      <div className="grow">
        <img
          className="object-cover w-full h-60 md:h-80"
          src={props.imageUrl}
          alt={props.title}
          loading="lazy"
        />
      </div>

      <div className="grow flex flex-col h-full p-3">
        <div className="grow mb-3 last:mb-0">
          {props.year || props.rating
            ? <div className="flex justify-between align-middle text-gray-900 text-xs font-medium mb-2">
                <span>{props.year}</span>

                {props.rating
                  ? <Rating>
                      <Rating.Star />

                      <span className="ml-0.5">
                        {props.rating}
                      </span>
                    </Rating>
                  : null
                }
              </div>
            : null
          }

          <h3 className="text-gray-900 text-lg leading-tight font-semibold mb-1">
            {props.title}
          </h3>

          <p className="text-gray-600 text-sm leading-normal mb-4 last:mb-0">
            {props.plot.substr(0, 80)}...
          </p>
        </div>

        {props.wikipediaUrl
          ? <Button
              color="light"
              size="xs"
              className="w-full"
              onClick={() => window.open(props.wikipediaUrl, '_blank')}
            >
              More
            </Button>
          : null
        }
      </div>
    </div>
  );
};

export default App;
