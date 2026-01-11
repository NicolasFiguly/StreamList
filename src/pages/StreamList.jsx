import { useState } from "react";

export default function StreamList() {
  const [movieTitle, setMovieTitle] = useState("");
  const [movies, setMovies] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();

    const cleanedTitle = movieTitle.trim();
    if (!cleanedTitle) return;

    const normalized = cleanedTitle.toLowerCase();

    setMovies((prev) => {
      const alreadyExists = prev.some(
        (m) => m.normalized === normalized
      );

      if (alreadyExists) return prev;

      return [
        ...prev,
        {
          id: crypto.randomUUID(),
          title: cleanedTitle,
          normalized
        }
      ];
    });

    console.log("Movie added:", cleanedTitle);
    setMovieTitle("");
  }

  function removeMovie(id) {
    setMovies((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <div className="page">
      <div className="card">
        <h1 className="title">StreamList</h1>

        <form onSubmit={handleSubmit} className="form">
          <label className="label" htmlFor="movieTitle">
            Movie title
          </label>

          <div className="row">
            <input
              id="movieTitle"
              className="input"
              type="text"
              value={movieTitle}
              onChange={(e) => setMovieTitle(e.target.value)}
              placeholder="Example: Inception"
            />
            <button className="button" type="submit">
              Add
            </button>
          </div>
        </form>

        <h2 className="subtitle">My List</h2>

        {movies.length === 0 ? (
          <p className="muted">No movies yet.</p>
        ) : (
          <ul className="list">
            {movies.map((movie) => (
              <li key={movie.id} className="listItemRow">
                <span className="listItemText">{movie.title}</span>

                <button
                  type="button"
                  className="removeBtn"
                  onClick={() => removeMovie(movie.id)}
                  aria-label={`Remove ${movie.title}`}
                  title="Remove"
                >
                  x
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}