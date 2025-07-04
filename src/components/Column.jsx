import React from 'react';
import TaskCard from './TaskCard';
import { useDroppable } from '@dnd-kit/core';

const Column = ({ id, title, tasks, onDelete }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      className="column"
      ref={setNodeRef}
      style={{ backgroundColor: isOver ? '#f0f0f0' : '#ffffff' }}
    >
      <h2>{title}</h2>
      <div className="task-list">
        {tasks.map(task => (
          <TaskCard key={task._id} task={task} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
};

export default Column;
