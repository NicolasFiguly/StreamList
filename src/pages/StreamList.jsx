import { useEffect, useState } from "react";

export default function StreamList() {
  const [movieTitle, setMovieTitle] = useState("");

  // Persist list across tab changes + page refresh
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("streamlist-items");
    return saved ? JSON.parse(saved) : [];
  });

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    localStorage.setItem("streamlist-items", JSON.stringify(items));
  }, [items]);

  function normalize(text) {
    return text.trim().toLowerCase();
  }

  function handleSubmit(e) {
    e.preventDefault();

    const cleanedTitle = movieTitle.trim();
    if (!cleanedTitle) return;

    const normalized = normalize(cleanedTitle);

    setItems((prev) => {
      const alreadyExists = prev.some((item) => item.normalized === normalized);
      if (alreadyExists) return prev;

      return [
        ...prev,
        {
          id: crypto.randomUUID(),
          title: cleanedTitle,
          normalized,
          completed: false
        }
      ];
    });

    // Display input in console
    console.log("Movie added:", cleanedTitle);

    // Clear input after submit
    setMovieTitle("");
  }

  function toggleComplete(id) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  }

  function startEdit(item) {
    setEditingId(item.id);
    setEditValue(item.title);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditValue("");
  }

  function saveEdit(id) {
    const cleaned = editValue.trim();
    if (!cleaned) return;

    const normalized = normalize(cleaned);

    setItems((prev) => {
      const duplicate = prev.some(
        (item) => item.id !== id && item.normalized === normalized
      );
      if (duplicate) return prev;

      return prev.map((item) =>
        item.id === id ? { ...item, title: cleaned, normalized } : item
      );
    });

    console.log("Movie edited:", cleaned);

    setEditingId(null);
    setEditValue("");
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((item) => item.id !== id));
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

        {items.length === 0 ? (
          <p className="muted">No movies yet.</p>
        ) : (
          <ul className="list">
            {items.map((item) => {
              const isEditing = editingId === item.id;

              return (
                <li key={item.id} className="listItemRow">
                  <div className="itemLeft">
                    {/* Checkbox with a checkmark */}
                    <label
                      className="checkWrap"
                      title={item.completed ? "Uncomplete" : "Complete"}
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleComplete(item.id)}
                      />
                      <span className="customCheck" aria-hidden="true"></span>
                    </label>

                    {isEditing ? (
                      <input
                        className="editInput"
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                      />
                    ) : (
                      <span
                        className={
                          item.completed ? "listItemText done" : "listItemText"
                        }
                      >
                        {item.title}
                      </span>
                    )}
                  </div>

                  <div className="itemActions">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          className="iconBtn"
                          onClick={() => saveEdit(item.id)}
                          title="Save"
                          aria-label="Save"
                        >
                          <span className="material-symbols-outlined">save</span>
                        </button>

                        <button
                          type="button"
                          className="iconBtn"
                          onClick={cancelEdit}
                          title="Cancel"
                          aria-label="Cancel"
                        >
                          <span className="material-symbols-outlined">close</span>
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="iconBtn"
                        onClick={() => startEdit(item)}
                        title="Edit"
                        aria-label="Edit"
                      >
                        {/* Pen-style icon */}
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                    )}

                    {/* Delete as an X */}
                    <button
                      type="button"
                      className="iconBtn"
                      onClick={() => removeItem(item.id)}
                      title="Delete"
                      aria-label="Delete"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}