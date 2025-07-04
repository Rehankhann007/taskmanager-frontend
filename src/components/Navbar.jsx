import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="navbar">
      <h2>📌 Task Manager</h2>
      <div className="user-info">
        <span>{user.name || 'User'} ({user.email})</span>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
