import React from 'react';
import { useDraggable } from '@dnd-kit/core';

const TaskCard = ({ task, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task._id,
  });

  const style = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    opacity: isDragging ? 0.5 : 1,
    marginBottom: '1rem',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '0.8rem',
    cursor: 'default', 
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();      
    e.preventDefault();       
    onDelete(task._id);       
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="task-card">
      <div {...listeners}>
        <h4>{task.title}</h4>
        <p>{task.description}</p>
        <p><strong>Status:</strong> {task.status}</p>
        <p><strong>Priority:</strong> {task.priority}</p>
      </div>
      <button
        onClick={handleDeleteClick}
        className="delete-btn"
        style={{
          backgroundColor: '#e74c3c',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '6px 12px',
          cursor: 'pointer',
          marginTop: '0.5rem'
        }}
      >
        Remove
      </button>
    </div>
  );
};

export default TaskCard;
