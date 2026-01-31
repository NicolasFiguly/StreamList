import { useEffect, useRef, useState } from "react";

const KEY_QUERY = "tmdb-last-query";
const KEY_RESULTS = "tmdb-last-results";

function safeLoadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed;
  } catch {
    return fallback;
  }
}

export default function Movies() {
  const apiKey = process.env.REACT_APP_TMDB_API_KEY;

  const [query, setQuery] = useState(() => {
    return localStorage.getItem(KEY_QUERY) || "";
  });

  const [results, setResults] = useState(() => {
    const saved = safeLoadJson(KEY_RESULTS, []);
    return Array.isArray(saved) ? saved : [];
  });

  // Do not persist status to storage. Status is session-based.
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const abortRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(KEY_QUERY, query);
  }, [query]);

  useEffect(() => {
    localStorage.setItem(KEY_RESULTS, JSON.stringify(results));
  }, [results]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  async function searchMovies(e) {
    e.preventDefault();

    const cleaned = query.trim();
    if (!cleaned) {
      setStatus("error");
      setErrorMsg("Please enter a movie title before searching.");
      return;
    }

    if (!apiKey) {
      setStatus("error");
      setErrorMsg("Missing TMDB API key. Check your .env file and restart the server.");
      return;
    }

    // Abort any previous request before starting a new one
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus("loading");
    setErrorMsg("");

    try {
      const url =
        "https://api.themoviedb.org/3/search/movie" +
        `?api_key=${encodeURIComponent(apiKey)}` +
        `&query=${encodeURIComponent(cleaned)}` +
        "&include_adult=false&language=en-US&page=1";

      const res = await fetch(url, { signal: controller.signal });

      if (!res.ok) {
        throw new Error(`TMDB request failed: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      const safeResults = Array.isArray(data.results) ? data.results : [];

      setResults(safeResults);
      setStatus("success");
    } catch (err) {
      if (err.name === "AbortError") return;

      setStatus("error");
      setErrorMsg(err.message || "Something went wrong while searching TMDB.");
    }
  }

  function clearSearch() {
    setQuery("");
    setResults([]);
    setStatus("idle");
    setErrorMsg("");

    localStorage.removeItem(KEY_QUERY);
    localStorage.removeItem(KEY_RESULTS);

    if (abortRef.current) abortRef.current.abort();
    abortRef.current = null;
  }

  function posterUrl(path) {
    if (!path) return "";
    return `https://image.tmdb.org/t/p/w342${path}`;
  }

  function yearFromDate(dateString) {
    if (!dateString) return "N/A";
    return dateString.slice(0, 4);
  }

  function shortOverview(text) {
    if (!text) return "No overview available.";
    const trimmed = text.trim();
    if (trimmed.length <= 220) return trimmed;
    return trimmed.slice(0, 220) + "...";
  }

  return (
    <div className="page">
      <div className="card">
        <h1 className="title">Movies</h1>
        <p className="muted placeholder">
          Search TMDB and review movie information on this page.
        </p>

        <form onSubmit={searchMovies} className="form">
          <label className="label" htmlFor="movieSearch">
            Search for a movie
          </label>

          <div className="row">
            <input
              id="movieSearch"
              className="input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Example: The Matrix"
            />

            <button
              className="button"
              type="submit"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Searching..." : "Search"}
            </button>

            <button className="ghostBtn" type="button" onClick={clearSearch}>
              Clear
            </button>
          </div>
        </form>

        {status === "error" && (
          <div className="notice errorNotice">
            <strong>Search failed:</strong> {errorMsg}
          </div>
        )}

        {status === "success" && results.length === 0 && (
          <p className="muted">No results found. Try a different title.</p>
        )}

        {results.length > 0 && (
          <div className="movieGrid">
            {results.map((m) => (
              <div key={m.id} className="movieCard">
                <div className="moviePoster">
                  {m.poster_path ? (
                    <img
                      src={posterUrl(m.poster_path)}
                      alt={`${m.title} poster`}
                      loading="lazy"
                    />
                  ) : (
                    <div className="posterPlaceholder">No Image</div>
                  )}
                </div>

                <div className="movieInfo">
                  <div className="movieTitleRow">
                    <h2 className="movieTitle">{m.title}</h2>
                    <span className="movieYear">
                      {yearFromDate(m.release_date)}
                    </span>
                  </div>

                  <p className="movieOverview">{shortOverview(m.overview)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {status === "idle" && results.length === 0 && (
          <p className="muted">
            Enter a movie title above and click Search to view results.
          </p>
        )}
      </div>
    </div>
  );
}