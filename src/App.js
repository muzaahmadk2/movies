import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
import AddMovie from "./components/AddMovie";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setErro] = useState(null);

  const movieHandler = useCallback(async () => {
    setIsLoading(true);
    setErro(null);

    try {
      const response = await fetch(
        "https://reacr-http-82765-default-rtdb.firebaseio.com/Movies.json "
      );
      if (!response.ok) {
        throw new Error("Something went wrong .....");
      }
      const data = await response.json();
      const transformedMovies = [];
      for (const key in data) {
        transformedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }

      setMovies(transformedMovies);
    } catch (error) {
      setErro(error.message);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    movieHandler();
  }, [movieHandler]);

  async function addMovieHandler(movie) {
    const response = await fetch(
      "https://reacr-http-82765-default-rtdb.firebaseio.com/Movies.json ",
      {
        method: "POST",
        body: JSON.stringify(movie),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log(data);
  }

  let content = <p>FOund no Movies</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies}/>;
  }
  if (error) {
    content = <p>{error}</p>;
  }
  if (isLoading) {
    content = <p>Loading.....</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={movieHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
