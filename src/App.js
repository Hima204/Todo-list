import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://to-do-list-backend-ysbp.onrender.com"
    : "http://localhost:5000";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [hoveredId, setHoveredId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [originalTitle, setOriginalTitle] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/todos`);
      setTodos(res.data);
    } catch (err) {
      console.error("Error fetching todos:", err);
    }
  };

  const createTodo = async () => {
    if (!title.trim()) return;
    try {
      await axios.post(`${API_BASE}/api/todos`, { title });
      setTitle("");
      fetchTodos();
    } catch (err) {
      console.error("Error creating todo:", err);
    }
  };

  const updateTodo = async (id, data) => {
    try {
      await axios.put(`${API_BASE}/api/todos/${id}`, data);
      fetchTodos();
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/todos/${id}`);
      fetchTodos();
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  const handleUpdate = async (id) => {
    if (!editedTitle.trim()) return;
    if (editedTitle !== originalTitle) {
      await updateTodo(id, { title: editedTitle });
    }
    resetEditState();
  };

  const handleCancel = () => {
    resetEditState();
  };

  const resetEditState = () => {
    setEditingId(null);
    setEditedTitle("");
    setOriginalTitle("");
  };

  return (
    <div className="App">
      <h1>📝 To-Do List</h1>
      <div className="input-section">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a task..."
        />
        <button onClick={createTodo}>Add</button>
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li
            key={todo._id}
            className={`todo-item ${todo.pinned ? "pinned" : ""}`}
            onMouseEnter={() => setHoveredId(todo._id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() =>
                updateTodo(todo._id, { completed: !todo.completed })
              }
            />

            {editingId === todo._id ? (
              <>
                <input
                  className="edit-input"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
                <button
                  className="btn-update"
                  onClick={() => handleUpdate(todo._id)}
                  disabled={editedTitle.trim() === originalTitle.trim()}
                  style={
                    editedTitle.trim() === originalTitle.trim()
                      ? { opacity: 0.4, cursor: "not-allowed" }
                      : {}
                  }
                  title="Save"
                >
                  ✅
                </button>

                <button className="btn-cancel" onClick={handleCancel}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span
                  className={`todo-text ${todo.completed ? "completed" : ""}`}
                >
                  {todo.title}
                </span>
                {hoveredId === todo._id && (
                  <button
                    className="btn-edit"
                    title="Edit"
                    onClick={() => {
                      setEditingId(todo._id);
                      setEditedTitle(todo.title);
                      setOriginalTitle(todo.title);
                    }}
                  >
                    ✏️
                  </button>
                )}
              </>
            )}

            {editingId !== todo._id && hoveredId === todo._id && (
              <button
                className="btn-pin-hover"
                onClick={() => updateTodo(todo._id, { pinned: !todo.pinned })}
                title={todo.pinned ? "Unpin" : "Pin"}
              >
                📌
              </button>
            )}

            {editingId !== todo._id && (
              <button
                className="btn-delete"
                onClick={() => deleteTodo(todo._id)}
                title="Delete"
              >
                ❌
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
