import { useEffect, useState } from "react";

const STORAGE_KEY = "streamlist_user_events";

function safeLoadItems() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalize(text) {
  return text.trim().toLowerCase();
}

function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function StreamList() {
  const [movieTitle, setMovieTitle] = useState("");

  // Persist user events across navigation and refresh
  const [items, setItems] = useState(() => safeLoadItems());

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // If storage is full or blocked, do not crash the app.
    }
  }, [items]);

  function handleSubmit(e) {
    e.preventDefault();

    const cleanedTitle = movieTitle.trim();
    if (!cleanedTitle) return;

    const normalizedTitle = normalize(cleanedTitle);

    setItems((prev) => {
      const exists = prev.some((item) => item.normalized === normalizedTitle);
      if (exists) return prev;

      return [
        ...prev,
        {
          id: makeId(),
          title: cleanedTitle,
          normalized: normalizedTitle,
          completed: false
        }
      ];
    });

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

    const normalizedTitle = normalize(cleaned);

    setItems((prev) => {
      const duplicate = prev.some(
        (item) => item.id !== id && item.normalized === normalizedTitle
      );
      if (duplicate) return prev;

      return prev.map((item) =>
        item.id === id ? { ...item, title: cleaned, normalized: normalizedTitle } : item
      );
    });

    setEditingId(null);
    setEditValue("");
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((item) => item.id !== id));

    if (editingId === id) {
      cancelEdit();
    }
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
                    <label
                      className="checkWrap"
                      title={item.completed ? "Uncomplete" : "Complete"}
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleComplete(item.id)}
                        aria-label={
                          item.completed
                            ? `Mark ${item.title} as not completed`
                            : `Mark ${item.title} as completed`
                        }
                      />
                      <span className="customCheck" aria-hidden="true"></span>
                    </label>

                    {isEditing ? (
                      <input
                        className="editInput"
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(item.id);
                          if (e.key === "Escape") cancelEdit();
                        }}
                        aria-label={`Edit title for ${item.title}`}
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
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                    )}

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