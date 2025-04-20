import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-indigo-600">
          SingleTennis
        </Link>
        {user && (
          <div className="flex gap-4 items-center">
            <Link to="/leaderboard" className="hover:text-indigo-500">
              Leaderboard
            </Link>
            <Link to="/players" className="hover:text-indigo-500">
              Players
            </Link>
            <Link to="/challenges" className="hover:text-indigo-500">
              Challenges
            </Link>
            <button
              onClick={handleLogout}
              className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

