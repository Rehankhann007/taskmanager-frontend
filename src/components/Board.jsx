// src/components/Board.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Column from './Column';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

const statuses = ['Todo', 'In Progress', 'Done'];

const Board = () => {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState({});
  const [form, setForm] = useState({ title: '', description: '', status: 'Todo', priority: 'Low' });

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    fetchTasks();
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({ id: payload.id, email: payload.email, name: payload.name || 'User' });
    }
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('https://taskmanager-backend-ztz8.onrender.com/api/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://taskmanager-backend-ztz8.onrender.com/api/tasks', form);
      setTasks(prev => [...prev, res.data]);
      setForm({ title: '', description: '', status: 'Todo', priority: 'Low' });
    } catch (err) {
      console.error('Error adding task', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://taskmanager-backend-ztz8.onrender.com/api/tasks/${id}`);
      setTasks(prev => prev.filter(task => task._id !== id));
    } catch (err) {
      console.error('❌ Error deleting task:', err);
    }
  };

  const onDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;

    const draggedTask = tasks.find(task => task._id === active.id);
    if (draggedTask.status === over.id) return;

    const updatedTasks = tasks.map(task =>
      task._id === active.id ? { ...task, status: over.id } : task
    );
    setTasks(updatedTasks);

    try {
      await axios.put(`https://taskmanager-backend-ztz8.onrender.com/api/tasks/${active.id}`, {
        status: over.id,
      });
    } catch (err) {
      console.error('❌ Error updating task status:', err);
    }
  };

  return (
    <>
      <Navbar user={user} />

      <form className="task-form" onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          required
        />
        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <button type="submit">Add Task</button>
      </form>

      <div className="board-container">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          {statuses.map(status => (
            <SortableContext
              key={status}
              items={tasks.filter(task => task.status === status).map(task => task._id)}
              strategy={verticalListSortingStrategy}
            >
              <Column
                id={status}
                title={status}
                tasks={tasks.filter(task => task.status === status)}
                onDelete={handleDelete}
              />
            </SortableContext>
          ))}
        </DndContext>
      </div>
    </>
  );
};

export default Board;
