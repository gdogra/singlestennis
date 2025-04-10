// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const getInitials = (name = '') => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

const tennisAvatars = [
  'https://api.dicebear.com/7.x/initials/svg?seed=roger&backgroundColor=ffd700',
  'https://api.dicebear.com/7.x/initials/svg?seed=serena&backgroundColor=add8e6',
  'https://api.dicebear.com/7.x/initials/svg?seed=rafa&backgroundColor=90ee90',
  'https://api.dicebear.com/7.x/initials/svg?seed=venus&backgroundColor=ffb6c1',
];

const getAvatar = (name = '') => {
  const index = name.length % tennisAvatars.length;
  return tennisAvatars[index];
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const avatarUrl = user ? getAvatar(user.first_name || user.email) : '';
  const initials = user ? getInitials(`${user.first_name || ''} ${user.last_name || ''}`) : '';

  return (
    <nav className="bg-white shadow-md px-4 py-3 w-full relative">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">
          Home
        </Link>

        <div className="flex items-center gap-4">
          {user && <Bell className="text-gray-600 hidden md:block" size={20} />}

          {user && (
            <div className="relative hidden md:block">
              <div
                className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 bg-white cursor-pointer"
                onClick={() => setProfileOpen(!profileOpen)}
                title="View Profile"
              >
                {!imageError ? (
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    onError={() => setImageError(true)}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-gray-700 bg-gray-200">
                    {initials}
                  </div>
                )}
              </div>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-md p-4 z-50"
                  >
                    <p className="font-semibold text-gray-800 mb-1">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">{user.email}</p>
                    <p className="text-sm text-gray-600 mb-2">
                      🏆 Wins: {user.wins || 0} | ❌ Losses: {user.losses || 0}
                    </p>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => navigate('/profile')}
                        className="text-left text-blue-600 hover:underline"
                      >
                        Edit Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="text-left text-red-600 hover:underline"
                      >
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-700 focus:outline-none"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link to="/dashboard" className="hover:underline">
                  Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="hover:underline">
                    Admin Panel
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link to="/login" className="hover:underline">
                  Login
                </Link>
                <Link to="/register" className="hover:underline">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col md:hidden mt-3 space-y-2"
          >
            {user ? (
              <>
                <Link to="/dashboard" className="hover:underline" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="hover:underline" onClick={() => setMenuOpen(false)}>
                    Admin Panel
                  </Link>
                )}
                <span className="text-sm text-gray-600">
                  Hello, {user.first_name || user.email}
                </span>
                <button
                  onClick={() => { setMenuOpen(false); handleLogout(); }}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:underline" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="hover:underline" onClick={() => setMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

