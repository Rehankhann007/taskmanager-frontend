// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Board from './components/Board';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated ? "/board" : "/login"} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/board" element={isAuthenticated ? <Board /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
