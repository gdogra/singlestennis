// frontend/src/components/Navbar.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b shadow-sm px-4 py-2 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-blue-600 cursor-pointer" onClick={() => navigate('/dashboard')}>
        TennisConnect
      </h1>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-700">{user?.email}</span>
        <button
          onClick={handleLogout}
          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

