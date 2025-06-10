import React, { useEffect, useState } from "react";
import "./App.css";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import TodoItem from "./components/TodoItem";

const App = () => {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "todos"));
      const items = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        items.push({ 
          id: doc.id, 
          ...data,
          timestamp: data.timestamp?.toDate?.() || new Date(),
          completedAt: data.completedAt?.toDate?.() || null
        });
      });
      
      // Sort todos: incomplete first, then by timestamp
      items.sort((a, b) => {
        if (a.completed !== b.completed) {
          return a.completed - b.completed;
        }
        return b.timestamp - a.timestamp;
      });
      
      setTodos(items);
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (task.trim()) {
      try {
        await addDoc(collection(db, "todos"), {
          text: task.trim(),
          completed: false,
          timestamp: serverTimestamp(),
          completedAt: null
        });
        setTask("");
        fetchTodos();
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    }
  };

  const deleteTodo = async (id) => {
    try {
      await deleteDoc(doc(db, "todos", id));
      fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const toggleComplete = async (id, current) => {
    try {
      const updateData = {
        completed: !current
      };
      
      if (!current) {
        // If marking as complete, add completion timestamp
        updateData.completedAt = serverTimestamp();
      } else {
        // If marking as incomplete, remove completion timestamp
        updateData.completedAt = null;
      }
      
      await updateDoc(doc(db, "todos", id), updateData);
      fetchTodos();
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const updateTodo = async (id, newText) => {
    try {
      await updateDoc(doc(db, "todos", id), {
        text: newText
      });
      fetchTodos();
    } catch (error) {
      console.error("Error updating todo text:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;
  const pendingCount = totalCount - completedCount;

  useEffect(() => {
    fetchTodos();
  }, []);

  if (loading) {
    return (
      <div className="app-container">
        <div className="main-wrapper">
          <div className="app-card">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <div className="loading-text">Loading your todos...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Floating background shapes */}
      <div className="floating-shape"></div>
      <div className="floating-shape"></div>
      <div className="floating-shape"></div>
      
      <button className="theme-toggle" onClick={toggleTheme}>
        <span>{theme === 'light' ? '🌙' : '☀️'}</span>
        <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
      </button>

      <div className="main-wrapper">
        <div className="header">
          <h1 className="title">✨ My Todo List</h1>
          <p className="subtitle">Stay organized, stay productive, stay inspired</p>
        </div>

        <div className="app-card">
          <div className="input-section">
            <div className="input-container">
              <div className="input-wrapper">
                <input
                  type="text"
                  className="todo-input"
                  placeholder="What amazing thing will you accomplish today? ✨"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <button className="add-button" onClick={addTodo}>
                <span>Add Task</span>
              </button>
            </div>

            {totalCount > 0 && (
              <div className="stats">
                <div className="stats-item">
                  <div className="stats-number">{totalCount}</div>
                  <div className="stats-label">Total Tasks</div>
                </div>
                <div className="stats-item">
                  <div className="stats-number">{pendingCount}</div>
                  <div className="stats-label">In Progress</div>
                </div>
                <div className="stats-item">
                  <div className="stats-number">{completedCount}</div>
                  <div className="stats-label">Completed</div>
                </div>
              </div>
            )}
          </div>

          <div className="todo-list">
            {todos.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <div className="empty-text">Ready to be productive?</div>
                <div className="empty-subtext">Add your first task above and start conquering your goals!</div>
              </div>
            ) : (
              todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  toggleComplete={toggleComplete}
                  deleteTodo={deleteTodo}
                  updateTodo={updateTodo}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;