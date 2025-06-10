import React, { useState, useRef, useEffect } from "react";
// import "./TodoItem.css";

const TodoItem = ({ todo, toggleComplete, deleteTodo, updateTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const editInputRef = useRef(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(todo.text);
  };

  const handleSave = async () => {
    if (editText.trim() && editText !== todo.text) {
      await updateTodo(todo.id, editText.trim());
    }
    setIsEditing(false);
    setEditText(todo.text);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText(todo.text);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''} ${isEditing ? 'editing' : ''} todo-item-enter`}>
      <div 
        className={`todo-checkbox ${todo.completed ? 'completed' : ''}`}
        onClick={() => toggleComplete(todo.id, todo.completed)}
      />
      
      <div className="todo-content">
        {isEditing ? (
          <input
            ref={editInputRef}
            type="text"
            className="todo-edit-input"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyPress}
            onBlur={handleSave}
          />
        ) : (
          <>
            <div className={`todo-text ${todo.completed ? 'completed' : ''}`}>
              {todo.text}
            </div>
            {todo.timestamp && (
              <div className="todo-meta">
                <span>📅 {formatDate(todo.timestamp)}</span>
                {todo.completed && todo.completedAt && (
                  <span>✅ {formatDate(todo.completedAt)}</span>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <div className="todo-actions">
        {isEditing ? (
          <>
            <button
              className="action-button save-button"
              onClick={handleSave}
              title="Save changes"
            >
              ✓
            </button>
            <button
              className="action-button cancel-button"
              onClick={handleCancel}
              title="Cancel editing"
            >
              ✕
            </button>
          </>
        ) : (
          <>
            <button
              className="action-button edit-button"
              onClick={handleEdit}
              title="Edit todo"
              disabled={todo.completed}
            >
              ✏️
            </button>
            <button
              className="action-button delete-button"
              onClick={() => deleteTodo(todo.id)}
              title="Delete todo"
            >
              🗑️
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TodoItem;