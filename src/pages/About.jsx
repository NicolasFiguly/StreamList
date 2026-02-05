export default function About() {
  return (
    <div className="page">
      <div className="card">
        <h1 className="title">About</h1>

        <p className="muted">
          StreamList is a simple React app for keeping track of movies I want to
          watch. The StreamList page lets me add titles, mark them complete,
          edit them, and remove them, and it saves my list using localStorage so
          it survives refreshes.
        </p>

        <p className="muted">
          The Movies page connects to TMDB so I can search for a title and read
          basic details like the release year and overview.
        </p>
      </div>
    </div>
  );
}